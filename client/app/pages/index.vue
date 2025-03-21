<script setup lang="ts">
interface LaunchEditorServerResponse {
  status: 'success' | 'error'
  version: string
  message: string
}

const requestState = ref<{
  status: 'pending' | 'error' | 'success'
  errorMessage: string
  version: string
}>({
  status: 'pending',
  errorMessage: '',
  version: '',
})
const launchEditorServerResponse = ref<LaunchEditorServerResponse>()

async function init() {
  try {
    const position = window.location.hash.slice(1)
    if (!position) {
      throw new Error('No position provided')
    }
    const response = await $fetch<LaunchEditorServerResponse>(`/launchEditor?position=${(position)}`)
    if (response.status !== 'success') {
      throw new Error(response.message || 'Unknown error')
    }
    launchEditorServerResponse.value = response
    requestState.value.status = 'success'
    requestState.value.version = response.version
    window.close()
  }
  catch (error: any) {
    console.error(error)
    requestState.value = {
      status: 'error',
      errorMessage: error,
      version: '',
    }
  }
}

init()
</script>

<template>
  <main class="w-screen p-8">
    <div v-if="requestState.status === 'pending'" class="flex h-full justify-center">
      <div class="flex flex-col items-center gap-2">
        <Icon name="uil:spinner" class="text-2xl animate-spin" />
        <span class="text-gray-500 dark:text-gray-400">Loading...</span>
      </div>
    </div>
    <div v-else-if="requestState.status === 'error'" class="flex pt-64 px-8">
      <div class="text-red-500 dark:text-red-400 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 w-full">
        <div class="flex items-center gap-2 mb-2">
          <Icon name="uil:exclamation-triangle" class="text-xl" />
          <span class="font-medium">Error</span>
        </div>
        <div class="text-sm">
          {{ requestState.errorMessage }}
        </div>
      </div>
    </div>
    <div v-else-if="requestState.status === 'success'">
      <div class="text-green-500 dark:text-green-400 p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
        <div class="flex items-center gap-2 mb-2">
          <Icon name="uil:check-circle" class="text-xl" />
          <span class="font-medium">Success</span>
        </div>
        <div class="text-sm">
          🎉 Launch to editor trigger success!
        </div>
      </div>
    </div>
  </main>
</template>
