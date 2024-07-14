import path from 'path';
import colors from 'colors';
import * as ts from 'typescript';

import grammar from './grammar';

import { CompilerConfig } from '../@types/core';

export default class Parser {
  protected static _config: CompilerConfig;
  protected static _libraries: string[] = [];
  protected static _imports: string[] = [];

  protected static sourceFile: ts.SourceFile;
  protected static _typeChecker: ts.TypeChecker;

  protected static getTsSourceFile(filePath: string): ts.SourceFile {
    const program = ts.createProgram([filePath], { allowJs: false });
    const sourceFile = program.getSourceFile(filePath)!;

    this._typeChecker = program.getTypeChecker();

    return sourceFile;
  }

  public static get typeChecker(): ts.TypeChecker {
    return this._typeChecker;
  }

  public static config(config?: CompilerConfig) {
    if (!config) {
      return this._config;
    }

    this._config = config;
    return this;
  }

  public static addLibrary(library: string): void {
    if (!this._libraries.includes(library)) {
      this._libraries.push(library);
    }
  }

  public static addImport(importPath: string): void {
    if (!this._imports.includes(importPath)) {
      this._imports.push(importPath);
    }
  }

  public static get imports(): string[] {
    return [...this._libraries, ...this._imports];
  }

  public static parse(filePath: string): string {
    const parsedCode: string[] = [];
    const tsSourceFile =
      path.extname(filePath) === '.ts'
        ? this.getTsSourceFile(filePath)
        : ts.createSourceFile(
            'example.ts',
            filePath,
            ts.ScriptTarget.Latest,
            true
          );

    this.sourceFile = tsSourceFile;

    tsSourceFile.forEachChild((node) => {
      parsedCode.push(this.parseNode(node, tsSourceFile, filePath));
    });

    return parsedCode.join('\n');
  }

  public static parseNode(
    node: ts.Node,
    tsSourceFile: ts.SourceFile,
    filePath?: string
  ): string {
    let parsedCode: string[] = [];

    if (this._config.debug) {
      console.log(
        colors.yellow(colors.bold('[DEBUG] -> ')),
        colors.blue(colors.italic(ts.SyntaxKind[node.kind])),
        node.getText(tsSourceFile)
      );
    }

    if (node.getText(tsSourceFile).startsWith('declare')) {
      parsedCode.push(
        grammar.get(ts.SyntaxKind.DeclareKeyword)!(node, {
          tsSourceFile,
          filePath,
        })
      );
    } else if (grammar.get(node.kind)) {
      parsedCode.push(
        grammar.get(node.kind)!(node, {
          tsSourceFile,
          filePath,
        })
      );
    } else {
      parsedCode.push(node.getText(tsSourceFile));
    }

    return parsedCode.join('\n');
  }

  public static parseTypes(type?: string, varValue?: any): string {
    if (!type) {
      return 'auto';
    }

    if (type === 'number') {
      if (varValue?.includes('.')) {
        return 'float';
      }

      return 'int';
    }

    if (/^Pointer<\w+>$/.test(type)) {
      this.addLibrary('#include <memory>');
      this.addLibrary('#include <iostream>');

      return this.parseTypes(type.replace(/^Pointer<(\w+)>$/, '$1')) + '*';
    }

    if (
      (varValue?.startsWith('[') &&
        (varValue?.endsWith(']') || varValue?.endsWith('];'))) ||
      type.includes('Array') ||
      type.includes('array')
    ) {
      const arrayLength = eval(varValue!)?.length;

      this.addLibrary('#include <array>');

      if (arrayLength) {
        if (type?.startsWith('array<') || type?.startsWith('Array<')) {
          if (!type?.includes(',') && arrayLength) {
            type = type?.replace('>', `, ${arrayLength}>`);
          }
        } else {
          type = `std::array<${type?.replace('[]', '')}, ${arrayLength}>`;
        }
      }

      return type
        .replace(/^Array</, 'std::array<')
        .replace(/^array</, 'std::array<')
        .replace('string', 'std::string')
        .replace('number', 'int')
        .replace('boolean', 'bool');
    }

    if (type.endsWith('[]')) {
      // return type.replace('[]', '');
      return 'auto';
    }

    if (type === 'string') {
      //  || eval(`typeof ${varValue}`) === 'string'
      return 'std::string';
    }

    if (type === 'boolean') {
      return 'bool';
    }

    return type;
  }

  public static parseVariable(
    variable: ts.ParameterDeclaration | ts.VariableDeclaration,
    sourceFile?: ts.SourceFile
  ): string {
    const variableName = variable.name.getText(sourceFile);
    const variableType = variable.type?.getText(sourceFile);
    const variableValue = variable.initializer?.getText(sourceFile);

    return `${this.parseTypes(variableType, variableValue)} ${variableName}`;
  }
}
