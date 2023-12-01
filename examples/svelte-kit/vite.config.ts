import { sveltekit } from '@sveltejs/kit/vite';
import TurboConsole from 'vite-plugin-turbo-console'
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit(),
		TurboConsole()
	]
});
