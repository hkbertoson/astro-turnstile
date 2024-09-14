---
"astro-turnstile": minor
---

[refactor components]: Simplify Logic and breakout widget into its own component.

- Moved Widget to its own component that can be used with custom implementations.
- Refactored Form component to add slots, and adjust the configuration of how logic is handled.
- Updated API endpoint to give responses in the status text to use within the custom Form component.