- If you are using chat completions OpenAi or Google APIs you will need to create a `.env.local` file with the following variables:
  - `OPENAI_API_KEY=sk-...`
  - `GOOGLE_TRANSLATE_NLP_CREDENTIALS={"type":"service_account","project_id":"...","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...`

## Components

- personal notes
  - use milkdown to write notes (see if there's a way to provide helps by location overlay in a that doesn't interrupt the current dom)

- chat conversation
  - voice recorder
  - multi-language from Google Translate
  - character helps
  - dummy list of known words

<!-- later -->

- improve supabase server-side [Supabase Auth](https://supabase.com/docs/guides/auth/auth-helpers/sveltekit) 
- Save chats to Database: [SvelteKit data fetching](https://supabase.com/docs/guides/auth/auth-helpers/sveltekit#data-fetching)
- Supabase w/ offline-first support
  - https://github.com/orgs/supabase/discussions/357
  - RxDB
- Analytics
  - Partytown
  - [Rust Jieba](https://github.com/Hugo-Dz/svelte-rust)

https://web.dev/push-notifications-overview
https://jakearchibald.com/2014/offline-cookbook/#cache--network-race

## Resources

[Supabase Dashboard](https://supabase.com/dashboard/project/zfxvyodqwvigxarorgjx)
[Learn more about Supabase](https://github.com/vercel/nextjs-subscription-payments)
- https://sveltekit-ai-chatbot.vercel.app/