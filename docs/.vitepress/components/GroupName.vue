<script setup lang="ts">
defineProps<{
  name: string
  icon: string
}>()
</script>

<template>
  <span class="inline-block">
    <i class="w-4 h-4 mr-1" :class="icon" />
    <span>{{ name }}</span>
  </span>
</template>
