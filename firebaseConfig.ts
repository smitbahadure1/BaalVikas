import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB0m_G9bscNfTw1h9LpzafKipKSDnZRw7M",
    authDomain: "bal-vikas-mitra.firebaseapp.com",
    projectId: "bal-vikas-mitra",
    storageBucket: "bal-vikas-mitra.firebasestorage.app",
    messagingSenderId: "572270036141",
    appId: "1:572270036141:web:adbe3235d2bede2d51f224",
    measurementId: "G-P7LED6VFDL"
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
