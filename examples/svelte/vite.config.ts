import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import TurboConsole from '../../src/vite'
import inspect from 'vite-plugin-inspect'

export default defineConfig({
	plugins: [
		TurboConsole(),
		sveltekit(),
		inspect(),
	]
});
