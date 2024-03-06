<script lang="ts">
  import type { LanguageCode } from '$lib/i18n/locales'
  import Head from './Head.svelte'
  import Html from './Html.svelte'
  import Body from './Body.svelte'

  export let dark: boolean
  export let language: LanguageCode
  export let preview: string
  export let title: string
</script>

<Html lang={language}>
  <Head {dark}>
    <title>{title}</title>
  </Head>
  <Body {preview}>
    <slot />
  </Body>
</Html>
