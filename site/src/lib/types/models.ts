export enum OpenAiChatModels {
  'GPT4' = 'gpt-4-0125-preview', // $0.01 / 1K tokens input and $0.03 / 1K tokens output
  'GPT3_5' = 'gpt-3.5-turbo-1106', // $0.0005 /1K tokens input and $0.0015 /1K tokens output
  // 'gpt-3.5-turbo-0125' - coming out in a week, already using this price for simplicity
}

export type ChatModels = `${OpenAiChatModels}`


// .10 per million Cohere embed-multilingual-light-v3.0, 384 (50% more database space, 61.7 MIRACL multilingual benchmark avg)
// .13 per million OpenAI text-embedding-3-large, 256 (54.9 MIRACL avg)
