import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";
import astroTurnstile from "astro-turnstile";

// https://astro.build/config
export default defineConfig({
	integrations: [tailwind(), astroTurnstile({
		siteKey: "1x00000000000000000000AA"
	})],
});