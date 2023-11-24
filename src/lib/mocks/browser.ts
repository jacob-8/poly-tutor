import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'
import { browser, dev } from '$app/environment'

const isBrowserAndDev = browser && dev
export const worker = isBrowserAndDev ? setupWorker(...handlers) : null
