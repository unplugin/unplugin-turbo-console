<script setup lang="ts">
const { data, error } = await useAsyncData(async () => {
  const raw = await fetch(`/filePathMap`)
  const response = await raw.json()
  return response
})
</script>

<template>
  <Suspense>
    <template #default>
      <div v-if="error" class="text-red-500">
        {{ data }}
        {{ error }}
      </div>
    </template>
    <template #fallback>
      Loading...
    </template>
  </Suspense>
</template>
