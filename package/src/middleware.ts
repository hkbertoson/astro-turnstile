import type { MiddlewareHandler } from "astro";

const COMPONENT_IDENTIFIER = 'data-turnstile-container';
const TURNSTILE_SCRIPT = `
  <script 
    src="https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback" 
    async 
    defer 
    id="turnstile-script">
  </script>`;

const MAX_SCAN_BYTES = 16384; // 16KB
let bytesScanned = 0;

export const onRequest: MiddlewareHandler = async (_, next) => {
  const response = await next();
  
  const contentType = response.headers.get('Content-Type');
  if (!contentType?.includes('text/html') || !response.body) {
    return response;
  }

  const transformedBody = response.body
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(createFastScriptInjectionTransform())
    .pipeThrough(new TextEncoderStream());

  return new Response(transformedBody, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers
  });
};

function createFastScriptInjectionTransform(): TransformStream<string, string> {
  let hasInjected = false;
  let hasFoundComponent = false;
  let buffer = '';
  
  return new TransformStream({
    transform(chunk: string, controller) {
      // Fast path: already injected or scanned too much
      if (hasInjected || bytesScanned > MAX_SCAN_BYTES) {
        controller.enqueue(chunk);
        return;
      }

      bytesScanned += chunk.length;

      // Fast path: haven't found component yet
      if (!hasFoundComponent) {
        // Look for the data attribute
        if (chunk.includes(COMPONENT_IDENTIFIER)) {
          hasFoundComponent = true;
          buffer = chunk;
        } else {
          controller.enqueue(chunk);
          return;
        }
      } else {
        buffer += chunk;
      }

      const headCloseIndex = buffer.indexOf('</head>');
      if (headCloseIndex === -1) {
        if (buffer.length > MAX_SCAN_BYTES) {
          controller.enqueue(buffer);
          buffer = '';
          hasInjected = true;
        }
        return;
      }

      const injectedContent = 
        buffer.slice(0, headCloseIndex) + 
        TURNSTILE_SCRIPT + 
        buffer.slice(headCloseIndex);
      
      controller.enqueue(injectedContent);
      hasInjected = true;
      buffer = '';
    },

    flush(controller) {
      if (buffer) {
        controller.enqueue(buffer);
      }
      bytesScanned = 0;
    }
  });
}