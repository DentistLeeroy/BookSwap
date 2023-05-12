import * as admin from 'firebase-admin';
import * as path from 'path';

const serviceKeyPath = path.resolve(__dirname, 'keys/serviceKey.json');
const serviceKey = require(serviceKeyPath);

if (!admin.apps.length) { // Check if the Firebase Admin app is already initialized
  admin.initializeApp({
    credential: admin.credential.cert(serviceKey),
    // Your Firebase configuration
  });
}

const firestore = admin.firestore();

export { firestore };
export default admin;
