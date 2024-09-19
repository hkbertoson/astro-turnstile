# `Astro Turnstile`

This is an [Astro integration](https://docs.astro.build/en/guides/integrations-guide/) that allows you to add a turnstile to your Astro site.

## Usage

### Prerequisites

Before you can use this integration, you need to have a Cloudflare account. You can sign up for a free account [here](https://www.cloudflare.com/products/turnstile/).

### Getting Started

First, you need to create a new site in your Cloudflare account. You can do this by following the instructions [here](https://developers.cloudflare.com/turnstile/getting-started/create-site).

Once you have created a site, you will be given a site key and a secret key. You will need this key to configure the integration.

### Installation

Install the integration **automatically** using the Astro CLI:

```bash
pnpm astro add astro-turnstile
```

```bash
npx astro add astro-turnstile
```

```bash
yarn astro add astro-turnstile
```

```bun
bunx astro add astro-turnstile
```

Or install it **manually**:

1. Install the required dependencies

```bash
pnpm add astro-turnstile
```

```bash
npm install astro-turnstile
```

```bash
yarn add astro-turnstile
```

```bun
bun add astro-turnstile
```

2. Add the integration to your astro config

```diff
+import astroTurnstile from "astro-turnstile";

export default defineConfig({
  integrations: [
+    astroTurnstile(),
  ],
});
```

### Configuration

#### `.env` File

You will need to add these 2 values to your `.env` file:

- `TURNSTILE_SITE_KEY` (required): Your Turnstile site key
- `TURNSTILE_SECRET_KEY` (required): Your Turnstile secret key - this should be kept secret

#### Astro Config Options

**`verbose`**
- Type: `boolean`
- Default: `false`

Enable verbose logging.

**`disableClientScript`**
- Type: `boolean`
- Default: `false`

Disable the client-side script injection.

By default, the client-side script is injected into the Astro project on every page. In some cases, you may want to disable this behavior, and manually inject the script where needed. This option allows you to disable the client-side script injection.

Note: If you disable the client-side script injection, you will need to manually inject the Turnstile client-side script into your Astro project.

**`disableDevToolbar`**
- Type: `boolean`
- Default: `false`

Disable the Astro Turnstile Dev Toolbar App.

**`endpointPath`**
- Type: `string`
- Default: `/verify`

The path to the injected Turnstile API endpoint.

### Usage

The following components are made available to the end user:

- **`TurnstileWidget`** - The main widget component for displaying the Turnstile captcha field in forms
  - Available Props:
    - **`theme`**: 
      - Type: `"auto"` | `"light"` | `"dark"` | `undefined`
      - Default: `"auto"`
    - **`size`**: 
      - Type: `"normal"` | `"compact"` | `"flexible"` | `undefined`
      - Default: `"normal"`
    - **`margin`**: 
      - Type: `string` | `undefined`
      - Default: `"0.5rem"`

- `TurnstileForm` - A helper form element that assists you in building your forms with Turnstile verification built in
  - Available Props:
    - (All the props from Widget)
    - **`enctype`**
      - Type: `"multipart/form-data"` | `"application/x-www-form-urlencoded"` | `"submit"` | `undefined`
      - Default: `"application/x-www-form-urlencoded"`
    - **`action`**
      - Type: `string` | `null` | `undefined`
    - **`method`**
      - Type: `string` | `null` | `undefined`

These components can be accessed by either of the following methods:

```ts
// Option 1: Runtime virtual module
import { TurnstileWidget, TurnstileForm } from 'astro-turnstile:components';

// Option 2: Direct package exports
import { TurnstileWidget, TurnstileForm } from 'astro-turnstile/components';

```

## Contributing

This package is structured as a monorepo:

- `playground` contains code for testing the package
- `package` contains the actual package

Install dependencies using pnpm: 

```bash
pnpm i --frozen-lockfile
```

Start the playground:

```bash
pnpm playground:dev
```

You can now edit files in `package`. Please note that making changes to those files may require restarting the playground dev server.

## Licensing

[MIT Licensed](https://github.com/hkbertoson/astro-turnstile/blob/main/LICENSE). Made with ❤️ by [Hunter Bertoson](https://github.com/hkbertoson).

## Acknowledgements

[Astro](https://astro.build/)
[Turnstile](https://www.cloudflare.com/products/turnstile/)
[Florian Lefebvre](https://github.com/florian-lefebvre)
