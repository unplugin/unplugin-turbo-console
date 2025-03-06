<script setup lang="">
// ; (async () => {
//   try {
//     const position = window.location.hash.slice(1)
//     const raw = await fetch(`/launchEditor?position=${(position)}`)
//     const response = await raw.json()
//     const versionEl = document.getElementById('version')
//     versionEl.textContent = `version: ${response.version}`
//     if (response.status === 'error') {
//       const error = document.getElementById('error')
//       error.style.display = 'block'
//       const success = document.getElementById('success')
//       success.style.display = 'none'
//       throw new Error(response.message)
//     }

//     window.close()
//   }
//   catch (error) {
//     const errorInfo = document.getElementById('error-info')
//     errorInfo.textContent = String(error)
//   }
// })()

// const route = useRoute()
// const hash = route.hash
// const position = window.location.hash.slice(1)
// const raw = await fetch(`/launchEditor?position=${(position)}`)
// const response = await raw.json()

const { data, error } = await useAsyncData(async () => {
  const position = window.location.hash.slice(1)
  const raw = await fetch(`/launchEditor?position=${(position)}`)
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
