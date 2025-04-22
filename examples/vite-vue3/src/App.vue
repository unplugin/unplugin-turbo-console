<script setup>
import { logJs } from './jsLog.js'
import { logTs } from './tsLog'
import { server } from 'unplugin-turbo-console/helper'

function logVue() {
  console.log('xxxx234324xxxx123')

  console.info('asdasd')
}

function serverLog() {
  server.log('from vue23213')
}
</script>

<template>
  <h1>Unplugin Turbo Console Playground(Vite + Vue3)</h1>

  <h2>
    Highlight Output
  </h2>
  <div style="display: flex; gap: 10px;">
    <button @click="logVue">logVue</button>

    <button @click="logJs">logJs</button>

    <button @click="logTs">logTs</button>
  </div>

  <h2>
    Pass Logs
  </h2>

  <div style="display: flex; gap: 10px;">
    <button @click="serverLog">Client -> Server</button>
  </div>
</template>

<style scoped>
button {
  padding: 10px;
}
</style>
