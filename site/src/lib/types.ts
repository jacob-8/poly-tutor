import type { google } from '@google-cloud/language/build/protos/protos'
import type { ChatCompletionRequestMessage, CreateChatCompletionResponse } from 'openai-edge'
import type { LocaleCode } from './i18n/locales'

// Books, Shows, Volumes, Pages, Paragraphs are all sections, this let's us nest as many layers as we need
export interface Section {
  sentences?: Sentence[]
  children?: Section[]
}

export interface Sentence {
  text: string
  words?: Word[]
  start_ms?: number
  end_ms?: number
  translation?: Translation
  syntax?: google.cloud.language.v1.IAnalyzeSyntaxResponse
}

interface Word {
  text: string
  language: 'other' | 'zh'
  known: boolean
  partOfSpeechTag?: string
  pronunciation?: string
  tones?: string
}

type Translation = Partial<Record<LocaleCode, string>>

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
  language_code: 'en' | 'zh'
}

export interface YtCaptionsRequestBody {
  youtube_id: string
  locale: LocaleCode
}

export interface YtTranscribeRequestBody {
  youtube_id: string
  openai_api_key: string
  language_code: 'en' | 'zh'
  duration_seconds: number
}

export interface ExternalYoutubeTranscribeRequestBody {
  youtube_id: string
  openai_api_key: string
  poly_key: string
  language?: string
  prompt?: string
  seconds_per_chunk?: number
}

export interface WhisperTranscript {
  transcript: {
    text: string,
    start_second: number,
    end_second: number,
  }[]
}

export interface TranslateRequestBody {
  text: string
  sourceLanguageCode: LocaleCode // https://cloud.google.com/translate/docs/languages
  targetLanguageCode: LocaleCode
}

export interface AnalyzeSyntaxRequestBody {
  text: string
  sourceLanguageCode: string
}

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

