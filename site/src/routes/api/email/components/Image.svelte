<script lang="ts">
  // @ts-nocheck
  export let href: string
  export let src: string
  export let alt: string
</script>

<td align="center" valign="middle">
  <a target="_blank" {href}>
    <img {src} {alt} width="500" style="display: block; color: #666666; font-family: Helvetica, arial, sans-serif; font-size: 16px; width: 500px; height: auto;"  border="0" />
  </a>
</td>

<style>
  @media screen and (max-width: 525px) {
    img {
      max-width: 100% !important;
        width: 100% !important;
        height: auto !important;
    }
  }
</style>
