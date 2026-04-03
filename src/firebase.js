import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyANrRHf4OF_0xBfYmmIQABSESq00WqgHFg",
    authDomain: "wedding-invite-df0b6.firebaseapp.com",
    projectId: "wedding-invite-df0b6",
    storageBucket: "wedding-invite-df0b6.firebasestorage.app",
    messagingSenderId: "108911110788",
    appId: "1:108911110788:web:b5c1db1e429aae293a70d1"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);