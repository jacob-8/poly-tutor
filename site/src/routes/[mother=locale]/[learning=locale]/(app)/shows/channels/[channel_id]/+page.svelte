<script lang="ts">
  import ShowThumbnail from '../../ShowThumbnail.svelte'

  export let data
</script>

<div class="sm:px-3 pb-3 mb-3 border-b">
  <h2 class="my-3 font-semibold text-xl">
    Channel Videos
  </h2>
  <div class="grid sm:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
    {#each data.channel_youtubes as youtube}
      <ShowThumbnail youtube={youtube} channel={youtube.channel} href_prefix=".." />
    {/each}
  </div>
</div>
