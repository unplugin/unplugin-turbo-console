import Theme from 'vitepress/theme'
import './style.css'
import 'uno.css'
import TwoslashFloatingVue from '@shikijs/vitepress-twoslash/client'
import '@shikijs/vitepress-twoslash/style.css'
import type { EnhanceAppContext } from 'vitepress'
import { GroupIconComponent } from 'vitepress-plugin-group-icons/client'
import rspack from '../assets/icons/rspack.svg?raw'
import farm from '../assets/icons/farm.svg?raw'
import Layout from './Layout.vue'

export default {
  ...Theme,
  Layout,
  enhanceApp({ app }: EnhanceAppContext) {
    app.use(TwoslashFloatingVue)
    app.use(GroupIconComponent, {
      rspack,
      farm,
    })
  },
}
