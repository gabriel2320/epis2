import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';

const analyze = process.env.ANALYZE === 'true';

export default defineConfig({
  optimizeDeps: {
    include: [
      '@mui/material',
      '@mui/material/styles',
      '@mui/material/locale',
      '@emotion/react',
      '@emotion/styled',
    ],
  },
  plugins: [
    react(),
    ...(analyze
      ? [
          visualizer({
            filename: 'dist/bundle-stats.html',
            gzipSize: true,
            brotliSize: true,
            open: false,
          }),
        ]
      : []),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('@mui/x-data-grid')) return 'mui-x-grid';
          if (id.includes('@mui/x-charts')) return 'mui-x-charts';
          if (id.includes('@mui/x-scheduler')) return 'mui-x-scheduler';
          if (id.includes('@mui/x-tree-view')) return 'mui-x-other';
          if (id.includes('node_modules/@mui/') && !id.includes('@mui/x-')) return 'mui-core';
          if (id.includes('@mui/x-date-pickers')) return 'mui-core';
        },
      },
    },
  },
  server: {
    host: '127.0.0.1',
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true,
      },
    },
  },
});
