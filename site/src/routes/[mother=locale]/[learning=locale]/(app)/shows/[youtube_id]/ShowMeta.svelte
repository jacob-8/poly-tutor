<script lang="ts">
  import SentenceComponent from '$lib/components/Sentence.svelte'
  import type { LanguageCode, LocaleCode } from '$lib/i18n/locales'
  import type { Sentence, Settings, StudyWordsObject, UserVocabulary } from '$lib/types'
  import { Modal, ShowHide } from 'svelte-pieces'

  export let mother: LocaleCode
  export let language: LanguageCode
  export let label: string
  export let sentences: Sentence[]
  export let studySentence: (sentence: Sentence) => void
  export let settings: Settings
  export let study_words_object: StudyWordsObject
  export let changed_words: UserVocabulary = {}
  export let split_sentences: (sentences: Sentence[]) => Sentence[] | Promise<Sentence[]>
</script>

{#if sentences.length}
  <ShowHide let:show let:toggle>
    <div class="px-2 sm:px-0 my-2 cursor-pointer" on:click={toggle}>
      <div class="text-sm line-clamp-2 overflow-hidden">
        {#if label}
          <span class="text-xs bg-gray-200 rounded px-1">
            {label}
          </span>
        {/if}
        {sentences.map(sentence => sentence.text).join(' ')}
      </div>
    </div>
    {#if show}
      <Modal on:close={toggle}>
        <span slot="heading">{label}</span>
        {#await split_sentences(sentences) then parsed_sentences}
          {#each parsed_sentences as sentence}
            <SentenceComponent {language} {changed_words} add_seen_sentence={() => null} {study_words_object} {sentence} {settings} onclick={() => studySentence(sentence)} mark_seen_based_on_visibility />
            {#if sentence.translation?.[mother]}
              <div class="text-xs border-b pb-2 mb-2">{sentence.translation[mother]}</div>
            {/if}
          {/each}
        {/await}
      </Modal>
    {/if}
  </ShowHide>
{/if}
