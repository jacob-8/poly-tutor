<script lang="ts">
  import { dev } from '$app/environment'
  import { page } from '$app/stores'
</script>

<div class="w-full lg:max-w-1250px mx-auto p-2 sm:p-3">
  <h1 class="text-3xl mb-3 font-bold">Poly {$page.data.t.layout.tutor}</h1>

  <p class="sm:text-lg mb-6 sm:mb-10">
    {$page.data.t.home.tagline}
  </p>

  <div class="grid sm:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
    <a class="box group" href="/{$page.data.mother}/{$page.data.learning}/shows">
      <span class="i-logos-youtube-icon text-200% opacity-50 block mb-1" />
      <span class="text-lg font-semibold">
        YouTube
      </span>
      <span class="text-sm my-1">{$page.data.t.home.youtube_description}</span>
      <span class="text-sm font-semibold">
        {$page.data.t.home.watch_shows}
        <span class="i-material-symbols-arrow-right-alt vertical--3px transform group-hover:translate-x-1 transition-all duration-600" />
      </span>
    </a>

    {#if dev}
      <a class="box">{$page.data.t.home.read_texts}</a>
      <a class="box" href="/{$page.data.mother}/{$page.data.learning}/chat">{$page.data.t.home.chat}</a>
      <a class="box">{$page.data.t.home.read_websites}</a>
      <a class="box">{$page.data.t.home.word_lists}</a>
      <a class="box">{$page.data.t.home.realtime_transcription}</a>
      <a class="box">{$page.data.t.home.my_words}</a>
      <a class="box">{$page.data.t.home.dictionary}</a>
    {/if}
  </div>
</div>

<style>
  .box {
    --at-apply: p-6 flex flex-col mx-auto bg-gray/9 rounded-lg w-full h-full border-2 border-transparent hover:border-blue/50 cursor-pointer;
  }
</style>
