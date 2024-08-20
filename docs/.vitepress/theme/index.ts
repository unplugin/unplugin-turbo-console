import Theme from 'vitepress/theme'
import './style.css'
import 'uno.css'
import TwoslashFloatingVue from '@shikijs/vitepress-twoslash/client'
import '@shikijs/vitepress-twoslash/style.css'
import type { EnhanceAppContext } from 'vitepress'
import Layout from './Layout.vue'
import 'virtual:group-icons.css'

export default {
  ...Theme,
  Layout,
  enhanceApp({ app }: EnhanceAppContext) {
    app.use(TwoslashFloatingVue)
  },
}
