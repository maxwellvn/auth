<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { signInWithEmailAndPassword } from '../../services/localAuth';
import { handleAuthError, logError } from '../../services/errorLogger';

const email = ref('');
const password = ref('');
const errorMessage = ref('');
const detailedError = ref('');
const loading = ref(false);
const router = useRouter();

const login = async () => {
  // Reset error messages
  errorMessage.value = '';
  detailedError.value = '';

  // Form validation
  if (!email.value || !password.value) {
    errorMessage.value = 'Please fill in all fields';
    // Log validation error
    logError(
      new Error('Form validation failed'),
      'login-validation',
      {
        email: email.value ? 'provided' : 'missing',
        password: password.value ? 'provided' : 'missing'
      }
    );
    return;
  }

  try {
    loading.value = true;

    // Log login attempt (without sensitive data)
    console.info(`[LOGIN] Attempt for email: ${email.value}`);

    // Add a timestamp for debugging
    const startTime = new Date().getTime();

    // Attempt to sign in with local auth service
    const userCredential = await signInWithEmailAndPassword(email.value, password.value);

    // Calculate response time for performance monitoring
    const responseTime = new Date().getTime() - startTime;

    // Log successful login
    console.info(`[LOGIN] Success for user: ${userCredential.user.uid} (${responseTime}ms)`);
    console.info(`[LOGIN] User info:`, {
      uid: userCredential.user.uid,
      displayName: userCredential.user.displayName || 'Not set'
    });

    // Redirect to dashboard
    router.push('/dashboard');
  } catch (error) {
    console.error('[LOGIN] Error during login:', error);

    // Store detailed error for debugging
    detailedError.value = `Error Code: ${error.code || 'unknown'}\nMessage: ${error.message || 'No message available'}`;

    // Use the error handler service to get a user-friendly message
    errorMessage.value = handleAuthError(error, 'login', {
      email: email.value,
      attemptTime: new Date().toISOString()
    });
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="auth-container">
    <div class="auth-card">
      <h1>Login</h1>
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
        <div v-if="detailedError" class="detailed-error">
          <strong>Technical Details (for debugging):</strong>
          <pre>{{ detailedError }}</pre>
        </div>
      </div>
      <form @submit.prevent="login">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            v-model="email"
            placeholder="Enter your email"
            required
          />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            v-model="password"
            placeholder="Enter your password"
            required
          />
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary" :disabled="loading">
            {{ loading ? 'Logging in...' : 'Login' }}
          </button>
        </div>
      </form>
      <div class="auth-links">
        <router-link to="/forgot-password">Forgot Password?</router-link>
        <router-link to="/register">Don't have an account? Register</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 1rem;
}

.auth-card {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  background-color: var(--card-background);
  border-radius: 8px;
  box-shadow: 0 4px 6px var(--shadow-color);
}

h1 {
  text-align: center;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-actions {
  margin-top: 2rem;
}

.btn {
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
}

.detailed-error {
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px dashed #e3a0a5;
  font-size: 0.85rem;
}

.detailed-error pre {
  margin-top: 0.5rem;
  white-space: pre-wrap;
  word-break: break-all;
  background-color: rgba(0, 0, 0, 0.05);
  padding: 0.5rem;
  border-radius: 3px;
  max-height: 150px;
  overflow-y: auto;
}

.auth-links {
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: center;
}

.auth-links a {
  color: var(--primary-color);
  text-decoration: none;
}

.auth-links a:hover {
  text-decoration: underline;
}
</style>
