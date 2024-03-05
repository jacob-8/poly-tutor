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
      code: 'en_zh-TW',
    },
    {
      name: 'English:简体中文',
      code: 'en_zh-CN',
    },
    {
      name: '繁體中文:English',
      code: 'zh-TW_en',
    },
    {
      name: '简体中文:English',
      code: 'zh-CN_en',
    }
  ],
  addLanguageToUrl: ({ code, url }) => {
    const [mother, learning] = code.split('_')
    return url.replace(/^.[^/]+.[^/]+/, `/${mother}/${learning}`)
  }, // replaces "/mother/learning" - using a period for any character to avoid parsing issues with slashes
  kitbookRoute: '/[mother=locale]/[learning=locale]/kitbook',
  githubURL: 'https://github.com/jacob-8/poly-tutor',
  expandTree: true,
  // darkMode: true,
})
