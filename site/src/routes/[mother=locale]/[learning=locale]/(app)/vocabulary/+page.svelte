<script lang="ts">
  import type { PageData } from './$types'

  export let data: PageData
  $: ({user_vocabulary} = data)
</script>

Count: {Object.keys($user_vocabulary).length}
<hr>
<pre>{JSON.stringify($user_vocabulary, null, 2)}</pre>
