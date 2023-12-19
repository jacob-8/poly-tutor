import { setupWorker } from 'msw/browser'
import { http, HttpResponse, passthrough } from 'msw'

export const handlers = [
  http.post('/api/translate', async ({request}) => {
    const clonedRequest = request.clone()
    const { text } = await clonedRequest.json()
    if (!text.startsWith('This is a fake transcript'))
      return passthrough()

    const translatedText = text.split('\n').map(t => 'Mocked translation: ' + t).join('\n')
    return HttpResponse.json({ line_separated_translations: translatedText })
  }),
]

export const worker = setupWorker(...handlers)
