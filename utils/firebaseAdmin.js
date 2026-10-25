const { initializeApp, cert } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const fs = require('fs');
const path = require('path');

let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } catch (err) {
    console.error('Error parsing FIREBASE_SERVICE_ACCOUNT env var:', err);
  }
}

if (!serviceAccount) {
  const possiblePaths = [
    path.join(__dirname, '..', 'firebaseServiceAccountKey.json'),
    path.join(process.cwd(), 'firebaseServiceAccountKey.json'),
    '/etc/secrets/firebaseServiceAccountKey.json',
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      try {
        serviceAccount = require(p);
        break;
      } catch (err) {
        console.error(`Error loading service account from ${p}:`, err);
      }
    }
  }
}

if (!serviceAccount) {
  console.error(
    'CRITICAL: Firebase service account key not found! Provide firebaseServiceAccountKey.json or set FIREBASE_SERVICE_ACCOUNT env var.',
  );
}

const app = initializeApp({
  credential: cert(serviceAccount),
});

const auth = getAuth(app);

module.exports = { app, auth };
