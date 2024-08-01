import * as ts from 'typescript';

import Parser from './parser';

import type {
  ArrowFunction,
  FunctionDeclaration,
  NaytiveNode,
  VariableDeclaration,
} from '../@types/lexer';

/**
 * Unfortunately, the TypeScript compiler does not provide all the information we need to
 * accurately determine things like node dependencies, so we have to do some guesswork. This
 * lexer is responsible for parsing the TypeScript AST and converting it into a format that
 * the Naytive parser can understand.
 *
 * This Lexer is a bit different from your typical lexer in that it doesn't just tokenize the
 * input, but it also does some parsing. This is because the TypeScript AST is already a parsed
 * representation of the code, so we can skip the tokenization step and go straight to updating
 * the nodes with the information we need and tracking the dependencies between them.
 *
 * *This is a very 'thinky' file. It's still being thought about which is why there's a ton of
 * anti-patterns and weird stuff going on. Will be cleaned up as soon as the thought process is
 * complete.*
 *
 * *naytify* is damn memory hungry. Unfortunately, it's a necessary evil for now. It's the only
 * way to accurately track dependencies between nodes. It's a bit of a mess, but it works for now.
 * This will change when Naytive stops relying on TypeScript's AST and moves to its own AST.
 */
export default class Lexer {
  public static nodes: Record<string, NaytiveNode> = {};

  public static naytify(
    node: ts.Node,
    tsSourceFile: ts.SourceFile
  ): NaytiveNode {
    const id = `${node.pos}-${node.end}`;

    if (this.nodes[id]) {
      const cachedNode = node as NaytiveNode;

      if (
        (cachedNode.naytive?.type?.length || 0) > 0 ||
        cachedNode.naytive?.symbol ||
        cachedNode.naytive?.dependencies?.length > 0
      ) {
        return cachedNode;
      }
    }

    if (node.getChildren().length > 0) {
      node.forEachChild((child) => {
        child = this.naytify(child, tsSourceFile);
      });
    }

    const nodeInfo: NaytiveNode['naytive'] = {
      type: '',
      dependents: [],
      initialValue: '',
      dependencies: [],
      symbol: undefined,
      scopedDependencies: {},
    };

    if (node.kind === ts.SyntaxKind.VariableDeclaration) {
      if (node.initializer) {
        const symbol = Parser.typeChecker
          .getSymbolAtLocation(node.initializer)
          ?.getDeclarations()?.[0]?.parent?.parent as NaytiveNode;

        if (symbol) {
          nodeInfo.symbol = this.naytify(symbol, tsSourceFile);
          nodeInfo.dependencies.push(nodeInfo.symbol);
        }

        nodeInfo.initialValue = node.initializer.getText(tsSourceFile);
        nodeInfo.type = Parser.getType(
          node.initializer?.kind === ts.SyntaxKind.Identifier
            ? node.initializer
            : node,
          tsSourceFile
        );

        node.initializer = this.naytify(node.initializer, tsSourceFile);
      }
    } else if (node.kind === ts.SyntaxKind.Block) {
      node.forEachChild((child) => {
        child = this.naytify(child, tsSourceFile);
      });
    } else if (node.kind === ts.SyntaxKind.ArrayLiteralExpression) {
      // @ts-expect-error - el is readonly
      node.elements.forEach((el) => {
        el = this.naytify(el, tsSourceFile);
      });
    }

    (node as any).id ??= id;
    (node as any).naytive ??= nodeInfo;
    // (node as any).naytive ??= specialNode
    //   ? nodeInfo
    //   : this.findScopedDependencies(node, nodeInfo);

    // if (
    //   // @ts-expect-error - naytive is not a property of ts node
    //   !node.parent?.naytive &&
    //   node.parent?.kind !== ts.SyntaxKind.SourceFile
    // ) {
    //   //! @ts-expect-error - parent is readonly
    //   console.log('THIS IS THE PARENT');
    //   // node.parent = this.naytify(node?.parent, tsSourceFile);
    // }

    if (!this.nodes[id]) {
      this.nodes[id] = node as NaytiveNode;

      for (const dep of nodeInfo.dependencies) {
        this.nodes[dep?.id]?.naytive?.dependents?.push(node as NaytiveNode);
      }
    }

    return node as NaytiveNode;
  }

  public static findScopedDependencies(
    node: ts.Node,
    nodeInfo: NaytiveNode['naytive']
  ): NaytiveNode['naytive'] {
    if (
      [
        // ts.SyntaxKind.TemplateExpression,
        // ts.SyntaxKind.ReturnStatement,
        // ts.SyntaxKind.VariableDeclaration,
        // ts.SyntaxKind.CallExpression,
        ts.SyntaxKind.Identifier,
      ].includes(node.kind)
    ) {
      const symbol = nodeInfo.symbol;
      const parentFunction = this.findFuntionParent(node?.parent?.parent);

      // console.log(
      //   'NODE KIND',
      //   ts.SyntaxKind[node.kind],
      //   node.getText(node.getSourceFile()),
      //   '----------',
      //   parentFunction?.getText(node.getSourceFile())
      // );

      if (parentFunction && symbol) {
        (
          (parentFunction?.kind === ts.SyntaxKind.VariableDeclaration
            ? parentFunction?.initializer?.body
            : parentFunction?.body) as ts.FunctionBody
        )?.forEachChild((child) => {
          if (
            ![ts.SyntaxKind.ImportClause, ts.SyntaxKind.SourceFile].includes(
              symbol.kind
            )
          ) {
            // @ts-expect-error - id is not a property of ts node
            symbol.id ??= `${symbol.pos}-${symbol.end}`;

            nodeInfo.rawScopedDependencies?.push(
              symbol.getText(symbol.getSourceFile())
            );

            // @ts-expect-error - id is not a property of ts node
            nodeInfo.scopedDependencies[symbol.id] = symbol;
          }
        });

        // if (!isSymbolInParent) {
        //   nodeInfo?.scopedDependencies.push(symbol);

        //   this.nodes[`${parentFunction.pos}-${parentFunction.end}`] =
        //     parentFunction;
        // }
      }
    }

    return nodeInfo;
  }

  public static findFuntionParent(
    currentNode: ts.Node
  ): FunctionDeclaration | VariableDeclaration | ArrowFunction | undefined {
    if (!currentNode) {
      return;
    }

    if (this.isFunctionDeclaration(currentNode)) {
      if (currentNode.kind === ts.SyntaxKind.ArrowFunction) {
        const variableDeclaration =
          currentNode?.parent as ts.VariableDeclaration;

        if (variableDeclaration?.kind === ts.SyntaxKind.VariableDeclaration) {
          return this.getCachedNode(variableDeclaration) as VariableDeclaration;
        }
      }

      return this.getCachedNode(currentNode) as FunctionDeclaration;
    }

    return this.findFuntionParent(currentNode?.parent);
  }

  public static isFunctionDeclaration(node: ts.Node): boolean {
    if (ts.isFunctionDeclaration(node) || ts.isArrowFunction(node)) {
      return true;
    }

    if (ts.isVariableDeclaration(node) && node.initializer) {
      return this.isFunctionDeclaration(node.initializer);
    }

    return false;
  }

  public static getCachedNode(node: ts.Node): NaytiveNode | undefined {
    const cachedNode = this.nodes?.[`${node.pos}-${node.end}`];

    if (!cachedNode) {
      // @ts-expect-error - id is not a property of ts node
      node.id = `${node.pos}-${node.end}`;

      this.nodes[`${node.pos}-${node.end}`] = node as NaytiveNode;
    }

    // return this.naytify(node, node.getSourceFile());

    return this.nodes?.[`${node.pos}-${node.end}`];
  }

  public static clear() {
    this.nodes = {};
  }
}
