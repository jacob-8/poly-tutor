<script lang="ts">
  import SentenceComponent from '$lib/components/Sentence.svelte'
  import type { Sentence, Settings, StudyWordsObject } from '$lib/types'

  export let label: string
  export let sentence: Sentence
  export let studySentence: (sentence: Sentence) => void
  export let settings: Settings
  export let study_words_object: StudyWordsObject
</script>

<div class="text-xs text-gray mb-2">
  {label}:
</div>
<div class="max-h-240px overflow-y-auto border-b pb-2 mb-2">
  <SentenceComponent {study_words_object} {sentence} {settings} onClick={() => studySentence(sentence)} />
</div>
