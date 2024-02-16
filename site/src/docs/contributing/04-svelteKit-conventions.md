# SvelteKit Conventions

- All data and database actions are passed into `+page.svelte` components and children components via the data prop and subsequent props. No database imports are allowed in components themselves. 
- Nothing except i18n comes via the `$page` store
- We don't use universal stores imported from files, we use them coming from the `+page.svelte` data prop. I'm not opposed to using `setContext` and `getContext` if one is wary of prop-drilling in extreme situations but I usually find myself that I don't like the loosey-goosey nature of the context route. Though it has its place.
