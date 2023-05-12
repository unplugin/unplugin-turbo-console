import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import {hi} from './hi.js'

const helloTS = "hello TS"
console.log(helloTS)
hi()

createApp(App).mount('#app')
