<script setup lang="ts">
const props = defineProps<{
  code: string
}>()

const code = shiki.codeToHtml(props.code, {
  lang: 'js',
  themes: {
    light: 'vitesse-light',
    dark: 'vitesse-dark',
  },
})
</script>

<template>
  <div v-html="code" />
</template>
