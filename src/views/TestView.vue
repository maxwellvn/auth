<script setup>
// Simple test component
</script>

<template>
  <div class="test-container">
    <h1>Test Page</h1>
    <p>If you can see this, the router is working correctly.</p>
    <div class="links">
      <router-link to="/" class="btn">Home</router-link>
      <router-link to="/login" class="btn">Login</router-link>
      <router-link to="/register" class="btn">Register</router-link>
    </div>
  </div>
</template>

<style scoped>
.test-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  text-align: center;
}

h1 {
  color: var(--primary-color);
  margin-bottom: 1rem;
}

p {
  margin-bottom: 2rem;
  font-size: 1.2rem;
}

.links {
  display: flex;
  gap: 1rem;
}

.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: var(--primary-color);
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-weight: 500;
  transition: background-color 0.3s;
}

.btn:hover {
  background-color: #3aa876;
}
</style>
