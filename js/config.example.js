// ROM Mirror Configuration Template
// IMPORTANT: Do NOT commit your actual API keys to git!

// Step 1: Copy this file to 'config.js' (don't commit config.js)
// Step 2: Replace the placeholder values with your real credentials
// Step 3: Add config.js to your .gitignore file

window.ROM_MIRROR_CONFIG = {
  // Your Google Drive API Key
  // Get this from: https://console.cloud.google.com/apis/credentials
  DRIVE_API_KEY: "YOUR_API_KEY_HERE",

  // Your Google Drive Folder ID
  // Extract from your share URL: https://drive.google.com/drive/folders/FOLDER_ID
  DRIVE_FOLDER_ID: "YOUR_FOLDER_ID_HERE",

  // Optional: Custom configuration
  MAX_RETRIES: 3,
  CACHE_DURATION: 300000, // 5 minutes in milliseconds

  // File type icons mapping
  FILE_ICONS: {
    "zip": "icon-zip",
    "img": "icon-image",
    "iso": "icon-image",
    "apk": "icon-file",
    "txt": "icon-file",
    "md": "icon-file"
  },

  // Error messages
  MESSAGES: {
    LOADING: "Loading ROM files from Google Drive...",
    ERROR: "Failed to connect to Google Drive. Please check your configuration.",
    NO_FILES: "No ROM files found in this folder.",
    DOWNLOAD_SUCCESS: "Download started successfully!"
  }
};

// Development mode - uncomment these lines for local testing
// if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
//   console.log('Development mode: ROM Mirror config loaded');
// }
