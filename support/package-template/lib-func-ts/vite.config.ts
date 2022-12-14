import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => ({
  build: {
    target: 'node18',
    lib: {
      entry: path.resolve(__dirname, 'src/handler.ts'),
      fileName: 'index',
      formats: ['cjs'],
    },
    outDir: 'build',
    minify: mode === 'production' ? 'esbuild' : false,
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src'),
    },
  },
}));
