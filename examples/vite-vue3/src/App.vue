<template>
  <button @click="test">222</button>
</template>

<script setup lang="ts">
import { server } from 'unplugin-turbo-console/helper'

  function test() {
    server.log('xxx')
  }
</script>
