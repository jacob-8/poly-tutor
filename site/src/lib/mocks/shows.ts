import type { Channel, YouTube } from '$lib/supabase/database.types'

export const natureShow: YouTube & { channel: Partial<Channel>} = {
  id: '-CTlz5PJRZs',
  title: '4K Nature Treasures of Hawaii Botanical Garden - Jungle Forest Cinematic Virtual Walk (Slow Motion)',
  description: 'hello',
  duration_seconds: 122.521 * 60,
  channel_id: 'RelaxationChannel',
  created_at: new Date().toISOString(),
  language: 'en',
  channel: {
    id: 'UC8butISFwT-Wl7EV0hUK0BQ',
    title: 'freeCodeCamp.org',
    // description: 'hello',
    thumbnail_id: 'APkrFKav44IZWeQMQttWjk2AsDi8oLkP1Mnf6zgIVu8s',
  }
}
