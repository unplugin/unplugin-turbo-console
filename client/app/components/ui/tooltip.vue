<script setup lang="ts">
import { TooltipContent, TooltipPortal, TooltipProvider, TooltipRoot, TooltipTrigger } from 'reka-ui'
</script>

<template>
  <TooltipProvider>
    <TooltipRoot :delay-duration="100">
      <TooltipTrigger>
        <slot name="trigger" />
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent
          class="data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade text-zinc-400 select-none rounded-md bg-white px-[10px] py-[5px] text-xs leading-none shadow-sm border border-zinc-200 will-change-[transform,opacity] dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300"
          :side-offset="5"
        >
          Open in Editor
        </TooltipContent>
      </TooltipPortal>
    </TooltipRoot>
  </TooltipProvider>
</template>
