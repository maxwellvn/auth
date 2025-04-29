<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { signOut, onAuthStateChanged } from '../../services/localAuth';
import { handleAuthError, logError } from '../../services/errorLogger';

const user = ref(null);
const loading = ref(true);
const errorMessage = ref('');
const router = useRouter();

onMounted(() => {
  // Log dashboard mount
  console.info('[DASHBOARD] Component mounted, checking authentication state');

  // Subscribe to auth state changes
  const unsubscribe = onAuthStateChanged((currentUser) => {
    if (currentUser) {
      // Log successful authentication
      console.info(`[DASHBOARD] User authenticated: ${currentUser.uid}`);

      // Set user data
      user.value = {
        uid: currentUser.uid,
        email: currentUser.email,
        displayName: currentUser.displayName || 'User',
        emailVerified: currentUser.emailVerified,
        lastLoginAt: currentUser.metadata?.lastSignInTime || 'Unknown'
      };
    } else {
      // Log unauthenticated access attempt
      console.warn('[DASHBOARD] Unauthenticated access attempt, redirecting to login');
      router.push('/login');
    }
    loading.value = false;
  }, (error) => {
    // Handle auth state change error
    const errorMsg = handleAuthError(error, 'dashboard-auth-state', {
      timestamp: new Date().toISOString()
    });
    errorMessage.value = errorMsg;
    loading.value = false;
  });

  // Clean up subscription on component unmount
  return () => {
    console.info('[DASHBOARD] Component unmounting, cleaning up auth subscription');
    unsubscribe();
  };
});

const handleLogout = async () => {
  try {
    // Log logout attempt
    console.info('[LOGOUT] Attempt');

    // Sign out using local auth service
    await signOut();

    // Log successful logout
    console.info('[LOGOUT] Success');

    // Redirect to login
    router.push('/login');
  } catch (error) {
    // Handle logout error
    const errorMsg = handleAuthError(error, 'logout', {
      userId: user.value?.uid,
      timestamp: new Date().toISOString()
    });
    errorMessage.value = errorMsg;
  }
};
</script>

<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <div class="container">
        <h1>Dashboard</h1>
        <div class="user-info" v-if="user">
          <span>Welcome, {{ user.displayName }}</span>
          <button @click="handleLogout" class="btn-logout">Logout</button>
        </div>
      </div>
    </header>

    <main class="dashboard-content">
      <div class="container">
        <!-- Error message display -->
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <div v-if="loading" class="loading">
          Loading...
        </div>

        <div v-else-if="user" class="dashboard-cards">
          <div class="card">
            <h2>Profile Information</h2>
            <div class="profile-info">
              <div class="info-item">
                <span class="label">Name:</span>
                <span class="value">{{ user.displayName }}</span>
              </div>
              <div class="info-item">
                <span class="label">Email:</span>
                <span class="value">{{ user.email }}</span>
              </div>
              <div class="info-item">
                <span class="label">User ID:</span>
                <span class="value">{{ user.uid }}</span>
              </div>
            </div>
          </div>

          <div class="card">
            <h2>Quick Actions</h2>
            <div class="actions">
              <button class="btn btn-primary">Edit Profile</button>
              <button class="btn btn-secondary">Change Password</button>
            </div>
          </div>

          <div class="card">
            <h2>Recent Activity</h2>
            <p class="empty-state">No recent activity to display.</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.dashboard {
  min-height: 100vh;
  background-color: #f5f7fa;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.dashboard-header {
  background-color: var(--primary-color);
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.dashboard-header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn-logout {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-logout:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.dashboard-content {
  padding: 2rem 0;
}

.loading {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  color: #666;
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
  text-align: center;
}

.dashboard-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.card h2 {
  margin-bottom: 1.5rem;
  color: var(--primary-color);
  font-size: 1.5rem;
}

.profile-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
}

.label {
  font-weight: 500;
  color: #666;
  margin-bottom: 0.25rem;
}

.value {
  font-size: 1.1rem;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.btn {
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.empty-state {
  color: #666;
  font-style: italic;
  text-align: center;
  padding: 1rem 0;
}

@media (max-width: 768px) {
  .dashboard-cards {
    grid-template-columns: 1fr;
  }

  .dashboard-header .container {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .user-info {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
