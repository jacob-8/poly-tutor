<script lang="ts">
  import { WordStatus } from '$lib/types'
  // import type { SyncVocabRequestBody, SyncVocabResponseBody } from '$api/sync-vocab/+server'
  // import { post_request } from '$lib/utils/post-request'
  import type { PageData } from './$types'

  export let data: PageData
  $: ({user_vocabulary} = data)

  // async function sync_vocab() {
  //   const url = prompt('Enter url')
  //   if (!url) return
  //   const { data, error } = await post_request<SyncVocabRequestBody, SyncVocabResponseBody>('/api/sync-vocab', { url })
  //   console.info({data, error})
  // }

  $: unknown_words = Object.entries($user_vocabulary)
    .filter(([_word, {status}]) => status === WordStatus.unknown)
    .sort((a, b) => b[1].views - a[1].views)
    .map(([word, {views}]) => ({word, views}))

  $: pronunciation_words = Object.entries($user_vocabulary)
    .filter(([_word, {status}]) => status === WordStatus.pronunciation)
    .sort((a, b) => b[1].views - a[1].views)
    .map(([word, {views}]) => ({word, views}))

  $: tone_words = Object.entries($user_vocabulary)
    .filter(([_word, {status}]) => status === WordStatus.tone)
    .sort((a, b) => b[1].views - a[1].views)
    .map(([word, {views}]) => ({word, views}))

  $: known_words = Object.entries($user_vocabulary)
    .filter(([_word, {status}]) => status === WordStatus.known)
    .sort((a, b) => b[1].views - a[1].views)
    .map(([word, {views}]) => ({word, views}))
</script>

<!-- {#if $user?.email === 'jacob@polylingual.dev'}
  <button type="button" on:click={sync_vocab}>Migrate Vocab</button>
{/if} -->

<div class="p-2">
  <div>
    {#if data.mother === 'en'}
      Pronunciation: {pronunciation_words.length},
      Tone: {tone_words.length},
    {/if}
    Known: {known_words.length},
    Total: {Object.keys($user_vocabulary).length}
  </div>

  <div class="flex">
    <div class="w-1/2">
      {#each known_words.slice(0, 100) as word}
        <div>{word.word} - {word.views}</div>
      {/each}
    </div>
    <div class="w-1/2">
      Unknown: {unknown_words.length}
      {#each unknown_words.slice(0, 100) as word}
        <div>{word.word} - {word.views}</div>
      {/each}
    </div>
  </div>



  <!-- <pre>{JSON.stringify($user_vocabulary, null, 2)}</pre> -->

</div>
