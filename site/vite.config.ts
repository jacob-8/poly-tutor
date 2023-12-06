import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'
import { kitbook } from 'kitbook/plugins/vite'
import kitbookConfig from './kitbook.config'
import UnoCSS from '@unocss/svelte-scoped/vite'
import { transformerDirectives } from 'unocss'

// @ts-ignore
export default defineConfig(({command}) => {
  return {
    plugins: [
      kitbook(kitbookConfig),
      UnoCSS({
        injectReset: '@unocss/reset/tailwind.css',
        cssFileTransformers: [transformerDirectives()],
      }),
      sveltekit()
    ],
    define: {
      'process.env.VITE_COMMAND': JSON.stringify(command), // for service-worker
    },
  }
})

