---
"astro-turnstile": patch
---

[Fix/Docs]: 

- Update Type `AstroTurnstileOptions` to reflect the correct default values by switching from `z.infer` to a `typeof Schema._input` which properly shows the type as it would be used by the enduser

```ts
// Previously
type AstroTurnstileOptions = {
    endpointPath: string;
    disableClientScript: boolean;
    disableDevToolbar: boolean;
    verbose: boolean;
}

// Now
type AstroTurnstileOptions = {
    endpointPath?: string | undefined;
    disableClientScript?: boolean | undefined;
    disableDevToolbar?: boolean | undefined;
    verbose?: boolean | undefined;
} | undefined
```

- Update readme to include instructions and more information about what is available to users from the integration