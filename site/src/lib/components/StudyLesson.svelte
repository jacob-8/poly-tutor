<script lang="ts">
  import { page } from '$app/stores'
  import type { StudyWords, UserVocabulary, WordStatus } from '$lib/types'
  import EditWordStatus from './EditWordStatus.svelte'

  export let study_words: StudyWords
  export let change_word_status: (word: string, status: WordStatus) => void
  export let changed_words: UserVocabulary = {}
</script>

{#if study_words?.high_view_count.length}
  <div class="text-xs text-gray mb-2">
    {$page.data.t.shows.most_viewed_unknown_words}:
  </div>
  {#each study_words.high_view_count as word}
    <EditWordStatus {changed_words} {change_word_status} high_view_count {word} />
  {/each}
  <hr>
{/if}

{#if study_words?.common_in_this_context.length}
  <div class="text-xs text-gray mb-2">
    {$page.data.t.shows.common_in_this_context}:
  </div>
  {#each study_words.common_in_this_context as word}
    <EditWordStatus {changed_words} {change_word_status} common_in_this_context {word} />
  {/each}
  <hr>
{/if}

{#if study_words?.improve_pronunciation_or_tone?.length}
  <div class="text-xs text-gray mb-2">
    Improve pronunciation or tone:
  </div>

  {#each study_words.improve_pronunciation_or_tone || [] as word}
    <EditWordStatus {changed_words} {change_word_status} improve_pronunciation_or_tone {word} />
  {/each}
{/if}
