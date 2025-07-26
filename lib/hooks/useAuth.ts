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

  // Sign in with Google using popup
  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign in with Google using redirect (better for mobile)
  const signInWithGoogleRedirect = () => {
    setLoading(true);
    return signInWithRedirect(auth, googleProvider);
  };

  // Register with email and password
  const registerWithEmailAndPassword = async (
    email: string,
    password: string,
    displayName?: string
  ) => {
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update profile if displayName is provided
      if (displayName) {
        await updateProfile(userCredential.user, { displayName });
      }

      return userCredential.user;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Login with email and password
  const loginWithEmailAndPassword = async (email: string, password: string) => {
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential.user;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const logoutUser = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      dispatch(logout());
      router.push("/login");
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    isAuthenticated,
    loading,
    signInWithGoogle,
    signInWithGoogleRedirect,
    loginWithEmailAndPassword,
    registerWithEmailAndPassword,
    logout: logoutUser,
  };
};
