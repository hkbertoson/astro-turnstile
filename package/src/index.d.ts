import type { AstroIntegration } from "astro";
import type { AstroTurnstileOptions } from "./schema";

/**
 * # Astro Turnstile integration.
 *
 * @description An [Astro](https://astro.build) integration that enables ease of use within Astro for Cloudflare Turnstile Captcha.
 * @requires `TURNSTILE_SECRET_KEY` .env variable - The secret key for the Turnstile API.
 * @requires `TURNSTILE_SITE_KEY` .env variable - The site key for the Turnstile API.
 * @see [Cloudflare: Get started with Turnstile](https://developers.cloudflare.com/turnstile/get-started/#get-a-sitekey-and-secret-key) For instructions on how to get your Turnstile API keys.
 * @param {string} options.endpointPath - The path to use for the injected Turnstile API endpoint.
 * @param {boolean} options.verbose - Enable verbose logging.
 * @returns {AstroIntegration & {}} The Astro Turnstile integration.
 */
export default function astroTurnstile(
	options?: AstroTurnstileOptions,
): AstroIntegration & {};
