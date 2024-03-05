import { render_component_to_html } from '../render-component-to-html'
import NewUserWelcome from './NewUserWelcome.svelte'

test('welcome email html', () => {
  const html = render_component_to_html({
    component: NewUserWelcome,
    props: {
      dark: false,
      language: 'en',
    },
    options: {
      pretty: true,
    }
  })

  expect(html).toMatchFileSnapshot('./NewUserWelcome.html')
})
