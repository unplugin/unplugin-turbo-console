import { defineConfig } from "@solidjs/start/config";
import TurboConsole from '../../src/vite'

export default defineConfig({
  vite: {
    plugins: [
      TurboConsole()
    ]
  },
});
