<script setup lang="ts">
import PKG from '../../../package.json'
</script>

<template>
  <footer class="p-8 flex justify-between items-center">
    <UButton
      to="https://github.com/unplugin/unplugin-turbo-console"
      target="_blank"
      icon="i-uil-github"
      color="neutral"
      variant="link"
      label="Source Code"
    />

    <div class="text-muted">Version: {{ PKG.version }}</div>
  </footer>
</template>
