# astro-turnstile

## 1.1.1

### Patch Changes

- 2c91682: Updated readme

## 1.1.0

### Minor Changes

- a200211: [refactor components]: Simplify Logic and breakout widget into its own component.

  - Moved Widget to its own component that can be used with custom implementations.
  - Refactored Form component to add slots, and adjust the configuration of how logic is handled.
  - Updated API endpoint to give responses in the status text to use within the custom Form component.

## 1.0.1

### Patch Changes

- b08da43: Updated readme

## 1.0.0

### Major Changes

- a30c366: First Release

## 0.3.0

### Minor Changes

- 5dbd778: [Refactor]: Update integration logic and handling and create a reusable component

  - BREAKING: Minimum version of Astro is now `v4.14` due to the use of the new injectTypes helper functions.
  - NEW: Auto injection of Turnstile Client API script.
  - NEW: You can now change the endpoint path of your Astro-Turnstile install for Verifying Tokens.
  - NEW: Virtual component module for users with full types `astro-turnstile:components`.
  - NEW: Added new Astro DevToolbarApp.
  - NEW: Virtual modules `virtual:astro-turnstile/config` and `astro-turnstile:components` automatic `.d.ts` generation providing a fully typed ecosystem.
  - CHANGED: The options have changed, the `TURNSTILE_SECRET_KEY` and `TURNSTILE_SITE_KEY` are now environment variables only, and integration options change functionality:

  ```ts
  type AstroTurnstileOptions = {
    endpointPath: string;
    disableClientScript: boolean;
    disableDevToolbar: boolean;
    verbose: boolean;
  };
  ```

  - NEW: Reusable form component:

  ```tsx
  // src/pages/index.astro
  ---
  import { TurnstileForm } from "astro-turnstile:components";
  ---

  <Layout title="Welcome to Astro.">
  	<main>
  		<TurnstileForm action="/" method="POST">
  			<label>
  				Username:
  				<input type="text" name="username" required />
  			</label>
  		</TurnstileForm>
  		{/*
  			Note: You do not need to place a submit button in <TurnstileForm>
  			as there is already one present as part of the component.
  		*/}
  	</main>
  </Layout>
  ```

## 0.2.0

### Minor Changes

- 154366f: Playground and Integration Updates

## 0.1.1

### Patch Changes

- 23b88a0: Update Readme

## 0.1.0

### Minor Changes

- 75f9d29: Inital Release
