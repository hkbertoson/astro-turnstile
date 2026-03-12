# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Astro Turnstile is an Astro integration that adds Cloudflare Turnstile (CAPTCHA alternative) to Astro sites. This is a monorepo with two main packages:
- `package/` - The actual npm package (`astro-turnstile`)
- `playground/` - Testing environment for the integration

## Development Commands

### Installation
```bash
pnpm i --frozen-lockfile
```

### Development
```bash
pnpm playground:dev
```
Start the playground dev server to test changes to the package. Changes to `package/` files may require restarting the server.

### Linting
```bash
pnpm lint              # Check for issues
pnpm lint:fix          # Auto-fix issues
```
Uses Biome for linting and code formatting.

### Release
```bash
pnpm changeset         # Create a changeset
pnpm release           # Run the release script
pnpm ci:version        # Version packages (CI)
pnpm ci:publish        # Publish packages (CI)
```

## Architecture

### Integration Setup Flow (package/src/integration.ts)
The integration uses `astro-integration-kit` and hooks into Astro's lifecycle:

1. **astro:config:setup**:
   - Validates environment variables (TURNSTILE_SECRET_KEY, TURNSTILE_SITE_KEY)
   - Prevents demo keys from being used in production builds
   - Injects middleware for client-side script injection (package/src/middleware.ts)
   - Adds dev toolbar app (package/src/toolbar.ts) unless disabled
   - Injects the verification API endpoint (package/lib/server.ts)
   - Creates virtual imports for components and config

2. **astro:config:done**:
   - Injects TypeScript types for components and config

3. **astro:server:setup**:
   - Sets up dev toolbar server event listeners for testing

### Middleware (package/src/middleware.ts)
Streams HTML responses and injects the Turnstile client script into `</head>` when a Turnstile component is detected on the page (via `data-turnstile-container` attribute). Uses efficient streaming with a 16KB scan limit to avoid processing entire large pages.

### Server Endpoint (package/lib/server.ts)
Provides a POST endpoint (default: `/verify`) that:
- Accepts form data with `cf-turnstile-response` token
- Validates the token with Cloudflare's API
- Returns 200 on success, 400 on failure
- Returns 405 for non-POST requests

### Components
Located in `package/lib/components/`:
- **TurnstileWidget.astro**: Renders the Turnstile widget with extensive configuration options
- **TurnstileForm.astro**: Form wrapper that includes TurnstileWidget

Both components are exposed via:
- Virtual imports: `astro-turnstile:components/TurnstileWidget`
- Direct exports: `astro-turnstile/components/TurnstileWidget`

#### TurnstileWidget Configuration Options
Basic options:
- `theme`: Visual theme (`auto` | `light` | `dark`)
- `size`: Widget size (`normal` | `compact` | `flexible`)
- `margin`: CSS margin value

Advanced options:
- `execution`: Execution mode (`render` | `execute`) - controls when the widget renders
- `appearance`: Appearance mode (`always` | `execute` | `interaction-only`) - controls when the challenge is shown
- Callback function names (strings referencing global functions):
  - `callback`: Called when verification succeeds
  - `errorCallback`: Called when verification fails
  - `expiredCallback`: Called when token expires
  - `timeoutCallback`: Called when verification times out
  - `beforeInteractiveCallback`: Called before interactive challenge
  - `afterInteractiveCallback`: Called after interactive challenge
  - `unsupportedCallback`: Called when browser is unsupported

The inline script reads these props from data attributes and looks up callback function names in the global scope (window), then passes them to Cloudflare's `turnstile.render()` API.

### Configuration Schema (package/src/schema.ts)
Zod-based validation for integration options:
- `endpointPath`: API endpoint path (default: `/verify`)
- `disableClientScript`: Skip automatic script injection
- `disableDevToolbar`: Disable dev toolbar app
- `verbose`: Enable verbose logging

### Type Generation (package/src/stubs.ts)
Uses `@matthiesenxyz/astrodtsbuilder` to generate TypeScript definitions for:
- Virtual module imports
- Component types
- Configuration types

## Key Technical Details

### Environment Variables
- `TURNSTILE_SITE_KEY`: Public key for client-side rendering (accessible via `astro:env/client`)
- `TURNSTILE_SECRET_KEY`: Secret key for server-side verification (accessible via `astro:env/server`)

Both use Astro's `astro:env` with automatic validation. Demo keys are allowed in dev/preview but blocked in production builds.

### Virtual Modules
The integration creates virtual modules at build time:
- `virtual:astro-turnstile/config`: Runtime access to integration options
- `astro-turnstile:components/*`: Import aliases for components

### Dev Toolbar (package/src/toolbar.ts)
Custom Astro dev toolbar app that allows testing Turnstile configuration during development. Communicates with the server via the `sendverify`/`verifyresponse` event system.

## Package Structure

```
package/
├── src/           # Integration source code
│   ├── integration.ts   # Main integration logic
│   ├── middleware.ts    # Script injection middleware
│   ├── schema.ts        # Configuration validation
│   ├── toolbar.ts       # Dev toolbar app
│   ├── stubs.ts         # Type stub generation
│   └── strings.ts       # Error messages and constants
└── lib/           # Exported modules
    ├── server.ts       # Verification endpoint
    └── components/     # Astro components
        ├── TurnstileWidget.astro
        └── TurnstileForm.astro
```

## Important Notes

- The package requires Astro >=5.0.2
- Uses pnpm as the package manager (defined in `packageManager` field)
- Changes to `package/` during development require restarting the playground dev server
- The middleware uses streaming to efficiently inject scripts without loading entire HTML responses into memory