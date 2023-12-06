<script lang="ts">
  import { page } from '$app/stores'
</script>

<div class="p-2">
  <a href="/{$page.data.mother}/{$page.data.learning}/chat">{$page.data.t.home.chat}</a>
  <a href="/{$page.data.mother}/{$page.data.learning}/shows">{$page.data.t.home.watch}</a>
</div>
