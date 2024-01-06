// import { WordStatus, type ChineseEmphasisLimits, type Sentence, type AnalyzedChineseWordWithEmphasis } from '$lib/types'
// import { MinHeap } from './min-heap'

// export function emphasize_chinese_sentences({ sentences, emphasis_limits }: { sentences: Sentence[], emphasis_limits: ChineseEmphasisLimits}): { emphasized_sentences: Sentence[], emphasized_words: AnalyzedChineseWordWithEmphasis[] } {
//   const {common_in_this_context_max, high_view_count_max, improve_pronunciation_or_tone_max} = emphasis_limits
//   const words = sentences.flatMap(sentence => sentence.words)

//   const learning_pronunciation_with_count = {} as Record<string, AnalyzedChineseWordWithEmphasis>
//   const unknown_words_with_count = {} as Record<string, AnalyzedChineseWordWithEmphasis>

//   for (const word of words) {
//     if (word.status === undefined) continue // weeds out non-Chinese words
//     if (word.status === WordStatus.known || word.status === WordStatus.wordlist) continue

//     if (word.status === WordStatus.tone || word.status === WordStatus.pronunciation) {
//       if (word.text in learning_pronunciation_with_count)
//         learning_pronunciation_with_count[word.text].context_views++
//       else
//         learning_pronunciation_with_count[word.text] = { ...word, context_views: 1 }
//       continue
//     }

//     if (word.text in unknown_words_with_count)
//       unknown_words_with_count[word.text].context_views++
//     else
//       unknown_words_with_count[word.text] = { ...word, context_views: 1 }
//   }

//   function getTopWords(wordsWithCount: Record<string, AnalyzedChineseWordWithEmphasis>, maxCount: number, comparator: (a: AnalyzedChineseWordWithEmphasis, b: AnalyzedChineseWordWithEmphasis) => number, label: string) {
//     const heap = new MinHeap<AnalyzedChineseWordWithEmphasis>(comparator)
//     Object.values(wordsWithCount).forEach(word => {
//       heap.insert(word)
//       if (heap.size() > maxCount)
//         heap.extractMin()
//     })
//     return heap.toArray().reduce<Record<string, AnalyzedChineseWordWithEmphasis>>((acc, word) => {
//       acc[word.text] = { ...word, [label]: true }
//       return acc
//     }, {})
//   }

//   const top_context_words = getTopWords(unknown_words_with_count, common_in_this_context_max, (a, b) => a.context_views - b.context_views, 'common_in_this_context')
//   const top_user_words = getTopWords(unknown_words_with_count, high_view_count_max, (a, b) => (a.context_views + a.user_views) - (b.context_views + b.user_views), 'high_view_count')
//   const top_improve_words = getTopWords(learning_pronunciation_with_count, improve_pronunciation_or_tone_max, (a, b) => (a.context_views + a.user_views) - (b.context_views + b.user_views), 'improve_pronunciation_or_tone')

//   // const top_context_words = Object.entries(unknown_words_with_count)
//   //   .sort(([,a], [,b]) => b.context_views - a.context_views)
//   //   .slice(0, common_in_this_context_max)
//   //   .reduce<Record<string, AnalyzedChineseWordWithEmphasis>>((acc, [key, value]) => {
//   //     acc[key] = { ...value, common_in_this_context: true }
//   //     return acc
//   //   }, {})

//   // const top_user_words = Object.entries(unknown_words_with_count)
//   //   .sort(([,a], [,b]) => (b.context_views + b.user_views) - (a.context_views + b.user_views))
//   //   .slice(0, high_view_count_max)
//   //   .reduce<Record<string, AnalyzedChineseWordWithEmphasis>>((acc, [key, value]) => {
//   //     acc[key] = { ...value, high_view_count: true }
//   //     return acc
//   //   }, {})

//   // const top_improve_words = Object.entries(learning_pronunciation_with_count)
//   //   .sort(([,a], [,b]) => (b.context_views + b.user_views) - (a.context_views + b.user_views))
//   //   .slice(0, improve_pronunciation_or_tone_max)
//   //   .reduce<Record<string, AnalyzedChineseWordWithEmphasis>>((acc, [key, value]) => {
//   //     acc[key] = { ...value, improve_pronunciation_or_tone: true }
//   //     return acc
//   //   }, {})

//   const emphasized_sentences = sentences.map(sentence =>  {
//     for (const word of sentence.words) {
//       if (top_user_words[word.text]) {
//         word.high_view_count = true
//         continue
//       }
//       if (top_context_words[word.text]) {
//         word.common_in_this_context = true
//         continue
//       }
//       if (top_improve_words[word.text])
//         // @ts-ignore
//         word.improve_pronunciation_or_tone = true
//     }
//     return sentence
//   })

//   const emphasized_words = [...Object.values(top_user_words), ...Object.values(top_context_words), ...Object.values(top_improve_words)].filter((word, index, array) =>
//     array.findIndex(w => w.text === word.text) === index
//   )
//   return { emphasized_sentences, emphasized_words }
// }

// if (import.meta.vitest) {
//   describe(emphasize_chinese_sentences, () => {
//     const result = emphasize_chinese_sentences({ sentences: [
//       { text: '你好嗎',
//         words: [
//           { text: '你好', status: WordStatus.unknown, user_views: 3 },
//           { text: '嗎', status: WordStatus.tone, user_views: 10 },
//         ]},
//       { text: '你好，我老師！',
//         words: [
//           { text: '你好', status: WordStatus.unknown, user_views: 3 },
//           { text: '，' },
//           { text: '我', status: WordStatus.wordlist, user_views: 20 },
//           { text: '老師', status: WordStatus.unknown, user_views: 4 },
//           { text: '！' },
//         ]},
//       { text: '你好，老師！',
//         words: [
//           { text: '你好', status: WordStatus.unknown, user_views: 3 },
//           { text: '，' },
//           { text: '老師', status: WordStatus.unknown, user_views: 4 },
//           { text: '！' },
//         ]},
//       { text: '你好，大家！',
//         words: [
//           { text: '你好', status: WordStatus.unknown, user_views: 3 },
//           { text: '，' },
//           { text: '大家', status: WordStatus.unknown, user_views: 0 },
//           { text: '！' },
//         ]},
//     ], emphasis_limits: { high_view_count_max: 1, common_in_this_context_max: 2, improve_pronunciation_or_tone_max: 1 }})

//     test('marks high_view_count based on user vocab + context, then marks words as common if not already high_view, and also denotes the most common words to improve', () => {

//       const expected: { emphasized_sentences: Sentence[], emphasized_words: AnalyzedChineseWordWithEmphasis[] } = { emphasized_sentences: [
//         { text: '你好嗎',
//           words: [
//             { text: '你好', status: WordStatus.unknown, user_views: 3, high_view_count: true },
//             { text: '嗎', status: WordStatus.tone, user_views: 10, improve_pronunciation_or_tone: true },
//           ]},
//         { text: '你好，我老師！',
//           words: [
//             { text: '你好', status: WordStatus.unknown, user_views: 3, high_view_count: true  },
//             { text: '，' },
//             { text: '我', status: WordStatus.wordlist, user_views: 20 },
//             { text: '老師', status: WordStatus.unknown, user_views: 4, common_in_this_context: true },
//             { text: '！' },
//           ]},
//         { text: '你好，老師！',
//           words: [
//             { text: '你好', status: WordStatus.unknown, user_views: 3, high_view_count: true  },
//             { text: '，' },
//             { text: '老師', status: WordStatus.unknown, user_views: 4, common_in_this_context: true },
//             { text: '！' },
//           ]},
//         { text: '你好，大家！',
//           words: [
//             { text: '你好', status: WordStatus.unknown, user_views: 3, high_view_count: true  },
//             { text: '，' },
//             { text: '大家', status: WordStatus.unknown, user_views: 0 },
//             { text: '！' },
//           ]},
//       ], emphasized_words: [
//         { text: '你好', status: WordStatus.unknown, user_views: 3, context_views: 4, high_view_count: true },
//         { text: '老師', status: WordStatus.unknown, user_views: 4, context_views: 2, common_in_this_context: true },
//         { text: '嗎', status: WordStatus.tone, user_views: 10, context_views: 1, improve_pronunciation_or_tone: true },
//       ] }
//       expect(result).toEqual(expected)
//     })
//   })
// }
