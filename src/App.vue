<script setup>
// App.vue is now just a router view container
</script>

<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style>
/* Global styles */
:root {
  --primary-color: #42b983;
  --text-color: #2c3e50;
  --background-color: #f5f5f5;
  --card-background: #ffffff;
  --shadow-color: rgba(0, 0, 0, 0.1);
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--text-color);
  background-color: var(--background-color);
}

#app {
  min-height: 100vh;
}
</style>
