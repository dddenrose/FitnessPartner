"use client";
import { RootState } from "@/lib/store";
import { Button } from "antd";
import {
  getAuth,
  getRedirectResult,
  signInWithPopup,
  signInWithRedirect,
} from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import React from "react";
import { useSelector } from "react-redux";

const LoginButton: React.FC = () => {
  const firebaseApp = useSelector((state: RootState) => state.firebase.app);
  const provider = new GoogleAuthProvider().addScope(
    "https://www.googleapis.com/auth/contacts.readonly"
  );

  const auth = getAuth(firebaseApp);
  auth.languageCode = "it";
  //   const handleSignIn = () =>
  //     signInWithPopup(auth, provider)
  //       .then((result) => {
  //         // This gives you a Google Access Token. You can use it to access the Google API.
  //         const credential = GoogleAuthProvider.credentialFromResult(result);
  //         const token = credential?.accessToken;
  //         // The signed-in user info.
  //         const user = result.user;
  //         // IdP data available using getAdditionalUserInfo(result)
  //         // ...
  //       })
  //       .catch((error) => {
  //         // Handle Errors here.
  //         const errorCode = error.code;
  //         const errorMessage = error.message;
  //         // The email of the user's account used.
  //         const email = error.customData.email;
  //         // The AuthCredential type that was used.
  //         const credential = GoogleAuthProvider.credentialFromError(error);
  //         // ...
  //       });

  const handleSignIn = () => signInWithRedirect(auth, provider);

  getRedirectResult(auth)
    .then((result) => {
      if (!result) return;
      // This gives you a Google Access Token. You can use it to access Google APIs.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;

      // The signed-in user info.
      const user = result.user;
      // IdP data available using getAdditionalUserInfo(result)
      // ...
      console.log(user, "====user");
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });

  return (
    <Button type="primary" onClick={() => handleSignIn()} className="absolute">
      LoginButton
    </Button>
  );
};

export default LoginButton;
