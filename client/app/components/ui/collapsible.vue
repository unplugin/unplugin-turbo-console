<script setup lang="ts">
import { useSessionStorage } from '@vueuse/core'

const { expanded, collapsed, path } = defineProps<{
  expanded?: boolean
  collapsed?: boolean
  path: string
}>()

const openState = useSessionStorage<boolean>(`utc-${path}-open-state`, false)
const contentId = useId()

watch(
  () => expanded,
  value => {
    if (value) {
      openState.value = true
    }
  },
)

watch(
  () => collapsed,
  value => {
    if (value) {
      openState.value = false
    }
  },
)
</script>

<template>
  <div class="mt-2.5 text-sm">
    <div
      class="flex items-center gap-1 rounded-lg border border-default bg-elevated p-0.5"
      :class="{ 'rounded-b-none': openState }"
      @click="openState = !openState"
    >
      <UButton
        color="neutral"
        variant="ghost"
        class="justify-start min-w-0"
        :aria-expanded="openState"
        :aria-controls="contentId"
        @click.stop="openState = !openState"
      >
        <slot name="trigger" :open="openState" />
      </UButton>
      <slot name="actions" />
    </div>

    <UCollapsible v-model:open="openState" :unmount-on-hide="false">
      <template #content>
        <div :id="contentId" class="w-full border border-default rounded-b-lg border-t-0">
          <slot name="content" />
        </div>
      </template>
    </UCollapsible>
  </div>
</template>
