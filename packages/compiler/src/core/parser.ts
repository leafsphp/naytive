import fs from 'fs';
import path from 'path';
import colors from 'colors';
import * as ts from 'typescript';

import Lexer from './lexer';
import grammar from './grammar';

import { CompilerConfig } from '../@types/core';
import { NaytiveNode } from '../@types/lexer';

export default class Parser {
  protected static _config: CompilerConfig;
  protected static _imports: string[] = [];
  protected static _libraries: string[] = [];
  protected static _hasMain: boolean = false;
  protected static _naytive_libs: string[] = [];
  protected static _modules: Record<string, string> = {};
  protected static _c_functions: Record<string, string> = {};
  protected static _app_functions: Record<string, string> = {};

  protected static sourceFile: ts.SourceFile;
  protected static _typeChecker: ts.TypeChecker;

  public static getTsSourceFile(filePath: string): ts.SourceFile {
    const program = ts.createProgram([filePath], { allowJs: false });
    const sourceFile = program.getSourceFile(filePath)!;

    this._typeChecker = program.getTypeChecker();

    return sourceFile;
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

  public static addCFunction(name: string, fn: string): void {
    if (!this._c_functions[name]) {
      this._c_functions[name] = fn;
    }
  }

  public static addNaytiveLib(name: string): void {
    if (!this._naytive_libs.includes(name)) {
      this._naytive_libs.push(name);

      fs.copyFileSync(
        path.join(
          __dirname,
          `../src/clib/${name}.h`
        ),
        path.join(
          (Parser.config() as CompilerConfig).appDir,
          (Parser.config() as CompilerConfig).output,
          `${name}.h`
        )
      );

      fs.copyFileSync(
        path.join(__dirname, `../src/clib/${name}.cpp`),
        path.join(
          (Parser.config() as CompilerConfig).appDir,
          (Parser.config() as CompilerConfig).output,
          `${name}.cpp`
        )
      );

      this.addLibrary(`#include "${name}.h"`);
    }
  }

  public static addModule(name: string, fn: string): void {
    if (!this._modules[name]) {
      this._modules[name] = fn;
    }
  }

  public static addAppFunction(name: string, fn: string): void {
    if (!this._app_functions[name]) {
      this._app_functions[name] = fn;
    }
  }

  public static get imports(): string[] {
    return [
      ...this._libraries,
      ...Object.values(this._c_functions),
      ...this._imports,
      ...Object.values(this._modules),
      ...Object.values(this._app_functions),
    ];
  }

  public static get hasMain(): boolean {
    return this._hasMain;
  }

  public static get naytiveLibs(): string[] {
    return this._naytive_libs;
  }

  public static get typeChecker(): ts.TypeChecker {
    return this._typeChecker;
  }

  public static parse(filePath: string, root = true): string {
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
    this._hasMain =
      root === false ||
      this.hasMainFunction(tsSourceFile) ||
      this._config.compileType === '.ino';

    const nodes = Lexer.naytify(tsSourceFile);

    nodes.forEachChild((node) => {
      parsedCode.push(this.parseNode(node as NaytiveNode, filePath));
    });

    if (root) {
      return this._hasMain
        ? parsedCode.join('\n')
        : `\nint main() {${parsedCode.join('\n')} return 0;\n}`;
    }

    return parsedCode.join('\n');
  }

  protected static hasMainFunction(tsSourceFile: ts.SourceFile): boolean {
    let hasMain = false;

    const isFunction = (node: ts.Node) => {
      const response: { name?: string; body?: ts.Node } = {};

      if (node.kind === ts.SyntaxKind.FunctionDeclaration) {
        const fn = node as ts.FunctionDeclaration;

        response.name = fn.name?.getText(tsSourceFile);
        response.body = fn.body;
      } else if (node.kind === ts.SyntaxKind.VariableDeclaration) {
        const variable = node as ts.VariableDeclaration;

        if (variable.initializer?.kind === ts.SyntaxKind.ArrowFunction) {
          const arrowFn = variable.initializer as ts.ArrowFunction;

          response.name = variable.name.getText(tsSourceFile);
          response.body = arrowFn.body;
        }
      } else if (node.kind === ts.SyntaxKind.VariableStatement) {
        const variable = node as ts.VariableStatement;

        if (
          variable.declarationList.declarations[0].initializer?.kind ===
          ts.SyntaxKind.ArrowFunction
        ) {
          const arrowFn = variable.declarationList.declarations[0]
            .initializer as ts.ArrowFunction;

          response.name =
            variable.declarationList.declarations[0].name.getText(tsSourceFile);
          response.body = arrowFn.body;
        }
      }

      return response;
    };

    tsSourceFile.forEachChild((node) => {
      const fn = isFunction(node);

      if (fn.name === 'main') {
        hasMain = true;
      }
    });

    return hasMain;
  }

  public static parseNode(node: NaytiveNode, filePath?: string): string {
    let parsedCode: string[] = [];
    const tsSourceFile = node.getSourceFile();

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
          filePath,
        })
      );
    } else if (grammar.get(node.kind)) {
      parsedCode.push(
        grammar.get(node.kind)!(node, {
          filePath,
        })
      );
    } else {
      parsedCode.push(node.getText(tsSourceFile));
    }

    return parsedCode.join('\n');
  }

  public static parseTypes(type?: string, varValue?: any): string {
    if (!type || type === 'any') {
      return 'auto';
    }

    // will fix this later
    if (['int', 'short', 'long', 'float', 'double'].includes(type)) {
      return type;
    }

    if (/\(\s*(?:[^()]*|(?:\([^()]*\)))*\s*\)\s*=>/.test(type)) {
      const returnType = type
        .replace(/\(\s*(?:[^()]*|(?:\([^()]*\)))*\s*\)\s*=>\s*/, '');
      const returnStatement = varValue
        ?.match(/return\s+([^;]+);/)?.[1]
        ?.trim?.();

      return this.parseTypes(returnType, returnStatement);
    }

    if (type === 'longdouble') {
      return 'long double';
    }

    if (type === 'longlong') {
      return 'long long';
    }

    if (type === 'number') {
      if (varValue?.includes('.')) {
        if (varValue?.length > 7) {
          return 'double';
        } else if (varValue?.length > 15) {
          return 'long double';
        }

        return 'float';
      }

      const number = Number(varValue);

      if (number < 0) {
        if (number < -32768) {
          return 'int';
        } else {
          return 'short';
        }
      }

      if (number < 65535) {
        return 'unsigned short';
      }

      return 'int';
    } else if (!isNaN(Number(type))) {
      return this.parseTypes('number', varValue);
    }

    if (/^Pointer<\w+>$/.test(type)) {
      this.addLibrary('#include <iostream>');
      this.addLibrary('#include <memory>');

      return this.parseTypes(type.replace(/^Pointer<(\w+)>$/, '$1')) + '*';
    }

    if (
      (varValue?.startsWith('[') &&
        (varValue?.endsWith(']') || varValue?.endsWith('];'))) ||
      type.includes('Array') ||
      type.includes('array')
    ) {
      const arrayLength = eval(varValue!)?.length;

      if (arrayLength) {
        this.addLibrary('#include <array>');

        if (type?.startsWith('array<') || type?.startsWith('Array<')) {
          if (!type?.includes(',') && arrayLength) {
            type = type?.replace('>', `, ${arrayLength}>`);
          }
        } else {
          type = `std::array<${type?.replace('[]', '')}, ${arrayLength}>`;
        }
      } else {
        this.addLibrary('#include <vector>');

        if (type?.startsWith('array<') || type?.startsWith('Array<')) {
          type = type
            ?.replace('array<', 'std::vector<')
            .replace('Array<', 'std::vector<');
        } else {
          type = `std::vector<${type?.replace('[]', '')}>`;
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

    if (type === 'boolean') {
      return 'bool';
    }

    if (
      type === 'string' ||
      /,.@#%&*()_ +{}|":?><`~;[]\-=/.test(varValue) ||
      / /.test(varValue)
    ) {
      Parser.addLibrary('#include <string>');

      return 'std::string';
    }

    return type;
  }

  public static getType(node: any): string {
    const tsSourceFile = node.getSourceFile();
    const symbol = Parser.typeChecker
      .getSymbolAtLocation(node)
      ?.getDeclarations()?.[0] as any;

    const type = this.parseTypes(
      symbol?.valueDeclaration?.type?.getText(tsSourceFile) ||
        node.type?.getText(tsSourceFile) ||
        Parser.typeChecker.typeToString(
          Parser.typeChecker.getTypeAtLocation(node),
          node
        ),
      symbol?.initializer?.getText(tsSourceFile) ??
        node.initializer?.getText(tsSourceFile)
    );

    return type;
  }

  public static parseVariable(
    variable: ts.ParameterDeclaration | ts.VariableDeclaration,
    sourceFile?: ts.SourceFile
  ): string {
    const variableName = variable.name.getText(sourceFile);
    const variableType = this.getType(variable);

    return `${variableType} ${variableName}`;
  }
}
