const { auth } = require('./utils/firebaseAdmin');

const target = process.argv[2];

if (!target) {
  console.log('Usage: node verify-user.js <email-or-uid>');
  process.exit(1);
}

(async () => {
  try {
    let uid = target;
    if (target.includes('@')) {
      const user = await auth.getUserByEmail(target.trim().toLowerCase());
      uid = user.uid;
    }
    const updated = await auth.updateUser(uid, { emailVerified: true });
    console.log(`Successfully verified email for: ${updated.email} (UID: ${updated.uid})`);
    process.exit(0);
  } catch (err) {
    console.error('Failed to verify user:', err.message);
    process.exit(1);
  }
})();
