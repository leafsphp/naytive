import { resolve } from 'path';
import { defineConfig } from 'vite';

import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'Naytive-Types',
      fileName: 'index',
    },
  },
  plugins: [dts()],
});
