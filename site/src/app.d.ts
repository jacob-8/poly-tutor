// https://kit.svelte.dev/docs/types#app
import type { BaseUser } from '$lib/supabase/user'
import type { AuthResponse } from '@supabase/supabase-js'
import type { Readable } from 'svelte/store'
import type { Supabase } from '$lib/supabase/database.types'

declare global {
	namespace App {
		interface Locals {
			getSession(): Promise<AuthResponse & { supabase: Supabase}> | null
    }
    interface PageData {
			// root +layout.ts
      mother: import('$lib/i18n/locales').LocaleCode;
      learning: import('$lib/i18n/locales').LocaleCode;
			t: Awaited<ReturnType<typeof import('$lib/i18n').getTranslator>>;
			// /[mother=locale]/[learning=locale]/(app)/+layout.ts
			supabase: Supabase
			authResponse: AuthResponse
			user: Readable<BaseUser>
			user_vocabulary: ReturnType<typeof import('$lib/vocab/vocabulary').createVocabStore>
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

	interface Window {
		handleSignInWithGoogle: (response) => Promise<void>;
	}
}

export {}
