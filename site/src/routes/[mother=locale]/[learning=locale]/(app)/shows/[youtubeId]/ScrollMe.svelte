<script lang="ts">
  import ShowLayout from './ShowLayout.svelte'
</script>

<ShowLayout>
  <div class="bg-red/50 max-w-100% overflow-hidden h-0 pb-56.25% relative" slot="player">Player</div>
  <div class="bg-purple p-2" slot="sentences">
    {#each Array(2).fill('') as _}
      <div>sentences</div>
    {/each}
  </div>
  <div class="bg-blue p-2" slot="study">
    {#each Array(70).fill('') as _}
      <div>study</div>
    {/each}
  </div>
  <div class="bg-yellow p-2" slot="chat">
    {#each Array(50).fill('') as _}
      <div>chat</div>
    {/each}
  </div>
</ShowLayout>
