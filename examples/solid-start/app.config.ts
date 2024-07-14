import { defineConfig } from "@solidjs/start/config";
import TurboConsole from 'unplugin-turbo-console/vite'

export default defineConfig({
  vite: {
    plugins: [
      TurboConsole()
    ]
  },
});
