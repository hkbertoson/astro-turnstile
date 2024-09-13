import tailwind from "@astrojs/tailwind";
import astroTurnstile from "astro-turnstile";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	output: "hybrid",
	integrations: [
		tailwind(),
		astroTurnstile({
			verbose: true,
		}),
	],
});
