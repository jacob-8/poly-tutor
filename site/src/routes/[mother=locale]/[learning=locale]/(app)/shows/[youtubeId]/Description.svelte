<script lang="ts">
  export let description: string
</script>

{#if description}
  <div class="text-xs text-gray mb-2">
    Description:
  </div>
  <div class="text-base max-h-200px overflow-y-auto border-b border-green">
    {description}
  </div>
{/if}
