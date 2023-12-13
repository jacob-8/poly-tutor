// https://kit.svelte.dev/docs/types#app
import type { BaseUser } from '$lib/supabase/user'
import type { AuthResponse } from '@supabase/supabase-js'
import type { Readable } from 'svelte/store'
import type { Supabase } from '$lib/supabase/database.types'

declare global {
	namespace App {
		interface Locals {
			getSession(): Promise<AuthResponse> | null
    }
    interface PageData {
			supabase: Supabase
			user: Readable<BaseUser>
			authResponse: AuthResponse
			t: Awaited<ReturnType<typeof import('$lib/i18n').getTranslator>>;
      mother: import('$lib/i18n/locales').LocaleCode;
      learning: import('$lib/i18n/locales').LocaleCode;
    }
		// interface Error {}
		// interface Platform {}
	}

	interface ViewTransition {
		updateCallbackDone: Promise<void>;
		ready: Promise<void>;
		finished: Promise<void>;
		skipTransition: () => void;
	}

	interface Document {
		startViewTransition(updateCallback: () => Promise<void>): ViewTransition;
	}
}

export {}
