"use client";
import { useRef, useEffect } from "react";
import { Provider } from "react-redux";
import { makeStore, AppStore, makePersistedStore } from "../lib/store";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  setFirebaseInitialized,
  setAuthLoaded,
} from "@/lib/features/firebase/firebaseSlice";
import { PersistGate } from "redux-persist/integration/react";
import { Persistor } from "redux-persist";
import { Spin } from "antd";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore>();
  const persistorRef = useRef<Persistor>();

  if (!storeRef.current) {
    // 創建持久化的 store 實例
    const { store, persistor } = makePersistedStore();
    storeRef.current = store;
    persistorRef.current = persistor;
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

  return (
    <Provider store={storeRef.current}>
      <PersistGate
        loading={
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
            }}
          >
            loading...
          </div>
        }
        persistor={persistorRef.current!}
      >
        {children}
      </PersistGate>
    </Provider>
  );
}
