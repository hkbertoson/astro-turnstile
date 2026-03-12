import node from "@astrojs/node";
import { defineConfig } from "astro/config";
import astroTurnstile from "astro-turnstile";

// https://astro.build/config
export default defineConfig({
	adapter: node({ mode: "standalone" }),
	integrations: [
		astroTurnstile({
			verbose: true,
		}),
	],
});
