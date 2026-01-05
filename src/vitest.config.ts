import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '*.config.ts',
        'electron/',
        'build/',
        'mcp-server/',
        'docs/',
        '**/*.d.ts',
      ],
    },
    include: ['tests/**/*.test.{ts,tsx}'],
    exclude: ['node_modules', 'build', 'dist'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      '@components': path.resolve(__dirname, './components'),
      '@lib': path.resolve(__dirname, './lib'),
      '@utils': path.resolve(__dirname, './utils'),
      '@hooks': path.resolve(__dirname, './hooks'),
      '@types': path.resolve(__dirname, './types'),
    },
  },
});
