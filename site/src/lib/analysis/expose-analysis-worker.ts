import { type Remote, wrap } from 'comlink'

const worker = new Worker(new URL('./chinese-text-analysis.worker.ts', import.meta.url), { type: 'module' })

export const api: Remote<typeof import('./chinese-text-analysis.worker').api> = wrap(worker)
