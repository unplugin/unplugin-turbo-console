<script setup lang="ts">
import type { ExpressionsMap, ExpressionsMapResponse } from '~~/shared/types'

useHead({
  title: 'Console Inspector',
})

const data = ref<ExpressionsMapResponse>()
const wsStatus = ref<'pending' | 'error' | 'success'>('pending')
const wsError = ref<string>()
let ws: WebSocket | null = null

const lastUpdate = computed(() => {
  if (!data.value?.timestamp)
    return 'Never'
  return useTimeAgo(data.value.timestamp)
})

function initWebSocket() {
  wsStatus.value = 'pending'
  ws = new WebSocket(`ws://${window.location.host}/ws/inspector`)
  ws.onopen = () => {
    wsStatus.value = 'success'
  }
  ws.onerror = (error) => {
    wsStatus.value = 'error'
    wsError.value = String(error)
  }
  ws.onmessage = (event) => {
    data.value = JSON.parse(event.data)
  }
}

onMounted(() => {
  initWebSocket()
})

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

const searchKeyword = ref('')

const filterExpression = computed(() => {
  if (!data.value?.expressionsMap)
    return {}

  const filteredMap: ExpressionsMap = {}

  Object.entries(data.value.expressionsMap).forEach(([key, value]) => {
    const filteredExpressions = value.expressions.filter((item) => {
      const method = item.method as 'info' | 'log' | 'warn' | 'error'
      return activeConsoleMethod.value.includes(method) && (item.code.includes(searchKeyword.value) || key.includes(searchKeyword.value))
    })

    if (filteredExpressions.length > 0) {
      filteredMap[key] = {
        ...value,
        expressions: filteredExpressions,
      }
    }
  })

  return filteredMap
})

function handleActiveConsoleMethod(method: 'info' | 'log' | 'warn' | 'error') {
  const index = activeConsoleMethod.value.indexOf(method)
  if (index === -1) {
    activeConsoleMethod.value.push(method)
  }
  else {
    activeConsoleMethod.value.splice(index, 1)
  }
}
</script>

<template>
  <div class="w-screen p-8">
    <div class="flex items-center justify-between flex-wrap gap-4">
      <div>
        <a class="text-3xl font-[300] cursor-pointer" href="https://github.com/unplugin/unplugin-turbo-console" target="_blank">
          <Icon name="ph:magnifying-glass-bold" class="text-2xl text-green-500 mr-1" />
          <span>Console Inspector</span>
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

    <div v-if="wsStatus === 'pending'" class="flex h-full justify-center">
      <div class="flex flex-col items-center gap-2">
        <Icon name="uil:spinner" class="text-2xl animate-spin" />
        <span class="text-gray-500 dark:text-gray-400">Loading...</span>
      </div>
    </div>

    <div v-else-if="wsStatus === 'error'">
      <div class="text-red-500 dark:text-red-400 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 w-full">
        <div class="flex items-center gap-2 mb-2">
          <Icon name="uil:exclamation-triangle" class="text-xl" />
          <span class="font-medium">Error</span>
          {{ wsError }}
        </div>
      </div>
    </div>

    <div v-else-if="wsStatus === 'success'" class="py-4">
      <div class="text-sm">
        <span class="text-gray-400 dark:text-gray-400">
          Find <span class="text-gray-600 dark:text-gray-300">{{ totalConsoleCount }}</span> console statements, updated <span class="text-gray-600 dark:text-gray-300">{{ lastUpdate }}</span>
        </span>
      </div>

      <div class="relative">
        <input v-model="searchKeyword" placeholder="Search by file name or console statement" type="text" class="font-mono w-full rounded-full mt-[10px] p-2 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex items-center gap-1 cursor-input pl-10 focus:outline-none">
        <Icon name="ph:magnifying-glass-duotone" class="text-xl text-gray-500 dark:text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
      </div>

      <div class="flex items-center gap-4">
        <div class="opacity-50 text-sm">
          Methods
        </div>

        <div class="flex gap-2 my-4">
          <button
            class="i-filter-btn"
            :class="[activeConsoleMethod.includes('info') ? 'i-filter-btn-active' : '']"
            @click="handleActiveConsoleMethod('info')"
          >
            <Icon
              name="ph:info" class="text-gray-500 dark:text-gray-400 text-[16px]"
              :class="{ 'text-blue-500! dark:text-blue-400!': activeConsoleMethod.includes('info') }"
            />
            info
          </button>

          <button
            class="i-filter-btn"
            :class="[activeConsoleMethod.includes('log') ? 'i-filter-btn-active' : '']"
            @click="handleActiveConsoleMethod('log')"
          >
            <Icon
              name="ph:terminal-window-light" class="text-gray-500 dark:text-gray-400 text-[16px]"
              :class="{ 'text-emerald-500! dark:text-emerald-400!': activeConsoleMethod.includes('log') }"
            />
            log
          </button>

          <button
            class="i-filter-btn"
            :class="[activeConsoleMethod.includes('warn') ? 'i-filter-btn-active' : '']"
            @click="handleActiveConsoleMethod('warn')"
          >
            <Icon
              name="ph:warning" class="text-gray-500 dark:text-gray-400 text-[16px]"
              :class="{ 'text-yellow-500! dark:text-yellow-400!': activeConsoleMethod.includes('warn') }"
            />
            warn
          </button>

          <button
            class="i-filter-btn"
            :class="[activeConsoleMethod.includes('error') ? 'i-filter-btn-active' : '']"
            @click="handleActiveConsoleMethod('error')"
          >
            <Icon
              name="ph:x" class="text-gray-500 dark:text-gray-400 text-[16px]"
              :class="{ 'text-red-500! dark:text-red-400!': activeConsoleMethod.includes('error') }"
            />
            error
          </button>
        </div>
      </div>

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

      <div v-for="(items, key) in filterExpression" :key="items.id">
        <ui-collapsible
          :expanded="expandAll"
          :collapsed="collapseAll"
          :path="(key as string)"
        >
          <template #trigger="{ open }">
            <div class="flex items-center gap-2">
              <Icon name="uil:angle-right-b" class="text-gray-500 text-[16px] transition-transform duration-300" :class="{ 'rotate-90': open }" />
              <div class="flex items-center gap-1">
                <FileIcon :name="key as string" />
                <span class="opacity-50">{{ key }}</span>
              </div>

              <ui-tooltip>
                <template #trigger>
                  <div class="flex items-center">
                    <Icon
                      name="carbon:launch" class="opacity-50 hover:opacity-70 text-[16px] cursor-pointer" @click.stop="handleLaunchEditor(items.filePath)"
                    />
                  </div>
                </template>
              </ui-tooltip>
            </div>
          </template>
          <template #content>
            <div class="flex gap-4 h-full px-4 overflow-x-auto">
              <div class="py-4  flex flex-col gap-2">
                <div v-for="item in items.expressions" :key="item.line + item.column" class="text-gray-500 dark:text-gray-400" @click="handleLaunchEditor(items.filePath)">
                  {{ item.line }}
                </div>
              </div>

              <div class="min-h-full flex-shrink-0 w-[1px] bg-gray-200 dark:bg-gray-700" />

              <div class="py-4 flex flex-col gap-2">
                <div v-for="item in items.expressions" :key="item.line + item.column" class="flex">
                  <shiki :code="`console.${item.method}(${item.code})`" />
                </div>
              </div>

              <div class="py-4 flex flex-col gap-2">
                <div v-for="item in items.expressions" :key="item.line + item.column" class="flex items-center">
                  <div class="relative top-[2px]">
                    <ui-tooltip>
                      <template #trigger>
                        <Icon
                          name="carbon:launch" class="opacity-50 hover:opacity-70 text-[16px] cursor-pointer" @click.stop="handleLaunchEditor(items.filePath, item.line, item.column)"
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
