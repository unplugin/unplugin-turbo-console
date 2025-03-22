<script setup lang="ts">
import { createHighlighterCore } from 'shiki/core'
import { createOnigurumaEngine } from 'shiki/engine/oniguruma'

const props = defineProps<{
  code: string
}>()

const highlighter = await createHighlighterCore({
  themes: [
    import('@shikijs/themes/vitesse-light'),
    import('@shikijs/themes/vitesse-dark'),
  ],
  langs: [import('@shikijs/langs/typescript')],
  engine: createOnigurumaEngine(import('shiki/wasm')),
})

const code = highlighter.codeToHtml(props.code, {
  lang: 'typescript',
  themes: {
    light: 'vitesse-light',
    dark: 'vitesse-dark',
  },
})
</script>

<template>
  <div v-html="code" />
</template>
