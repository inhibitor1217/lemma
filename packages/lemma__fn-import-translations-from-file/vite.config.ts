import { builtinModules } from 'module';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => ({
  build: {
    target: 'node18',
    lib: {
      entry: path.resolve(__dirname, 'src/handler.ts'),
      formats: ['cjs'],
    },
    outDir: 'build',
    minify: mode === 'production' ? 'esbuild' : false,
    rollupOptions: {
      external: ['@lemma/prisma-client', ...builtinModules],
    },
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src'),
    },
  },
  ssr: {
    noExternal: true,
  },
}));
