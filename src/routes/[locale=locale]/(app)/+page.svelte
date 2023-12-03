<script lang="ts">
  import { page } from '$app/stores'
</script>

<div class="p-2">
  <a href="/{$page.data.locale}/chat">{$page.data.t.home.chat}</a>
  <a href="/{$page.data.locale}/shows">{$page.data.t.home.watch}</a>
</div>
