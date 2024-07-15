<template>
  <button @click="test">222</button>
</template>

<script setup lang="ts">
import { Server } from 'unplugin-turbo-console/helper'

  function test() {
    Server.log('xxx')
  }
</script>
