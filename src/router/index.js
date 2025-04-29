import { createRouter, createWebHistory } from 'vue-router';
import { auth } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { logError } from '../services/errorLogger';

// Route components
const Login = () => import('../views/auth/LoginView.vue');
const Register = () => import('../views/auth/RegisterView.vue');
const ForgotPassword = () => import('../views/auth/ForgotPasswordView.vue');
const Dashboard = () => import('../views/dashboard/DashboardView.vue');
const Home = () => import('../views/HomeView.vue');

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      requiresGuest: true
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: {
      requiresGuest: true
    }
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPassword,
    meta: {
      requiresGuest: true
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      requiresAuth: true
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation guard for authentication
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest);

  // Log navigation attempt
  console.info(`[ROUTER] Navigation to: ${to.path} (requiresAuth: ${requiresAuth}, requiresGuest: ${requiresGuest})`);

  try {
    // Check if the user is authenticated
    onAuthStateChanged(auth, (user) => {
      if (requiresAuth && !user) {
        // Log unauthorized access attempt
        console.warn(`[ROUTER] Unauthorized access attempt to: ${to.path}`);
        next('/login');
      } else if (requiresGuest && user) {
        // Log authenticated user trying to access guest-only route
        console.info(`[ROUTER] Authenticated user (${user.uid}) redirected from guest-only route: ${to.path}`);
        next('/dashboard');
      } else {
        // Log successful navigation
        const userStatus = user ? `authenticated (${user.uid})` : 'unauthenticated';
        console.info(`[ROUTER] Navigation permitted for ${userStatus} user to: ${to.path}`);
        next();
      }
    }, (error) => {
      // Log auth state error
      logError(error, 'router-auth-check', {
        destination: to.path,
        requiresAuth,
        requiresGuest
      });

      // Default to login page on error
      console.error(`[ROUTER] Auth check error, redirecting to login`);
      next('/login');
    });
  } catch (error) {
    // Log any unexpected errors in the navigation guard
    logError(error, 'router-navigation-guard', {
      destination: to.path,
      source: from.path
    });

    // Default to login page on error
    next('/login');
  }
});

export default router;
