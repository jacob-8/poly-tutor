import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { ResponseCodes } from '$lib/response-codes'
import { GOOGLE_SHEETS_CREDENTIALS, RECORD_STATS_KEY } from '$env/static/private'
import { GoogleSpreadsheet } from 'google-spreadsheet'
import { JWT } from 'google-auth-library'

export interface RecordStatsRequestBody {
  key: string
}

export const POST: RequestHandler = async ( { request }) => {
  const { key } = await request.json() as RecordStatsRequestBody
  if (!key) error(ResponseCodes.BAD_REQUEST, 'No key found in request body')
  if (key !== RECORD_STATS_KEY) error(ResponseCodes.UNAUTHORIZED, 'Invalid key')

  const CREDENTIALS = JSON.parse(GOOGLE_SHEETS_CREDENTIALS)

  // https://theoephraim.github.io/node-google-spreadsheet/#/guides/authentication
  const serviceAccountAuth = new JWT({
    email: CREDENTIALS.client_email,
    key: CREDENTIALS.private_key,
    scopes: [ 'https://www.googleapis.com/auth/spreadsheets' ],
  })

  const doc = new GoogleSpreadsheet('1PKg7UiccnCxI-10tSsVevinHzPR666UWvLS-cHmkie8', serviceAccountAuth)

  await doc.loadInfo() // loads document properties and worksheets
  // console.log(doc.title)
  // await doc.updateProperties({ title: 'renamed doc' });

  // const sheet = doc.sheetsByIndex[0] // or use `doc.sheetsById[id]` or `doc.sheetsByTitle[title]`

  // adding / removing sheets
  // const newSheet = await doc.addSheet({ title: 'another sheet' });
  // await newSheet.delete();


  return json({ title: doc.title })
}

