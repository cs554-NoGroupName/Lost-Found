import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getStorage } from 'firebase-admin/storage';

import dotenv from 'dotenv';
dotenv.config();

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
const app = initializeApp({
  credential: cert(serviceAccount),
  storageBucket: 'gs://lostfoundstevens.appspot.com',
});

export const storage = getStorage(app);
export const auth = getAuth(app);
