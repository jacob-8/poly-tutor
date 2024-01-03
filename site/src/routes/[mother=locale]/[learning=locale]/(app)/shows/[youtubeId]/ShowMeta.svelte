<script lang="ts">
  import SentenceComponent from '$lib/Sentence.svelte'
  import type { Sentence } from '$lib/types'

  export let label: string
  export let sentence: Sentence
  export let studySentence: (sentence: Sentence) => void
</script>

<div class="text-xs text-gray mb-2">
  {label}:
</div>
<div class="max-h-240px overflow-y-auto border-b pb-2 mb-2">
  <SentenceComponent {sentence} onMouseover={() => studySentence(sentence)} />
</div>
