import {
  defineConfig,
  presetIcons,
  // presetTypography,
  presetUno,
  presetWebFonts,
} from 'unocss'
// import { presetForms } from '@julr/unocss-preset-forms'

export default defineConfig({
  shortcuts: [
    [/^btn-(\w+)$/, ([_, color]) => `op50 px2.5 py1 transition-all duration-200 ease-out no-underline! hover:(op100 text-${color} bg-${color}/10) rounded`],
    // [/^btn-(\w+)$/, ([_, color]) => `op50 px2.5 py1 transition-all duration-200 ease-out no-underline! hover:(op100 text-${color} bg-${color}/10) border border-base! rounded`],
    // { 'styled-input': 'rounded-md border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50' },
  ],
  presets: [
    presetUno(),
    // presetForms(),
    presetIcons({
      prefix: 'i-',
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
      },
    }),
    // presetTypography(),
    presetWebFonts({
      fonts: {
        sans: 'Noto Sans:400,600,800',
        mono: 'DM Mono:400,600',
      },
    }),
  ],
  // safelist: [],
})
