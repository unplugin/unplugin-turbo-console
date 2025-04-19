<script setup lang="ts">
const props = defineProps<{
  name: string
}>()

const icon = computed(() => {
  const ext = props.name.split('.').pop()
  switch (ext) {
    case 'vue':
      return 'catppuccin:vue'
    case 'js':
      return 'catppuccin:javascript'
    case 'ts':
      return 'catppuccin:typescript'
    case 'jsx':
      return 'catppuccin:javascript'
    case 'tsx':
      return 'catppuccin:typescript'
    case 'svelte':
      return 'catppuccin:svelte'
    case 'astro':
      return 'catppuccin:astro'
    default:
      return 'vscode-icons:file-type-default'
  }
})
</script>

<template>
  <Icon :name="icon" class="text-[14px] relative top-[1px]" />
</template>
