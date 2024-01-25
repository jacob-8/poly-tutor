<script lang="ts">
  import { current_voice, get_voices, set_preferred_voice } from '$lib/utils/speak'

  function handle_voice_change(event) {
    set_preferred_voice(event.target.value)
  }
</script>

{#if $current_voice}
  <div class="flex flex-col sm:flex-row sm:items-center mb-3">
    <div class="mr-1 text-nowrap">
      Translation voice:
    </div>
    <select on:change={handle_voice_change} class="py-1 px-2 border border-gray rounded w-full">
      {#each get_voices() as voice}
        <option value={voice.name} selected={voice.name === $current_voice.name}>{voice.name} ({voice.lang})</option>
      {/each}
    </select>
  </div>
{/if}
