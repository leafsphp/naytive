import fs from 'fs';
import path from 'path';
import colors from 'colors';

import type { CompilerConfig } from '../@types/core';
import Parser from './parser';

export default function Compile(compilerConfig: Partial<CompilerConfig>) {
  const config: CompilerConfig = {
    appDir: '',
    noRun: false,
    debug: false,
    output: 'dist/',
    entry: 'index.ts',
    optimizeApp: false,
    compileType: '.cpp',
    optimizeDeps: false,
    noNativeBuild: false,
    keepCppSource: false,
    watch: false,
    ...compilerConfig,
  };

  const fullFilePath = path.join(config.appDir, config.entry);
  const buildDir = path.join(config.appDir, config.output);
  const naytiveBuild = path.join(buildDir, 'main');
  const cppFile = path.join(
    buildDir,
    `${config.compileType === '.ino' ? 'dist' : 'main'}${config.compileType}`
  );

  if (config.debug) {
    console.log(colors.blue(colors.bgBlack('🔭 Running in debug mode\n')));
    console.log(
      `Full path: ${fullFilePath}\nBuild Dir: ${buildDir}\nNative Build: ${naytiveBuild}\nNative Code File: ${cppFile}\n`
    );
  }

  console.log(
    colors.yellow(`⏳ Compiling ${path.basename(fullFilePath)}...`) + '\n'
  );

  const compileAndWrite = () => {
    const parsedApp = (Parser.config(config) as typeof Parser).parse(
      fullFilePath
    );

    fs.writeFile(
      path.join(
        buildDir,
        `${config.compileType === '.ino' ? 'dist' : 'main'}${
          config.compileType
        }`
      ),
      Parser.imports.join('\n') + parsedApp,
      async (err) => {
        if (err) {
          throw new Error('Failed to write file');
        }

        const otherFiles = fs
          .readdirSync(buildDir)
          .filter(
            (file) =>
              file !== `main${config.compileType}` &&
              file !== 'main' &&
              !file.endsWith('.h')
          )
          .map((file) => path.join(buildDir, file).replace(/["]/g, ''));

        if (config.compileType === '.ino') {
          if (!config.noRun) {
            const { $ } = await import('execa');

            $({
              cwd: buildDir,
              stdio: 'inherit',
            })`arduino-cli compile --fqbn ${config.config?.board} dist.ino`.then(
              () => {
                console.log(colors.green(`\n\n✔ Compiled Successfully\n`));
                console.log(colors.yellow(`⏳ Uploading...`) + '\n');

                $({
                  cwd: buildDir,
                  stdio: 'inherit',
                })`arduino-cli upload -p ${config.config?.port} --fqbn ${config.config?.board} dist.ino`.then(
                  () => {
                    console.log(colors.green(`\n\n✔ Uploaded Successfully\n`));

                    if (!config.keepCppSource) {
                      fs.unlink(cppFile, (err) => {
                        otherFiles.forEach((file) => {
                          fs.unlinkSync(path.join(buildDir, file));
                        });

                        if (err) {
                          throw new Error('Failed to delete file');
                        }
                      });
                    }
                  }
                );
              }
            );
          } else {
            console.log(colors.green(`✔ Arduino source generated\n`));
          }
        } else {
          if (!config.noNativeBuild) {
            const { $ } = await import('execa');

            $({
              cwd: buildDir,
              stdio: 'inherit',
            })`g++ -std=c++17 -o ${naytiveBuild} ${cppFile} ${
              otherFiles ? otherFiles : ''
            }`.then(() => {
              console.log(colors.green(`✔ Successfully Compiled\n`));

              if (!config.noRun) {
                console.log(colors.yellow(`⏳ Running...`) + '\n');

                $({
                  cwd: buildDir,
                  stdio: 'inherit',
                })`${naytiveBuild}`.then(() => {
                  console.log(colors.green(`\n\n✔ Run Successfully\n`));

                  if (!config.keepCppSource) {
                    fs.unlink(cppFile, (err) => {
                      otherFiles.forEach((file) => {
                        fs.unlinkSync(path.join(buildDir, file));
                      });

                      if (err) {
                        throw new Error('Failed to delete file');
                      }
                    });
                  }
                });
              }
            });
          } else {
            console.log(colors.green(`✔ C++ source generated\n`));
          }
        }
      }
    );
  };

  fs.mkdir(buildDir, { recursive: true }, () => {
    if (config.watch) {
      compileAndWrite();

      fs.watch(path.dirname(fullFilePath), { recursive: true }, () => {
        console.log(
          colors.yellow(`⏳ Changes Detected. Recompiling...`) + '\n'
        );

        compileAndWrite();
      });
    } else {
      compileAndWrite();
    }
  });
}
