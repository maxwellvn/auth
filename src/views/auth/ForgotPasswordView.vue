<script setup>
import { ref } from 'vue';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebase/config';

const email = ref('');
const errorMessage = ref('');
const successMessage = ref('');
const loading = ref(false);

const resetPassword = async () => {
  // Reset messages
  errorMessage.value = '';
  successMessage.value = '';
  
  if (!email.value) {
    errorMessage.value = 'Please enter your email address';
    return;
  }
  
  try {
    loading.value = true;
    await sendPasswordResetEmail(auth, email.value);
    successMessage.value = 'Password reset email sent. Check your inbox.';
    email.value = ''; // Clear the email field
  } catch (error) {
    console.error('Password reset error:', error);
    switch (error.code) {
      case 'auth/invalid-email':
        errorMessage.value = 'Invalid email address';
        break;
      case 'auth/user-not-found':
        errorMessage.value = 'No account found with this email';
        break;
      default:
        errorMessage.value = 'An error occurred. Please try again';
    }
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="auth-container">
    <div class="auth-card">
      <h1>Reset Password</h1>
      <p class="description">
        Enter your email address and we'll send you a link to reset your password.
      </p>
      
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
      
      <div v-if="successMessage" class="success-message">
        {{ successMessage }}
      </div>
      
      <form @submit.prevent="resetPassword">
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
        <div class="form-actions">
          <button type="submit" class="btn btn-primary" :disabled="loading">
            {{ loading ? 'Sending...' : 'Send Reset Link' }}
          </button>
        </div>
      </form>
      
      <div class="auth-links">
        <router-link to="/login">Back to Login</router-link>
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
  margin-bottom: 1rem;
}

.description {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #666;
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

.success-message {
  background-color: #d4edda;
  color: #155724;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
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
