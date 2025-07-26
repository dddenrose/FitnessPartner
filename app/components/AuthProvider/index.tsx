"use client";

import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  setFirebaseUser,
  setLoading,
} from "@/lib/features/userInfo/userInfoSlice";
import { auth } from "@/app/firebase";
import { onAuthStateChanged } from "firebase/auth";

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      dispatch(setFirebaseUser(user));
      dispatch(setLoading(false));

      if (user) {
        console.log("User is authenticated:", user.displayName);
      } else {
        console.log("User is not authenticated");
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return <>{children}</>;
};

export default AuthProvider;
