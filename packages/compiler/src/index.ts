import colors from 'colors';
import minimist from 'minimist';

import { existsSync, readFileSync } from 'fs';
import { basename, join } from 'path';

import Compile from './core/compile';

const main = async () => {
  const cwd = process.cwd();
  const argv = minimist(process.argv.slice(2));
  const watchMode = !!argv.watch || !!argv.w;

  let fileToCompile = argv._?.[0];

  if (!fileToCompile) {
    if (existsSync(join(cwd, 'naytive.json'))) {
      fileToCompile = 'naytive.json';
    } else if (existsSync(join(cwd, 'naytive.config.js'))) {
      fileToCompile = 'naytive.config.js';
    } else if (existsSync(join(cwd, 'naytive.config.ts'))) {
      fileToCompile = 'naytive.config.ts';
    } else {
      throw new Error(
        colors.red('✖') + colors.yellow(' Please provide a file to compile')
      );
    }
  }

  if (!fileToCompile.endsWith('.config.js') && fileToCompile.endsWith('.js')) {
    throw new Error(
      colors.red('✖') +
        colors.yellow(' JavaScript files are only supported in config files')
    );
  }

  if (
    !fileToCompile.endsWith('.ts') &&
    !fileToCompile.endsWith('.json') &&
    !fileToCompile.endsWith('.config.js')
  ) {
    throw new Error(
      colors.red('✖') +
        colors.yellow(' File to compile must be a TypeScript or JSON file')
    );
  }

  if (
    fileToCompile.endsWith('.json') ||
    fileToCompile.endsWith('.config.ts') ||
    fileToCompile.endsWith('.config.js') ||
    fileToCompile.endsWith('.config.json')
  ) {
    if (!readFileSync(`${join(cwd, fileToCompile)}`, 'utf-8')) {
      throw new Error(
        colors.red('✖') +
          colors.yellow(' File to compile must be a valid JSON file')
      );
    } else {
      console.log(
        colors.yellow(
          `🔏 ${colors.bold(basename(fileToCompile))} found. Applying config...`
        )
      );
    }
  }

  Compile({
    ...(fileToCompile.endsWith('.json') ||
    fileToCompile.endsWith('.config.json')
      ? {
          ...JSON.parse(
            readFileSync(`${join(cwd, fileToCompile)}`, 'utf-8') || '{}'
          ),
        }
      : fileToCompile.endsWith('.config.js') ||
        fileToCompile.endsWith('.config.ts')
      ? require(join(cwd, fileToCompile))
      : {
          entry: basename(fileToCompile),
        }),
    appDir: join(cwd, fileToCompile).replace(basename(fileToCompile), ''),
    watch: watchMode,
  });
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

export * from './@types/core';
