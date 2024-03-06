# Use MailChannels and a Cloudflare Worker to Send Emails for Free

## Cloudflare Worker

Source: https://mailchannels.zendesk.com/hc/en-us/articles/4565898358413-Sending-Email-from-Cloudflare-Workers-using-MailChannels-Send-API

Place the following into a Cloudflare Worker:

```js
// Learn about status codes: https://restfulapi.net/http-status-codes/#4xx

const AUTH_HEADER_KEY = "x-api-key";
const AUTH_HEADER_VALUE = "CHANGE_TO_API_KEY"; // 👈 Use your own made up key to keep strangers from using your worker

async function handleRequest(request) {
  if (request.method.toUpperCase() !== "POST")
    return new Response("Error: Must be a POST request", { status: 405 });

  const apiKey = request.headers.get(AUTH_HEADER_KEY);
  if (apiKey !== AUTH_HEADER_VALUE)
    return new Response("Invalid API key", { status: 403 });

  if (request.headers.get("Content-Type") !== "application/json")
    return new Response("'Content-Type' must be 'application/json'", {
      status: 406,
    });

  const requestBody = await request.json();
  const api_url = "https://api.mailchannels.net/tx/v1/send"
  // const api_url_dry_run = "https://api.mailchannels.net/tx/v1/send?dry-run=true" // see https://api.mailchannels.net/tx/v1/documentation
  const send_request = new Request(api_url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  const response = await fetch(send_request);

  // Uncomment to log the response from MailChannels
  // const responseText = await response.clone().text();
  // console.log({ responseText, response: JSON.stringify(response) })

  return response;
}

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});
```

## Server Endpoint

Add to your environment variables:
- the API key for the Cloudflare Worker you just made up and included above-
- a private key for DKIM signing which you will create further on. 

Do this by adding blank keys to your committed `.env` file:

```
MAILCHANNELS_WORKER_KEY=
DKIM_PRIVATE_KEY=
```

Then add those same keys to an uncommitted `.env.local` file with the actual values for local testing. You will also need to add these to the environment variables wherever you deploy your app.

Create `send-email.ts` file, making sure to update the `CLOUDFLARE_EMAIL_ENDPOINT` with your own:

```ts
import { DKIM_PRIVATE_KEY, MAILCHANNELS_WORKER_KEY } from '$env/static/private'

const CLOUDFLARE_EMAIL_ENDPOINT = 'https://mail.peoples.workers.dev/' // 👈 Use your own worker endpoint

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
```

If you don't have an actual email inbox under your domain, you can do one of two things: 
- In `Cloudflare > Website > Email > Email Routing > Routing Rules`, you can setup the email address that you send from to forward to your actual email.
- You can use a `no-reply` address in the from field and then use an actual email in the `reply_to` field. Here's an example of a `no-reply` address:

```ts
const no_reply_address: Address = {
  email: 'no-reply@polylingual.dev',
  name: 'Polylingual Dev',
}
```

Now we can use our `send_email` function in a server endpoint (this is SvelteKit style, but you can adjust for your own framework):

```ts
import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { send_email } from './send-email'

export interface NewUserEmailRequestBody {
    email: string
    name: string
}

export const POST: RequestHandler = async ({request, fetch}) => {
  
  // 👈 Add an auth check here based on your authentication setup to keep just anyone from being able to use this endpoint.

  try {
    const { email, name } = await request.json() as NewUserEmailRequestBody

    await send_email({
      from: { email: 'jacob@polylingual.dev', name: 'Jacob' },
      to: [{email, name}],
      subject: 'Welcome to Poly Tutor!',
      body: `Hi ${name},\n\nWelcome to Poly Tutor!`,
      type: 'text/plain',
    }, fetch)

    return json('success')
  } catch (err) {
    console.error(`Error with email send request: ${err.message}`)
    error(500, `Error with email send request: ${err.message}`)
  }
}
```

## Set up DNS Records for MailChannels verification and DKIM signing

Sources: https://mailchannels.zendesk.com/hc/en-us/articles/7122849237389-Adding-a-DKIM-Signature and https://support.mailchannels.com/hc/en-us/articles/16918954360845-Secure-your-domain-name-against-spoofing-with-Domain-Lockdown

- Under `Cloudflare > Website > yours.com > Email > Email Routing > Settings` ensure that your domain is setup for email. If you already have this setup you'll have three `MX` records and one `TXT` record related to email sending.
- In the DNS Records page, edit the `TXT` record at `polylingual.dev` from `v=spf1 include:_spf.mx.cloudflare.net ~all` to `v=spf1 a mx include:relay.mailchannels.net include:_spf.mx.cloudflare.net ~all`

- Add a `_mailchannels` `TXT` record to let mailchannels know the worker domain that emails are coming from: `v=mc1 cfid=yourworkersubdomain.workers.dev`

- Create a private key by running in bash: `openssl genrsa 2048 | tee priv_key.pem | openssl rsa -outform der | openssl base64 -A > priv_key.txt`
- Take the value from `priv_key.txt` and add it to your website environment variables that will be used server-side only in the `personalizations > dkim_private_key` field

- Create a public key from your private key by running `echo -n "v=DKIM1;p=" > pub_key_record.txt && openssl rsa -in priv_key.pem -pubout -outform der | openssl base64 -A >> pub_key_record.txt`
- Take the output of `pub_key_record.txt` and add it to your DNS records as a `TXT` entry under `notification._domainkey`. It will look like this: `v=DKIM1; p=<your DKIM public key>`. The use of `notification` is arbitrary here but it must match the `dkim_selector` field in the `send_email` function.

- Then go to `Cloudflare > Website > yours.com > Email > DMARC Management` and click `Enable DMARC Management` to automatically add a `_dmarc` TXT record to keep other people from being able to spoof your domain in emails. It will look something like this: `v=DMARC1;  p=none; rua=mailto:1212-long-string@dmarc-reports.cloudflare.net`. That's a good place to start. Read https://dmarc.org/overview/ to learn more about making your policy more restrictive. Right now I update the `p=none;` to `p=quarantine; sp=reject; adkim=r; aspf=r;`. Here's a short overview of what this means:
  - `p=quarantine;` - `p` is the policy for the domain. This tells email servers to quarantine emails that fail the DMARC check. This means that the email may be sent with a warning or be put in the spam folder.
  - `sp=reject;` - `sp` is the policy for subdomains. This tells email servers to reject emails that fail the DMARC check which come from subdomains of my main domain.
  - `adkim=r;` - This tells email servers to use relaxed alignment for DKIM, meaning the DKIM signature can be in the header or the body of the email.
  - `aspf=r;` - This tells email servers to use relaxed alignment for SPF, meaning the SPF signature can be in the header or the body of the email.

As mentioned in https://dmarc.org/overview/, I will work towards marking `p` as `reject`.

Now go try out sending an email!