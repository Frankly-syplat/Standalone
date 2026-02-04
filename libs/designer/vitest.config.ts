import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import packageJson from './package.json';

export default defineConfig({
  plugins: [react()],
  test: {
    name: packageJson.name,
    environment: 'jsdom',
    setupFiles: ['test-setup.ts'],
    restoreMocks: true,
    coverage: { 
      provider: 'istanbul', 
      include: ['src/**/*'], 
      reporter: ['html', 'cobertura', 'lcov'] 
    },
  },
});
