import * as ts from 'typescript';

export interface BaseNaytiveNode {
  id: number;
  naytive: {
    type?: string;
    symbol?: NaytiveNode;
    initialValue?: string;
    dependents: NaytiveNode[];
    dependencies: NaytiveNode[];
    rawScopedDependencies?: string[];
    scopedDependencies: Record<string, NaytiveNode[]>;
  };
}

export interface NaytiveNode extends ts.Node, BaseNaytiveNode {}

export interface ImportDeclaration
  extends ts.ImportDeclaration,
    BaseNaytiveNode {}

export interface VariableDeclaration
  extends ts.VariableDeclaration,
    BaseNaytiveNode {}

export interface VariableDeclarationList
  extends ts.VariableDeclarationList,
    BaseNaytiveNode {}

export interface VariableStatement
  extends ts.VariableStatement,
    BaseNaytiveNode {}

export interface FunctionDeclaration
  extends ts.FunctionDeclaration,
    BaseNaytiveNode {}

export interface ClassDeclaration
  extends ts.ClassDeclaration,
    BaseNaytiveNode {}

export interface InterfaceDeclaration
  extends ts.InterfaceDeclaration,
    BaseNaytiveNode {}

export interface TypeAliasDeclaration
  extends ts.TypeAliasDeclaration,
    BaseNaytiveNode {}

export interface ArrowFunction extends ts.ArrowFunction, BaseNaytiveNode {}

export interface PropertyDeclaration
  extends ts.PropertyDeclaration,
    BaseNaytiveNode {}

export interface PropertyAccessExpression
  extends ts.PropertyAccessExpression,
    BaseNaytiveNode {}

export interface CallExpression extends ts.CallExpression, BaseNaytiveNode {}

export interface ExpressionStatement
  extends ts.ExpressionStatement,
    BaseNaytiveNode {}

export interface BinaryExpression
  extends ts.BinaryExpression,
    BaseNaytiveNode {}

export interface Block extends ts.Block, BaseNaytiveNode {}

export interface SourceFile extends ts.SourceFile, BaseNaytiveNode {}

export interface Identifier extends ts.Identifier, BaseNaytiveNode {}

export interface StringLiteral extends ts.StringLiteral, BaseNaytiveNode {}

export interface NumericLiteral extends ts.NumericLiteral, BaseNaytiveNode {}

export interface TemplateExpression
  extends ts.TemplateExpression,
    BaseNaytiveNode {}

export interface ArrayLiteralExpression
  extends ts.ArrayLiteralExpression,
    BaseNaytiveNode {}

export interface IfStatement extends ts.IfStatement, BaseNaytiveNode {}

export interface ForStatement extends ts.ForStatement, BaseNaytiveNode {}

export interface ForOfStatement extends ts.ForOfStatement, BaseNaytiveNode {}

export interface WhileStatement extends ts.WhileStatement, BaseNaytiveNode {}

export interface DoStatement extends ts.DoStatement, BaseNaytiveNode {}

export interface SwitchStatement extends ts.SwitchStatement, BaseNaytiveNode {}

export interface CaseClause extends ts.CaseClause, BaseNaytiveNode {}

export interface DefaultClause extends ts.DefaultClause, BaseNaytiveNode {}

export interface BreakStatement extends ts.BreakStatement, BaseNaytiveNode {}

export interface ContinueStatement
  extends ts.ContinueStatement,
    BaseNaytiveNode {}

export interface ReturnStatement extends ts.ReturnStatement, BaseNaytiveNode {}

export interface TryStatement extends ts.TryStatement, BaseNaytiveNode {}

export interface CatchClause extends ts.CatchClause, BaseNaytiveNode {}

export interface ThrowStatement extends ts.ThrowStatement, BaseNaytiveNode {}

export interface NewExpression extends ts.NewExpression, BaseNaytiveNode {}

export interface ThisExpression extends ts.ThisExpression, BaseNaytiveNode {}

export interface SuperExpression extends ts.SuperExpression, BaseNaytiveNode {}

export interface TypeOfExpression extends ts.TypeOfExpression, BaseNaytiveNode {}
