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
  words?: (AnalyzedWordWithEmphasis | AnalyzedChineseWordWithEmphasis)[]
  start_ms?: number
  end_ms?: number
  translation?: Translation
  syntax?: google.cloud.language.v1.IAnalyzeSyntaxResponse
}

type Translation = Partial<Record<LocaleCode, string>>

export interface VocabularyWordStats {
  status?: WordStatus

  // these are used in vocabulary list views and to calculate word emphasis
  views?: number
  rank?: number // personal rank based on view count, for word focus view and pronunciation/tone improvement emphasizing
  rank_amongst_unknown?: number // personal rank based on view count of unknown words
}

export type UserVocabulary = Record<string, VocabularyWordStats>

/* eslint-disable no-magic-numbers */
export enum WordStatus {
  'unknown' = 0,
  'pronunciation' = 1, // Chinese only
  'tone' = 2, // Chinese only
  'known' = 3,
  'wordlist' = 4,
}

export interface AnalyzedWord extends VocabularyWordStats {
  text: string
  definitions_array?: string[]
  neighbors_understood?: boolean
}

// calculated sentence by sentence
export interface AnalyzedChineseWord extends AnalyzedWord {
  opposite_script?: string
  pinyin?: string // for word focus view
  // tones?: number[]
  pronunciation?: string // a combination of pinyin, tone markers or nothing depending on word status
  tone_change?: boolean
}

// calculated on 2nd pass after analyzing all content
export interface WordEmphasis {
  high_view_count?: boolean // learn it - true if word ranks in the top ____ of unknown words using rank_amongst_unknown and user's preference for how many unknown words to learn per lesson - when showing preview, put words at the top if they are also common_in_this_context
  common_in_this_context?: boolean // notice it - true if word is unknown ranks
}

export interface ChineseWordEmphasis extends WordEmphasis {
  improve_pronunciation_or_tone?: boolean // improve it, 1-5 of the highest ranked words that are pronunciation or tone status
}

export type AnalyzedWordWithEmphasis = AnalyzedWord & WordEmphasis
export type AnalyzedChineseWordWithEmphasis = AnalyzedChineseWord & ChineseWordEmphasis

export interface ChineseEmphasisLimits {
  high_view_count_max: number
  common_in_this_context_max: number
  improve_pronunciation_or_tone_max: number
}

export interface CEDictEntry {
  traditional: string
  simplified?: string
  pinyin: string
  definitions: string
  // added
  tones?: number[]
  definitions_array?: string[]
}

export interface Settings {
  font_size_em?: number
  quizzing?: boolean
  show_definition?: boolean
  show_pronunciation?: boolean // Chinese only
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

