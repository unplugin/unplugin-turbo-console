<script setup>
import { initWebSocket } from '~console'

if (import.meta.client)
  initWebSocket()


console.log('test222')
</script>

<template>
  <div>
    <NuxtWelcome />
  </div>
</template>
