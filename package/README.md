# `Astro Turnstile`

**THIS PACKAGE IS CURRENTLY IN DEVELOPMENT AND IS NOT YET READY FOR USE**

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

You will need to add these 2 values to your `.env` file:

- `siteKey` (required): Your Turnstile site key
- `secretKey` (required): Your Turnstile secret key - this should be kept secret

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
