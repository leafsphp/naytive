module.exports = {
  entry: 'src/index.ts',
  output: 'dist',
  // debug: true,
  noNativeBuild: true,
  keepCppSource: true,
  compileType: '.ino', // This tells the compiler to compile the code as an Arduino sketch
  config: {
    board: 'arduino:avr:uno',
    port: '/dev/cu.usbmodem1301',
  },
};
