import { defineConfig } from 'vite';
import { resolve } from 'path';

// Since our UI apps are already self-contained HTML files with inline CSS and JS,
// we use vite in library mode just to copy and optimize them
export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        'library-menu': resolve(__dirname, 'ui-apps/library-menu/index.html'),
        'token-viewer': resolve(__dirname, 'ui-apps/token-viewer/index.html'),
        'pattern-gallery': resolve(__dirname, 'ui-apps/pattern-gallery/index.html'),
        'dashboard': resolve(__dirname, 'ui-apps/dashboard/index.html'),
      },
    },
    // Keep assets inline
    assetsInlineLimit: 100000000,
    cssCodeSplit: false,
  },
});
