<script lang="ts">
  import { page } from '$app/stores'
  import type { LocaleCode } from '$lib/i18n/locales'
  import type { Translation } from '$lib/types'
  import { Modal, ShowHide } from 'svelte-pieces'

  export let mother: LocaleCode
  export let summary: Translation

  let summary_text: string
  $: if (summary) {
    if (summary[mother])
      summary_text = summary[mother]
    else if (mother === 'zh-CN' && summary['zh-TW'])
      summary_text = summary['zh-TW']
    else if (mother === 'zh-TW' && summary['zh-CN'])
      summary_text = summary['zh-CN']
  }
</script>

{#if summary?.[mother]}
  <ShowHide let:show let:toggle>
    <div class="px-2 sm:px-0 my-2 cursor-pointer" on:click={toggle}>
      <div class="text-sm line-clamp-2 overflow-hidden">
        <span class="text-xs bg-gray-200 rounded px-1">
          {$page.data.t.shows.chapter_summary}
        </span>
        {summary_text}
      </div>
    </div>
    {#if show}
      <Modal on:close={toggle}>
        <span slot="heading">{$page.data.t.shows.chapter_summary}</span>
        {summary_text}
      </Modal>
    {/if}
  </ShowHide>
{:else}
  <slot />
{/if}
