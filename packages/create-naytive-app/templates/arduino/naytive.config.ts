module.exports = {
  entry: 'src/index.ts',
  output: 'dist',
  noNativeBuild: true,
  keepCppSource: true,
  compileType: '.ino', // This tells the compiler to compile the code as an Arduino sketch
  config: {
    board: '', // You can find the board by running `arduino-cli board list`
    port: '', // You can find the port by running `arduino-cli board list`
  },
};
