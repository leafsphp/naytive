/**
 * Naytive Compiler Grammar
 * -------------------------
 * This file contains the grammar that the compiler
 * uses to compile the TypeScript code to C++ code.
 */

import fs from 'fs';
import path from 'path';
import colors from 'colors';
import * as ts from 'typescript';

import { CompilerConfig, CompilerGrammar } from '../@types/core';
import Parser from './parser';

export const libraries: Record<string, string> = {
  std: 'iostream',
  array: 'array',
};

export const types = [
  'int',
  'struct',
  'array',
  'char',
  'float',
  'double',
  'long',
  'longlong',
  'short',
  'uint',
  'ushort',
  'ulong',
  'ulonglong',
  'longdouble',
];

const grammar = new Map<ts.SyntaxKind, CompilerGrammar>();

grammar.set(
  ts.SyntaxKind.ImportDeclaration,
  (node, { tsSourceFile, filePath }) => {
    const importDeclaration = node as ts.ImportDeclaration;
    const moduleSpecifier =
      importDeclaration.moduleSpecifier.getText(tsSourceFile);
    const namedImports = importDeclaration.importClause?.namedBindings;
    const importedFile = moduleSpecifier.replaceAll(/['"`]+/g, '');
    const importedFilePath = path.join(
      filePath!.replace(path.basename(filePath!), ''),
      `${importedFile}${path.extname(importedFile) ? '' : '.ts'}`
    );

    if (
      importedFile.startsWith('@naytive/types') ||
      importedFile.startsWith('@naytive/core')
    ) {
      if (namedImports) {
        const imports = namedImports as ts.NamedImports;
        const importClause = imports.elements.map(
          (element) => element.name.text
        );

        // if import is a naytive type or library, remove the import because naytive types are built-in C/C++ types
        importClause.forEach((imported) => {
          if (libraries[imported]) {
            Parser.addLibrary(`#include <${libraries[imported]}>`);
          }
        });
      }
    } else {
      // if file is local
      if (importedFile.startsWith('.')) {
        if (!fs.existsSync(importedFilePath)) {
          throw new Error(
            colors.red(
              `File ${path.basename(
                importedFilePath
              )} does not exist in ${path.dirname(importedFilePath)}`
            )
          );
        }

        // if modulespecifier is a local file, parse the file and add the parsed code
        if (importedFilePath.endsWith('.ts')) {
          return Parser.parse(importedFilePath);
        } else {
          fs.copyFileSync(
            importedFilePath,
            path.join(
              (Parser.config() as CompilerConfig).appDir,
              (Parser.config() as CompilerConfig).output,
              importedFile
            )
          );

          if (path.extname(importedFile) === '.h') {
            const cppFilePath = importedFilePath.replace('.h', '.cpp');

            if (fs.existsSync(cppFilePath)) {
              fs.copyFileSync(
                cppFilePath,
                path.join(
                  (Parser.config() as CompilerConfig).appDir,
                  (Parser.config() as CompilerConfig).output,
                  importedFile.replace(
                    '.h',
                    (Parser.config() as CompilerConfig).compileType
                  )
                )
              );
            }
          }
        }
      }

      // C/C++ libraries and files can be loaded with this
      Parser.addImport(`#include ${moduleSpecifier.replace(/['"`]+/g, '"')}`);
    }

    return '';
  }
);

grammar.set(ts.SyntaxKind.VariableDeclaration, (node, { tsSourceFile }) => {
  const variable = node as ts.VariableDeclaration;

  let variableName = variable.name.getText(tsSourceFile);
  let variableValue = Parser.parseNode(variable.initializer!, tsSourceFile);
  let variableType = Parser.parseTypes(
    variable.type?.getText(tsSourceFile) ||
      Parser.typeChecker.typeToString(
        Parser.typeChecker.getTypeAtLocation(node),
        node
      ),
    variable.initializer?.getText(tsSourceFile)
  );

  if (variable.initializer?.kind === ts.SyntaxKind.ArrowFunction) {
    const arrowFunction = variable.initializer as ts.ArrowFunction;
    const functionArguments = arrowFunction.parameters
      .map((parameter) => Parser.parseVariable(parameter, tsSourceFile))
      .join(', ');
    const functionType =
      Parser.parseTypes(arrowFunction.type?.getText(tsSourceFile)) ||
      variableType;

    console.log(
      ts.SyntaxKind[arrowFunction.body!.kind],
      arrowFunction.body!.getText(tsSourceFile)
    );

    return `${functionType} ${variableName}(${functionArguments}) {\n${
      (arrowFunction.body?.kind !== ts.SyntaxKind.Block ? 'return ' : '') +
      Parser.parseNode(arrowFunction.body!, tsSourceFile)
    };\n}`;
  }

  if (variableValue?.includes('std.cin')) {
    const stdInPrompt = variableValue.match(/(?<=\()(.*)(?=\))/)?.[0];

    return `${variableType} ${variableName};\n${
      stdInPrompt ? `std::cout << ${stdInPrompt};\n` : ''
    }\n${variableValue
      .replace(stdInPrompt || '', '')
      .replace(/std\.cin\((.*)\)/, `std::cin >> ${variableName}`)}`;
  }

  if (variable.initializer?.kind === ts.SyntaxKind.ArrayLiteralExpression) {
    if (!variableType.includes('std::array<')) {
      variableName = `${variableName}[]`;
    }

    variableValue = variableValue?.replace('[', '{').replace(']', '}');
  }

  return `${variableType} ${variable.name.getText(
    tsSourceFile
  )} = ${variableValue}`;
});

grammar.set(ts.SyntaxKind.VariableDeclarationList, (node, { tsSourceFile }) => {
  const variableDeclarationList = node as ts.VariableDeclarationList;
  const variableDeclaration = variableDeclarationList.declarations[0];

  return grammar.get(ts.SyntaxKind.VariableDeclaration)!(variableDeclaration, {
    tsSourceFile,
  });
});

grammar.set(ts.SyntaxKind.VariableStatement, (node, { tsSourceFile }) => {
  const variableStatement = node as ts.VariableStatement;
  const variableDeclaration = variableStatement.declarationList.declarations[0];

  return `${grammar.get(ts.SyntaxKind.VariableDeclaration)!(
    variableDeclaration,
    {
      tsSourceFile,
    }
  )};`;
});

grammar.set(
  ts.SyntaxKind.PropertyAccessExpression,
  (node, { tsSourceFile }) => {
    const propertyAccessExpression = node as ts.PropertyAccessExpression;

    const name = propertyAccessExpression.name.getText(tsSourceFile);
    const expression =
      propertyAccessExpression.expression.getText(tsSourceFile);

    if (expression === 'std' && name === 'cout') {
      return `std::cout << `;
    }

    if (name === 'length') {
      let variableType = '';

      const symbol = Parser.typeChecker
        .getSymbolAtLocation(propertyAccessExpression.expression)
        ?.getDeclarations()?.[0] as any;

      if (symbol) {
        variableType =
          symbol.type?.getText() ||
          Parser.typeChecker.typeToString(
            Parser.typeChecker.getTypeAtLocation(
              propertyAccessExpression.expression
            ),
            symbol
          );
      }

      if (variableType === 'string') {
        return `${expression}.size()`;
      } else if (
        variableType.includes('[]') ||
        variableType.includes('Array<')
      ) {
        return `${expression}.size()`;
      }
    }

    if (name === 'toString') {
      Parser.addLibrary('#include <string>');

      return `std::to_string(${expression})`;
    }

    return `${expression}.${name}`;
  }
);

grammar.set(ts.SyntaxKind.ExpressionStatement, (node, { tsSourceFile }) => {
  const expressionStatement = node as ts.ExpressionStatement;

  return `${Parser.parseNode(expressionStatement.expression, tsSourceFile)};`;
});

grammar.set(ts.SyntaxKind.CallExpression, (node, { tsSourceFile }) => {
  const callExpression = node as ts.CallExpression;
  const expression = Parser.parseNode(callExpression.expression, tsSourceFile);
  const args = callExpression.arguments.map((arg) =>
    Parser.parseNode(arg, tsSourceFile)
  );

  // console.log('callExpression', callExpression.getText(tsSourceFile));

  if (
    callExpression.expression.kind === ts.SyntaxKind.PropertyAccessExpression
  ) {
    return (
      expression + (expression.includes('(') ? args.join() : `(${args.join()})`)
    );
  }

  return `${expression}(${args.join(', ')})`;
});

grammar.set(ts.SyntaxKind.TemplateExpression, (node, { tsSourceFile }) => {
  const templateExpression = node as ts.TemplateExpression;

  Parser.addLibrary('#include <string>');

  const parsedTemplateSpans = templateExpression.templateSpans.map((span) =>
    Parser.parseNode(span.expression, tsSourceFile)
  );

  return templateExpression
    .getText(tsSourceFile)
    .replace(/(\${)(.*?)(})/g, (_, __, _expression) => {
      const symbol = Parser.typeChecker
        .getSymbolAtLocation(templateExpression.templateSpans[0].expression)
        ?.getDeclarations()?.[0] as any;

      if (symbol) {
        const variableType = Parser.parseTypes(
          symbol.type?.getText() ||
            Parser.typeChecker.typeToString(
              Parser.typeChecker.getTypeAtLocation(
                templateExpression.templateSpans[0].expression
              ),
              symbol
            ),
          symbol?.initializer?.getText()
        );

        if (variableType !== 'std::string') {
          return `" + std::to_string(${parsedTemplateSpans.shift()!}) + "`;
        }
      }

      return `" + ${parsedTemplateSpans.shift()!} + "`;
    })
    .replace(/`([^`]+)`/g, '"$1"');
});

grammar.set(ts.SyntaxKind.StringLiteral, (node) => {
  const stringLiteral = node as ts.StringLiteral;

  Parser.addLibrary('#include <string>');

  return `"${stringLiteral.text}"`;
});

grammar.set(ts.SyntaxKind.ArrayLiteralExpression, (node, { tsSourceFile }) => {
  const arrayLiteralExpression = node as ts.ArrayLiteralExpression;
  const elements = arrayLiteralExpression.elements.map((element) =>
    Parser.parseNode(element, tsSourceFile)
  );

  return `{${elements.join(', ')}}`;
});

grammar.set(ts.SyntaxKind.BinaryExpression, (node, { tsSourceFile }) => {
  const binaryExpression = node as ts.BinaryExpression;
  const left = Parser.parseNode(binaryExpression.left, tsSourceFile);
  const right = Parser.parseNode(binaryExpression.right, tsSourceFile);
  const operator = binaryExpression.operatorToken.getText(tsSourceFile);

  return `${left} ${operator} ${right}`;
});

grammar.set(ts.SyntaxKind.FunctionDeclaration, (node, { tsSourceFile }) => {
  const functionDeclaration = node as ts.FunctionDeclaration;
  const functionName = functionDeclaration.name?.getText(tsSourceFile);
  const functionArguments = functionDeclaration.parameters
    .map((parameter) => Parser.parseVariable(parameter, tsSourceFile))
    .join(', ');
  const functionType = Parser.parseTypes(
    functionDeclaration.type?.getText(tsSourceFile)
  );

  return `${functionType} ${functionName}(${functionArguments}) {\n${Parser.parseNode(
    functionDeclaration.body!,
    tsSourceFile
  )}\n}`;
});

grammar.set(ts.SyntaxKind.ArrowFunction, (node, { tsSourceFile }) => {
  const variable = node as ts.VariableStatement;
  const variableDeclaration = variable.declarationList?.declarations?.[0];

  const arrowFunction =
    (variableDeclaration?.initializer as ts.ArrowFunction) ||
    (node as ts.ArrowFunction);

  const functionName = variableDeclaration?.name?.getText(tsSourceFile);
  const functionArguments = arrowFunction.parameters
    .map((parameter) => Parser.parseVariable(parameter, tsSourceFile))
    .join(', ');
  const functionType = Parser.parseTypes(
    arrowFunction.type?.getText(tsSourceFile)
  );

  if (!functionName) {
    return `${functionType}(${functionArguments}) {\n${Parser.parseNode(
      arrowFunction.body!,
      tsSourceFile
    )}\n}`;
  }

  return `${functionType} ${functionName}(${functionArguments}) {\n${Parser.parseNode(
    arrowFunction.body!,
    tsSourceFile
  )}\n}`;
});

grammar.set(ts.SyntaxKind.Block, (node, { tsSourceFile, filePath }) => {
  const block = node as ts.Block;
  const parsedCode: string[] = [];

  block.statements.forEach((statement) => {
    parsedCode.push(Parser.parseNode(statement, tsSourceFile, filePath));
  });

  return parsedCode.join('\n\n');
});

grammar.set(ts.SyntaxKind.IfStatement, (node, { tsSourceFile }) => {
  const ifStatement = node as ts.IfStatement;

  const condition = Parser.parseNode(ifStatement.expression, tsSourceFile);

  const thenStatement = Parser.parseNode(
    ifStatement.thenStatement,
    tsSourceFile
  );

  const elseStatement = ifStatement.elseStatement
    ? Parser.parseNode(ifStatement.elseStatement, tsSourceFile)
    : '';

  return `if (${condition}) {\n${thenStatement}\n} ${
    elseStatement ? `else {\n${elseStatement}\n}` : ''
  }`;
});

grammar.set(ts.SyntaxKind.ForStatement, (node, { tsSourceFile }) => {
  const forStatement = node as ts.ForStatement;
  const initializer = Parser.parseNode(forStatement.initializer!, tsSourceFile);
  const condition = Parser.parseNode(forStatement.condition!, tsSourceFile);
  const incrementor = Parser.parseNode(forStatement.incrementor!, tsSourceFile);
  const statement = Parser.parseNode(forStatement.statement, tsSourceFile);

  return `for (${initializer}; ${condition}; ${incrementor}) {\n${statement}\n}`;
});

export default grammar;