<script lang="ts">
  import { Button, Modal } from 'svelte-pieces'

  export let close: () => void
  export let key: string
  export let set_key: (key: string) => void
</script>

<Modal on:close={close}>
  <a slot="heading"
    href="https://platform.openai.com/account/api-keys"
    class="underline"
    target="_blank">OpenAI Api Key</a
  >

  {#if key}
    <div class="flex flex-col sm:flex-row gap-1">
      <span class="text-green-700 bg-gray-100 p-2 rounded font-mono">sk-...{key.slice(-4)}</span>
      <Button
        class="text-left!"
        color="red"
        form="simple"
        onclick={() => set_key(null)}
        title="delete"><span class="i-carbon-trash-can vertical--1px mr-1" /> Delete</Button
      >
    </div>

  {:else}
    <div>
      <p class="mb-2">
        For features requiring a language model, you must provide your OpenAI Api key. Go to
        <a
          href="https://platform.openai.com/account/api-keys"
          class="underline"
          target="_blank">Api Keys</a
        >. Log in (or sign up) and click on "Create new secret key". Then paste it here:
      </p>
      <input
        type="text"
        class="p-2 border border-gray block w-full rounded mb-2"
        placeholder="sk-..."
        on:input={(e) => {
          // @ts-expect-error
          const {value} = e.target
          if (value.startsWith('sk-') && value.length > 20) // currently 51 characters long
            set_key(value)
        }}
      />
      <div class="mt-2 text-red">
        Note their warning: "Do not share your API key with others, or expose it
        in the browser or other client-side code." That's because whoever has this
        key can rack up usage charges on your account. Only use this key if you
        trust this site. Also make sure you don't have any untrusted browser
        extensions running that have access to this page because they would be
        able to view your key. If you're unsure about your key safety you can always set
        extremely low spend limits at <a
          href="https://platform.openai.com/account/billing/limits"
          class="underline"
          target="_blank">Usage limits</a
        >, like a soft $5 and a hard $10.
      </div>
    </div>
  {/if}
</Modal>


