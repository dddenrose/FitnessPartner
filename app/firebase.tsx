import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";

// 檢查環境變數是否正確加載
if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
  console.error(
    "Firebase 配置環境變數未正確加載。請確保在部署環境中設置了所有必要的環境變數。"
  );
}

// 使用環境變數配置 Firebase
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth and get a reference to the service
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
// Initialize Realtime Database
export const database = getDatabase(app);

console.log("====Firebase app initialized");
console.log("====Database URL:", process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL);
console.log("====Database reference initialized:", database ? "成功" : "失敗");

// Add additional scopes as needed
googleProvider.addScope("https://www.googleapis.com/auth/contacts.readonly");

// Optional: Enable analytics if supported
const enableAnalytics = async () => {
  if (await isSupported()) {
    return getAnalytics(app);
  }
  return null;
};
