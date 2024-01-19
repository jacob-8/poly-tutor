import { type Remote, wrap } from 'comlink'

const worker = new Worker(new URL('./english-text-analysis.worker.ts', import.meta.url), { type: 'module' })

export const api: Remote<typeof import('./english-text-analysis.worker').api> = wrap(worker)
