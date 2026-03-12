import { z } from "astro/zod";

const endpointErrorMessages = {
	startsWith:
		"The endpoint path must start with a forward slash. (e.g. '/your-path')",
	urlSafe:
		"The endpoint path must only contain URL-safe characters. (e.g. '/your-path')",
	endsWith:
		"The endpoint path must not end with a forward slash. (e.g. '/your-path')",
};

/**
 * Astro-Turnstile configuration options schema.
 */
export const AstroTurnstileOptionsSchema = z
	.object({
		/**
		 * The path to the injected Turnstile API endpoint.
		 * @type {string}
		 * @default "/verify"
		 */
		endpointPath: z
			.string()
			.optional()
			.default("/verify")
			.refine(
				(arg) => arg.startsWith("/"),
				(arg) => ({
					message: `${endpointErrorMessages.startsWith} Error: ${arg}`,
				}),
			)
			.refine(
				(arg) => /^[a-zA-Z0-9\-_/]+$/.test(arg),
				(arg) => ({
					message: `${endpointErrorMessages.urlSafe} Error: ${arg}`,
				}),
			)
			.refine(
				(arg) => !arg.endsWith("/"),
				(arg) => ({
					message: `${endpointErrorMessages.endsWith} Error: ${arg}`,
				}),
			)
			.describe(
				'The path to the injected Turnstile API endpoint. (default: "/verify")',
			),
		/**
		 * Disable the client-side script injection.
		 *
		 * By default, the client-side script is injected into the Astro project on every page.  In some cases, you may want to disable this behavior, and manually inject the script where needed. This option allows you to disable the client-side script injection.
		 *
		 * **Note:** If you disable the client-side script injection, you will need to manually inject the Turnstile client-side script into your Astro project.
		 * @example On any Layout that you want to use Turnstile, you can add the following script tag to the head:
		 * ```html
		 * <html>
		 *  <head>
		 *	  <!-- Other head content -->
		 * 	  <script> import 'astro-turnstile/client'; </script>
		 *  </head>
		 * </html>
		 * ```
		 * @see [Cloudflare: Turnstile Explicitly render the Turnstile widget (onloadTurnstileCallback)](https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/#explicitly-render-the-turnstile-widget) For more information on the Turnstile client-side script. Or if you want to inject their script manually.
		 * @type {boolean}
		 * @default false
		 */
		disableClientScript: z
			.boolean()
			.optional()
			.default(false)
			.describe("Disable the client-side script injection. (default: false)"),
		/**
		 * Disable the Astro Turnstile Dev Toolbar App.
		 *
		 * @default false
		 */
		disableDevToolbar: z
			.boolean()
			.optional()
			.default(false)
			.describe("Disable the Astro Turnstile Dev Toolbar. (default: false)"),
		/**
		 * Enable verbose logging.
		 * @type {boolean}
		 * @default false
		 */
		verbose: z
			.boolean()
			.optional()
			.default(false)
			.describe("Enable verbose logging. (default: false)"),
	})
	.optional()
	.default({});

/**
 * Astro-Turnstile configuration options type.
 */
export type AstroTurnstileOptions = typeof AstroTurnstileOptionsSchema._input;

/**
 * Astro-Turnstile configuration options type used by the `virtual:astro-turnstile/config` module.
 */
export type AstroTurnstileConfig = z.infer<typeof AstroTurnstileOptionsSchema>;
