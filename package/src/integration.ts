import {
	addVirtualImports,
	createResolver,
	defineIntegration,
} from "astro-integration-kit";
import { z } from "astro/zod";
import { loadEnv } from "vite";

const { TURNSTILE_TOKEN } = loadEnv("all", process.cwd(), "TURNSTILE_");
if (!TURNSTILE_TOKEN) {
	throw new Error("Missing TURNSTILE_TOKEN in .env");
}

export default defineIntegration({
	name: "astro-turnstile",
	optionsSchema: z.object({ siteKey: z.string() }),
	setup({ options }) {
		const { resolve } = createResolver(import.meta.url);

		if (!options.siteKey) {
			throw new Error("Missing siteKey in options");
		}
		return {
			"astro:config:setup"(params) {
				const { injectRoute } = params;
				injectRoute({
					pattern: "/verify",
					entrypoint: resolve("verify.ts"),
				});
				addVirtualImports(params, {
					name: "virtual:astro-turnstile/config",
					imports: {
						"virtual:astro-turnstile/config": `export default ${JSON.stringify({
							options,
							TURNSTILE_TOKEN,
						})}`,
					},
				});
			},
		};
	},
});
