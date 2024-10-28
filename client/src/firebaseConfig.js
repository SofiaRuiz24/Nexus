// src/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCPf9KhYnLHAW9Y51e7SFNssF5eqntpFlQ",
    authDomain: "proyectosuda-4451a.firebaseapp.com",
    projectId: "proyectosuda-4451a",
    storageBucket: "proyectosuda-4451a.appspot.com",
    messagingSenderId: "246310202177",
    appId: "1:246310202177:web:967b64de755d11e73b0fc0",
    measurementId: "G-3RVE3YC1KH"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
