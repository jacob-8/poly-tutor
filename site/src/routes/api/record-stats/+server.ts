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

  const POLY_TUTOR_STATS_SHEET_ID = '1PKg7UiccnCxI-10tSsVevinHzPR666UWvLS-cHmkie8'
  const doc = new GoogleSpreadsheet(POLY_TUTOR_STATS_SHEET_ID, serviceAccountAuth)
  await doc.loadInfo()
  const sheet = doc.sheetsById['1831799422'] // doc.sheetsByIndex[0]

  const date = new Date()
  const formattedDate = `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`

  const stats_for_today = {
    date: formattedDate,
    new_channels: 2,
    new_playlists: undefined,
    new_videos: undefined,
    videos_transcribed: undefined,
    videos_translated: undefined,
    total_visitors: undefined,
    new_users: undefined,
    total_users: undefined,
    active_users_within_7_days: undefined,
    active_users_today: undefined,
    inactive_users_within_7_days: undefined,
    inactive_users_today: undefined,
    videos_added_to_user: undefined,
    playlists_added_to_user: undefined,
    videos_with_part_watched: undefined,
    videos_completed: undefined,
    hours_studied: undefined,
    conversations: undefined,
    avg_conversation_turns: undefined,
    word_status_updates: undefined,
  } satisfies DailyStats
  const new_row = await sheet.addRow(stats_for_today)

  return json({ new_row: new_row.toObject() })
}

interface DailyStats {
  date: string;
  new_channels: number;
  new_playlists: number;
  new_videos: number;
  videos_transcribed: number;
  videos_translated: number;
  total_visitors: number;
  new_users: number;
  total_users: number;
  active_users_within_7_days: number;
  active_users_today: number;
  inactive_users_within_7_days: number;
  inactive_users_today: number;
  videos_added_to_user: number;
  playlists_added_to_user: number;
  videos_with_part_watched: number;
  videos_completed: number;
  hours_studied: number;
  conversations: number;
  avg_conversation_turns: number;
  word_status_updates: number;
}
