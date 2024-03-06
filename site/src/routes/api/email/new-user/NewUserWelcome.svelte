<script lang="ts">
  import type { LanguageCode } from '$lib/i18n/locales'
  import Row from '../components/Row.svelte'
  import Header from '../components/Header.svelte'
  import Title from '../components/Title.svelte'
  // import Image from '../components/Image.svelte'
  import Shell from '../components/Shell.svelte'
  import Paragraph from '../components/Paragraph.svelte'
  import Link from '../components/Link.svelte'
  import CallToActionButton from '../components/CallToActionButton.svelte'
  import Footer from '../components/Footer.svelte'

  export let dark = false
  export let language: LanguageCode
  export let preview = 'You\'re going to love language Learning with your personal tutor.'

  $: title = `Welcome to Poly Tutor!`
  const home_url = 'https://tutor.polylingual.dev'
</script>

<Shell {language} {dark} {preview} {title}>
  <Row backgroundColor="#546e7a" space={12}>
    <Header brand="Poly Tutor" href={home_url} />
  </Row>
  <Row top={35}>
    <Title text={title} />
  </Row>
  <!-- <Row>
    <Image href={home_url} src="http://fakeimg.pl/1000x600/" alt="Welcome to Poly Tutor!" />
  </Row> -->
  <Row top={20}>
    <Paragraph>
      Thank you for creating a new account. With Poly Tutor your email is your password. You can study anytime at
      <Link color="#546e7a" href={home_url}>tutor.polylingual.dev</Link>.
    </Paragraph>
  </Row>
  <!-- <Row space={5}>
    <Paragraph>
      Paragraph text goes here. You can also place a
      <Link color="#546e7a" href="/">link</Link>.
    </Paragraph>
  </Row> -->
  <Row space={30}>
    <CallToActionButton href={home_url} backgroundColor="#546e7a">Start Studying!</CallToActionButton>
  </Row>
  <!-- <Row bottom={20}>
    <td align="center"
      style="font-size: 14px; line-height: 18px; font-family: Helvetica, Arial, sans-serif; color: #aaaaaa; font-style: italic; text-align: center;">
      This is just a test email while I'm designing things.
    </td>
  </Row> -->
  <Row backgroundColor="#dddddd" space={20}>
    <Footer brand="Poly Tutor" href={home_url} address="6222 Exodus St SE, Salem, OR 97317, USA" reason_for_email="You're receiving this email because you signed up for a new account." />
    <!-- unsubscribe_url="{home_url}/account" -->
  </Row>
</Shell>
