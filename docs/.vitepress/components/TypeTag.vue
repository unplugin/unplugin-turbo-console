<script setup lang="ts">
defineProps<{
  type: string
  defaultValue: string
}>()
</script>

<template>
  <div class="flex gap-4">
    <div class="flex items-center gap-2 my-2">
      <div class="bg-[#4577c0] text-12px font-600 text-white px-2 rounded-md">
        Type
      </div>

      <code>
        {{ type }}
      </code>
    </div>

    <div class="flex items-center gap-2 my-2">
      <div class="bg-[#f59e0b] text-12px font-600 text-white px-2 rounded-md">
        Default
      </div>

      <code>
        {{ defaultValue }}
      </code>
    </div>
  </div>
</template>
