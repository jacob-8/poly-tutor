import type { google } from '@google-cloud/language/build/protos/protos'
import type { ChatCompletionRequestMessage, CreateChatCompletionResponse } from 'openai-edge'
import type { LocaleCode } from './i18n/locales'
import type { ChatModels } from './types/models'

// Books, Shows, Volumes, Pages, Paragraphs are all sections, this let's us nest as many layers as we need
export interface Section {
  sentences?: Sentence[]
  children?: Section[]
}

export interface Sentence {
  text?: string
  words?: (AnalyzedEnglishWord | AnalyzedChineseWord)[]
  start_ms?: number
  end_ms?: number
  translation?: Translation
  syntax?: google.cloud.language.v1.IAnalyzeSyntaxResponse
}

type Translation = Partial<Record<LocaleCode, string>>

export interface VocabularyWordStats {
  status?: WordStatus
  views?: number
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

// calculated sentence by sentence
interface AnalyzedWord extends VocabularyWordStats {
  text: string
  definitions?: string
  context_sentence_indexes?: number[] // not implemented
  neighbors_understood?: boolean // designed, not implemented
}

export interface AnalyzedEnglishWord extends AnalyzedWord {
  phonetic?: string
}

export interface AnalyzedChineseWord extends AnalyzedWord {
  pinyin?: string
  opposite_script?: string
  tone_change?: boolean // designed, not implemented
}

export interface EmphasisLimits {
  high_view_count_max: number
  common_in_this_context_max: number
}

export interface ChineseEmphasisLimits extends EmphasisLimits {
  improve_pronunciation_or_tone_max: number
}

export interface StudyWords {
  high_view_count: AnalyzedChineseWord[]
  common_in_this_context: AnalyzedChineseWord[]
  improve_pronunciation_or_tone?: AnalyzedChineseWord[]
}

export interface StudyWordsObject {
  high_view_count: Record<string, boolean>
  common_in_this_context: Record<string, boolean>
  improve_pronunciation_or_tone?: Record<string, boolean>
}

export interface CEDictEntry {
  traditional: string
  simplified?: string
  pinyin: string
  definitions: string
}

export interface ECDictEntry {
  word: string
  phonetic?: string
  translation: string
}

export interface Settings {
  font_size_em?: number
  quizzing?: boolean
  show_definition?: boolean
  show_pronunciation?: boolean // Chinese only
}

export interface GoogleAuthUserMetaData{
    // "iss": string,
    // "sub": string,
    // "name": string,
    // "email": string,
    // "picture": string, // duplicate of avatar_url
    full_name?: string,
    avatar_url?: string,
    // "provider_id": string,
    // "email_verified": boolean,
    // "phone_verified": boolean
}

export type UserMetaData = GoogleAuthUserMetaData

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

export interface YtTranslateRequestBody {
  youtube_id: string
  sentences: Sentence[]
  mother: LocaleCode
  learning: LocaleCode
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
  model: ChatModels
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

