import { WordStatus, type AnalyzedChineseWord, type Sentence } from '$lib/types'

const words: AnalyzedChineseWord[] = [
  {
    'text': '自',
    'pinyin': 'zì',
    'definitions': [
      'self',
      'oneself',
      'from',
      'since',
      'naturally',
      'surely'
    ].join('/'),
    'status': WordStatus.wordlist,
    // common_in_this_context: true,
  },
  {
    'text': '駕',
    'pinyin': 'jià',
    'definitions': [
      'surname Jia',
      'to harness',
      'to draw (a cart etc)',
      'to drive',
      'to pilot',
    ].join('/'),
    'status': WordStatus.unknown,
    'opposite_script': '驾',
    // high_view_count: true,
  },
  {
    'text': '游',
    'pinyin': 'yóu',
    'definitions': [
      'to swim',
      'variant of 遊|游[yóu]',
      'surname You'
    ].join('/'),
    'status': WordStatus.wordlist,
  },
  {
    'text': '貴州',
    'pinyin': 'guì zhōu',
    'definitions': [
      'Guizhou province (Kweichow) in south central China, abbr. to 黔[qián] or 貴|贵[guì], capital Guiyang 貴陽|贵阳[guì yáng]'
    ].join('/'),
    'status': WordStatus.pronunciation,
    'opposite_script': '贵州'
  },
  {
    'text': '黔',
    'pinyin': 'qián',
    'definitions': [
      'abbr. for Guizhou province 貴州|贵州[guì zhōu]'
    ].join('/'),
    'status': WordStatus.tone,
  },
  {
    'text': '東',
    'pinyin': 'dōng',
    'definitions': [
      'east',
      'host (i.e. sitting on east side of guest)',
      'landlord',
      'surname Dong'
    ].join('/'),
    'status': WordStatus.known,
    'opposite_script': '东'
  },
  {
    'text': '南',
    'pinyin': 'nán',
    'definitions': [
      'south',
      'surname Nan'
    ].join('/'),
    'status': WordStatus.unknown,
  },
  {
    'text': '，'
  },
  {
    'text': '花',
    'pinyin': 'huā',
    'definitions': [
      'flower',
      'blossom',
      'CL:朵[duǒ],支[zhī],束[shù],把[bǎ],盆[pén],簇[cù]',
      'fancy pattern',
      'florid',
      'to spend (money, time)',
    ].join('/'),
    'status': WordStatus.wordlist,
  },
  {
    'text': '50'
  },
  {
    'text': '元',
    'pinyin': 'yuán',
    'definitions': [
      'currency unit (esp. Chinese yuan)',
      'first',
      'original',
      'primary',
      'fundamental',
      'constituent',
      'part',
    ].join('/'),
    'status': WordStatus.known,
  },
  {
    'text': '買',
    'pinyin': 'mǎi',
    'definitions': [
      'to buy',
      'to purchase'
    ].join('/'),
    'status': WordStatus.known,
    'opposite_script': '买'
  },
  {
    'text': '了',
    'pinyin': 'le',
    'definitions': [
      '(modal particle intensifying preceding clause)',
      '(completed action marker)',
      'to finish',
      'to achieve',
      'to understand clearly',
      'variant of 瞭|了[liǎo]'
    ].join('/'),
    'status': WordStatus.unknown,
  },
  {
    'text': '個',
    'pinyin': 'gè',
    'definitions': [
      'individual',
      'this',
      'that',
      'size',
      'classifier for people or objects in general'
    ].join('/'),
    'status': WordStatus.pronunciation,
    'opposite_script': '个'
  },
  {
    'text': '竹',
    'pinyin': 'zhú',
    'definitions': [
      'bamboo',
      'CL:棵[kē],支[zhī],根[gēn]',
      'Kangxi radical 118'
    ].join('/'),
    'status': WordStatus.tone,
  },
  {
    'text': '簍',
    'pinyin': 'lǒu',
    'definitions': [
      'basket'
    ].join('/'),
    'status': WordStatus.known,
    'opposite_script': '篓'
  },
  {
    'text': '，'
  },
  {
    'text': '是不是',
    'pinyin': 'shì bù shì',
    'definitions': [
      'is or isn\'t',
      'yes or no',
      'whether or not'
    ].join('/'),
    'status': WordStatus.known,
  },
  {
    'text': '特別',
    'pinyin': 'tè bié',
    'definitions': [
      'especially',
      'special',
      'particular',
      'unusual'
    ].join('/'),
    'status': WordStatus.known,
    'opposite_script': '特别'
  },
  {
    'text': '洋氣',
    'pinyin': 'yáng qì',
    'definitions': [
      'trendy',
      'fashionable',
      'foreign styles and trends'
    ].join('/'),
    'status': WordStatus.known,
    'opposite_script': '洋气'
  },
  {
    'text': '？'
  },
  {
    'text': '【'
  },
  {
    'text': '小白',
    'pinyin': 'xiǎo bái',
    'definitions': [
      '(slang) novice',
      'greenhorn',
    ].join('/'),
    'status': WordStatus.known,
  },
  {
    'text': '的',
    'pinyin': 'de',
    'definitions': [
      'of',
      '~\'s (possessive particle)',
      '(used after an attribute)',
      '(used to form a nominal expression)',
      '(used at the end of a declarative sentence for emphasis)',
      'aim',
      'clear',
      'really and truly',
      'see 的士[dī shì]'
    ].join('/'),
    'status': WordStatus.unknown,
  },
  {
    'text': '奇幻',
    'pinyin': 'qí huàn',
    'definitions': [
      'fantasy (fiction)'
    ].join('/'),
    'status': WordStatus.known,
  },
  {
    'text': '旅行',
    'pinyin': 'lǚ xíng',
    'definitions': [
      'to travel',
      'journey',
      'trip',
      'CL:趟[tàng],次[cì],個|个[gè]'
    ].join('/'),
    'status': WordStatus.known,
  },
  {
    'text': '】'
  }
]

export const title_sentence: Sentence = { words, translation: { en: 'When traveling by car to Qiandongnan, Guizhou, I bought a bamboo basket for 50 yuan. Isn’t it very fashionable? 【Xiaobai\'s Fantastic Travel】'} }
