<script lang="ts">
  import { Button, JSON } from 'svelte-pieces'
  import Sentence from '../Sentence.svelte'
  import type { LanguageCode } from '$lib/i18n/locales'
  import type { ChatMessageWithTranslation, Settings } from '$lib/types'
  import { scrollIntoView } from '$lib/utils/scroll-into-view'
  import { speech } from '$lib/utils/speak'

  export let language: LanguageCode
  export let settings: Settings
  export let chat: ReturnType<typeof import('./create-chat-store').create_chat_store>

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
    const { speak } = speech({ text: sentence.text, rate: .8, locale: 'zh-TW', volume: 0.8})
    await speak()
    // const { speak: speakTranslation } = speech({ text: sentence.translation[mother], rate: 1.2, locale: mother, volume: 0.7})
    // await speakTranslation()
    return true
  }
</script>

<div bind:this={threadElement} class="overflow-y-auto grow-1 sm:border-t">
  {#each $thread as { role, sentences }, message_index}
    {@const last_message = message_index === $thread.length - 1}
    {#if role === 'system'}
      <div class="text-xs">
        {#each sentences as {text}}
          {text}
        {/each}
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
        {#if sentence.translation?.en}
          <div class="text-xs">{sentence.translation?.en}</div>
        {/if}
      {/each}
    {/if}
  {/each}

  {#if $error}
    <div use:scrollIntoView={{active: true, options: {behavior: 'instant', block: 'end'}}} class="text-red p-2">{$error}</div>
  {/if}
</div>

<form class="flex w-full mt-2" on:submit|preventDefault={submit}>
  {#if $thread}
    <JSON obj={$thread} />
  {/if}
  <input type="text" required class="grow-1 border border-gray-300 p-2 rounded mr-1" on:keydown|stopPropagation bind:value={query} />
  <Button loading={$is_receiving} type="submit">Send</Button>
</form>
