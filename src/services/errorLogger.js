/**
 * Error Logger Service
 * Provides centralized error logging functionality for the application
 */

// Map of Firebase auth error codes to user-friendly messages
const authErrorMessages = {
  // Authentication errors
  'auth/email-already-in-use': 'This email address is already in use by another account.',
  'auth/invalid-email': 'The email address is not valid.',
  'auth/operation-not-allowed': 'Email/password accounts are not enabled. Contact support.',
  'auth/weak-password': 'The password is too weak. Please use a stronger password.',
  'auth/user-disabled': 'This account has been disabled. Please contact support.',
  'auth/user-not-found': 'No account found with this email address.',
  'auth/wrong-password': 'Incorrect password. Please try again.',
  'auth/invalid-credential': 'The provided credentials are invalid or have expired.',
  'auth/invalid-verification-code': 'The verification code is invalid.',
  'auth/invalid-verification-id': 'The verification ID is invalid.',
  'auth/missing-verification-code': 'The verification code is missing.',
  'auth/missing-verification-id': 'The verification ID is missing.',
  'auth/too-many-requests': 'Too many unsuccessful login attempts. Please try again later or reset your password.',
  'auth/network-request-failed': 'A network error occurred. Please check your internet connection and try again.',
  'auth/popup-closed-by-user': 'The authentication popup was closed before completing the sign-in process.',
  'auth/unauthorized-domain': 'This domain is not authorized for OAuth operations.',
  'auth/expired-action-code': 'The action code has expired. Please request a new one.',
  'auth/invalid-action-code': 'The action code is invalid. This can happen if the code is malformed or has already been used.',
  'auth/missing-continue-uri': 'A continue URL must be provided in the request.',
  'auth/invalid-continue-uri': 'The continue URL provided is invalid.',
  'auth/missing-phone-number': 'The phone number is missing.',
  'auth/invalid-phone-number': 'The phone number is invalid.',
  'auth/missing-app-credential': 'The app credential is missing.',
  'auth/invalid-app-credential': 'The app credential is invalid.',
  'auth/session-expired': 'The SMS code has expired. Please re-send the verification code to try again.',
  'auth/quota-exceeded': 'The SMS quota for the project has been exceeded.',
  'auth/missing-multi-factor-session': 'No multi-factor session found.',
  'auth/missing-multi-factor-info': 'No multi-factor info found.',
  'auth/invalid-multi-factor-session': 'The multi-factor session is invalid.',
  'auth/multi-factor-info-not-found': 'The multi-factor info was not found.',
  'auth/multi-factor-auth-required': 'Multi-factor authentication is required to complete sign-in.',
  'auth/second-factor-already-in-use': 'The second factor is already enrolled on this account.',
  'auth/maximum-second-factor-count-exceeded': 'The maximum allowed number of second factors has been exceeded.',
  'auth/unsupported-first-factor': 'The first factor authentication is not supported.',
  'auth/unsupported-second-factor': 'The second factor authentication is not supported.',
  'auth/requires-recent-login': 'This operation requires recent authentication. Please log in again before retrying.',
  'auth/provider-already-linked': 'The provider is already linked to the user.',
  'auth/credential-already-in-use': 'This credential is already associated with a different user account.',
  'auth/email-already-in-use': 'The email address is already in use by another account.',
  'auth/account-exists-with-different-credential': 'An account already exists with the same email address but different sign-in credentials.',
  'auth/missing-or-invalid-nonce': 'The OIDC nonce is missing or invalid.',
  'auth/tenant-id-mismatch': 'The provided tenant ID does not match the Auth instance\'s tenant ID.',
  'auth/rejected-credential': 'The request contains malformed or mismatching credentials.',
  'auth/invalid-tenant-id': 'The tenant ID is invalid.',
  'auth/missing-tenant-id': 'The tenant ID is missing.',
  'auth/missing-iframe-start': 'An internal error has occurred.',
  'auth/missing-iframe-end': 'An internal error has occurred.',
  'auth/missing-app-config': 'An internal error has occurred.',
  'auth/missing-app-config-values': 'An internal error has occurred.',
  'auth/invalid-app-config': 'An internal error has occurred.',
  'auth/invalid-app-config-values': 'An internal error has occurred.',
  'auth/invalid-oauth-client-id': 'The OAuth client ID is invalid.',
  'auth/invalid-oauth-provider': 'The OAuth provider is invalid.',
  'auth/invalid-oauth-scope': 'The OAuth scope is invalid.',
  'auth/invalid-oauth-response-type': 'The OAuth response type is invalid.',
  'auth/invalid-oauth-flow': 'The OAuth flow is invalid.',
  'auth/invalid-oauth-credential': 'The OAuth credential is invalid.',
  'auth/invalid-oauth-token': 'The OAuth token is invalid.',
  'auth/invalid-oauth-token-secret': 'The OAuth token secret is invalid.',
  'auth/invalid-oauth-access-token': 'The OAuth access token is invalid.',
  'auth/invalid-oauth-id-token': 'The OAuth ID token is invalid.',
  'auth/invalid-oauth-jwt': 'The OAuth JWT is invalid.',
  'auth/invalid-oauth-jwt-payload': 'The OAuth JWT payload is invalid.',
  'auth/invalid-oauth-jwt-signature': 'The OAuth JWT signature is invalid.',
  'auth/invalid-oauth-jwt-audience': 'The OAuth JWT audience is invalid.',
  'auth/invalid-oauth-jwt-issuer': 'The OAuth JWT issuer is invalid.',
  'auth/invalid-oauth-jwt-subject': 'The OAuth JWT subject is invalid.',
  'auth/invalid-oauth-jwt-claims': 'The OAuth JWT claims are invalid.',
  'auth/invalid-oauth-jwt-header': 'The OAuth JWT header is invalid.',
  'auth/invalid-oauth-jwt-alg': 'The OAuth JWT algorithm is invalid.',
  'auth/invalid-oauth-jwt-kid': 'The OAuth JWT key ID is invalid.',
  'auth/invalid-oauth-jwt-exp': 'The OAuth JWT expiration time is invalid.',
  'auth/invalid-oauth-jwt-iat': 'The OAuth JWT issued-at time is invalid.',
  'auth/invalid-oauth-jwt-nbf': 'The OAuth JWT not-before time is invalid.',
  'auth/invalid-oauth-jwt-jti': 'The OAuth JWT ID is invalid.',
  'auth/invalid-oauth-jwt-typ': 'The OAuth JWT type is invalid.',
  'auth/invalid-oauth-jwt-cty': 'The OAuth JWT content type is invalid.',
  'auth/invalid-oauth-jwt-enc': 'The OAuth JWT encryption algorithm is invalid.',
  'auth/invalid-oauth-jwt-zip': 'The OAuth JWT compression algorithm is invalid.',
  'auth/invalid-oauth-jwt-use': 'The OAuth JWT use is invalid.',
  'auth/invalid-oauth-jwt-key-ops': 'The OAuth JWT key operations are invalid.',
  'auth/invalid-oauth-jwt-x5c': 'The OAuth JWT X.509 certificate chain is invalid.',
  'auth/invalid-oauth-jwt-x5t': 'The OAuth JWT X.509 certificate SHA-1 thumbprint is invalid.',
  'auth/invalid-oauth-jwt-x5u': 'The OAuth JWT X.509 URL is invalid.',
  'auth/invalid-oauth-jwt-jwk': 'The OAuth JWT JWK is invalid.',
  'auth/invalid-oauth-jwt-jku': 'The OAuth JWT JWK URL is invalid.',
  'auth/invalid-oauth-jwt-kty': 'The OAuth JWT key type is invalid.',
  'auth/invalid-oauth-jwt-crv': 'The OAuth JWT curve is invalid.',
  'auth/invalid-oauth-jwt-x': 'The OAuth JWT x coordinate is invalid.',
  'auth/invalid-oauth-jwt-y': 'The OAuth JWT y coordinate is invalid.',
  'auth/invalid-oauth-jwt-d': 'The OAuth JWT private key is invalid.',
  'auth/invalid-oauth-jwt-n': 'The OAuth JWT modulus is invalid.',
  'auth/invalid-oauth-jwt-e': 'The OAuth JWT exponent is invalid.',
  'auth/invalid-oauth-jwt-p': 'The OAuth JWT prime factor p is invalid.',
  'auth/invalid-oauth-jwt-q': 'The OAuth JWT prime factor q is invalid.',
  'auth/invalid-oauth-jwt-dp': 'The OAuth JWT dp is invalid.',
  'auth/invalid-oauth-jwt-dq': 'The OAuth JWT dq is invalid.',
  'auth/invalid-oauth-jwt-qi': 'The OAuth JWT coefficient is invalid.',
  'auth/invalid-oauth-jwt-oth': 'The OAuth JWT other primes info is invalid.',
  'auth/invalid-oauth-jwt-k': 'The OAuth JWT symmetric key is invalid.',
};

// Default error message when no specific message is found
const DEFAULT_ERROR_MESSAGE = 'An unexpected error occurred. Please try again.';

/**
 * Log an error to the console with additional context
 * 
 * @param {Error} error - The error object
 * @param {string} context - The context where the error occurred (e.g., 'login', 'register')
 * @param {Object} additionalData - Any additional data to log with the error
 */
export const logError = (error, context, additionalData = {}) => {
  // Create a structured error log
  const errorLog = {
    timestamp: new Date().toISOString(),
    context,
    message: error.message,
    code: error.code,
    stack: error.stack,
    ...additionalData
  };
  
  // Log to console in development
  console.error(`[${context.toUpperCase()}] Error:`, errorLog);
  
  // In a production app, you might want to send this to a logging service
  // Example: sendToLoggingService(errorLog);
  
  return errorLog;
};

/**
 * Get a user-friendly error message for Firebase auth errors
 * 
 * @param {Error} error - The Firebase auth error
 * @returns {string} - User-friendly error message
 */
export const getAuthErrorMessage = (error) => {
  if (!error || !error.code) {
    return DEFAULT_ERROR_MESSAGE;
  }
  
  return authErrorMessages[error.code] || DEFAULT_ERROR_MESSAGE;
};

/**
 * Handle authentication errors with logging and user-friendly messages
 * 
 * @param {Error} error - The error object
 * @param {string} context - The context where the error occurred
 * @param {Object} additionalData - Any additional data to log with the error
 * @returns {string} - User-friendly error message
 */
export const handleAuthError = (error, context, additionalData = {}) => {
  // Log the error
  logError(error, context, additionalData);
  
  // Return a user-friendly message
  return getAuthErrorMessage(error);
};
