# Testing

- Unit tests using Vitest are the cheapest and should be the most common. They can be done inline using `import.meta.vitest` or in a silbing `.test.ts` file.
- Anything visual is developed and tested in Kitbook. These components have visual regression screenshot tests.
- E2E tests are done using Playwright.
