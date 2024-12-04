import node from '@astrojs/node';
import tailwind from '@astrojs/tailwind';
import astroTurnstile from 'astro-turnstile';
import {defineConfig} from 'astro/config';

// https://astro.build/config
export default defineConfig({
	adapter: node({mode: 'standalone'}),
	integrations: [
		tailwind(),
		astroTurnstile({
			verbose: true,
		}),
	],
});
