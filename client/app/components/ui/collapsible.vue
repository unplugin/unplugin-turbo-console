<script setup lang="ts">
import { CollapsibleContent, CollapsibleRoot } from 'reka-ui'

const { expanded, collapsed } = defineProps<{
  expanded?: boolean
  collapsed?: boolean
}>()

const open = ref(false)

watch(() => expanded, (value) => {
  if (value) {
    open.value = true
  }
})

watch(() => collapsed, (value) => {
  if (value) {
    open.value = false
  }
})
</script>

<template>
  <CollapsibleRoot
    v-model:open="open"
    class="text-sm"
    :unmount-on-hide="false"
  >
    <CollapsibleTrigger
      class="w-full rounded-md mt-[10px] p-2 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex items-center gap-1 cursor-pointer"
      :class="{ 'rounded-b-none border-b-0': open }"
    >
      <slot name="trigger" :open="open" />
    </CollapsibleTrigger>

    <CollapsibleContent>
      <div class="w-full border border-gray-200 dark:border-gray-700 rounded-t-none rounded-b-md border-t-0">
        <slot name="content" />
      </div>
    </CollapsibleContent>
  </CollapsibleRoot>
</template>
