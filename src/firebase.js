import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth , GoogleAuthProvider} from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAYRL3M9hqLoYAgUb7lDXjgD6WveI4_MSw",
    authDomain: "insight-surf.firebaseapp.com",
    projectId: "insight-surf",
    storageBucket: "insight-surf.appspot.com",
    messagingSenderId: "232806272280",
    appId: "1:232806272280:web:a3c58e26b2975aa71aa26d"
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  const storage = getStorage();

  export { auth, provider, storage };
  export default db;