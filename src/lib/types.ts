import type { google } from '@google-cloud/language/build/protos/protos'

export interface Content {
  summary?: Paragraph[]
  paragraphs?: Paragraph[]
}

export interface Paragraph {
  sentences: Sentence[]
}

export interface Sentence {
  text: string
  words?: Word[]
  syntax?: google.cloud.language.v1.IAnalyzeSyntaxResponse
  start_ms?: number
  end_ms?: number
  machine_translation?: Translation
}

interface Word {
  text: string
  pronunciation?: string
  tones?: string
}

// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
interface Translation {
  [bcp: string]: string;
}

// API

export interface YtCaptionsRequestBody {
  youtubeId: string
}

export interface TranslateRequestBody {
  text: string
  sourceLanguageCode: string
  targetLanguageCode: string
}

export interface AnalyzeSyntaxRequestBody {
  text: string
  sourceLanguageCode: string
}

import type { ChatCompletionRequestMessage, CreateChatCompletionResponse } from 'openai-edge'

export interface ChatRequestBody {
  messages: ChatCompletionRequestMessage[]
  model: 'gpt-4-1106-preview' | 'gpt-3.5-turbo-1106'
  max_tokens: number
}

export interface OpenAiChatStreamResponse extends Omit<CreateChatCompletionResponse, 'usage'> {
  choices: {
    index: number;
    delta: {
      content?: string;
    };
    finish_reason: string | null;
  }[];
}
