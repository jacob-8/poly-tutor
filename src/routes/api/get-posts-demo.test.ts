import { afterAll, afterEach, beforeAll } from 'vitest'
import { server } from '$lib/mocks/server'

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
afterEach(() => server.resetHandlers())

async function getPosts() {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts')
  const posts = await response.json()
  return posts
}

describe(getPosts, () => {
  test('mock posts', async () => {
    // const returnedPosts = await getPosts()
    // expect(returnedPosts).toEqual(posts)
    // expect(returnedPosts).toMatchInlineSnapshot(`
    //   [
    //     {
    //       "body": "first post body",
    //       "id": 1,
    //       "title": "first post title",
    //       "userId": 1,
    //     },
    //   ]
    // `)
  })
})

// pnpm -F tutor test get-posts
