<script setup lang="ts">
import PKG from '../../../package.json'
</script>

<template>
  <footer class="p-8 flex justify-between items-center">
    <a href="https://github.com/unplugin/unplugin-turbo-console" target="_blank" class="flex items-center gap-1 text-gray-400 hover:text-gray-500 transition-colors">
      <Icon name="uil:github" class="text-2xl" />
      Source Code
    </a>

    <div class="text-gray-400">
      Version: {{ PKG.version }}
    </div>
  </footer>
</template>
