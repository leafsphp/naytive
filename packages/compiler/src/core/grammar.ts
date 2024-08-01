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

import Parser from './parser';

import type { CompilerConfig, CompilerGrammar } from '../@types/core';
import type {
  ArrayLiteralExpression,
  ArrowFunction,
  BinaryExpression,
  Block,
  CallExpression,
  ExpressionStatement,
  ForStatement,
  FunctionDeclaration,
  IfStatement,
  ImportDeclaration,
  PropertyAccessExpression,
  StringLiteral,
  TemplateExpression,
  TypeOfExpression,
  VariableDeclaration,
  VariableDeclarationList,
  VariableStatement,
} from '../@types/lexer';
import Lexer from './lexer';

export const libraries: Record<string, string> = {
  std: 'iostream',
  array: 'array',
};

const grammar = new Map<ts.SyntaxKind | string, CompilerGrammar>();

grammar.set(
  ts.SyntaxKind.ImportDeclaration,
  (node, { tsSourceFile, filePath }) => {
    const importDeclaration = node as ImportDeclaration;
    const moduleSpecifier =
      importDeclaration.moduleSpecifier.getText(tsSourceFile);
    const namedImports = importDeclaration.importClause?.namedBindings;
    const importedFile = moduleSpecifier.replaceAll(/['"`]+/g, '');
    const importedFilePath = path.join(
      filePath!.replace(path.basename(filePath!), ''),
      `${importedFile}${path.extname(importedFile) ? '' : '.ts'}`
    );

    if (importedFile.startsWith('@naytive/')) {
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

grammar.set(ts.SyntaxKind.DeclareKeyword, (node, { tsSourceFile }) => {
  return `#define ${node
    .getText(tsSourceFile)
    .replace(/^declare\s*(\s*(const|let|var)\s*)/, '')
    .replace(/\s*=\s*/, ' ')
    .replace(';', '')}`;
});

grammar.set(ts.SyntaxKind.FirstStatement, (node, { tsSourceFile }) => {
  return grammar.get(ts.SyntaxKind.ExpressionStatement)!(node, {
    tsSourceFile,
  });
});

grammar.set(ts.SyntaxKind.VariableDeclaration, (node, { tsSourceFile }) => {
  const variable = node as VariableDeclaration;

  const isRoot =
    Parser.hasMain &&
    variable?.parent?.parent?.parent?.kind === ts.SyntaxKind.SourceFile;

  let variableName = variable.name.getText(tsSourceFile);
  let variableType = variable?.naytive?.type;

  let variableValue = Parser.parseNode(
    variable.initializer! as any,
    tsSourceFile
  );

  if (variable.initializer?.kind === ts.SyntaxKind.ArrowFunction) {
    const arrowFunction = variable.initializer as ArrowFunction;
    const functionArguments = arrowFunction.parameters
      .map((parameter) => Parser.parseVariable(parameter, tsSourceFile))
      .join(', ');
    const functionType =
      variableName === 'main' && variableType === 'unsigned short'
        ? 'int'
        : variableType || arrowFunction.naytive?.type || 'auto';

    console.log(
      variable?.naytive,
      arrowFunction.naytive,
      variable?.getText(variable?.getSourceFile()),
      'scoped'
    );

    if (!isRoot) {
      return `${
        functionType === 'void' ? 'auto' : functionType
      } ${variableName} = [](${functionArguments}) {${Parser.parseNode(
        arrowFunction.body! as any,
        tsSourceFile
      )}}`;
    }

    return `${functionType} ${variableName}(${functionArguments}) {\n${
      (arrowFunction.body?.kind !== ts.SyntaxKind.Block ? 'return ' : '') +
      Parser.parseNode(arrowFunction.body! as any, tsSourceFile)
    };\n}`;
  }

  if (variableValue?.includes('std::cin')) {
    const stdInPrompt = variableValue.match(/(?<=\()(.*)(?=\))/)?.[0];

    return `${variableType} ${variableName};\n${
      stdInPrompt ? `std::cout << ${stdInPrompt};\n` : ''
    }\n${variableValue
      .replace(stdInPrompt || '', '')
      .replace(/std\::cin\((.*)\)/, `std::cin >> ${variableName}`)
      .replace(/alert\((.*)\)/, `std::cin >> ${variableName}`)}`;
  }

  if (variable.initializer?.kind === ts.SyntaxKind.ArrayLiteralExpression) {
    if (
      !variableType?.includes('std::array<') &&
      !variableType?.includes('std::vector<')
    ) {
      variableName = `${variableName}[]`;
    }

    variableValue = variableValue?.replace('[', '{').replace(']', '}');
  }

  return `${variableType} ${variable.name.getText(
    tsSourceFile
  )} = ${variableValue}`;
});

grammar.set(ts.SyntaxKind.VariableDeclarationList, (node, { tsSourceFile }) => {
  const variableDeclarationList = node as VariableDeclarationList;
  const variableDeclaration = variableDeclarationList.declarations[0];

  return grammar.get(ts.SyntaxKind.VariableDeclaration)!(
    variableDeclaration as any,
    {
      tsSourceFile,
    }
  );
});

grammar.set(ts.SyntaxKind.VariableStatement, (node, { tsSourceFile }) => {
  const variableStatement = node as VariableStatement;
  const variableDeclaration = variableStatement.declarationList.declarations[0];

  return `${grammar.get(ts.SyntaxKind.VariableDeclaration)!(
    variableDeclaration as any,
    {
      tsSourceFile,
    }
  )};`;
});

grammar.set(
  ts.SyntaxKind.PropertyAccessExpression,
  (node, { tsSourceFile }) => {
    const propertyAccessExpression = node as PropertyAccessExpression;

    const name = propertyAccessExpression.name.getText(tsSourceFile);
    const expression =
      propertyAccessExpression.expression.getText(tsSourceFile);

    if (name === 'length') {
      return `${expression}.size()`;
    }

    if (name === 'toUpperCase') {
      Parser.addNaytiveLib('str_to_upper');
      Parser.addLibrary('#include <string>');

      return `str_to_upper(${expression})`;
    }

    if (name === 'toLowerCase') {
      Parser.addNaytiveLib('str_to_lower');

      return `str_to_lower(${expression})`;
    }

    if (name === 'replace') {
      Parser.addNaytiveLib('str_replace');

      return `str_replace(${expression})`;
    }

    if (name === 'split') {
      Parser.addNaytiveLib('str_to_array');

      return `str_to_array(${expression})`;
    }

    if (name === 'toString') {
      Parser.addLibrary('#include <string>');

      return `std::to_string(${expression})`;
    }

    if (name === 'forEach') {
      return `for (int i = 0; i < ${expression}.size(); i++)`;
    }

    return `${expression}.${name}`;
  }
);

grammar.set(ts.SyntaxKind.ExpressionStatement, (node, { tsSourceFile }) => {
  const expressionStatement = node as ExpressionStatement;

  return `${Parser.parseNode(
    expressionStatement.expression as any,
    tsSourceFile
  )};`;
});

grammar.set(ts.SyntaxKind.CallExpression, (node, { tsSourceFile }) => {
  const callExpression = node as CallExpression;
  const expression = Parser.parseNode(
    callExpression.expression as any,
    tsSourceFile
  );
  const args = callExpression.arguments.map((arg) =>
    Parser.parseNode(arg as any, tsSourceFile)
  );

  if (callExpression.expression.getText(tsSourceFile).includes('.forEach')) {
    const forEachFunction = callExpression.arguments?.[0] as ts.ArrowFunction;
    const forEachFunctionArguments = forEachFunction.parameters.map(
      (parameter) => Parser.parseVariable(parameter, tsSourceFile)
    );

    let loopVariables = '';

    if (forEachFunctionArguments.length > 0) {
      loopVariables += `${forEachFunctionArguments[0]} = ${(
        callExpression.expression as ts.PropertyAccessExpression
      ).expression.getText()}[i];\n`;

      if (forEachFunctionArguments[1]) {
        loopVariables += `${forEachFunctionArguments[1]} = i;\n`;
      }

      if (forEachFunctionArguments[2]) {
        loopVariables += `${forEachFunctionArguments[2]} = ${(
          callExpression.expression as ts.PropertyAccessExpression
        ).expression.getText()};\n`;
      }
    }

    return `${expression} {\n${loopVariables}\n${Parser.parseNode(
      forEachFunction.body! as any,
      tsSourceFile
    )}}`;
  }

  if (
    callExpression.expression.kind === ts.SyntaxKind.PropertyAccessExpression
  ) {
    // check if expression is a defined library function
    if (!!grammar.get(expression)) {
      return grammar.get(expression)!(callExpression, { tsSourceFile });
    }

    if (expression.endsWith('.dereference')) {
      return `*${expression.replace('.dereference', '')}`;
    }

    if (expression.startsWith('std.')) {
      Parser.addLibrary('#include <iostream>');

      if (expression.includes('std.setprecision')) {
        Parser.addLibrary('#include <iomanip>');
      }

      return `${expression.replace('std.', 'std::')}(${args.join(', ')})`;
    }

    return (
      expression + (expression.includes('(') ? args.join() : `(${args.join()})`)
    );
  }

  return `${expression}(${args.join(', ')})`;
});

grammar.set(ts.SyntaxKind.TemplateExpression, (node, { tsSourceFile }) => {
  const templateExpression = node as TemplateExpression;

  Parser.addLibrary('#include <string>');

  const parsedTemplateSpans = templateExpression.templateSpans.map((span) =>
    Parser.parseNode(span.expression as any, tsSourceFile)
  );

  return templateExpression
    .getText(tsSourceFile)
    .replace(/(\${)(.*?)(})/g, (_, __, _expression) => {
      // const variableType = Parser.getType(
      //   templateExpression.templateSpans[0].expression,
      //   tsSourceFile
      // );

      // if (variableType !== 'std::string' && !variableType.endsWith('*')) {
      //   return `" + std::to_string(${parsedTemplateSpans.shift()!}) + "`;
      // }

      return `" + ${parsedTemplateSpans.shift()!} + "`;
    })
    .replace(/`([^`]+)`/g, '"$1"');
});

grammar.set(ts.SyntaxKind.FirstTemplateToken, (node, { tsSourceFile }) => {
  return grammar.get(ts.SyntaxKind.StringLiteral)!(node, { tsSourceFile });
});

grammar.set(ts.SyntaxKind.StringLiteral, (node) => {
  const stringLiteral = node as StringLiteral;

  Parser.addLibrary('#include <string>');

  return JSON.stringify(stringLiteral.text);
});

grammar.set(ts.SyntaxKind.ArrayLiteralExpression, (node, { tsSourceFile }) => {
  const arrayLiteralExpression = node as ArrayLiteralExpression;
  const elements = arrayLiteralExpression.elements.map((element) =>
    Parser.parseNode(element as any, tsSourceFile)
  );

  return `{${elements.join(', ')}}`;
});

grammar.set(ts.SyntaxKind.BinaryExpression, (node, { tsSourceFile }) => {
  const binaryExpression = node as BinaryExpression;
  const left = Parser.parseNode(binaryExpression.left as any, tsSourceFile);
  const operator = binaryExpression.operatorToken.getText(tsSourceFile);

  let right = Parser.parseNode(binaryExpression.right as any, tsSourceFile);

  if (right?.startsWith('std.cin')) {
    const stdInPrompt = right.match(/(?<=\()(.*)(?=\))/)?.[0];

    return `${
      stdInPrompt
        ? `std::cout << ${stdInPrompt
            .replace(/'(.*)'/, '"$1"')
            .replace(/`(.*)`/, '"$1"')};\n`
        : ''
    }\nstd::cin >> ${left};`;
  }

  return `${left} ${operator} ${right}`;
});

grammar.set(ts.SyntaxKind.FunctionDeclaration, (node, { tsSourceFile }) => {
  const functionDeclaration = node as FunctionDeclaration;
  const functionType = functionDeclaration.naytive?.type;
  const functionName = functionDeclaration.name?.getText(tsSourceFile);
  const functionArguments = functionDeclaration.parameters
    .map((parameter) => Parser.parseVariable(parameter, tsSourceFile))
    .join(', ');

  const isRoot =
    Parser.hasMain &&
    functionDeclaration?.parent?.parent?.parent?.kind ===
      ts.SyntaxKind.SourceFile;

  if (!isRoot) {
    const dependencies: ts.Node[] = [];
    const parsedDeps: string[] = [];

    const extractIdentifiers = (node: ts.Node) => {
      if (ts.isIdentifier(node)) {
        dependencies.push(node);
      }

      ts.forEachChild(node, extractIdentifiers);
    };

    extractIdentifiers(functionDeclaration);

    dependencies.forEach((dependency) => {
      const depSymbol = Parser.typeChecker.getSymbolAtLocation(dependency);

      const isSameFunction = depSymbol?.valueDeclaration === functionDeclaration;
      const isDeclarationPresent = !!depSymbol?.valueDeclaration?.getText();

      if (!isSameFunction && isDeclarationPresent) {
        const nearestFunctionParent = Lexer.findFuntionParent(depSymbol?.valueDeclaration!);

        if (
          nearestFunctionParent !== functionDeclaration &&
          (
            depSymbol?.valueDeclaration?.kind === ts.SyntaxKind.FunctionDeclaration ||
            depSymbol?.valueDeclaration?.kind === ts.SyntaxKind.ArrowFunction ||
            depSymbol?.valueDeclaration?.kind === ts.SyntaxKind.VariableDeclaration
          )
        ) {
          const valueDeclaration = depSymbol?.valueDeclaration;
          const valueName = valueDeclaration?.name?.getText();

          parsedDeps.push(valueName);
        }
      }
    });

    return `${
      functionType === 'void' ? 'auto' : functionType
    } ${functionName} = [${parsedDeps.join(', ')}](${functionArguments}) {${Parser.parseNode(
      functionDeclaration.body! as any,
      tsSourceFile
    )}}`;
  }

  return `${functionType} ${functionName}(${functionArguments}) {\n${Parser.parseNode(
    functionDeclaration.body! as any,
    tsSourceFile
  )}\n}`;
});

grammar.set(ts.SyntaxKind.ArrowFunction, (node, { tsSourceFile }) => {
  const variable = node as VariableStatement;
  const variableDeclaration = variable.declarationList?.declarations?.[0];

  const arrowFunction =
    (variableDeclaration?.initializer as ArrowFunction) ||
    (node as ArrowFunction);

  const functionName = variableDeclaration?.name?.getText(tsSourceFile);
  const functionArguments = arrowFunction.parameters
    .map((parameter) => Parser.parseVariable(parameter, tsSourceFile))
    .join(', ');
  const functionType = arrowFunction.naytive?.type || variable.naytive?.type;

  if (!functionName) {
    return `[](${functionArguments}) {${Parser.parseNode(
      arrowFunction.body! as any,
      tsSourceFile
    )}}`;
  }

  if (arrowFunction.naytive?.isNested) {
    return `${functionType} ${functionName} = [](${functionArguments}) {${Parser.parseNode(
      arrowFunction.body! as any,
      tsSourceFile
    )}}`;
  }

  return `${functionType} ${functionName}(${functionArguments}) {\n${Parser.parseNode(
    arrowFunction.body! as any,
    tsSourceFile
  )}\n}`;
});

grammar.set(ts.SyntaxKind.Block, (node, { tsSourceFile, filePath }) => {
  const block = node as Block;
  const parsedCode: string[] = [];

  block.statements.forEach((statement: any) => {
    parsedCode.push(Parser.parseNode(statement, tsSourceFile, filePath));
  });

  return parsedCode.join('\n\n');
});

grammar.set(ts.SyntaxKind.IfStatement, (node, { tsSourceFile }) => {
  const ifStatement = node as IfStatement;

  const condition = Parser.parseNode(
    ifStatement.expression as any,
    tsSourceFile
  );

  const thenStatement = Parser.parseNode(
    ifStatement.thenStatement as any,
    tsSourceFile
  );

  const elseStatement = ifStatement.elseStatement
    ? Parser.parseNode(ifStatement.elseStatement as any, tsSourceFile)
    : '';

  return `if (${condition}) {\n${thenStatement}\n} ${
    elseStatement ? `else {\n${elseStatement}\n}` : ''
  }`;
});

grammar.set(ts.SyntaxKind.ForStatement, (node, { tsSourceFile }) => {
  const forStatement = node as ForStatement;

  const initializer = Parser.parseNode(
    forStatement.initializer! as any,
    tsSourceFile
  );
  const condition = Parser.parseNode(
    forStatement.condition! as any,
    tsSourceFile
  );
  const incrementor = Parser.parseNode(
    forStatement.incrementor! as any,
    tsSourceFile
  );
  const statement = Parser.parseNode(
    forStatement.statement as any,
    tsSourceFile
  );

  return `for (${initializer}; ${condition}; ${incrementor}) {\n${statement}\n}`;
});

grammar.set(ts.SyntaxKind.TypeOfExpression, (node, { tsSourceFile }) => {
  const typeOfExpression = node as TypeOfExpression;

  return `typeid(${Parser.parseNode(
    typeOfExpression.expression as any,
    tsSourceFile
  )}).name()`;
});

grammar.set(ts.SyntaxKind.ReturnStatement, (node, { tsSourceFile }) => {
  const returnStatement = node as unknown as ts.ReturnStatement;

  return `return ${Parser.parseNode(
    returnStatement.expression as any,
    tsSourceFile
  )}`;
});

// JAVASCRIPT/NAYTIVE LIBRARY GRAMMAR

grammar.set('std.cout', (node, { tsSourceFile }) => {
  const cout = node as CallExpression;
  const values = cout.arguments
    .map((arg) => Parser.parseNode(arg as any, tsSourceFile))
    .join(' << ');

  return `std::cout << ${values.replace(/\s*\+\s*/g, ' << ')}`;
});

grammar.set('console.log', (node, { tsSourceFile }) => {
  const cout = node as CallExpression;
  const values = cout.arguments
    .map((arg) => Parser.parseNode(arg as any, tsSourceFile))
    .join(' << ');

  return `std::cout << ${values.replace(/\s*\+\s*/g, ' << ')}`;
});

grammar.set('memory.pointer', (node, { tsSourceFile }) => {
  const pointer = node as CallExpression;
  const pointerValue = Parser.parseNode(
    pointer.arguments[0] as any,
    tsSourceFile
  );

  return `&${pointerValue}`;
});

grammar.set('memory.dereference', (node, { tsSourceFile }) => {
  const dereference = node as CallExpression;
  const dereferenceValue = Parser.parseNode(
    dereference.arguments[0] as any,
    tsSourceFile
  );

  return `*${dereferenceValue}`;
});

export default grammar;
