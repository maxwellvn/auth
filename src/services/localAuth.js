/**
 * Local Authentication Service
 * This service provides authentication functionality using local storage
 * as a simple database for user credentials.
 */

// Initialize the users database in local storage if it doesn't exist
const initializeDatabase = () => {
  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify([]));
  }
};

// Get all users from the database
const getUsers = () => {
  initializeDatabase();
  return JSON.parse(localStorage.getItem('users') || '[]');
};

// Save users to the database
const saveUsers = (users) => {
  localStorage.setItem('users', JSON.stringify(users));
};

// Get the current authenticated user
const getCurrentUser = () => {
  const userJson = localStorage.getItem('currentUser');
  return userJson ? JSON.parse(userJson) : null;
};

// Set the current authenticated user
const setCurrentUser = (user) => {
  if (user) {
    // Remove password before storing in local storage
    const { password, ...userWithoutPassword } = user;
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
  } else {
    localStorage.removeItem('currentUser');
  }
};

/**
 * Register a new user
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @param {string} name - User's display name
 * @returns {Promise} - Promise that resolves with the new user
 */
export const registerUser = (email, password, name) => {
  return new Promise((resolve, reject) => {
    try {
      // Simulate network delay
      setTimeout(() => {
        const users = getUsers();
        
        // Check if user already exists
        if (users.some(user => user.email === email)) {
          return reject({
            code: 'auth/email-already-in-use',
            message: 'The email address is already in use by another account.'
          });
        }
        
        // Create new user
        const newUser = {
          uid: Date.now().toString(),
          email,
          password, // In a real app, this would be hashed
          displayName: name,
          emailVerified: false,
          createdAt: new Date().toISOString()
        };
        
        // Add user to database
        users.push(newUser);
        saveUsers(users);
        
        // Set current user (without password)
        const { password: _, ...userWithoutPassword } = newUser;
        setCurrentUser(userWithoutPassword);
        
        resolve(userWithoutPassword);
      }, 500); // Simulate network delay
    } catch (error) {
      reject({
        code: 'auth/operation-not-allowed',
        message: 'An error occurred during registration.'
      });
    }
  });
};

/**
 * Sign in a user with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise} - Promise that resolves with the user
 */
export const signInWithEmailAndPassword = (email, password) => {
  return new Promise((resolve, reject) => {
    try {
      // Simulate network delay
      setTimeout(() => {
        const users = getUsers();
        const user = users.find(user => user.email === email);
        
        // Check if user exists
        if (!user) {
          return reject({
            code: 'auth/user-not-found',
            message: 'No user found with this email address.'
          });
        }
        
        // Check if password is correct
        if (user.password !== password) {
          return reject({
            code: 'auth/wrong-password',
            message: 'Incorrect password.'
          });
        }
        
        // Set current user (without password)
        const { password: _, ...userWithoutPassword } = user;
        setCurrentUser(userWithoutPassword);
        
        resolve({
          user: userWithoutPassword
        });
      }, 500); // Simulate network delay
    } catch (error) {
      reject({
        code: 'auth/invalid-credential',
        message: 'An error occurred during login.'
      });
    }
  });
};

/**
 * Sign out the current user
 * @returns {Promise} - Promise that resolves when sign out is complete
 */
export const signOut = () => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      setCurrentUser(null);
      resolve();
    }, 300);
  });
};

/**
 * Send a password reset email
 * @param {string} email - User's email
 * @returns {Promise} - Promise that resolves when email is sent
 */
export const sendPasswordResetEmail = (email) => {
  return new Promise((resolve, reject) => {
    try {
      // Simulate network delay
      setTimeout(() => {
        const users = getUsers();
        const user = users.find(user => user.email === email);
        
        // Check if user exists
        if (!user) {
          return reject({
            code: 'auth/user-not-found',
            message: 'No user found with this email address.'
          });
        }
        
        // In a real app, this would send an email
        console.log(`[LOCAL-AUTH] Password reset requested for: ${email}`);
        
        resolve();
      }, 500);
    } catch (error) {
      reject({
        code: 'auth/invalid-email',
        message: 'An error occurred while sending the password reset email.'
      });
    }
  });
};

/**
 * Update a user's profile
 * @param {Object} user - User object
 * @param {Object} profile - Profile data to update
 * @returns {Promise} - Promise that resolves when profile is updated
 */
export const updateProfile = (user, profile) => {
  return new Promise((resolve, reject) => {
    try {
      // Simulate network delay
      setTimeout(() => {
        const users = getUsers();
        const userIndex = users.findIndex(u => u.uid === user.uid);
        
        if (userIndex === -1) {
          return reject({
            code: 'auth/user-not-found',
            message: 'User not found.'
          });
        }
        
        // Update user profile
        users[userIndex] = {
          ...users[userIndex],
          ...profile
        };
        
        saveUsers(users);
        
        // Update current user if it's the same user
        const currentUser = getCurrentUser();
        if (currentUser && currentUser.uid === user.uid) {
          setCurrentUser({
            ...currentUser,
            ...profile
          });
        }
        
        resolve();
      }, 300);
    } catch (error) {
      reject({
        code: 'auth/operation-not-allowed',
        message: 'An error occurred while updating the profile.'
      });
    }
  });
};

/**
 * Subscribe to auth state changes
 * @param {Function} callback - Function to call when auth state changes
 * @returns {Function} - Unsubscribe function
 */
export const onAuthStateChanged = (callback) => {
  // Initial call with current user
  callback(getCurrentUser());
  
  // Set up event listener for storage changes
  const handleStorageChange = (event) => {
    if (event.key === 'currentUser') {
      callback(getCurrentUser());
    }
  };
  
  window.addEventListener('storage', handleStorageChange);
  
  // Return unsubscribe function
  return () => {
    window.removeEventListener('storage', handleStorageChange);
  };
};

// Create a mock auth object that mimics Firebase Auth
export const auth = {
  currentUser: getCurrentUser(),
  onAuthStateChanged
};

// Initialize the database
initializeDatabase();
