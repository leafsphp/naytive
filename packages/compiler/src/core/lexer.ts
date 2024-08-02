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
  public static naytify(
    node: ts.Node
  ): NaytiveNode {
    const id = `${node.pos}-${node.end}`;

    if (node.getChildren().length > 0) {
      node.forEachChild((child) => {
        child = this.naytify(child);
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
      const variableDeclaration = node as ts.VariableDeclaration;

      if (variableDeclaration.initializer) {
        const symbol = Parser.typeChecker
          .getSymbolAtLocation(variableDeclaration.initializer)
          ?.getDeclarations()?.[0]?.parent?.parent as NaytiveNode;

        if (symbol) {
          nodeInfo.symbol = this.naytify(symbol);
          nodeInfo.dependencies.push(nodeInfo.symbol);
        }

        nodeInfo.initialValue = variableDeclaration.initializer.getText(node.getSourceFile());
        nodeInfo.type = Parser.getType(
          variableDeclaration.initializer?.kind === ts.SyntaxKind.Identifier
            ? variableDeclaration.initializer
            : variableDeclaration
        );

        // @ts-expect-error - initializer is readonly
        variableDeclaration.initializer = this.naytify(variableDeclaration.initializer);
      }
    } else if (node.kind === ts.SyntaxKind.FunctionDeclaration) {
      const functionDeclaration = node as ts.FunctionDeclaration;

      nodeInfo.type = Parser.getType(functionDeclaration);

      // @ts-expect-error - body is readonly
      functionDeclaration.body = this.naytify(functionDeclaration.body!);
    }

    (node as any).id ??= id;
    (node as any).naytive ??= nodeInfo;

    return node as NaytiveNode;
  }

  public static extractIdentifiers(node: ts.Node) {
    const dependencies = [];

    if (ts.isIdentifier(node)) {
      dependencies.push(node);
    } else {
      node.forEachChild((child) => {
        dependencies.push(...this.extractIdentifiers(child));
      });
    }

    return dependencies;
  }

  public static findNodeDependencies(node: ts.Node) {
    const parsedDeps: string[] = [];
    const dependencies = this.extractIdentifiers(node);

    dependencies.forEach((dependency) => {
      const depSymbol = Parser.typeChecker.getSymbolAtLocation(dependency);

      const isSameFunction =
        depSymbol?.valueDeclaration === node;
      const isDeclarationPresent = !!depSymbol?.valueDeclaration?.getText();

      if (!isSameFunction && isDeclarationPresent) {
        const nearestFunctionParent = Lexer.findFuntionParent(
          depSymbol?.valueDeclaration!
        );

        if (
          nearestFunctionParent !== node &&
          (depSymbol?.valueDeclaration?.kind ===
            ts.SyntaxKind.FunctionDeclaration ||
            depSymbol?.valueDeclaration?.kind === ts.SyntaxKind.ArrowFunction ||
            depSymbol?.valueDeclaration?.kind ===
              ts.SyntaxKind.VariableDeclaration)
        ) {
          const valueDeclaration = depSymbol?.valueDeclaration;
          // @ts-expect-error name is not defined on all nodes
          const valueName = valueDeclaration?.name?.getText();

          parsedDeps.push(valueName);
        }
      }
    });

    return parsedDeps;
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
          return variableDeclaration as VariableDeclaration;
        }
      }

      return currentNode as FunctionDeclaration;
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
}
