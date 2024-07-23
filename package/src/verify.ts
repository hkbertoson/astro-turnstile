import type { APIRoute } from "astro";

import config from "virtual:astro-turnstile/config";

const verifyEndpoint =
	"https://challenges.cloudflare.com/turnstile/v0/siteverify";

const { TURNSTILE_TOKEN } = config;
const { siteKey } = config.options;

export const POST: APIRoute = async () => {
	const response = await fetch(verifyEndpoint, {
		method: "POST",
		headers: {
			"content-type": "application/x-www-form-urlencoded",
		},
		body: `secret=${encodeURIComponent(
			TURNSTILE_TOKEN,
		)}&response=${encodeURIComponent(siteKey)}`,
	});
	const data = await response.json();
	return new Response(JSON.stringify(data));
};
