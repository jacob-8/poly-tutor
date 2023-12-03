<script lang="ts">
  import { Button, Modal, ShowHide, createPersistedStore } from 'svelte-pieces'

  const open_ai_api_key = createPersistedStore<string>(
    'open_ai_api_key',
    '',
    true,
  )
</script>

{#if $open_ai_api_key}
  <ShowHide let:show let:toggle>
    <Button onclick={toggle}>
      <span class="i-simple-icons-openai" />
    </Button>
    {#if show}
      <Modal on:close={toggle}>
        <a
          href="https://platform.openai.com/account/api-keys"
          class="underline"
          target="_blank">OpenAI Api</a
        >
        Key:
        <pre
          class="inline text-green-700 bg-gray-100 p-1"
          on:click={() =>
            navigator.clipboard.writeText(
              $open_ai_api_key,
            )}>sk-...{$open_ai_api_key.slice(-4)}</pre>
        <Button
          size="sm"
          color="red"
          form="simple"
          onclick={() => ($open_ai_api_key = '')}
          title="delete">Delete <span class="i-carbon-trash-can mb-1" /></Button
        >
      </Modal>
    {/if}
  </ShowHide>
  <slot open_ai_api_key={$open_ai_api_key} />
{:else}
  <div>
    <p class="mb-2">
      To transcribe using OpenAI's Whisper AI service, you need to have your own
      API key from them. First, sign up at
      <a
        href="https://platform.openai.com/signup"
        class="underline"
        target="_blank">https://platform.openai.com/signup</a
      >. This will give you a developer account with $5 to try things out for
      three months. After which you'll need to add a credit card to continue
      with them. For every $1 USD you get 167 minutes of transcription. Once you
      are logged in go to
      <a
        href="https://platform.openai.com/account/api-keys"
        class="underline"
        target="_blank">Api Keys</a
      > and click on "Create new secret key". Copy the key and then paste it here:
    </p>
    <input
      type="text"
      class="p-1 border text-sm rounded mb-2"
      placeholder="sk-..."
      on:input={(e) => {
        // @ts-expect-error
        const {value} = e.target
        if (value.startsWith('sk-') && value.length > 20)
          $open_ai_api_key = value
      }}
    />
    <div class="mt-2 text-red">
      Note their warning: "Do not share your API key with others, or expose it
      in the browser or other client-side code." That's because whoever has this
      key can rack up usage charges on your account. Only use this key where you
      trust the site. Also make sure you don't have any untrusted browser
      extensions running that have access to this page because they would be
      able to view your key. It's not too big of a worry while you are using
      free credit, but if you do end up adding your credit card to OpenAI after
      3 months, and you're unsure about your key safety you can always set
      extremely low spend limits at <a
        href="https://platform.openai.com/account/billing/limits"
        class="underline"
        target="_blank">Usage limits</a
      >, like a soft $5 and a hard $10.
    </div>
  </div>
{/if}
