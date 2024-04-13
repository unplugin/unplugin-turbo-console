import { defineConfig } from 'astro/config';
import TurboConsole from '../../src/astro'
import Inspect from 'vite-plugin-inspect'

// https://astro.build/config
export default defineConfig({
  integrations: [
    TurboConsole()
  ],
  vite: {
    plugins: [
      Inspect()
    ]
  }
});
