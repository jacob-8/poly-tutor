import { getTranslator } from '$lib/i18n'

export const load = (async ({ params: { mother, learning } }) => {
  const t = await getTranslator((mother))
  return { mother, learning, t }
})
