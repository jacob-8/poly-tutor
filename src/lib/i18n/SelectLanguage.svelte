<script lang="ts">
  import { Modal } from 'svelte-pieces'
  import { page } from '$app/stores'
  import { changeLocale } from './changeLocale'
</script>

<Modal on:close>
  <span slot="heading">
    What language are you learning?
  </span>

  {@const enTW = $page.data.mother === 'en' && $page.data.learning === 'zh-TW'}
  {@const enCN = $page.data.mother === 'en' && $page.data.learning === 'zh-CN'}
  {@const twEN = $page.data.mother === 'zh-TW' && $page.data.learning === 'en'}
  {@const cnEN = $page.data.mother === 'zh-CN' && $page.data.learning === 'en'}

  <div class="flex flex-col space-y-1 mt-4">
    <button class:active={enTW} disabled={enTW} type="button" on:click={() => changeLocale('en', 'zh-TW')}>Traditional Chinese</button>
    <button class:active={enCN} disabled={enCN} type="button" on:click={() => changeLocale('en', 'zh-CN')}>Simplified Chinese</button>
    <button class:active={twEN} disabled={twEN} type="button" on:click={() => changeLocale('zh-TW', 'en')}>使用繁體學習英文</button>
    <button class:active={cnEN} disabled={cnEN} type="button" on:click={() => changeLocale('zh-CN', 'en')}>使用简体学习英文</button>
  </div>
</Modal>

<style>
  button {
    --at-apply: px-2 py-1 bg-gray/20 rounded;
  }
  .active {
    --at-apply: font-bold;
  }
</style>
