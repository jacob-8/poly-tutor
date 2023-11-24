// https://kit.svelte.dev/docs/types#app
import type { BaseUser } from '$lib/supabase/user'
import type { AuthResponse, SupabaseClient } from '@supabase/supabase-js'
import type { Readable } from 'svelte/store'
// import { Database } from './DatabaseDefinitions'

declare global {
	namespace App {
		interface Locals {
			supabase: SupabaseClient
			getSession(): Promise<AuthResponse> | null
    }
    interface PageData {
			supabase: SupabaseClient // SupabaseClient<Database> // https://supabase.com/docs/guides/auth/auth-helpers/sveltekit#generate-types-from-your-database
			user: Readable<BaseUser>
			authResponse: AuthResponse
			t: Awaited<ReturnType<typeof import('$lib/i18n').getTranslator>>;
      locale: import('$lib/i18n/locales').LocaleCode;
    }
		// interface Error {}
		// interface Platform {}
	}
}

export {}
