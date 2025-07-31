// frontend/utils/config.js

import Constants from 'expo-constants';

// --- The Dynamic IP Logic ---

// Get the full URI of the Expo development server.
// It will look something like `exp://10.9.40.222:8081`.
const { manifest } = Constants;
const uri = manifest?.debuggerHost?.split(':').shift();

// Set the backend server port. This is likely 3000, 5000, or whatever you configured.
const backendPort = '5000'; // IMPORTANT: Change this if your backend runs on a different port.

// Construct the base URL dynamically.
// It will now correctly be "http://10.9.40.222:3000" on your current network.
export const BASE_URL = `http://${uri}:${backendPort}`;

console.log('🚀 Backend URL configured to:', BASE_URL);
