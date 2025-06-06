import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin
admin.initializeApp();

// Environment-specific configuration
const config = {
  development: {
    cors: true,
    timeoutSeconds: 60,
    memory: '256MB' as const,
  },
  production: {
    cors: true,
    timeoutSeconds: 300,
    memory: '512MB' as const,
  },
};

// Get current environment
const environment = process.env.NODE_ENV === 'production' ? 'production' : 'development';
const envConfig = config[environment];

// Export functions with environment-specific configuration
export const fetchBookMetadata = functions
  .region('asia-south1')
  .runWith({
    timeoutSeconds: envConfig.timeoutSeconds,
    memory: envConfig.memory,
  })
  .https.onCall(async (data, context) => {
    // Ensure user is authenticated
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'The function must be called while authenticated.'
      );
    }

    try {
      // TODO: Implement book metadata fetching logic
      return { message: 'Book metadata fetching not implemented yet' };
    } catch (error) {
      throw new functions.https.HttpsError('internal', 'Error fetching book metadata');
    }
  });

// Add more functions here as needed
