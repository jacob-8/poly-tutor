<script lang="ts">
  import { page } from '$app/stores'

  export let description: string
</script>

{#if description}
  <div class="text-xs text-gray my-2">
    {$page.data.t.shows.description}:
  </div>
  <div class="max-h-200px overflow-y-auto border-b pb-2">
    {description}
  </div>
{/if}
