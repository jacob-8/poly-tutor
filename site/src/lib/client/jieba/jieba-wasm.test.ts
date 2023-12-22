import { cut, cut_all } from 'jieba-wasm'

// true param is for hmm

// hmm in jieba-wasm is a parameter that controls whether or not to use the Hidden Markov Model for Chinese word segmentation.

// Hidden Markov Model (HMM) is a statistical model where the system being modeled is assumed to be a Markov process with hidden states. In the context of jieba-wasm and Chinese word segmentation, the HMM is used to help with the segmentation of words that are not in the dictionary.

// If hmm is set to true, the HMM model will be used for word segmentation, which can help with the segmentation of unknown words. If hmm is set to false, the HMM model will not be used.

describe(cut, () => {
  test('你好世界！', () => {
    expect(cut('你好世界！', true)).toMatchInlineSnapshot(`
      [
        "你好",
        "世界",
        "！",
      ]
    `)
  })

  test('中华人民共和国武汉市长江大桥', () => {
    expect(cut('中华人民共和国武汉市长江大桥', true)).toMatchInlineSnapshot(`
      [
        "中华人民共和国",
        "武汉市",
        "长江大桥",
      ]
    `)

    // use this in study view to give all possible words for easier lookups and word adding
    expect(cut_all('中华人民共和国武汉市长江大桥')).toMatchInlineSnapshot(`
      [
        "中",
        "中华",
        "中华人民",
        "中华人民共和国",
        "华",
        "华人",
        "人",
        "人民",
        "人民共和国",
        "民",
        "共",
        "共和",
        "共和国",
        "和",
        "国",
        "武",
        "武汉",
        "武汉市",
        "汉",
        "市",
        "市长",
        "长",
        "长江",
        "长江大桥",
        "江",
        "大",
        "大桥",
        "桥",
      ]
    `)
  })
})
