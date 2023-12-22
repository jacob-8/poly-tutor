import init, { cut } from 'jieba-wasm/pkg/web/jieba_rs_wasm.js'
import { expose } from 'comlink'

const wasm_ready = init('/jieba_rs_wasm_bg.wasm')

wasm_ready.then(() => {
  console.info('jieba-wasm loaded')
})

async function segment(text: string) {
  await wasm_ready
  return cut(text, true)
}

export const api = {
  segment,
}

expose(api)
