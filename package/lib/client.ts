// This file is responsible for loading the Cloudflare Turnstile script

// Set the script ID for reusability
const CFTurnstileScriptId = "turnstile-script";

// Set the script source
const CFTurnstileScriptSrc =
	"https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback";

// Check if the script has already been loaded
if (!(document.scripts.namedItem(CFTurnstileScriptId) !== null)) {
	// If the script has not been loaded, create a new script element
	const CFTurnStileScript = document.createElement("script");

	// Set the script source, async, defer, and ID attributes
	CFTurnStileScript.src = CFTurnstileScriptSrc;
	CFTurnStileScript.id = CFTurnstileScriptId;
	CFTurnStileScript.async = true;
	CFTurnStileScript.defer = true;

	// Append the script to the head of the document
	document.head.appendChild(CFTurnStileScript);
}
