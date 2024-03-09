<script lang="ts">
  import { WordStatus, type UserVocabulary } from '$lib/types'
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

  const words_by_status_sorted_by_views = (vocab: UserVocabulary, status: WordStatus) => {
    return Object.entries(vocab)
      .filter(([_word, details]) => details.status === status)
      .sort((a, b) => b[1].views - a[1].views)
      .map(([word, {views, updated_at}]) => ({word, views, updated_at}))
  }

  const words_by_status_sorted_by_date = (vocab: UserVocabulary,status: WordStatus) => {
    return Object.entries(vocab)
      .filter(([_word, details]) => details.status === status)
      .sort((a, b) => new Date(b[1].updated_at).getTime() - new Date(a[1].updated_at).getTime())
      .map(([word, {views, updated_at}]) => ({word, views, updated_at}))
  }

  $: unknown_words_by_views = words_by_status_sorted_by_views($user_vocabulary, WordStatus.unknown)
  $: unknown_words_by_date = words_by_status_sorted_by_date($user_vocabulary, WordStatus.unknown)

  $: pronunciation_words = words_by_status_sorted_by_views($user_vocabulary, WordStatus.pronunciation)
  $: tone_words = words_by_status_sorted_by_views($user_vocabulary, WordStatus.tone)
  $: known_words = words_by_status_sorted_by_views($user_vocabulary, WordStatus.known)
  $: word_list_words = words_by_status_sorted_by_views($user_vocabulary, WordStatus.wordlist)

  $: recognized_words_count = known_words.length + pronunciation_words.length + tone_words.length
</script>

<!-- {#if $user?.email === 'jacob@polylingual.dev'}
  <button type="button" on:click={sync_vocab}>Migrate Vocab</button>
{/if} -->


<div class="p-2">
  <div>
    Recognized words: {recognized_words_count} {#if data.mother === 'en'}(including pronunciation and tone){/if}
  </div>
  <div>
    Known: {known_words.length},
    {#if data.mother === 'en'}
      Tone: {tone_words.length},
      Pronunciation: {pronunciation_words.length},
    {/if}
    Encountered, but not known: {unknown_words_by_views.length},
    Total: {Object.keys($user_vocabulary).length}
  </div>

  <div>
    Unknown words seens today: {Object.values($user_vocabulary).filter(({updated_at}) => updated_at === new Date().toDateString()).length}
  </div>

  <div class="flex space-x-8 mt-5 overflow-x-auto">
    <div class="shrink-0">
      Unknown by date
      <table>
        <tr class="text-left">
          <th>Views</th>
          <th>Word</th>
          <th>Last seen</th>
        </tr>
        {#each unknown_words_by_date.slice(0, 200) as word}
          <tr>
            <td class="text-right pr-2">{word.views}</td>
            <td>{word.word}</td>
            <td>{new Date(word.updated_at).toLocaleDateString(data.mother, {day: '2-digit', month: '2-digit', year:'2-digit'})}</td>
          </tr>
        {/each}
      </table>
    </div>
    <div class="shrink-0">
      Unknown by views
      <table>
        <tr class="text-left">
          <th>Views</th>
          <th>Word</th>
          <th>Last seen</th>
        </tr>
        {#each unknown_words_by_views.slice(0, 200) as word}
          <tr>
            <td class="text-right pr-2">{word.views}</td>
            <td>{word.word}</td>
            <td>{new Date(word.updated_at).toLocaleDateString(data.mother, {day: '2-digit', month: '2-digit', year:'2-digit'})}</td>
          </tr>
        {/each}
      </table>
    </div>
    <div class="shrink-0">
      <div>Known words by views</div>
      <table>
        <tr class="text-left">
          <th>Views</th>
          <th>Word</th>
        </tr>
        {#each known_words.slice(0, 200) as word}
          <tr>
            <td class="text-right pr-2">{word.views}</td>
            <td>{word.word}</td>
          </tr>
        {/each}
      </table>
      <hr>
    </div>
    <div class="shrink-0">
      <div>Word list words</div>
      {#each word_list_words.slice(0, 200) as word}
        <div>{word.word}</div>
      {/each}
    </div>
  </div>
</div>
