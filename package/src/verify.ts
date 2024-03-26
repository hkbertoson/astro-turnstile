import type { APIRoute } from "astro";

import config from 'virtual:astro-turnstile/config';

console.log(config);


const verifyEndpoint = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export const GET: APIRoute = async () => {
    return new Response(JSON.stringify({config}))
}
