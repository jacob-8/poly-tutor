<script lang="ts">
  import Link from './Link.svelte'

  export let brand: string
  export let href: string
  export let address: string
  export let unsubscribe_url: string = undefined
  export let reason_for_email: string = undefined
</script>

<td>
  <table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center" style="font-family: Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
        <a style="font-weight:bold; color:#555555; text-decoration:none" target="_blank"
          {href}>
          {brand}
        </a>
      </td>
    </tr>
    <tr>
      <td align="center" style="font-family: Helvetica, arial, sans-serif; font-size: 13px; line-height: 21px; color: #889098;">
        {address}
      </td>
    </tr>
    <tr>
      <td width="100%" height="14"></td>
    </tr>
    <tr>
      <td align="center" style="font-family: Helvetica, arial, sans-serif; font-size: 13px; line-height: 21px; color: #555555">
        {#if reason_for_email}
          {reason_for_email}
        {/if}
        {#if unsubscribe_url}
          <Link color="#555555" href={unsubscribe_url}>Unsubscribe</Link>
        {/if}
      </td>
    </tr>
  </table>
</td>
