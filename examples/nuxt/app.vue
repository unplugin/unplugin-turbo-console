<script setup lang="ts">
import '~console'
import { ServerConsole,ClientConsole } from 'unplugin-turbo-console/helper'

if (import.meta.server)
  ClientConsole.log('From Server')

if (import.meta.client)
  ServerConsole.log('From Clien22t')

</script>

<template>
  <div>
    <NuxtWelcome />
  </div>
</template>
