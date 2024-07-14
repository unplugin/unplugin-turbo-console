<template>
  <button @click="test">222</button>
</template>

<script setup lang="ts">
import { ServerConsole } from 'unplugin-turbo-console/helper'

  function test() {
    ServerConsole.log('xxx')
  }
</script>
