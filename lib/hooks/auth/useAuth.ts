"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectFirebaseUser,
  selectIsAuthenticated,
  setFirebaseUser,
  logout,
} from "@/lib/features/userInfo/userInfoSlice";
import { auth } from "@/app/firebase";
import {
  signInWithPopup,
  signInWithRedirect,
  GoogleAuthProvider,
  signOut,
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { googleProvider } from "@/app/firebase";
import { useRouter } from "next/navigation";

export const useAuth = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const user = useSelector(selectFirebaseUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const handleAuthStateChange = (user: User | null) => {
    dispatch(setFirebaseUser(user ? user : null));
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Error signing in with Google:", error);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogleRedirect = async () => {
    try {
      await signInWithRedirect(auth, googleProvider);
    } catch (error) {
      console.error("Error signing in with Google redirect:", error);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    displayName: string
  ) => {
    try {
      setLoading(true);

      // 創建用戶
      const credential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // 設置顯示名稱
      if (credential.user) {
        await updateProfile(credential.user, { displayName });
        handleAuthStateChange(credential.user);
      }

      return credential.user;
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const credential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return credential.user;
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      dispatch(logout());
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(handleAuthStateChange);
    return () => unsubscribe();
  }, []);

  return {
    user,
    isAuthenticated,
    loading,
    signInWithGoogle,
    signInWithGoogleRedirect,
    signUp,
    signIn,
    logoutUser,
  };
};
