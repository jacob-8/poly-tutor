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
  const sheet = doc.sheetsById['1831799422']

  const date = new Date()
  const formattedDate = `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`

  const stats_for_today = {
    date: formattedDate,
    total_visitors: undefined,
    new_users: undefined,
    total_users: 10,
    active_users_within_7_days: 8,
    active_users_today: 2,
    inactive_users_within_7_days: undefined,
    inactive_users_today: undefined,
    new_channels_zh: 2,
    new_channels_en: 2,
    new_playlists_zh: undefined,
    new_playlists_en: undefined,
    new_videos_zh: undefined,
    new_videos_en: undefined,
    videos_transcribed_zh: undefined,
    videos_transcribed_en: undefined,
    videos_translated_zh: undefined,
    videos_translated_en: undefined,
    videos_added_to_user_zh: undefined,
    videos_added_to_user_en: undefined,
    playlists_added_to_user_zh: undefined,
    playlists_added_to_user_en: undefined,
    videos_with_part_watched_zh: undefined,
    videos_with_part_watched_en: undefined,
    videos_completed_zh: undefined,
    videos_completed_en: undefined,
    hours_studied_zh: undefined,
    hours_studied_en: undefined,
    conversations_zh: undefined,
    conversations_en: undefined,
    avg_conversation_turns_zh: undefined,
    avg_conversation_turns_en: undefined,
    word_status_updates_zh: undefined,
    word_status_updates_en: undefined,
  } satisfies DailyStats
  const new_row = await sheet.addRow(stats_for_today)

  return json({ new_row: new_row.toObject() })
}

interface DailyStats {
  date: string;

  total_visitors: number;
  new_users: number;
  total_users: number;
  active_users_within_7_days: number;
  active_users_today: number;
  inactive_users_within_7_days: string;
  inactive_users_today: string;

  new_channels_zh: number;
  new_channels_en: number;
  new_playlists_zh: number;
  new_playlists_en: number;
  new_videos_zh: number;
  new_videos_en: number;
  videos_transcribed_zh: number;
  videos_transcribed_en: number;
  videos_translated_zh: number;
  videos_translated_en: number;
  videos_added_to_user_zh: number;
  videos_added_to_user_en: number;
  playlists_added_to_user_zh: number;
  playlists_added_to_user_en: number;
  videos_with_part_watched_zh: number;
  videos_with_part_watched_en: number;
  videos_completed_zh: number;
  videos_completed_en: number;
  hours_studied_zh: number;
  hours_studied_en: number;
  conversations_zh: number;
  conversations_en: number;
  avg_conversation_turns_zh: number;
  avg_conversation_turns_en: number;
  word_status_updates_zh: number;
  word_status_updates_en: number;
}
