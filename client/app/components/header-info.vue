<script setup lang="ts">
const colorMode = useColorMode()

function toggleDark() {
  colorMode.value = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <div class="flex items-center gap-2">
    <Icon
      :name="colorMode.value === 'dark' ? 'ph:moon-stars-duotone' : 'ph:sun-duotone'"
      class="opacity-50 text-xl cursor-pointer hover:opacity-70"
      @click="toggleDark()"
    />

    <Icon
      name="carbon:logo-github"
      class="opacity-50 text-xl cursor-pointer hover:opacity-70"
      @click="navigateTo('https://github.com/unplugin/unplugin-turbo-console', { external: true, open: { target: '_blank' } })"
    />
  </div>
</template>
