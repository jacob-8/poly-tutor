<script lang="ts">
  export let description: string
</script>

{#if description}
  <div class="text-xs text-gray mb-2">
    Description:
  </div>
  <div class="max-h-200px overflow-y-auto border-b pb-2">
    {description}
  </div>
{/if}
