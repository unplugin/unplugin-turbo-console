export const disabledFile = {
  options: {
    prefix: '',
    suffix: '',
    disableLaunchEditor: false,
    port: 3070,
  },
  code: `
  /* turbo-console-disable */
  console.log('disabled-highlight-1');
  console.log('disabled-highlight-2');
  console.log('disabled-highlight-3');
  `,
  id: '/home/runner/work/unplugin-turbo-console/src/main.ts',
  hightlight: true,
}

export const disabledFileInWrongWay = {
  options: {
    prefix: '',
    suffix: '',
    disableLaunchEditor: false,
    port: 3070,
  },
  code: `
  console.log('highlight-1');
  /* turbo-console-disable */
  console.log('highlight-2');
  console.log('highlight-3');
  `,
  id: '/home/runner/work/unplugin-turbo-console/src/main.ts',
  hightlight: true,
}

export const disabledNextLine = {
  options: {
    prefix: '',
    suffix: '',
    disableLaunchEditor: false,
    port: 3070,
  },
  code: `
  /* turbo-console-disable-next-line */
  console.log('disabled-highlight-1');
  console.log('highlight-2');
  // turbo-console-disable-next-line 
  console.log('disabled-highlight-3');
  `,
  id: '/home/runner/work/unplugin-turbo-console/src/main.ts',
  hightlight: true,
}

export const disabledLines = {
  options: {
    prefix: '',
    suffix: '',
    disableLaunchEditor: false,
    port: 3070,
  },
  code: `
  // turbo-console-disable-next-line
  console.log('disabled-highlight-1');
  console.log('highlight-2');
  console.log('disabled-highlight-3'); // turbo-console-disable-line
  console.log('disabled-highlight-3'); /* turbo-console-disable-line  */
  `,
  id: '/home/runner/work/unplugin-turbo-console/src/main.ts',
  hightlight: true,
}

export const disabledLinesInWrongWay = {
  options: {
    prefix: '',
    suffix: '',
    disableLaunchEditor: false,
    port: 3070,
  },
  code: `
  // turbo-console-disable-next-line

  console.log('highlight-1');
  console.log('highlight-2');
  console.log('disabled-highlight-3'); // turbo-console-disable-line
  `,
  id: '/home/runner/work/unplugin-turbo-console/src/main.ts',
  hightlight: true,
}

export const loggingComments = {
  options: {
    prefix: '',
    suffix: '',
    disableLaunchEditor: false,
    port: 3070,
  },
  code: `
  console.log('highlight /* turbo-console-disable-next-line */');
  console.log('highlight // turbo-console-disable-next-line');
  console.log('highlight // turbo-console-disable-line');
  `,
  id: '/home/runner/work/unplugin-turbo-console/src/main.ts',
  hightlight: true,
}

export const disabledSfcLines = {
  options: {
    prefix: '',
    suffix: '',
    disableLaunchEditor: false,
    port: 3070,
  },
  code: `
<template>
  <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import HelloWorld from './components/HelloWorld.vue';
// turbo-console-disable-next-line
     console.log('disabled line highlight: App.vue')

export default defineComponent({
  name: 'App',
  components: {
    HelloWorld
  }
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
}
</style>
  `,
  id: '/home/runner/work/unplugin-turbo-console/src/App.vue',
  hightlight: true,
}