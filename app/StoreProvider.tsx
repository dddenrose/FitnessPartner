"use client";
import { useRef, useEffect } from "react";
import { Provider } from "react-redux";
import { makeStore, AppStore } from "../lib/store";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { setFirebaseInitialized, setAuthLoaded } from "@/lib/features/firebase/firebaseSlice";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore>();

  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
  }

  // Initialize Firebase state after store is created
  useEffect(() => {
    const store = storeRef.current;
    if (store) {
      // 標記 Firebase 初始化
      store.dispatch(setFirebaseInitialized(true));
      
      // 設置 Auth 監聽器
      const unsubscribe = onAuthStateChanged(auth, () => {
        store.dispatch(setAuthLoaded(true));
      });
      
      return () => unsubscribe();
    }
  }, []);

  return <Provider store={storeRef.current}>{children}</Provider>;
}
