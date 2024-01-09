<script lang="ts">
  let width
</script>

<svelte:window bind:innerWidth={width} />

{#if width}
  <slot {width} />
{/if}
