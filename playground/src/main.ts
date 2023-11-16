import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'



console.log()


const foo = 'foo'
const bar = 'bar'
console.log(`
${foo},
${bar}
`);

    console.log({foo,bar})

console.log({
  foo,
  bar: {
    foo,bar
  }
})

createApp(App).mount('#app')
