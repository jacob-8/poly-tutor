import { ResponseCodes } from '$lib/responseCodes'

type Return<ExpectedResponse> = {
  data: ExpectedResponse,
  error: null
} | {
  data: null,
  error: { status: number, message: string }
}

export async function post_request<T extends Record<string, any>, ExpectedResponse extends Record<string, any>>(route: string, data: T, _fetch = fetch): Promise<Return<ExpectedResponse>> {
  const response = await _fetch(route, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'content-type': 'application/json',
    },
  })

  return handleResponse<ExpectedResponse>(response)
}

export async function get_request<ExpectedResponse extends Record<string, any>>(route: string, _fetch = fetch): Promise<Return<ExpectedResponse>> {
  const response = await _fetch(route)
  return handleResponse<ExpectedResponse>(response)
}

async function handleResponse<ExpectedResponse extends Record<string, any>>(response: Response): Promise<Return<ExpectedResponse>> {
  const { status } = response
  if (status !== ResponseCodes.OK) {
    const responseClone = response.clone()
    try {
      try {
        const body = await response.json()
        const error = { status, message: body.message || JSON.stringify(body) }
        return { data: null, error }
      } catch {
        const textBody = await responseClone.text()
        return { data: null, error: { status, message: textBody } }
      }
    } catch (err) {
      return { data: null, error: { status, message: err.message } }
    }
  }

  const body = await response.json() as ExpectedResponse
  return { data: body, error: null }
}
