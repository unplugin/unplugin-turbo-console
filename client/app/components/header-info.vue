<script setup lang="ts">
const colorMode = useColorMode()

function toggleDark() {
  colorMode.value = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <div class="rounded-full border border-gray-200 dark:border-gray-700 py-1 px-4 flex items-center gap-2">
    <div class="hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full p-1 flex items-center justify-center cursor-pointer">
      <Icon
        name="uil:github" class="text-gray-500 dark:text-gray-400 text-[26px]"
        @click="navigateTo('https://github.com/unplugin/unplugin-turbo-console', { external: true, open: { target: '_blank' } })"
      />
    </div>

    <div class="hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full p-1 flex items-center justify-center cursor-pointer">
      <Icon
        :name="colorMode.value === 'dark' ? 'uil:sun' : 'uil:moon'"
        class="text-gray-500 dark:text-gray-400 text-[26px]"
        @click="toggleDark()"
      />
    </div>
  </div>
</template>
