export const loggerStrings = {
	setup: "Turnstile integration setup...",
	configSiteMissing: `Astro Config Error: 'site' is not defined, it is recommended to define 'site' in your Astro config. (https://docs.astro.build/en/reference/configuration-reference/#site)\nFalling back to 'window.location.origin'.`,
	updateConfig: "Updating Astro config with Turnstile environment variables...",
	injectScript: "Injecting Turnstile client script...",
	injectRoute: (value: string) => `Injecting Turnstile route at ${value}...`,
	virtualImports: "Adding Virtual Import modules...",
	setupComplete: "Turnstile integration setup complete.",
	addDevToolbarApp: "Adding Turnstile Dev Toolbar App for testing...",
	injectTypes: "Injecting Turnstile types...",
};

export const ErrorMessages = {
	demoSecret:
		"Turnstile Secret Key is set to a demo value. Please replace it with a valid secret key.",
	demoSiteKey:
		"Turnstile Site Key is set to a demo value. Please replace it with a valid site key.",
};

type astroHooks = import("astro").HookParameters<"astro:config:setup">;

export const envDefaults = {
	secretKey: (command: astroHooks["command"]): string | undefined => {
		if (command === "dev" || command === "preview") {
			return "1x0000000000000000000000000000000AA";
		}
		return undefined;
	},
	siteKey: (command: astroHooks["command"]): string | undefined => {
		if (command === "dev" || command === "preview") {
			return "1x00000000000000000000AA";
		}
		return undefined;
	},
};
