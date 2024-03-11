<script lang="ts">
// import { partytownSnippet } from '@builder.io/partytown/integration'
</script>

<svelte:head>
  <!-- <script>
      partytown = {
      forward: ['dataLayer.push']
      };
    </script>

    {@html '<script>' + partytownSnippet() + '</script>'} -->

  <!-- type="text/partytown" -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-ECHKC85GK4"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-ECHKC85GK4');
  </script>
</svelte:head>
