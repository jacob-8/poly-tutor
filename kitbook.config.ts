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
      name: 'English',
      code: 'en',
    },
    {
      name: '繁體中文',
      code: 'zh-TW',
    },
    {
      name: '简体中文',
      code: 'zh-CN',
    }
  ],
  addLanguageToUrl: ({ code, url }) => url.replace(/^.[^/]+/, `/${code}`),
  kitbookRoute: '/[locale=locale]/kitbook',
  githubURL: 'https://github.com/jacob-8/poly-tutor',
  expandTree: true,
})
