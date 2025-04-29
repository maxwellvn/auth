import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../firebase/config';
import { logError } from './errorLogger';

/**
 * Sign in a user with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise} - Firebase auth user credential
 */
export const loginUser = async (email, password) => {
  try {
    // Log login attempt (without sensitive data)
    console.info(`[AUTH-SERVICE] Login attempt for email: ${email.substring(0, 3)}...`);

    const result = await signInWithEmailAndPassword(auth, email, password);

    // Log successful login
    console.info(`[AUTH-SERVICE] Login successful for user: ${result.user.uid}`);

    return result;
  } catch (error) {
    // Log the error
    logError(error, 'auth-service-login', { email });

    // Re-throw the error for the caller to handle
    throw error;
  }
};

/**
 * Register a new user with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @param {string} name - User's display name
 * @returns {Promise} - Firebase auth user credential
 */
export const registerUser = async (email, password, name) => {
  try {
    // Log registration attempt (without sensitive data)
    console.info(`[AUTH-SERVICE] Registration attempt for email: ${email.substring(0, 3)}...`);

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Log successful user creation
    console.info(`[AUTH-SERVICE] User created with UID: ${userCredential.user.uid}`);

    // Update the user profile with the display name
    if (name) {
      await updateProfile(userCredential.user, {
        displayName: name
      });

      // Log profile update
      console.info(`[AUTH-SERVICE] Profile updated for user: ${userCredential.user.uid}`);
    }

    return userCredential;
  } catch (error) {
    // Log the error
    logError(error, 'auth-service-register', {
      email,
      nameProvided: !!name
    });

    // Re-throw the error for the caller to handle
    throw error;
  }
};

/**
 * Sign out the current user
 * @returns {Promise} - Promise that resolves when sign out is complete
 */
export const logoutUser = async () => {
  try {
    const currentUser = auth.currentUser;
    const uid = currentUser ? currentUser.uid : 'unknown';

    // Log logout attempt
    console.info(`[AUTH-SERVICE] Logout attempt for user: ${uid}`);

    await signOut(auth);

    // Log successful logout
    console.info(`[AUTH-SERVICE] Logout successful for user: ${uid}`);

    return true;
  } catch (error) {
    // Log the error
    logError(error, 'auth-service-logout', {
      userId: auth.currentUser?.uid
    });

    // Re-throw the error for the caller to handle
    throw error;
  }
};

/**
 * Send a password reset email
 * @param {string} email - User's email
 * @returns {Promise} - Promise that resolves when email is sent
 */
export const resetPassword = async (email) => {
  try {
    // Log password reset attempt (without sensitive data)
    console.info(`[AUTH-SERVICE] Password reset attempt for email: ${email.substring(0, 3)}...`);

    await sendPasswordResetEmail(auth, email);

    // Log successful password reset request
    console.info(`[AUTH-SERVICE] Password reset email sent to: ${email.substring(0, 3)}...`);

    return true;
  } catch (error) {
    // Log the error
    logError(error, 'auth-service-reset-password', { email });

    // Re-throw the error for the caller to handle
    throw error;
  }
};

/**
 * Get the current authenticated user
 * @returns {Object|null} - Current user or null if not authenticated
 */
export const getCurrentUser = () => {
  const currentUser = auth.currentUser;

  if (currentUser) {
    // Log current user retrieval
    console.info(`[AUTH-SERVICE] Current user retrieved: ${currentUser.uid}`);
  } else {
    // Log no current user
    console.info('[AUTH-SERVICE] No current user found');
  }

  return currentUser;
};

/**
 * Subscribe to auth state changes
 * @param {Function} callback - Function to call when auth state changes
 * @param {Function} errorCallback - Function to call when an error occurs
 * @returns {Function} - Unsubscribe function
 */
export const onAuthChange = (callback, errorCallback) => {
  console.info('[AUTH-SERVICE] Setting up auth state change listener');

  return onAuthStateChanged(
    auth,
    (user) => {
      if (user) {
        console.info(`[AUTH-SERVICE] Auth state changed: User logged in (${user.uid})`);
      } else {
        console.info('[AUTH-SERVICE] Auth state changed: User logged out');
      }
      callback(user);
    },
    (error) => {
      logError(error, 'auth-service-state-change');
      if (errorCallback) {
        errorCallback(error);
      }
    }
  );
};
