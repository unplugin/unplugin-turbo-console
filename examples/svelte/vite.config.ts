import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import TurboConsole from 'unplugin-turbo-console/vite'
import inspect from 'vite-plugin-inspect'

export default defineConfig({
	plugins: [
		TurboConsole(),
		sveltekit(),
		inspect(),
	]
});
