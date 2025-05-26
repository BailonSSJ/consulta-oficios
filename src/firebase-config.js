import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAheth-iCGenbU3n68q5PXADt8posrlyug",
  authDomain: "gestion-oficios-pc.firebaseapp.com",
  databaseURL: "https://gestion-oficios-pc-default-rtdb.firebaseio.com",
  projectId: "gestion-oficios-pc",
  storageBucket: "gestion-oficios-pc.firebasestorage.app",
  messagingSenderId: "1012485780559",
  appId: "1:1012485780559:web:fd0e985b31fd2900fea63a"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
