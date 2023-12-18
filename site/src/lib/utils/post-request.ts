import { ResponseCodes } from '$lib/responseCodes'

export async function post_request<T extends Record<string, any>, ExpectedResponse extends Record<string, any>>(route: string, data: T, _fetch = fetch): Promise<{
  data: ExpectedResponse,
  error: null
} | {
  data: null,
  error: { status: number, message: string }
}> {
  console.info({ data })

  const response = await _fetch(route, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'content-type': 'application/json',
    },
  })
  const body = await response.json() as ExpectedResponse

  if (response.status !== ResponseCodes.OK)
    return { data: null, error: { status: response.status, message: body.message } }

  return { data: body, error: null }
}

export async function get_request<ExpectedResponse extends Record<string, any>>(route: string, _fetch = fetch): Promise<{
  data: ExpectedResponse,
  error: null
} | {
  data: null,
  error: { status: number, message: string }
}> {
  const response = await _fetch(route)

  if (response.status !== ResponseCodes.OK) {
    try {
      const body = await response.json()
      return { data: null, error: { status: response.status, message: body.message } }
    } catch (err) {
      return { data: null, error: { status: response.status, message: err.message } }
    }
  }

  const body = await response.json() as ExpectedResponse
  return { data: body, error: null }
}

// export function apiFetch<T extends Record<string, any>>(route: string, data: T, _fetch = fetch) {
//   return _fetch(route, {
//     method: 'POST',
//     body: JSON.stringify(data),
//     headers: {
//       'content-type': 'application/json',
//     },
//   })
// }
