<script setup lang="ts">
import '~console'
import { ServerConsole } from 'unplugin-turbo-console/helper'
import { ref } from 'vue'

const count = ref(0)

function increment() {
  count.value++
  ServerConsole.log(count.value)
}
</script>

<template>
  <div>
    {{ count }}
  </div>
  <button @click="increment">
    +
  </button>
</template>
