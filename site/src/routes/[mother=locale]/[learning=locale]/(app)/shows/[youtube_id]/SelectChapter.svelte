<script lang="ts">
  import { page } from '$app/stores'
  import type { YouTube } from '$lib/supabase/database.types'
  import { format_time } from '$lib/utils/format_time'

  export let handle_chapter_select: (event: Event) => void
  export let chapter_index: number
  export let youtube: YouTube
</script>

<div class="px-2 sm:px-0 mb-2">
  {#if youtube.chapters.length > 1}
    <select on:change={handle_chapter_select} class="py-1 px-2 border border-gray rounded w-full">
      {#each youtube.chapters as chapter, index}
        <option value={index} selected={chapter_index == index}>
          {#if chapter.title}
            {chapter.title}
          {:else}
            {$page.data.t.shows.chapter} {index + 1}
          {/if}

          ({format_time(chapter.start_ms / 1000)}-{format_time(chapter.end_ms / 1000)})
        </option>
      {/each}
    </select>
  {:else}
    <div class="text-xs">
      <span class="text-xs bg-gray-200 rounded px-1">
        {$page.data.t.shows.duration}
      </span>
      {format_time(youtube.duration_seconds)}
    </div>
  {/if}
</div>
