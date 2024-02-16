# Svelte Conventions

Before moving further in wanting to help with this project, be sure you've read as least gone through the user-friendly Svelte tutorial and read the docs at least once. You don't have to understand everything, but you should at least have a big picture understanding of how Svelte works.

- [Learn Svelte and SvelteKit](https://learn.svelte.dev)
- [Svelte Docs](https://svelte.dev/)
- [SvelteKit Docs](https://kit.svelte.dev/)

# Component Design Principles

- Single Responsibility Principle - as much as possible, components should be responsible for one thing.
- Components don't import global stores, they only receive props and context. This means that all actions must be emitted as custom events. In the case of database actions let the parent page component consume the event and update the database. The component should built agnostic and just work, regardless of where in the web app it is placed.

## Tips
- Hold `Ctrl+Shift` and click on a component to jump to edit it in the code.
