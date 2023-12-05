import { defineConfig } from 'kitbook/defineConfig'

export default defineConfig({
  title: 'Tutor',
  description: 'Language Learning App',
  viewports: [
    {
      name: 'Mobile',
      width: 320,
      height: 568,
    },
    {
      name: 'Desktop',
      width: 1024,
      height: 768,
    },
  ],
  languages: [
    {
      name: 'English:繁體中文',
      code: 'en:zh-TW',
    },
    {
      name: 'English:简体中文',
      code: 'en:zh-CN',
    },
    {
      name: '繁體中文:English',
      code: 'zh-TW:en',
    },
    {
      name: '简体中文:English',
      code: 'zh-CN:en',
    }
  ],
  addLanguageToUrl: ({ code, url }) => {
    const [mother, learning] = code.split(':')
    return url.replace(/^\/\[mother=locale\]\/\[learning=locale\]/, `/${mother}/${learning}`)
  },
  kitbookRoute: '/[mother=locale]/[learning=locale]/kitbook',
  githubURL: 'https://github.com/jacob-8/poly-tutor',
  expandTree: true,
})
