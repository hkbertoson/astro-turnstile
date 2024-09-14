import { TURNSTILE_SECRET_KEY } from "astro:env/server";
import type { APIRoute } from "astro";

// Ensure this route is not prerendered by Astro
export const prerender = false;

/**
 * The Astro-Turnstile API endpoint for verifying tokens.
 */
export const POST: APIRoute = async ({ request }) => {
	// Parse the incoming form data
	const data = await request.formData();

	// Get the Turnstile token and the connecting IP
	const turnstileToken = data.get("cf-turnstile-response");
	const connectingIP = request.headers.get("CF-Connecting-IP");

	// Ensure the secret key and token are present
	if (!TURNSTILE_SECRET_KEY || !turnstileToken) {
		return new Response(null, {
			status: 400,
			statusText:
				"[Astro-Turnstile] Missing secret key or token, please contact the site administrator",
		});
	}

	// Validate the token
	const formData = new FormData();

	// Add the secret key and token to the form data
	formData.append("secret", TURNSTILE_SECRET_KEY);
	formData.append("response", turnstileToken);

	// If there is a connecting IP, add it to the form data
	connectingIP && formData.append("remoteip", connectingIP);

	// Send the token to the Turnstile API for verification
	const result = await fetch(
		"https://challenges.cloudflare.com/turnstile/v0/siteverify",
		{
			body: formData,
			method: "POST",
		},
	);

	// Parse the outcome
	const outcome = await result.json();

	// Return the outcome
	if (outcome.success) {
		return new Response(null, {
			status: 200,
			statusText: "[Astro-Turnstile] Token verification successful",
		});
	}

	// Return an error message if the token is invalid
	return new Response(null, {
		status: 400,
		statusText: "[Astro-Turnstile] Unable to verify token",
	});
};

/**
 * The Astro-Turnstile API endpoint for all other requests.
 */
export const ALL: APIRoute = async () => {
	// Return a 405 error for all other requests than POST
	return new Response(
		JSON.stringify({ error: "Method not allowed" }, null, 2),
		{
			status: 405,
			statusText: "method not allowed",
			headers: {
				"content-type": "application/json",
			},
		},
	);
};
