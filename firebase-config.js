import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore'
import { getStorage, ref } from "firebase/storage";

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyDIdEE2z2jrILfwTyX54yyunNk9GnMcm1s",
  authDomain: "trazedata.firebaseapp.com",
  projectId: "trazedata",
  storageBucket: "trazedata.appspot.com",
  messagingSenderId: "66104961022",
  appId: "1:66104961022:web:11b103db4363ac3ee6c2af"
};

export const app = initializeApp(firebaseConfig);
// MARK: Firestore Reference
export const db = getFirestore(app);
export const storage = getStorage(db);
export const storageRef = ref(storage);
