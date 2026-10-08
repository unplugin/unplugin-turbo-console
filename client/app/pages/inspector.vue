<script setup lang="ts">
import type { DevframeRpcClient } from 'devframe/client'
import type { ExpressionsMap, ExpressionsMapResponse } from '~~/shared/types'
import { useConsoleClient } from '../composables/useConsoleClient'

useHead({
  title: 'Console Inspector',
})

const isPreview = import.meta.dev
const previewData: ExpressionsMapResponse = {
  timestamp: Date.now(),
  version: '1.11.3',
  expressionsMap: {
    'src/App.vue': {
      id: '1',
      filePath: 'src/App.vue',
      expressions: [{ code: "'from vue'", method: 'log', line: 7, column: 2 }],
    },
    'src/jsLog.js': {
      id: '2',
      filePath: 'src/jsLog.js',
      expressions: [
        { code: "'from js'", method: 'info', line: 2, column: 2 },
        { code: "'from js'", method: 'warn', line: 4, column: 2 },
        { code: "'from js'", method: 'error', line: 6, column: 2 },
        { code: "'from js'", method: 'log', line: 8, column: 2 },
      ],
    },
    'src/tsLog.ts': {
      id: '3',
      filePath: 'src/tsLog.ts',
      expressions: [
        { code: 'abc', method: 'log', line: 3, column: 2 },
        { code: 'def', method: 'log', line: 6, column: 2 },
        { code: 'mno', method: 'log', line: 15, column: 8 },
      ],
    },
  },
}
const data = shallowRef<ExpressionsMapResponse | undefined>(isPreview ? previewData : undefined)
const {
  client,
  status: connectionStatus,
  error: wsError,
  authCode,
  authenticate,
  showError,
} = useConsoleClient(subscribe)
const wsStatus = computed(() => (isPreview ? 'success' : connectionStatus.value))
let disposed = false
let unsubscribeState: (() => void) | undefined

const lastUpdate = computed(() => {
  if (!data.value?.timestamp) return 'Never'
  return useTimeAgo(data.value.timestamp)
})

async function subscribe(connection: DevframeRpcClient) {
  if (unsubscribeState) return
  const state = await connection.scope('turbo-console').rpc.sharedState('expressions')
  if (disposed) return
  data.value = state.value()
  unsubscribeState = state.on('updated', value => {
    data.value = value
  })
}

onBeforeUnmount(() => {
  disposed = true
  unsubscribeState?.()
})

const totalConsoleCount = computed(() => {
  return Object.values(data?.value?.expressionsMap || {}).reduce(
    (acc, curr) => acc + curr.expressions.length,
    0,
  )
})

async function handleLaunchEditor(path: string, line = 1, column = 0) {
  if (isPreview) return
  try {
    const current = client.value
    const open = current?.services.get('@devframes/service-open')
    if (!open) throw new Error('Opening files is disabled.')
    await open.rpc.call('open-in-editor', { path, line, column: column + 1 })
  } catch (error) {
    showError(error)
  }
}

const expandAll = ref<boolean>()
const collapseAll = ref<boolean>()

const consoleMethods = [
  { method: 'info', icon: 'i-ph-info', color: 'info' },
  { method: 'log', icon: 'i-ph-terminal-window-light', color: 'success' },
  { method: 'warn', icon: 'i-ph-warning', color: 'warning' },
  { method: 'error', icon: 'i-ph-x', color: 'error' },
] as const

const activeConsoleMethod = ref<Array<'info' | 'log' | 'warn' | 'error'>>([
  'info',
  'log',
  'warn',
  'error',
])

const searchKeyword = ref('')

const filterExpression = computed(() => {
  if (!data.value?.expressionsMap) return {}

  const filteredMap: ExpressionsMap = {}

  Object.entries(data.value.expressionsMap).forEach(([key, value]) => {
    const filteredExpressions = value.expressions.filter(item => {
      const method = item.method as 'info' | 'log' | 'warn' | 'error'
      return (
        activeConsoleMethod.value.includes(method) &&
        (item.code.includes(searchKeyword.value) || key.includes(searchKeyword.value))
      )
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
  } else {
    activeConsoleMethod.value.splice(index, 1)
  }
}
</script>

<template>
  <div class="w-screen p-8">
    <div class="flex items-center justify-between flex-wrap gap-4">
      <div>
        <a
          class="text-3xl font-[300] cursor-pointer"
          href="https://github.com/unplugin/unplugin-turbo-console"
          target="_blank"
        >
          <UIcon name="i-ph-magnifying-glass-bold" class="size-6 mr-1" />
          <span>Console Inspector</span>
        </a>

        <a
          :href="`https://github.com/unplugin/unplugin-turbo-console/releases/tag/v${data?.version}`"
          target="_blank"
          class="-translate-y-[16px] font-mono text-[16px] text-muted inline-block"
        >
          v{{ data?.version }}
        </a>
      </div>

      <HeaderInfo />
    </div>

    <div v-if="wsStatus === 'pending'" class="flex h-full justify-center">
      <div class="flex flex-col items-center gap-2">
        <UIcon name="i-uil-spinner" class="size-6 animate-spin" />
        <span class="text-muted">Loading...</span>
      </div>
    </div>

    <form
      v-else-if="wsStatus === 'unauthorized'"
      class="py-4 flex flex-wrap items-center gap-2"
      @submit.prevent="authenticate"
    >
      <label for="inspector-auth-code">Enter the code printed in your terminal:</label>
      <UInput
        id="inspector-auth-code"
        v-model="authCode"
        inputmode="numeric"
        autocomplete="one-time-code"
        pattern="[0-9]{6}"
        maxlength="6"
        required
      />
      <UButton type="submit" label="Connect" />
      <UAlert v-if="wsError" role="alert" color="error" variant="soft" :description="wsError" />
    </form>

    <div v-else-if="wsStatus === 'error'">
      <UAlert
        role="alert"
        color="error"
        variant="soft"
        icon="i-uil-exclamation-triangle"
        title="Error"
        :description="wsError"
      />
    </div>

    <div v-else-if="wsStatus === 'success'" class="py-4">
      <div class="text-sm">
        <span class="text-muted">
          Find <span class="text-toned">{{ totalConsoleCount }}</span> console statements, updated
          <span class="text-toned">{{ lastUpdate }}</span>
        </span>
      </div>

      <UInput
        v-model="searchKeyword"
        placeholder="Search by file name or console statement"
        aria-label="Search by file name or console statement"
        icon="i-ph-magnifying-glass-duotone"
        class="font-mono w-full mt-2.5"
        size="lg"
      />

      <div class="flex items-center gap-4">
        <div class="text-muted text-sm">Methods</div>

        <div class="flex flex-wrap gap-2 my-4">
          <UButton
            v-for="{ method, icon, color } in consoleMethods"
            :key="method"
            :label="method"
            :icon="icon"
            :color="activeConsoleMethod.includes(method) ? color : 'neutral'"
            :variant="activeConsoleMethod.includes(method) ? 'soft' : 'outline'"
            :aria-pressed="activeConsoleMethod.includes(method)"
            size="sm"
            @click="handleActiveConsoleMethod(method)"
          />
        </div>
      </div>

      <div class="flex justify-end gap-2 my-4">
        <UButton
          color="neutral"
          variant="outline"
          @click="
            async () => {
              expandAll = true
              await nextTick()
              expandAll = false
            }
          "
        >
          Expand All
        </UButton>

        <UButton
          color="neutral"
          variant="outline"
          @click="
            async () => {
              collapseAll = true
              await nextTick()
              collapseAll = false
            }
          "
        >
          Collapse All
        </UButton>
      </div>

      <div v-for="(items, key) in filterExpression" :key="items.id">
        <ui-collapsible :expanded="expandAll" :collapsed="collapseAll" :path="key as string">
          <template #trigger="{ open }">
            <div class="flex items-center gap-2">
              <UIcon
                name="i-uil-angle-right-b"
                class="text-muted size-4 transition-transform duration-300"
                :class="{ 'rotate-90': open }"
              />
              <div class="flex items-center gap-1">
                <FileIcon :name="key as string" />
                <span class="text-toned font-mono">{{ key }}</span>
              </div>
            </div>
          </template>
          <template #actions>
            <UTooltip text="Open in Editor" :content="{ side: 'top', sideOffset: 5 }">
              <UButton
                icon="i-carbon-launch"
                color="neutral"
                variant="ghost"
                size="xs"
                class="text-muted"
                :aria-label="`Open ${key} in Editor`"
                @click.stop="handleLaunchEditor(items.filePath)"
              />
            </UTooltip>
          </template>
          <template #content>
            <div class="flex gap-4 h-full px-4 overflow-x-auto">
              <div class="py-4 flex flex-col gap-2">
                <UButton
                  v-for="item in items.expressions"
                  :key="item.line + item.column"
                  color="neutral"
                  variant="link"
                  class="font-mono p-0 justify-end"
                  :aria-label="`Open ${key} at line ${item.line} in Editor`"
                  @click="handleLaunchEditor(items.filePath, item.line, item.column)"
                >
                  {{ item.line }}
                </UButton>
              </div>

              <div class="min-h-full flex-shrink-0 w-px bg-accented" />

              <div class="py-4 flex flex-col gap-2">
                <div
                  v-for="item in items.expressions"
                  :key="item.line + item.column"
                  class="flex items-center gap-4"
                >
                  <shiki :code="`console.${item.method}(${item.code})`" />
                  <UTooltip text="Open in Editor" :content="{ side: 'top', sideOffset: 5 }">
                    <UButton
                      icon="i-carbon-launch"
                      color="neutral"
                      variant="ghost"
                      size="xs"
                      class="text-muted p-0"
                      :aria-label="`Open ${key} at line ${item.line} in Editor`"
                      @click="handleLaunchEditor(items.filePath, item.line, item.column)"
                    />
                  </UTooltip>
                </div>
              </div>
            </div>
          </template>
        </ui-collapsible>
      </div>
    </div>
  </div>
</template>
