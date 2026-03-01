import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB0PoqVI4J3pu2BlmbQosmo_OsuS5CO7HM",
    authDomain: "asha-mitra-e96b3.firebaseapp.com",
    projectId: "asha-mitra-e96b3",
    storageBucket: "asha-mitra-e96b3.firebasestorage.app",
    messagingSenderId: "222364555374",
    appId: "1:222364555374:web:1bed2b8bf00efbc2c8ee7f",
    measurementId: "G-2KG5LSRPPN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
const auth = getAuth(app);

// Initialize Analytics conditionally (since it requires a browser environment, this prevents crashes on React Native when not running on Web)
let analytics: ReturnType<typeof getAnalytics> | undefined;

isSupported().then((supported) => {
    if (supported) {
        analytics = getAnalytics(app);
    }
}).catch(() => {
    // Ignore errors
});

export { app, analytics, auth };
