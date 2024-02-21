import { ResponseCodes } from '$lib/response-codes'
import { createChunkDecoder } from './chunkDecoder'

interface FetchSSE {
  stream: () => Promise<void>;
  addEventListener: (eventType: string, callback: (event: CustomEvent) => void) => void;
  removeEventListener: (eventType: string, callback: (event: CustomEvent) => void) => void;
}

export function fetchSSE<T extends Record<string, any>>(url: string, data: T): FetchSSE {
  const listeners: Record<string, ((event: CustomEvent) => void)[]> = {}

  async function stream() {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.status !== ResponseCodes.OK) {
        const { message } = await response.json()
        dispatchEvent({ type: 'error', data: message })
        return
      }

      const reader = response.body.getReader()
      const decoder = createChunkDecoder()
      let result = ''

      reader.read().then(function processResult({ done, value }) {
        if (done) return

        result += decoder(value)

        const messages = result.split('\n\n')
        result = messages.pop() // pops off the last message which may only be partially received and saves it for the next read

        messages.forEach(message => {
          const event = { type: 'message', data: '' }

          message.split('\n').forEach(line => {
            const [field, ...values] = line.split(':')
            const value = values.join(':').trim()
            if (field === 'data') event.data = value
          })

          dispatchEvent(event)
        })

        reader.read().then(processResult)
      })
    } catch (error) {
      dispatchEvent({ type: 'error', data: error.message })
    }
  }

  function addEventListener(eventType: string, callback: (event: CustomEvent) => void): void {
    if (!listeners[eventType])
      listeners[eventType] = []

    listeners[eventType].push(callback)
  }

  function removeEventListener(eventType: string, callback: (event: CustomEvent) => void): void {
    if (listeners[eventType]) {
      listeners[eventType] = listeners[eventType].filter(
        listener => listener !== callback
      )
    }
  }

  function dispatchEvent(event: { type: string, data: string }): void {
    if (listeners[event.type]) {
      listeners[event.type].forEach(listener =>
        listener(new CustomEvent(event.type, { detail: event.data }))
      )
    }
  }

  return {
    stream,
    addEventListener,
    removeEventListener
  }
}
