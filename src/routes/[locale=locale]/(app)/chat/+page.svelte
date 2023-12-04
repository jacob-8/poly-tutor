<script lang="ts">
  import { Button } from 'svelte-pieces'
  import { fetchSSE } from '$lib/client/fetchSSE'
  import type { ChatCompletionRequestMessage } from 'openai-edge'
  import { languageTutor } from './personalities'
  import type { ChatRequestBody, OpenAiChatStreamResponse } from '$lib/types'
  import OpenAiUserKey from '$lib/OpenAiUserKey.svelte'

  export let data
  $: ({user} = data)

  const conversationPartnerPrompt = languageTutor
  let messages: ChatCompletionRequestMessage[] = data.savedMessages || []
  let asking = false
  let error = null
  let query = ''
  let answer = ''

  // let scrollToDiv: HTMLDivElement;
  // function scroll_to_bottom() {
  //   setTimeout(function () {
  //     scrollToDiv.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
  //   }, 100);
  // }

  function submit(openai_api_key: string) {
    if (!query || asking) return
    asking = true
    error = null

    messages = [...messages, { role: 'user', content: query }]
    const messagesToSend: ChatCompletionRequestMessage[] = [
      { role: 'system', content: conversationPartnerPrompt },
      ...messages,
    ]

    const eventSource = fetchSSE<ChatRequestBody>('/api/chat', { messages: messagesToSend, model: 'gpt-4-1106-preview', max_tokens: 1000, openai_api_key })
    eventSource.addEventListener('message', handle_message)
    eventSource.addEventListener('error', handleError)
    eventSource.stream()

    query = ''
  // scroll_to_bottom();
  }

  function handle_message({detail}: CustomEvent<string>) {
    if (detail === '[DONE]') {
      asking = false
      messages = [...messages, { role: 'assistant', content: answer }]
      answer = ''
      return
    }

    const { choices: [ { delta }] } = JSON.parse(detail) as OpenAiChatStreamResponse

    if (delta.content)
      answer += delta.content
  }

  function handleError(e: CustomEvent) {
    asking = false
    query = ''
    error = e.detail
    console.error(e.detail)
  }
</script>

{#if $user}
  <div class="border-b bg-blue-100">
    <div class="max-w-5xl mx-auto p-2">
      Prompt: {conversationPartnerPrompt}
    </div>
  </div>

  {#each messages as {content, role}}
    <div class="border-b" class:bg-gray-100={role === 'assistant'}>
      <div class="max-w-5xl mx-auto p-2">
        {content}
      </div>
    </div>
  {/each}

  {#if asking}
    <div class="border-b">
      <div class="max-w-5xl mx-auto p-2">
        {answer}
        <span class="blink-cursor" />
      </div>
    </div>
  {/if}

  <div class="flex p-3">
    <OpenAiUserKey let:openai_api_key>
      <form class="flex w-full ml-1" on:submit={() => submit(openai_api_key)}>
        <input type="text" required class="grow-1 border border-gray-300 p-2 rounded mr-1" bind:value={query} />
        <Button loading={asking} type="submit">Send</Button>
      </form>
    </OpenAiUserKey>
  </div>

  {#if error}
    <div class="text-red p-3">{error}</div>
  {/if}
{:else}
  <div class="p-3">
    Please login
  </div>
{/if}
