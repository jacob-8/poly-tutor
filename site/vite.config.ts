import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'
import { kitbook } from 'kitbook/plugins/vite'
import kitbookConfig from './kitbook.config'
import UnoCSS from '@unocss/svelte-scoped/vite'
import { transformerDirectives } from 'unocss'
import { partytownVite } from '@builder.io/partytown/utils'
import { join } from 'path'

export default defineConfig(({command}) => {
  return {
    plugins: [
      kitbook(kitbookConfig),
      UnoCSS({
        injectReset: '@unocss/reset/tailwind.css',
        cssFileTransformers: [transformerDirectives()],
      }),
      sveltekit(),
      partytownVite({ dest: join(process.cwd(), '.svelte-kit/output/client/~partytown') }),
    ],
    define: {
      'process.env.VITE_COMMAND': JSON.stringify(command), // for service-worker
    },
  }
})

