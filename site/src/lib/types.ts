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
  syntax?: google.cloud.language.v1.IAnalyzeSyntaxResponse
  words?: Word[]
  start_ms?: number
  end_ms?: number
  machine_translation?: Translation
}

interface Word {
  text: string
  language: 'other' | 'zh'
  known: boolean
  partOfSpeechTag?: string
  pronunciation?: string
  tones?: string
}

// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
interface Translation {
  [bcp: string]: string;
}

export interface CEDictEntry {
  hsk?: string
  hskId?: string
  traditional?: string
  simplified?: string
  pinyin?: string
  zhuyin?: string
  definitions?: string
  weight?: string
  length?: string
  example?: string
  exampleTranslation?: string
  order?: string

  noDefinition?: string // returned if no matching entry found
  not中文?: string

  // augments
  definitionsArray?: string[]
  adjustedWeight?: number
}

// API

export interface YtAddRequestBody {
  youtube_id: string
}

export interface YtCaptionsRequestBody {
  youtube_id: string
}

export interface YtTranscribeRequestBody {
  youtube_id: string
  openai_api_key: string
  language_code: 'en' | 'zh'
  duration_seconds: number
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
  openai_api_key: string
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

