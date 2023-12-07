export function setCookie(name: string, value: string, options: CookieOptions = {}) {
  document.cookie = formatCookie(name, value, options)
}

interface CookieOptions {
  domain?: string;
  expires?: string | Date;
  httpOnly?: boolean;
  maxAge?: number;
  path?: string;
  sameSite?: 'strict' | 'lax' | 'none';
  secure?: boolean;
}

function formatCookie(name: string, value: string, options: CookieOptions = {}) {
  if (options.expires instanceof Date)
    options.expires = options.expires.toUTCString()

  const updatedCookie = {
    [encodeURIComponent(name)]: encodeURIComponent(value),
    sameSite: 'strict',
    ...options,
  }

  console.info('updated cookie: ', { [name]: updatedCookie })

  const cookie = Object.entries(updatedCookie)
    .filter(([key]) => key !== 'secure')
    .map((kv) => kv.join('='))
    .join(';')

  return options.secure === false ? cookie : `${cookie};secure`
}

if (import.meta.vitest) {
  describe(setCookie, () => {
    test('basic, secure by default', () => {
      const cookie = formatCookie('my-cookie', '123')
      expect(cookie).toEqual('my-cookie=123;sameSite=strict;secure')
    })

    test('handles options', () => {
      const cookie = formatCookie('my-cookie', '123', { maxAge: 1234, path: '/', sameSite: 'lax' })
      expect(cookie).toEqual('my-cookie=123;sameSite=lax;maxAge=1234;path=/;secure')
    })

    test('secure false', () => {
      const cookie = formatCookie('my-cookie', '123', { secure: false})
      expect(cookie).toEqual('my-cookie=123;sameSite=strict')
    })

    test('clear cookie', () => {
      const cookie = formatCookie('my-cookie', '', { expires: new Date(0) })
      expect(cookie).toEqual('my-cookie=;sameSite=strict;expires=Thu, 01 Jan 1970 00:00:00 GMT;secure')
    })
  })
}
