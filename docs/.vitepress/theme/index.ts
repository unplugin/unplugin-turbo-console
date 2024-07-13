import Theme from 'vitepress/theme'
// eslint-disable-next-line ts/ban-ts-comment, ts/prefer-ts-expect-error
// @ts-ignore
import Layout from './Layout.vue'
import './style.css'
import 'uno.css'

export default {
  ...Theme,
  Layout,
}
