<script lang="ts">
  import { Button, JSON } from 'svelte-pieces'
  import Sentence from '../Sentence.svelte'
  import type { LanguageCode, LocaleCode } from '$lib/i18n/locales'
  import type { ChatMessageWithTranslation, Settings } from '$lib/types'
  import { scrollIntoView } from '$lib/utils/scroll-into-view'
  import { speech } from '$lib/utils/speak'
  import RecordAudio from './RecordAudio.svelte'
  import { dev } from '$app/environment'

  export let learning: LocaleCode
  export let language: LanguageCode
  export let settings: Settings
  export let chat: ReturnType<typeof import('./create-chat-store').create_chat_store>
  export let transcribe_audio: (audio: File) => Promise<string>

  $: ({is_receiving, send_query, thread, error } = chat)

  let query = ''
  let interacted = false

  function submit() {
    interacted = true
    send_query(query)
    query = ''
    scroll_to_bottom()
  }

  let threadElement: HTMLDivElement
  function scroll_to_bottom() {
    setTimeout(() => {
      threadElement.scroll({ top: threadElement.scrollHeight, behavior: 'smooth' })
    }, 100)
  }

  $: last_message = $thread?.[$thread.length - 1]
  $: last_message_is_assistant = last_message?.role === 'assistant'
  $: if (interacted && last_message_is_assistant)
    start_speaking()

  let current_speaking_sentence_index = -1

  async function start_speaking() {
    current_speaking_sentence_index = 0
    while (last_message.sentences.length > current_speaking_sentence_index) {
      const sentence = last_message.sentences[current_speaking_sentence_index]
      const spoke = await speak_sentence(sentence)
      if (!spoke) break
      current_speaking_sentence_index++
    }

    // eslint-disable-next-line require-atomic-updates
    current_speaking_sentence_index = -1
  }

  async function speak_sentence(sentence: ChatMessageWithTranslation['sentences'][0]) {
    const { speak } = speech({ text: sentence.text, rate: .8, locale: learning, volume: 0.8})
    await speak()
    return true
  }

  async function transcribe_audio_and_add_to_query(audio: File) {
    const transcription = await transcribe_audio(audio)
    query += ' ' + transcription
    submit()
  }
</script>

{#if $thread?.length}
  <div bind:this={threadElement} class="overflow-y-auto grow-1 sm:border-t pt-2">
    {#each $thread as { role, sentences }, message_index}
      {@const last_message = message_index === $thread.length - 1}
      {#if role === 'system'}
        <div class="text-sm">
          Chat with Poly Tutor
        </div>
      {:else if role === 'user'}
        <div class="text-right py-3">
          {#each sentences as {text}}
            {text}
          {/each}
        </div>
      {:else if role === 'assistant'}
        {#each sentences as sentence, index}
          {@const active = last_message && current_speaking_sentence_index === index}
          <Sentence {language} {sentence} {settings} {active} />
          <div class="text-xs">
            {#if language === 'zh'}
              {#if sentence.translation?.en}
                {sentence.translation.en}
              {/if}
            {:else}
              {#if sentence.translation?.['zh-TW'] || sentence.translation?.['zh-CN']}
                {sentence.translation['zh-TW'] || sentence.translation['zh-CN']}
              {/if}
            {/if}
          </div>
        {/each}
      {/if}
    {/each}

    {#if $error}
      <div use:scrollIntoView={{active: true, options: {behavior: 'instant', block: 'end'}}} class="text-red p-2">{$error}</div>
    {/if}
  </div>

  <form class="flex w-full mt-2 space-x-1" on:submit|preventDefault={submit}>
    {#if $thread && dev}
      <JSON obj={$thread} />
    {/if}
    <input type="text" required class="grow-1 border border-gray-300 p-2 rounded" on:keydown|stopPropagation bind:value={query} />
    <RecordAudio let:start let:stop let:cancel let:listening handle_audio={transcribe_audio_and_add_to_query}>
      {#if listening}
        <Button
          onclick={stop}
          color="red">
          <span class="i-svg-spinners-3-dots-fade align--2px" />
        </Button>
        <Button
          onclick={cancel}
          color="black">
          <span class="i-fa-solid-times align--3px -mx-1" />
        </Button>
      {:else}
        <Button onclick={start} color="green">
          <span class="i-mdi-microphone text-xl -mb-1.5 -mx-1" />
        </Button>
        <Button loading={$is_receiving} type="submit"><span class="i-material-symbols-send text-2xl align--5px -mx-2" /></Button>
      {/if}
    </RecordAudio>
  </form>
{/if}
