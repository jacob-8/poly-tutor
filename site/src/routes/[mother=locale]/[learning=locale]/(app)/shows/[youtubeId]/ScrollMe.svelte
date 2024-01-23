<script lang="ts">
  import ShowLayout from './ShowLayout.svelte'

  function scrollRight(node: HTMLElement) {
    node.scrollLeft = node.scrollWidth - node.clientWidth
  }
</script>

<ShowLayout>
  <div class="bg-green/10 h-full p-2 flex items-center" slot="header">
    <div class="p-2"><span class="i-iconamoon-arrow-left-1" /></div>
    <div class="flex items-center overflow-x-auto grow-1" use:scrollRight>
      <div class="p-2 font-semibold text-nowrap">Title that's a bit more verbose and actually kind of crazy long</div>
      <div class="mr-auto" />
      <div class="py-2 px-3"><span class="i-ic-baseline-manage-search text-xl" /></div>
      <div class="py-2 px-3"><span class="i-ic-baseline-manage-search text-xl" /></div>
      <div class="py-2 px-3"><span class="i-ic-baseline-manage-search text-xl" /></div>
      <div class="py-2 px-3"><span class="i-ic-baseline-loop text-xl" /></div>
      <div class="py-2 px-3"><span class="i-carbon-play-filled-alt text-xl" /></div>
      <div class="py-2 px-3">J</div>
    </div>
  </div>

  <div class="bg-red/50 max-w-100% overflow-hidden h-0 pb-56.25% relative" slot="player">Player</div>

  <div class="bg-purple p-2" slot="sentences">
    {#each Array(200).fill('') as _}
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
