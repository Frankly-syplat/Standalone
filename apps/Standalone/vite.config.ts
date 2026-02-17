import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import { nodePolyfills as np } from 'vite-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: [
      {
        find: '~@xyflow/react',
        replacement: '@xyflow/react',
      },
      {
        find: 'util',
        replacement: 'util',
      },
    ],
  },
  plugins: [
    react(),
    NodeGlobalsPolyfillPlugin({
      process: true,
      buffer: true,
    }),
    np(),
    // Removed mkcert() to avoid certificate prompts - using HTTP only
  ],
  server: {
    port: 4200,
    https: false, // Force HTTP only
    headers: {
      // Allow iframe embedding from any origin (adjust for production)
      'X-Frame-Options': 'ALLOWALL',
      'Content-Security-Policy': "frame-ancestors *;"
    },
    proxy: {
      '/templatesLocalProxy': {
        target: 'https://priti-cxf4h5cpcteue4az.b02.azurefd.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/templatesLocalProxy/, ''),
        secure: false, // Optional: skip SSL validation in dev
      },
    },
  },
  define: {
    global: 'globalThis',
    'process.env': {},
    'process.version': '"v18.0.0"',
  },
  build: {
    sourcemap: false, // Disable source maps for production
    minify: 'esbuild', // Enable minification for smaller bundle size
    rollupOptions: {
      plugins: [nodePolyfills()],
      output: {
        // Split vendor code for better caching
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-redux'],
          'fluent-ui': ['@fluentui/react', '@fluentui/react-components'],
        }
      }
      //external: ['react', 'react-dom', '@tanstack/react-query', '@tanstack/react-query-devtools'],
    },
  },
  optimizeDeps: {
    exclude: [
      'node_modules/.cache',
      '@microsoft/logic-apps-shared',
      '@microsoft/logic-apps-designer', 
      '@microsoft/designer-ui'
    ],
    include: [
      'react',
      'react-dom',
      '@tanstack/react-query',
      '@fluentui/react',
      '@fluentui/react-components',
      'util'
    ]
  },
});
