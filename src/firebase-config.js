import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCKE7EzS8mEQxOhTiSofHG0u8NLKHsMXjo",
  authDomain: "crud-app-73bcf.firebaseapp.com",
  projectId: "crud-app-73bcf",
  storageBucket: "crud-app-73bcf.firebasestorage.app",
  messagingSenderId: "130155703349",
  appId: "1:130155703349:web:8a60165c8f6ab499a7557c",
  measurementId: "G-M6P1JEKQQM",
};

const app = initializeApp(firebaseConfig);

getAnalytics(app);

const db = getFirestore(app);

const auth = getAuth(app);

const storage = getStorage(app);

export { db, auth, storage };
