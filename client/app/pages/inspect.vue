<script setup lang="ts">
import type { ExpressionItem, ExpressionsMapResponse } from '~~/shared/types'

const { data, status, error } = useFetch<ExpressionsMapResponse>('/expressionsMap')

function handleLaunchEditor(path: string, item: ExpressionItem) {
  $fetch('/launchEditor', {
    query: {
      path: `${path}:${item.line}:${item.column}`,
    },
  })
}
</script>

<template>
  <div class="w-screen p-8">
    <div class="flex items-center justify-between flex-wrap gap-4">
      <div>
        <a class="text-3xl font-[300] cursor-pointer" href="https://github.com/unplugin/unplugin-turbo-console" target="_blank">
          Unplugin<span class="text-green-500"> Turbo Console</span>  Inspector
        </a>

        <a
          :href="`https://github.com/unplugin/unplugin-turbo-console/releases/tag/v${data?.version}`" target="_blank"
          class="-translate-y-[16px] font-mono text-[16px] text-gray-400 inline-block"
        >
          v{{ data?.version }}
        </a>
      </div>

      <HeaderInfo />
    </div>

    <div v-if="status === 'pending'" class="flex h-full justify-center">
      <div class="flex flex-col items-center gap-2">
        <Icon name="uil:spinner" class="text-2xl animate-spin" />
        <span class="text-gray-500 dark:text-gray-400">Loading...</span>
      </div>
    </div>

    <div v-else-if="status === 'error'">
      <div class="text-red-500 dark:text-red-400 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 w-full">
        <div class="flex items-center gap-2 mb-2">
          <Icon name="uil:exclamation-triangle" class="text-xl" />
          <span class="font-medium">Error</span>
          {{ error }}
        </div>
      </div>
    </div>

    <div v-else-if="status === 'success'">
      <div v-for="(items, key) in data?.expressionsMap" :key="key">
        <ui-collapsible :file-name="(key as string)">
          <template #content>
            <div v-for="item in items.expressions" :key="item.code" @click="handleLaunchEditor(items.filePath, item)">
              <shiki :code="`console.${item.method}(${item.code})`" />
            </div>
          </template>
        </ui-collapsible>
      </div>
    </div>
  </div>
</template>
