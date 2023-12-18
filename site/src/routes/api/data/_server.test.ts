import { authenticatedLocal } from '$lib/mocks/locals'
import { request } from '$lib/mocks/sveltekit-endpoint-helper'
import { ResponseCodes } from '$lib/responseCodes'
import { GET } from './+server'

describe(GET, () => {
  test('works ', async () => {
    const response = await request(GET, { locals: authenticatedLocal })
    expect(response.status).toBe(ResponseCodes.OK)
    expect(await response.json()).toMatchInlineSnapshot(`
      {
        "data": {
          "completed": false,
          "id": 2,
          "title": "this ones mocked",
          "userId": 2,
        },
      }
    `)
  })
})
