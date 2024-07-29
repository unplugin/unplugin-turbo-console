<script setup lang="ts">
import "~console";
import '~console/theme-detect';

function makeFetch() {
  fetch("/api/test");
}

function vueLog() {
  console.log("Hello Vue");
}

function clientToServer() {
  server.log("Hello Client");
}
</script>

<template>
  <main>
    <h1>
      <span>Unplugin Turbo Conosle</span>
      Playgroud
    </h1>

    <h2>Highlight & Launch Editor</h2>

    <div>
      <button @click="jsLog">From JavaScript</button>
      <button @click="tsLog">From TypeScript</button>
      <button @click="vueLog">From Vue</button>
    </div>

    <h2>Pass Logs</h2>

    <div>
      <button @click="makeFetch">Server -> Client</button>
      <button @click="clientToServer">Client -> Server</button>
    </div>
  </main>
</template>

<style>
@media (prefers-color-scheme: dark) {
  body {
    color: white;
    background: black;
  }
}
</style>
