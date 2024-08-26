import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBUl9cL-sAA9bp4W0i14hbJ-uaEA9jLfyg",
    authDomain: "todoapp-460fb.firebaseapp.com",
    projectId: "todoapp-460fb",
    storageBucket: "todoapp-460fb.appspot.com",
    messagingSenderId: "149386007485",
    appId: "1:149386007485:web:71eb1bcdcd9cf525a238d4"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getFirestore(app);
// const auth = getAuth(app);

// export { database, auth };
export { database };
