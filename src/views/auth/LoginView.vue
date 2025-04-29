<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { signInWithEmailAndPassword, browserLocalPersistence, setPersistence } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { handleAuthError, logError } from '../../services/errorLogger';

const email = ref('');
const password = ref('');
const errorMessage = ref('');
const detailedError = ref('');
const loading = ref(false);
const router = useRouter();

// Set up persistence on component mount
onMounted(async () => {
  try {
    // Set persistence to LOCAL (browser persistence)
    await setPersistence(auth, browserLocalPersistence);
    console.info('[LOGIN] Firebase persistence set to LOCAL');
  } catch (error) {
    console.error('[LOGIN] Error setting persistence:', error);
    // Log the error but don't show to user as it's not critical for login UI
    logError(error, 'login-persistence-setup', {
      timestamp: new Date().toISOString()
    });
  }
});

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
    console.info(`[LOGIN] Attempt for email: ${email.value.substring(0, 3)}...`);

    // Add a timestamp for debugging
    const startTime = new Date().getTime();

    try {
      // Attempt to sign in
      const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);

      // Calculate response time for performance monitoring
      const responseTime = new Date().getTime() - startTime;

      // Log successful login with timing information
      console.info(`[LOGIN] Success for email: ${email.value.substring(0, 3)}... (${responseTime}ms)`);
      console.info(`[LOGIN] User info:`, {
        uid: userCredential.user.uid,
        emailVerified: userCredential.user.emailVerified,
        displayName: userCredential.user.displayName || 'Not set'
      });

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (firebaseError) {
      // Get detailed error information
      const errorDetails = {
        code: firebaseError.code,
        message: firebaseError.message,
        name: firebaseError.name,
        stack: firebaseError.stack,
        email: email.value,
        timestamp: new Date().toISOString()
      };

      // Log detailed error for debugging
      console.error('[LOGIN] Firebase authentication error:', errorDetails);

      // Store detailed error for debugging (only in development)
      if (process.env.NODE_ENV !== 'production') {
        detailedError.value = `Error Code: ${errorDetails.code}\nMessage: ${errorDetails.message}`;
      }

      // Use the error handler service to get a user-friendly message
      errorMessage.value = handleAuthError(firebaseError, 'login', {
        email: email.value,
        attemptTime: new Date().toISOString()
      });

      // Throw the error to be caught by the outer try-catch
      throw firebaseError;
    }
  } catch (error) {
    // This catch block handles any errors not caught by the inner try-catch
    console.error('[LOGIN] Unexpected error during login process:', error);

    // If we don't already have an error message, set a generic one
    if (!errorMessage.value) {
      errorMessage.value = 'An unexpected error occurred during login. Please try again.';
    }
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
