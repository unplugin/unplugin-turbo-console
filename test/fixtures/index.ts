export const webpackVue = {
  options: {
    prefix: '',
    suffix: '',
    disableLaunchEditor: false,
    port: 3070,
  },
  code: `<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import HelloWorld from './components/HelloWorld.vue';

console.log('App.vue')

export default defineComponent({
  name: 'App',
  components: {
    HelloWorld
  }
});
</script>
`,
  id: 'App.vue',
}

export const webpackVueScriptSetup = {
  options: {
    prefix: '',
    suffix: '',
    disableLaunchEditor: false,
    port: 3090,
  },
  code: `<script setup lang="ts">
  console.log('script setup')
  </script>
  
  <template>
    <div>
      script setup
    </div>
  </template>
`,
  id: 'App.vue',
}

export const webpackJS = {
  options: {
    prefix: '',
    suffix: '',
    disableLaunchEditor: false,
    port: 3090,
  },
  code: `console.log('hello javascript')`,
  id: 'main.js',
}
