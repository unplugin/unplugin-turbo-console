<script setup lang="ts">
import { CollapsibleContent, CollapsibleRoot } from 'reka-ui'

const { fileName } = defineProps<{
  fileName: string
}>()

const open = ref(false)
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
      <Icon name="uil:angle-right-b" class="text-gray-500 text-[16px] transition-transform duration-300" :class="{ 'rotate-90': open }" />
      <span class="text-gray-500 leading-[25px]">{{ fileName }}</span>
    </CollapsibleTrigger>

    <CollapsibleContent>
      <div class="w-full border border-gray-200 dark:border-gray-700 rounded-t-none rounded-b-md border-t-0 p-4">
        <slot name="content" />
      </div>
    </CollapsibleContent>
  </CollapsibleRoot>
</template>
