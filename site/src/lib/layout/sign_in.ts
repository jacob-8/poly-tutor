import type { AuthError, User } from '@supabase/supabase-js'
import { invalidateAll } from '$app/navigation'
import { toast } from '$lib/client/Toasts.svelte'
import type { Supabase } from '$lib/supabase/database.types'
import { post_request } from '$lib/utils/post-request'
import type { NewUserEmailRequestBody } from '$api/email/new-user/+server'
import { page } from '$app/stores'
import { get } from 'svelte/store'
import type { LanguageCode } from '$lib/i18n/locales'

const TEN_SECONDS = 10000
const FOUR_SECONDS = 4000

export async function handle_sign_in_response({user, error, supabase}: { user?: User, error?: AuthError, supabase: Supabase }) {
  console.info({ user, error })

  if (error)
    return toast(error.message, TEN_SECONDS)

  toast(`Signed in with ${user.email}`, FOUR_SECONDS)
  invalidateAll()

  const { data, error: check_for_email_status_error } = await supabase.from('profiles').select('welcome_email_sent').eq('id', user.id)
  if (check_for_email_status_error)
    return console.error({ check_for_email_status_error })
  if (data?.[0]?.welcome_email_sent)
    return

  const $page = get(page)
  const language = $page.data.mother
  const { error: sending_welcome_error } = await post_request<NewUserEmailRequestBody, null>('/api/email/new-user', { language: language.split('-')[0] as LanguageCode })
  if (sending_welcome_error)
    console.error({sending_welcome_error})
}

