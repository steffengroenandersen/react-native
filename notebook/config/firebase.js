// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCquTUj_p5ecw4X-56xWHs4lSXMQFbGK7I",
  authDomain: "kea-react-native-65729.firebaseapp.com",
  projectId: "kea-react-native-65729",
  storageBucket: "kea-react-native-65729.appspot.com",
  messagingSenderId: "577149764061",
  appId: "1:577149764061:web:8e5c4bb20acae72b0e3634",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getFirestore(app);

export { app, database };
