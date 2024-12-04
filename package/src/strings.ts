export const loggerStrings = {
	setup: 'Turnstile integration setup...',
	configSiteMissing: `Astro Config Error: 'site' is not defined, it is recommended to define 'site' in your Astro config. (https://docs.astro.build/en/reference/configuration-reference/#site)\nFalling back to 'window.location.origin'.`,
	updateConfig: 'Updating Astro config with Turnstile environment variables...',
	injectScript: 'Injecting Turnstile client script...',
	injectRoute: (value: string) => `Injecting Turnstile route at ${value}...`,
	virtualImports: 'Adding Virtual Import modules...',
	setupComplete: 'Turnstile integration setup complete.',
	addDevToolbarApp: 'Adding Turnstile Dev Toolbar App for testing...',
	injectTypes: 'Injecting Turnstile types...',
};

export const ErrorMessages = {
	demoSecret:
		'Turnstile Secret Key is set to a demo value. Please replace it with a valid secret key.',
	demoSiteKey:
		'Turnstile Site Key is set to a demo value. Please replace it with a valid site key.',
};

type astroHooks = import('astro').HookParameters<'astro:config:setup'>;

export const envDefaults = {
	secretKey: (command: astroHooks['command']): string | undefined => {
		if (command === 'dev' || command === 'preview') {
			return '1x0000000000000000000000000000000AA';
		}
		return undefined;
	},
	siteKey: (command: astroHooks['command']): string | undefined => {
		if (command === 'dev' || command === 'preview') {
			return '1x00000000000000000000AA';
		}
		return undefined;
	},
};
// Define the SVG icons for the toolbar app
export const svgIcons = {
	turnstile: `<svg width="1em" height="1em" viewBox="0 0 54 54" data-icon="turnstile"><symbol id="ai:local:turnstile"><path fill="#e07800" d="M27.315 7.261a19.45 19.45 0 0 0-13.518 4.917l1.23-6.743-3.193-.582-2.162 11.836 11.84 2.16.582-3.193-6.08-1.11a16.173 16.173 0 1 1-4.982 8.064l-3.142-.824A19.478 19.478 0 1 0 27.315 7.261Z"></path><path fill="#e07800" fill-rule="evenodd" d="M38.847 21.919 35.928 19 24.477 30.452 19.923 25.9 17 28.822l7.483 7.484 2.923-2.923-.011-.012L38.847 21.92Z" clip-rule="evenodd"></path></symbol><use xlink:href="#ai:local:turnstile"></use></svg>`,
	close: `<svg xmlns="http://www.w3.org/2000/svg" width="2rem" height="2rem" viewBox="0 0 32 32"><path fill="#e07800" d="M16 2C8.2 2 2 8.2 2 16s6.2 14 14 14s14-6.2 14-14S23.8 2 16 2m5.4 21L16 17.6L10.6 23L9 21.4l5.4-5.4L9 10.6L10.6 9l5.4 5.4L21.4 9l1.6 1.6l-5.4 5.4l5.4 5.4z"/></svg>`,
};

// Define the raw HTML elements for the app window
export const windowHtmlElements = {
	button: `<button type="submit" style="margin-top: 1rem; padding: 0.5rem 1rem; border: none; background-color: #e07800; color: black; cursor: pointer; border-radius: 0.25rem; margin-bottom: 0;">Test Turnstile Integration</button>`,
	successBanner: `<div style="margin-top: 0; padding: 0.5rem 1rem; border: none; background-color: green; color: black; cursor: pointer; border-radius: 0.25rem; text-align: center; width: 520px; position: absolute; bottom: 0.5rem;">Token Verification Successful</div>`,
	errorBanner: `<div style="margin-top: 0; padding: 0.5rem 1rem; border: none; background-color: red; color: white; cursor: pointer; border-radius: 0.25rem;" text-align: center; width: 520px; position: absolute; bottom: 0.5rem;">"Unable to verify token"</div>`,
};
