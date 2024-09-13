import {
	createResolver,
	addVirtualImports,
	defineIntegration,
} from 'astro-integration-kit';
import {AstroTurnstileOptionsSchema as optionsSchema} from './schema.ts';
import {name} from '../package.json';
import {envField} from 'astro/config';
import Dts from './stubs.ts';
import {envDefaults, ErrorMessages, loggerStrings} from './strings.ts';
import {loadEnv} from 'vite';
import {AstroError} from 'astro/errors';

// Load the Turnstile environment variables for the Server runtime and Verification
// that the environment variables are NOT set to Turnstile demo values during build.
const env = loadEnv('TURNSTILE_', process.cwd());

export const astroTurnstile = defineIntegration({
	name,
	optionsSchema,
	setup({
		name,
		options,
		options: {endpointPath, verbose, disableClientScript, disableDevToolbar},
	}) {
		const {resolve} = createResolver(import.meta.url);
		return {
			hooks: {
				'astro:config:setup': (params) => {
					// Destructure the params object
					const {
						logger,
						updateConfig,
						injectScript,
						injectRoute,
						command,
						config,
						addDevToolbarApp,
					} = params;

					// Log startup message
					verbose && logger.info(loggerStrings.setup);

					// Update the User's Astro config ('astro:env') with the required Turnstile
					// environment variables and Set the 'checkOrigin' security option to true
					verbose && logger.info(loggerStrings.updateConfig);
					updateConfig({
						security: {
							checkOrigin: true,
						},
						experimental: {
							env: {
								validateSecrets: true,
								schema: {
									TURNSTILE_SECRET_KEY: envField.string({
										access: 'secret',
										context: 'server',
										optional: false,
										// The default value is only usable in 'dev'/'preview' and should be replaced with the actual secret key.
										// See https://developers.cloudflare.com/turnstile/troubleshooting/testing/#dummy-sitekeys-and-secret-keys for more information.
										default: envDefaults.secretKey(command),
									}),
									TURNSTILE_SITE_KEY: envField.string({
										access: 'public',
										context: 'client',
										optional: false,
										// The default value is only usable in 'dev'/'preview' and should be replaced with the actual secret key.
										// See https://developers.cloudflare.com/turnstile/troubleshooting/testing/#dummy-sitekeys-and-secret-keys for more information.
										default: envDefaults.siteKey(command),
									}),
								},
							},
						},
					});

					// Helper function to check if the environment variables are set to Turnstile demo values
					function checkKeys(o: {
						key: string;
						knownKeys: string[];
						error: string;
					}) {
						if (o.knownKeys.includes(o.key)) {
							throw new AstroError(o.error);
						}
					}

					// If environment variables are set to Turnstile demo values during build, error
					if (command === 'build') {
						// Check TURNSTILE_SECRET_KEY
						if (env.TURNSTILE_SECRET_KEY) {
							checkKeys({
								key: env.TURNSTILE_SECRET_KEY,
								knownKeys: [
									'1x0000000000000000000000000000000AA',
									'2x0000000000000000000000000000000AA',
									'3x0000000000000000000000000000000AA',
								],
								error: ErrorMessages.demoSecret,
							});
						}

						// Check TURNSTILE_SITE_KEY
						if (env.TURNSTILE_SITE_KEY) {
							checkKeys({
								key: env.TURNSTILE_SITE_KEY,
								knownKeys: [
									'1x00000000000000000000AA',
									'1x00000000000000000000BB',
									'2x00000000000000000000AB',
									'2x00000000000000000000BB',
									'3x00000000000000000000FF',
								],
								error: ErrorMessages.demoSiteKey,
							});
						}
					}

					// Check if the Astro config has a 'site' property
					if (!config.site) {
						logger.warn(loggerStrings.configSiteMissing);
					}

					// Inject the required Turnstile client-side script if not disabled
					if (!disableClientScript) {
						verbose && logger.info(loggerStrings.injectScript);
						injectScript('page', `import '${name}/client'`);
					}

					// Add Development Toolbar App for Astro Turnstile testing
					if (!disableDevToolbar) {
						verbose && logger.info(loggerStrings.addDevToolbarApp);
						addDevToolbarApp(resolve('toolbar.ts'));
					}

					// Inject the required Turnstile server-side route
					verbose && logger.info(loggerStrings.injectRoute(endpointPath));
					injectRoute({
						pattern: endpointPath,
						entrypoint: `${name}/server`,
						prerender: false,
					});

					// Add Virtual Imports for resolving the Astro Turnstile Options during runtime
					verbose && logger.info(loggerStrings.virtualImports);
					addVirtualImports(params, {
						name,
						imports: {
							'virtual:astro-turnstile/config': `export default ${JSON.stringify(
								options
							)}`,
							'astro-turnstile:components': `export * from '${name}/components';`,
						},
					});

					// Log completion message
					verbose && logger.info(loggerStrings.setupComplete);
				},
				'astro:config:done': ({injectTypes, logger}) => {
					// Inject the required Turnstile types for the Astro config and components
					verbose && logger.info(loggerStrings.injectTypes);
					injectTypes(Dts.config);
					injectTypes(Dts.components);
				},
				'astro:server:setup': async ({toolbar, logger}) => {
					// Add a Server Event Listener for the 'sendverify' event from the Astro Dev Toolbar app
					if (!disableDevToolbar) {
						verbose &&
							logger.info('Adding Server Event Listener Dev Toolbar App...');
						toolbar.on('sendverify', async (data: {key: string}) => {
							const formData = new FormData();

							// Get the Turnstile site token from the environment variables
							// or use a dummy token for testing
							const siteToken =
								env.TURNSTILE_SITE_KEY || '1x00000000000000000000AA';

							// Add the secret key and token to the form data
							formData.append('secret', data.key);
							formData.append('response', siteToken);

							// Send the token to the Turnstile API for verification
							try {
								const response = await fetch(
									'https://challenges.cloudflare.com/turnstile/v0/siteverify',
									{
										method: 'POST',
										body: formData,
										headers: {
											'content-type': 'application/x-www-form-urlencoded',
										},
									}
								);

								// Send the verification response back to the Astro Dev Toolbar app
								toolbar.send('verifyresponse', {
									success: response.ok,
								});
							} catch (error) {
								// Send the verification response back to the Astro Dev Toolbar app
								toolbar.send('verifyresponse', {success: false});
							}
						});
					}
				},
			},
		};
	},
});

export default astroTurnstile;
