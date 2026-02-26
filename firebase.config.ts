// firebase.config.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase配置
const firebaseConfig = {
  apiKey: "AIzaSyDLsiFrs-xQbqNK34kFk2QD5UrN_wTAM38",
  authDomain: "toupee4u-1bcab.firebaseapp.com",
  projectId: "toupee4u-1bcab",
  storageBucket: "toupee4u-1bcab.firebasestorage.app",
  messagingSenderId: "715484017787",
  appId: "1:715484017787:web:555670bcef554c1c2f9ede"
};

// 初始化Firebase
const app = initializeApp(firebaseConfig);

// 导出服务
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;