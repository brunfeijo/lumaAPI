import { defineConfig } from 'cypress';
import createBundler from '@bahmutov/cypress-esbuild-preprocessor';

export default defineConfig({
  e2e: {
    baseUrl: 'https://api.restful-api.dev',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    supportFile: 'cypress/support/e2e.ts',
    setupNodeEvents(on, config) {
      // Use esbuild to avoid webpack/ts-loader quirks
      on('file:preprocessor', createBundler());
      return config;
    },
  },
  video: false,
});
