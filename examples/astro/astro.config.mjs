import { defineConfig } from 'astro/config';
import TurboConsole from 'unplugin-turbo-console/astro'

// https://astro.build/config
export default defineConfig({
  integrations: [
    TurboConsole()
  ]
});
