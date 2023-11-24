import { createPersistedStore } from 'svelte-pieces'
import type { PageLoad } from './$types'
import type { AnalyzeSyntaxRequestBody, ChatRequestBody, Content, OpenAiChatStreamResponse, Sentence, TranslateRequestBody, YtCaptionsRequestBody } from '$lib/types'
import { get } from 'svelte/store'
import { apiFetch } from '$lib/client/apiFetch'
import { fetchSSE } from '$lib/client/fetchSSE'
import type { ChatCompletionRequestMessage } from 'openai-edge'
import { merge_translations } from './merge_translations'
import { merge_syntax } from './merge_syntax'

export const load = (({ params: { youtubeId } }) => {
  const content = createPersistedStore<Content>(`content_${youtubeId}`, {}, true)

  async function getCaptions() {
    const response = await apiFetch<YtCaptionsRequestBody>('/api/yt_captions', { youtubeId })
    const sentences = await response.json() as Sentence[]
    content.set({ paragraphs: [{ sentences }] })
  }

  function getSummary(): Promise<void> {
    return new Promise((resolve) => {
      const currentContent = get(content)
      const transcript = currentContent.paragraphs.map(paragraph => {
        return paragraph.sentences.map(sentence => sentence.text).join('\n')
      }).join('\n\n')

      const messagesToSend: ChatCompletionRequestMessage[] = [
        { role: 'system', content: 'You are a professional language teacher who helps students learn language by watching films. Summarize the following transcript in less than 200 words to provide a quick preview before watching. Keep your speech simple and use 繁體中文.' },
        { role: 'user', content: `Transcript: ${transcript}` },
      ]

      const eventSource = fetchSSE<ChatRequestBody>('/api/chat', { messages: messagesToSend, model: 'gpt-4-1106-preview', max_tokens: 600 })
      eventSource.addEventListener('message', handle_message)
      eventSource.addEventListener('error', (e) => console.error(e))
      eventSource.stream()

      let summary = ''
      async function handle_message({detail}: CustomEvent<string>) {
        if (detail === '[DONE]') {
          const response = await apiFetch<TranslateRequestBody>('/api/translate', { text: summary, sourceLanguageCode: 'zh', targetLanguageCode: 'en' })
          const translatedSummary = await response.json() as string
          content.set({ ...currentContent, summary: [{ sentences: [{text: summary, machine_translation: { en: translatedSummary}}] }] })
          resolve()
          return
        }

        const { choices: [ { delta }] } = JSON.parse(detail) as OpenAiChatStreamResponse

        if (delta.content) {
          summary += delta.content
          content.set({ ...currentContent, summary: [{ sentences: [{text: summary}] }] })
        }
      }
    })
  }

  function deleteSummary() {
    const currentContent = get(content)
    content.set({ ...currentContent, summary: undefined })
  }

  function deleteContent() {
    content.set({})
  }

  async function analyze_syntax() {
    const currentContent = get(content)
    if (!currentContent.paragraphs?.length) return
    const [firstParagraph] = currentContent.paragraphs
    const lineSeparatedText = firstParagraph.sentences.map(sentence => sentence.text).join('\n')
    const response = await apiFetch<AnalyzeSyntaxRequestBody>('/api/analyze_syntax', { text: lineSeparatedText, sourceLanguageCode: 'zh' })
    const syntax = await response.json() as Sentence['syntax']
    const sentencesWithSyntax = merge_syntax(syntax, firstParagraph.sentences)
    content.set({ ...currentContent, paragraphs: [{ sentences: sentencesWithSyntax }] })
  }

  async function translate() {
    const currentContent = get(content)
    if (!currentContent.paragraphs?.length) return
    const [firstParagraph] = currentContent.paragraphs
    const lineSeparatedText = firstParagraph.sentences.map(sentence => sentence.text).join('\n')

    const response = await apiFetch<TranslateRequestBody>('/api/translate', { text: lineSeparatedText, sourceLanguageCode: 'zh', targetLanguageCode: 'en' })
    const lineSeparatedTranslations = await response.json() as string // separated by /n

    const sentencesWithTranslation = merge_translations(lineSeparatedTranslations, firstParagraph.sentences)
    content.set({ ...currentContent, paragraphs: [{ sentences: sentencesWithTranslation }] })
  }

  return { content, getCaptions, getSummary, deleteSummary, deleteContent, analyze_syntax, translate }
}) satisfies PageLoad
