import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import { app } from './firebase';

const functions = getFunctions(app);

// Connect to emulator in development environment
if (process.env.NODE_ENV === 'development') {
  connectFunctionsEmulator(functions, 'localhost', 5001);
}

// Configure region for production
if (process.env.NODE_ENV === 'production') {
  functions.region = 'asia-south1'; // Mumbai region for better latency in Asia
}

export { functions };
