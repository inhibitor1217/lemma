import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => ({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/handler.ts'),
      fileName: 'index',
      formats: ['cjs'],
    },
    outDir: 'build',
    minify: mode === 'production' ? 'esbuild' : false,
    rollupOptions: {
      external: ['@lemma/prisma-client'],
    },
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src'),
    },
  },
}));
