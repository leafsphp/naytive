import * as ts from 'typescript';

import Parser from './parser';

import type { NaytiveNode } from '../@types/lexer';

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
 */
export default class Lexer {
  public static nodes: Record<string, NaytiveNode> = {};

  public static naytify(
    node: ts.Node,
    tsSourceFile: ts.SourceFile
  ): NaytiveNode {
    const id = `${node.pos}-${node.end}`;
    const symbol = Parser.typeChecker.getSymbolAtLocation(node);

    const nodeInfo: NaytiveNode['naytive'] = {
      type: '',
      dependents: [],
      isNested: false,
      initialValue: '',
      dependencies: [],
      symbol: undefined,
    };

    if (node.getChildren().length > 0) {
      node.forEachChild((child) => {
        child = this.naytify(child, tsSourceFile);
      });
    }

    if (node.kind === ts.SyntaxKind.Identifier && symbol) {
      const declarations = symbol.getDeclarations() ?? [];

      for (const declaration of declarations) {
        if (declaration.kind === ts.SyntaxKind.VariableDeclaration) {
          const d = declaration as ts.VariableDeclaration;

          if (d.initializer) {
            const symbol = Parser.typeChecker
              .getSymbolAtLocation(d.initializer)
              ?.getDeclarations()?.[0]?.parent?.parent as NaytiveNode;

            nodeInfo.isNested = d.initializer.parent !== d;
            nodeInfo.initialValue = d.initializer.getText(tsSourceFile);
            nodeInfo.symbol = this.nodes[`${symbol?.pos}-${symbol?.end}`];
            nodeInfo.type = Parser.getType(
              d.initializer?.kind === ts.SyntaxKind.Identifier
                ? d.initializer
                : d,
              tsSourceFile
            );

            nodeInfo.dependencies.push(nodeInfo.symbol!);
          }
        } else if (declaration.kind === ts.SyntaxKind.FunctionDeclaration) {
          const d = declaration as ts.FunctionDeclaration;

          console.log('Declaration:', {
            text: declaration.getText(tsSourceFile),
            type: Parser.getType(d, tsSourceFile),
          });
        }
      }
    } else if (node.kind === ts.SyntaxKind.VariableDeclaration) {
      const d = node as ts.VariableDeclaration;

      console.log('Variable x amd y:', node.getText(tsSourceFile));

      if (d.initializer) {
        const symbol = Parser.typeChecker
          .getSymbolAtLocation(d.initializer)
          ?.getDeclarations()?.[0]?.parent?.parent as NaytiveNode;

        nodeInfo.isNested = d.initializer.parent !== d;
        nodeInfo.initialValue = d.initializer.getText(tsSourceFile);
        nodeInfo.symbol = this.nodes[`${symbol?.pos}-${symbol?.end}`];
        nodeInfo.type = Parser.getType(
          d.initializer?.kind === ts.SyntaxKind.Identifier ? d.initializer : d,
          tsSourceFile
        );

        nodeInfo.dependencies.push(nodeInfo.symbol!);
      }
    }

    (node as any).id ??= id;
    (node as any).naytive ??= nodeInfo;

    if (!this.nodes[id]) {
      this.nodes[id] = node as NaytiveNode;

      for (const dep of nodeInfo.dependencies) {
        this.nodes[dep?.id]?.naytive?.dependents?.push(node as NaytiveNode);
      }
    }

    return node as NaytiveNode;
  }
}
