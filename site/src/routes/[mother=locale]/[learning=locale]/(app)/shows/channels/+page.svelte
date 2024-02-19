<script lang="ts">
  export let data
</script>

<div class="p-2">
  <div class="text-3xl">My Channels</div>

  {#if data?.channels}
    {#each data.channels as channel}
      <a href="./channels/{channel.id}" class="flex my-2 p-2 bg-gray-100 rounded hover:bg-gray-200">
        <img src="{channel.thumbnail_url}=s200-c-k-c0x00ffffff-no-rj" />
        <div class="font-semibold ml-2 text-xl">
          {channel.title}<br />
          {channel.description || ''}
        </div>
      </a>
    {/each}
  {/if}
</div>
