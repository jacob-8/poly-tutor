export function createChunkDecoder() {
  const decoder = new TextDecoder()
  return function (chunk: Uint8Array | undefined): string {
    if (!chunk) return ''
    return decoder.decode(chunk, { stream: true })
  }
}
