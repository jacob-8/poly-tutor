import { DKIM_PRIVATE_KEY, MAILCHANNELS_WORKER_KEY } from '$env/static/private'

const CLOUDFLARE_EMAIL_ENDPOINT = 'https://mail.peoples.workers.dev/'

export async function send_email({ from, to, cc, reply_to, subject, body, type }: EmailParts, _fetch: typeof fetch) {
  if (!MAILCHANNELS_WORKER_KEY)
    throw new Error('MAILCHANNELS_WORKER_KEY env variable not configured')

  if (!DKIM_PRIVATE_KEY)
    throw new Error('DKIM_PRIVATE_KEY env variable not configured')

  const mail_channels_send_body: MailChannelsSendBody = {
    from,
    personalizations: [{
      to,
      cc: cc || [],
      dkim_domain: 'polylingual.dev',
      dkim_selector: 'notification',
      dkim_private_key: DKIM_PRIVATE_KEY,
    }],
    reply_to,
    subject,
    content: [{
      type,
      value: body,
    }],
  }

  const response = await _fetch(CLOUDFLARE_EMAIL_ENDPOINT, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-API-Key': MAILCHANNELS_WORKER_KEY
    },
    body: JSON.stringify(mail_channels_send_body),
  })

  // receives status 202 from MailChannels to indicate send pending
  if (!response.status.toString().startsWith('2')) {
    const body = await response.json()
    throw new Error(`MailChannels error: ${response.status} ${body.errors?.[0]}`)
  }
  return response
}

export interface EmailParts {
  from: Address;
  to: Address[]; // (1...1000)
  cc?: Address[]; // (0...1000)
  reply_to?: Address;
  subject: string;
  body: string;
  type: 'text/plain' | 'text/html';
}

interface Address {
  email: string;
  name?: string;
}

// Source: https://api.mailchannels.net/tx/v1/documentation
interface MailChannelsSendBody {
  subject: string;
  content: {
    type: 'text/plain' | 'text/html'; // The mime type of the content you are including in your email
    value: string; // The actual content of the specified mime type that you are including in the message
  }[];
  from: Address;
  personalizations: {
    to: Address[]; // (1...1000)
    from?: Address;
    reply_to?: Address;
    cc?: Address[]; // (0...1000)
    bcc?: Address[]; // (0...1000)
    subject?: string;
    dkim_domain: string; // see https://mailchannels.zendesk.com/hc/en-us/articles/7122849237389-Adding-a-DKIM-Signature
    dkim_private_key: string; // Encoded in Base64
    dkim_selector: string;
    headers?: Record<string, string>; // same as other headers
  }[]; // (0...1000)
  reply_to?: Address;
  headers?: Record<string, string>; // A JSON object containing key/value pairs of header names and the value to substitute for them. The Key/value pairs must be strings. You must ensure these are properly encoded if they contain unicode characters. Must not be one of the reserved headers (received, dkim-signature, Content-Type, Content-Transfer-Encoding, To, From, Subject, Reply-To, CC, BCC).
}
