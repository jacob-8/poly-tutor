<script lang="ts">
  import { page } from '$app/stores'
  import SentenceComponent from '$lib/components/Sentence.svelte'
  import { WordStatus, type Sentence, type StudyWordsObject } from '$lib/types'
  import EditWordStatus from '$lib/components/EditWordStatus.svelte'

  export let sentence: Sentence
  export let study_words_object: StudyWordsObject
  export let change_word_status: (word: string, status: WordStatus) => void

  $: unique_words = sentence.words?.filter((word, index, array) =>
    array.findIndex(w => w.text === word.text) === index
  ) || []
  $: unknown_words = unique_words.filter(({ status }) => status === WordStatus.unknown)
  $: learning_to_read = unique_words.filter(({ status }) => status === WordStatus.pronunciation || status === WordStatus.tone)
  $: word_list_words = unique_words.filter(({ status }) => status === WordStatus.wordlist)
  $: known_words = unique_words.filter(({ status }) => status === WordStatus.known)
</script>

<SentenceComponent {study_words_object} {sentence} settings={{font_size_em: 1.5, show_definition: false, show_pronunciation: true}} />
{#if sentence.translation?.[$page.data.mother]}
  {sentence.translation[$page.data.mother]}
{/if}

{#if unknown_words.length}
  <hr>
  <div class="text-xs text-gray mb-2">
    Unknown:
  </div>
{/if}
{#each unknown_words as word}
  <EditWordStatus {change_word_status} high_view_count={study_words_object?.high_view_count[word.text]} common_in_this_context={study_words_object?.common_in_this_context[word.text]} {word} />
{/each}

{#if learning_to_read.length}
  <hr>
  <div class="text-xs text-gray mb-2">
    Learning to read:
  </div>
{/if}
{#each learning_to_read as word}
  <EditWordStatus {change_word_status} high_view_count={study_words_object?.high_view_count[word.text]} common_in_this_context={study_words_object?.common_in_this_context[word.text]} {word} />
{/each}

{#if word_list_words.length}
  <hr>
  <div class="text-xs text-gray mb-2">
    In word list:
  </div>
{/if}

{#each word_list_words as word}
  <EditWordStatus {change_word_status} high_view_count={study_words_object?.high_view_count[word.text]} common_in_this_context={study_words_object?.common_in_this_context[word.text]} {word} />
{/each}

<div class="opacity-20 hover:opacity-100">

  {#if known_words.length}
    <hr>
    <div class="text-xs text-gray mb-2">
      Known:
    </div>
  {/if}

  {#each known_words as word}
    <EditWordStatus {change_word_status} {word} />
  {/each}
</div>

<style>
  hr {
    --at-apply: border-t border-1 my-3 border-b-0 border-b;
  }
</style>
