---
"astro-turnstile": minor
---

Refactored component imports for TurnstileWidget and TurnstileForm:
BREAKING: Direct package imports from 'astro-turnstile/components/TurnstileWidget' and 'astro-turnstile/components/TurnstileForm'.

  ```ts
    // Previously
    import {TurnstileForm} from 'astro-turnstile/components';
    import {TurnstileWidget} from 'astro-turnstile/components';

    // Virtual modules Before
    import {TurnstileForm} from 'astro-turnstile:components';
    import {TurnstileWidget} from 'astro-turnstile:components';

    // Now
    import TurnstileForm from 'astro-turnstile/components/TurnstileForm';
    import TurnstileWidget from 'astro-turnstile/components/TurnstileWidget';

    // Virtual modules now
    import TurnstileForm from 'astro-turnstile:components/TurnstileForm';
    import TurnstileWidget from 'astro-turnstile:components/TurnstileWidget';
  ```