interface ChatCompletionChunk {
  id: string;
  object: string;
  created: number;
  model: string;
  system_fingerprint: string;
  choices: Choice[];
}

interface Choice {
  index: number;
  delta: Delta;
  finish_reason: string | null;
}

interface Delta {
  role?: string;
  content?: string;
}

export function create_chat_completion_data(contents: string[]): ChatCompletionChunk[] {
  const id = 'chatcmpl-8Nh6hF13Na8XqMplwFT6VCjz5sJcP'
  const object = 'chat.completion.chunk'
  const model = 'gpt-4-1106-preview'
  const system_fingerprint = 'fp_a24b4d720c'
  const timestamp = 1700657939

  const chunks: ChatCompletionChunk[] = [...contents.map((content) => ({
    id,
    object,
    created: timestamp,
    model,
    system_fingerprint,
    choices: [{
      index: 0,
      delta: { content },
      finish_reason: null
    }]
  })),
  {
    id,
    object,
    created: timestamp,
    model,
    system_fingerprint,
    choices: [{
      index: 0,
      delta: {},
      finish_reason: 'stop'
    }]
  }]
  return chunks
}

if (import.meta.vitest) {
  test(create_chat_completion_data, () => {
    const contents = '企鹅(qǐ\'é)。你喜欢企鹅吗？为什么？'.split('')
    expect(create_chat_completion_data(contents)).toMatchFileSnapshot('./create_chat_completion.snap.json5')
  })
}
