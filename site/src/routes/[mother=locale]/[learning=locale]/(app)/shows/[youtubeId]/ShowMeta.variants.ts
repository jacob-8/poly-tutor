import type { Variant, Viewport } from 'kitbook'
import type Component from './ShowMeta.svelte'

export const viewports: Viewport[] = [{width: 400, height: 200}]

const words = [
  {
    'text': '自',
    'pinyin': 'zì',
    'pronunciation': 'zì',
    'definitions_array': [
      'self',
      'oneself',
      'from',
      'since',
      'naturally',
      'surely'
    ],
    'status': 0
  },
  {
    'text': '駕',
    'pinyin': 'jià',
    'pronunciation': 'jià',
    'definitions_array': [
      'surname Jia',
      'to harness',
      'to draw (a cart etc)',
      'to drive',
      'to pilot',
      'to sail',
      'to ride',
      'your good self',
      'prefixed word denoting respect (polite 敬辞)'
    ],
    'status': 0,
    'opposite_script': '驾'
  },
  {
    'text': '游',
    'pinyin': 'yóu',
    'pronunciation': 'yóu',
    'definitions_array': [
      'to swim',
      'variant of 遊|游[yóu]',
      'surname You'
    ],
    'status': 0
  },
  {
    'text': '貴州',
    'pinyin': 'guì zhōu',
    'pronunciation': 'guìzhōu',
    'definitions_array': [
      'Guizhou province (Kweichow) in south central China, abbr. to 黔[qián] or 貴|贵[guì], capital Guiyang 貴陽|贵阳[guì yáng]'
    ],
    'status': 3,
    'opposite_script': '贵州'
  },
  {
    'text': '黔',
    'pinyin': 'qián',
    'pronunciation': 'qián',
    'definitions_array': [
      'abbr. for Guizhou province 貴州|贵州[guì zhōu]'
    ],
    'status': 0
  },
  {
    'text': '東',
    'pinyin': 'dōng',
    'pronunciation': 'dōng',
    'definitions_array': [
      'east',
      'host (i.e. sitting on east side of guest)',
      'landlord',
      'surname Dong'
    ],
    'status': 0,
    'opposite_script': '东'
  },
  {
    'text': '南',
    'pinyin': 'nán',
    'pronunciation': 'nán',
    'definitions_array': [
      'south',
      'surname Nan'
    ],
    'status': 0
  },
  {
    'text': '，'
  },
  {
    'text': '花',
    'pinyin': 'huā',
    'pronunciation': 'huā',
    'definitions_array': [
      'flower',
      'blossom',
      'CL:朵[duǒ],支[zhī],束[shù],把[bǎ],盆[pén],簇[cù]',
      'fancy pattern',
      'florid',
      'to spend (money, time)',
      '(coll.) lecherous',
      'lustful',
      'surname Hua'
    ],
    'status': 0
  },
  {
    'text': '50'
  },
  {
    'text': '元',
    'pinyin': 'yuán',
    'pronunciation': 'yuán',
    'definitions_array': [
      'currency unit (esp. Chinese yuan)',
      'first',
      'original',
      'primary',
      'fundamental',
      'constituent',
      'part',
      'era (of a reign)',
      'meta- (prefix)',
      '(math.) argument',
      'variable',
      '(Tw) (geology) eon',
      'the Yuan or Mongol dynasty (1279-1368)',
      'surname Yuan'
    ],
    'status': 0
  },
  {
    'text': '買',
    'pinyin': 'mǎi',
    'pronunciation': 'mǎi',
    'definitions_array': [
      'to buy',
      'to purchase'
    ],
    'status': 0,
    'opposite_script': '买'
  },
  {
    'text': '了',
    'pinyin': 'le',
    'pronunciation': 'le',
    'definitions_array': [
      '(modal particle intensifying preceding clause)',
      '(completed action marker)',
      'to finish',
      'to achieve',
      'to understand clearly',
      'variant of 瞭|了[liǎo]'
    ],
    'status': 0
  },
  {
    'text': '個',
    'pinyin': 'gè',
    'pronunciation': 'gè',
    'definitions_array': [
      'individual',
      'this',
      'that',
      'size',
      'classifier for people or objects in general'
    ],
    'status': 0,
    'opposite_script': '个'
  },
  {
    'text': '竹',
    'pinyin': 'zhú',
    'pronunciation': 'zhú',
    'definitions_array': [
      'bamboo',
      'CL:棵[kē],支[zhī],根[gēn]',
      'Kangxi radical 118'
    ],
    'status': 0
  },
  {
    'text': '簍',
    'pinyin': 'lǒu',
    'pronunciation': 'lǒu',
    'definitions_array': [
      'basket'
    ],
    'status': 0,
    'opposite_script': '篓'
  },
  {
    'text': '，'
  },
  {
    'text': '是不是',
    'pinyin': 'shì bù shì',
    'pronunciation': 'shìbù shì',
    'definitions_array': [
      'is or isn\'t',
      'yes or no',
      'whether or not'
    ],
    'status': 0
  },
  {
    'text': '特別',
    'pinyin': 'tè bié',
    'pronunciation': 'tèbié',
    'definitions_array': [
      'especially',
      'special',
      'particular',
      'unusual'
    ],
    'status': 0,
    'opposite_script': '特别'
  },
  {
    'text': '洋氣',
    'pinyin': 'yáng qì',
    'pronunciation': 'yángqì',
    'definitions_array': [
      'trendy',
      'fashionable',
      'foreign styles and trends'
    ],
    'status': 0,
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
    'pronunciation': 'xiǎobái',
    'definitions_array': [
      '(slang) novice',
      'greenhorn',
      'fool',
      'idiot',
      'abbr. for 小白臉|小白脸[xiǎo bái liǎn], pretty boy'
    ],
    'status': 0
  },
  {
    'text': '的',
    'pinyin': 'de',
    'pronunciation': 'de',
    'definitions_array': [
      'of',
      '~\'s (possessive particle)',
      '(used after an attribute)',
      '(used to form a nominal expression)',
      '(used at the end of a declarative sentence for emphasis)',
      'aim',
      'clear',
      'really and truly',
      'see 的士[dī shì]'
    ],
    'status': 0
  },
  {
    'text': '奇幻',
    'pinyin': 'qí huàn',
    'pronunciation': 'qíhuàn',
    'definitions_array': [
      'fantasy (fiction)'
    ],
    'status': 0
  },
  {
    'text': '旅行',
    'pinyin': 'lǚ xíng',
    'pronunciation': 'lǚxíng',
    'definitions_array': [
      'to travel',
      'journey',
      'trip',
      'CL:趟[tàng],次[cì],個|个[gè]'
    ],
    'status': 0
  },
  {
    'text': '】'
  }
]

export const variants: Variant<Component>[] = [
  {
    name: 'not-analyzed',
    props: {
      label: 'Description',
      sentence: {text: 'This is just a plain text string.'},
      studySentence: (sentence) => console.info({sentence})
    },
  },
  {
    name: 'analyzed',
    viewports: [{width: 700, height: 250}],
    props: {
      label: 'Description',
      sentence: { words },
      studySentence: (sentence) => console.info({sentence})
    },
  },
]

