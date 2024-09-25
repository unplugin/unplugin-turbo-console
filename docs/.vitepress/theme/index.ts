import type { EnhanceAppContext } from 'vitepress'
import TwoslashFloatingVue from '@shikijs/vitepress-twoslash/client'
import Theme from 'vitepress/theme'
import Layout from './Layout.vue'
import './style.css'
import 'uno.css'
import '@shikijs/vitepress-twoslash/style.css'
import 'virtual:group-icons.css'

export default {
  ...Theme,
  Layout,
  enhanceApp({ app }: EnhanceAppContext) {
    app.use(TwoslashFloatingVue)
  },
}
