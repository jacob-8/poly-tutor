<script lang="ts">
  import { page } from '$app/stores'
  import SentenceComponent from '$lib/components/Sentence.svelte'
  import { WordStatus, type Sentence } from '$lib/types'
  import EditWordStatus from '$lib/components/EditWordStatus.svelte'

  export let sentence: Sentence

  $: unique_words = sentence.words?.filter((word, index, array) =>
    array.findIndex(w => w.text === word.text) === index
  ) || []
  $: unknown_words = unique_words.filter(({ status }) => status < WordStatus.known)
  $: word_list_words = unique_words.filter(({ status }) => status === WordStatus.wordlist)
  $: known_words = unique_words.filter(({ status }) => status === WordStatus.known)
</script>

<SentenceComponent {sentence} settings={{font_size_em: 1.5, show_definition: false, show_pronunciation: false}} />
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
  <EditWordStatus {word} />
{/each}

{#if word_list_words.length}
  <hr>
  <div class="text-xs text-gray mb-2">
    In word list:
  </div>
{/if}

{#each word_list_words as word}
  <EditWordStatus {word} />
{/each}

{#if known_words.length}
  <hr>
  <div class="text-xs text-gray mb-2">
    Known:
  </div>
{/if}

{#each known_words as word}
  <EditWordStatus {word} />
{/each}

<style>
  hr {
    --at-apply: border-t border-1 my-3 border-b-0 border-b;
  }
</style>
