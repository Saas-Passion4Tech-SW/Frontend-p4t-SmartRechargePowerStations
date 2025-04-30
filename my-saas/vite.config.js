import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	preview: {
	    port: 3001,
	},
	server: {
	    host: '0.0.0.0',
	    port: 1810,
	}
});
