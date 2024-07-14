import * as ts from 'typescript';

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
  node: ts.Node,
  params: {
    tsSourceFile: ts.SourceFile;
    filePath?: string;
  }
) => string;
