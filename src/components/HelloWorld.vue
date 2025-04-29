<script setup>
import { ref } from 'vue'

const message = ref('Welcome to Your Vue.js App')
</script>

<template>
  <div class="hello-world">
    <div class="card">
      <img alt="Vue logo" class="logo" src="https://vuejs.org/images/logo.png" />
      <h1>Hello World!</h1>
      <p>{{ message }}</p>
      <div class="links">
        <a href="https://vuejs.org/" target="_blank" rel="noopener">Vue.js Docs</a> |
        <a href="https://vite.dev/" target="_blank" rel="noopener">Vite Docs</a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hello-world {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  text-align: center;
  max-width: 500px;
  width: 100%;
}

.logo {
  height: 100px;
  margin-bottom: 1.5rem;
}

h1 {
  font-weight: 500;
  font-size: 2.6rem;
  margin-bottom: 1rem;
  color: #42b883; /* Vue green */
}

p {
  font-size: 1.2rem;
  line-height: 1.6;
  color: #2c3e50;
}

.links {
  margin-top: 2rem;
}

a {
  color: #42b883;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem;
}

a:hover {
  text-decoration: underline;
}
</style>
