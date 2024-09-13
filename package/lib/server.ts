import { TURNSTILE_SECRET_KEY } from "astro:env/server";
import type { APIRoute } from "astro";

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
		console.log("Missing secret key or token");
		return new Response("Missing secret key or token", {
			status: 400,
			statusText: "bad request",
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
		return new Response("Token verification successful", {
			status: 200,
			statusText: "ok",
		});
	}

	// Return an error message if the token is invalid
	return new Response("Unable to verify token", {
		status: 400,
		statusText: "bad request",
	});
};

/**
 * The Astro-Turnstile API endpoint for all other requests.
 */
export const ALL: APIRoute = async () => {
	// Return a 405 error for all other requests than POST
	return new Response("Method not allowed", {
		status: 405,
		statusText: "method not allowed",
	});
};
