<script setup lang="ts">
import type { OpenInEditorInput } from '@devframes/service-open'
import { useConsoleClient } from '../composables/useConsoleClient'

let opened = false
const { status, error, authCode, authenticate } = useConsoleClient(async client => {
  if (opened) return
  const position = window.location.hash.slice(1)
  const path = new URLSearchParams(window.location.search).get('path')
  // 验证码链接只建立信任，不包含待打开的文件。
  if (!position || new URLSearchParams(position).has('devframe_otp')) {
    if (!path) return
  }
  const open = client.services.get('@devframes/service-open')
  if (!open) throw new Error('Opening files is disabled.')
  let target: OpenInEditorInput = { path: path || '', line: 1, column: 1 }
  if (position && !new URLSearchParams(position).has('devframe_otp')) {
    const [id, line = '1', column = '1', extra] = position.split(',')
    if (
      !id ||
      extra !== undefined ||
      !/^[1-9][0-9]*$/.test(line) ||
      !/^[1-9][0-9]*$/.test(column)
    ) {
      throw new Error('Invalid file position.')
    }
    target = {
      path: await client.call('turbo-console:resolve-file', id),
      line: Number(line),
      column: Number(column),
    }
  } else if (path) {
    const match = /^(.*?):([0-9]+)(?::([0-9]+))?$/.exec(path)
    if (match) target = { path: match[1]!, line: Number(match[2]), column: Number(match[3] || 1) }
  }
  await open.rpc.call('open-in-editor', target)
  opened = true
  window.close()
})
</script>

<template>
  <div class="w-screen p-8">
    <div v-if="status === 'pending'" class="flex h-full justify-center">
      <div class="flex flex-col items-center gap-2">
        <Icon name="uil:spinner" class="text-2xl animate-spin" />
        <span class="text-gray-500 dark:text-gray-400">Loading...</span>
      </div>
    </div>
    <form
      v-else-if="status === 'unauthorized'"
      class="flex flex-wrap items-center gap-2"
      @submit.prevent="authenticate"
    >
      <label for="editor-auth-code">Enter the code printed in your terminal:</label>
      <input
        id="editor-auth-code"
        v-model="authCode"
        class="i-btn"
        inputmode="numeric"
        autocomplete="one-time-code"
        pattern="[0-9]{6}"
        maxlength="6"
        required
      />
      <button class="i-btn" type="submit">Connect</button>
      <span role="alert">{{ error }}</span>
    </form>
    <div v-else-if="status === 'error'" class="flex pt-64 px-8">
      <div
        class="text-red-500 dark:text-red-400 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 w-full"
      >
        <div class="flex items-center gap-2 mb-2">
          <Icon name="uil:exclamation-triangle" class="text-xl" />
          <span class="font-medium">Error</span>
        </div>
        <div class="text-sm">
          {{ error }}
        </div>
      </div>
    </div>
    <div v-else-if="status === 'success'">
      <div
        class="text-green-500 dark:text-green-400 p-4 rounded-lg bg-green-50 dark:bg-green-900/20"
      >
        <div class="flex items-center gap-2 mb-2">
          <Icon name="uil:check-circle" class="text-xl" />
          <span class="font-medium">Success</span>
        </div>
        <div class="text-sm">
          {{
            opened ? 'Editor launch requested.' : 'Connected. You can return to your application.'
          }}
        </div>
      </div>
    </div>
  </div>
</template>
