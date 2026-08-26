// ARKİLER Firebase bağlantısı

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import {
    getAuth
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAG8-zWt5I2b1MqGiPuLda_A3WMA29ISIE",
    authDomain: "arkiler-2491f.firebaseapp.com",
    projectId: "arkiler-2491f",
    storageBucket: "arkiler-2491f.firebasestorage.app",
    messagingSenderId: "814922993084",
    appId: "1:814922993084:web:ae356ddc35b9aae6706fb9"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
