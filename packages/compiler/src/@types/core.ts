import * as ts from 'typescript';

import type { NaytiveNode } from './lexer';

export type CompilerConfig = {
  watch: boolean;
  entry: string;
  output: string;
  appDir: string;
  noRun: boolean;
  debug: boolean;
  optimizeApp: boolean;
  optimizeDeps: boolean;
  keepCppSource: boolean;
  noNativeBuild: boolean;
  compileType: '.cpp' | '.c' | '.ino';
  config?: Record<string, any>;
};

export type CompilerGrammar = (
  node: NaytiveNode,
  params?: {
    filePath?: string;
  }
) => string;
