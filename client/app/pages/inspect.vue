<script setup lang="ts">
import type { ExpressionsMapResponse } from '~~/shared/types'

const { data, status, error } = useFetch<ExpressionsMapResponse>('/expressionsMap')

const totalConsoleCount = computed(() => {
  return Object.values(data?.value?.expressionsMap || {}).reduce((acc, curr) => acc + curr.expressions.length, 0)
})

function handleLaunchEditor(path: string, line?: number, column?: number) {
  $fetch('/launchEditor', {
    query: {
      path: `${path}:${line || 1}:${column || 1}`,
    },
  })
}

const expandAll = ref<boolean>()
const collapseAll = ref<boolean>()

const activeConsoleMethod = ref<Array<'info' | 'log' | 'warn' | 'error'>>(['info', 'log', 'warn', 'error'])

function handleActiveConsoleMethod(method: 'info' | 'log' | 'warn' | 'error') {
  if (activeConsoleMethod.value.includes(method)) {
    activeConsoleMethod.value = activeConsoleMethod.value.filter(m => m !== method)
  }
  else {
    activeConsoleMethod.value.push(method)
  }
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

    <div v-else-if="status === 'success'" class="py-4">
      <div class="text-sm">
        <span class="text-gray-400 dark:text-gray-400">
          Find <span class="text-gray-600 dark:text-gray-300">{{ totalConsoleCount }}</span> console statements, updated <span class="text-gray-600 dark:text-gray-300">4 hours ago</span>
        </span>
      </div>

      <div class="flex gap-2 my-4">
        <button
          class="i-active-btn" :class="[activeConsoleMethod.includes('info') ? 'bg-blue-50 border-blue-300! hover:bg-blue-50! text-blue-600! dark:text-blue-400! dark:bg-blue-900! dark:border-blue-700! dark:hover:bg-blue-900!' : '']"
          @click="handleActiveConsoleMethod('info')"
        >
          info
        </button>

        <button
          class="i-active-btn" :class="[activeConsoleMethod.includes('log') ? 'bg-emerald-50 border-emerald-300! hover:bg-emerald-50! text-emerald-600! dark:text-emerald-400! dark:bg-emerald-900! dark:border-emerald-700! dark:hover:bg-emerald-900!' : '']"
          @click="handleActiveConsoleMethod('log')"
        >
          log
        </button>

        <button
          class="i-active-btn" :class="[activeConsoleMethod.includes('warn') ? 'bg-amber-50 border-amber-300! hover:bg-amber-50! text-amber-600! dark:text-amber-400! dark:bg-amber-900! dark:border-amber-700! dark:hover:bg-amber-900!' : '']"
          @click="handleActiveConsoleMethod('warn')"
        >
          warn
        </button>

        <button
          class="i-active-btn" :class="[activeConsoleMethod.includes('error') ? 'bg-red-50 border-red-300! hover:bg-red-50! text-red-600! dark:text-red-400! dark:bg-red-900! dark:border-red-700! dark:hover:bg-red-900!' : '']"
          @click="handleActiveConsoleMethod('error')"
        >
          error
        </button>
      </div>

      <input placeholder="Search by file name or console statement" type="text" class="w-full rounded-full mt-[10px] p-2 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex items-center gap-1 cursor-input pl-5 focus:outline-none">

      <div class="flex justify-end gap-2 my-4">
        <button
          class="i-btn" @click="async () => {
            expandAll = true
            await nextTick()
            expandAll = false
          }"
        >
          Expand All
        </button>

        <button
          class="i-btn" @click="async () => {
            collapseAll = true
            await nextTick()
            collapseAll = false
          }"
        >
          Collapse All
        </button>
      </div>

      <div v-for="(items, key) in data?.expressionsMap" :key="key">
        <ui-collapsible :expanded="expandAll" :collapsed="collapseAll">
          <template #trigger="{ open }">
            <div class="flex items-center gap-2">
              <Icon name="uil:angle-right-b" class="text-gray-500 text-[16px] transition-transform duration-300" :class="{ 'rotate-90': open }" />
              <span class="text-gray-500 dark:text-gray-400 leading-[25px]">{{ key }}</span>
              <ui-tooltip>
                <template #trigger>
                  <div class="flex items-center">
                    <Icon
                      name="carbon:launch" class="text-gray-500 dark:text-gray-400 text-[16px] cursor-pointer" @click.stop="handleLaunchEditor(items.filePath)"
                    />
                  </div>
                </template>
              </ui-tooltip>
            </div>
          </template>
          <template #content>
            <div class="flex gap-4 h-full px-4 overflow-x-auto">
              <div class="py-4  flex flex-col gap-2">
                <div v-for="item in items.expressions" :key="item.code" class="text-gray-500 dark:text-gray-400" @click="handleLaunchEditor(items.filePath)">
                  {{ item.line }}
                </div>
              </div>

              <div class="min-h-full flex-shrink-0 w-[1px] bg-gray-200 dark:bg-gray-700" />

              <div class="py-4 flex flex-col gap-2">
                <div v-for="item in items.expressions" :key="item.code" class="flex">
                  <shiki :code="`console.${item.method}(${item.code})`" />
                </div>
              </div>

              <div class="py-4 flex flex-col gap-2">
                <div v-for="item in items.expressions" :key="item.code" class="flex items-center">
                  <div class="relative top-[2px]">
                    <ui-tooltip>
                      <template #trigger>
                        <Icon
                          name="carbon:launch" class="text-gray-500 dark:text-gray-400 text-[16px] cursor-pointer" @click.stop="handleLaunchEditor(items.filePath, item.line, item.column)"
                        />
                      </template>
                    </ui-tooltip>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </ui-collapsible>
      </div>
    </div>
  </div>
</template>
