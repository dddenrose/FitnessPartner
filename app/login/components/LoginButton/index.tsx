"use client";
import { RootState } from "@/lib/store";
import {
  selectFirebaseUser,
  selectIsAuthenticated,
} from "@/lib/features/userInfo/userInfoSlice";
import { Button, Space, Typography, Avatar, message, Spin, Card } from "antd";
import { signInWithPopup, signOut } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { auth, googleProvider } from "@/app/firebase";
import { useRouter } from "next/navigation";
import EmailPasswordForm from "../EmailPasswordForm";

const { Text, Title } = Typography;

const LoginButton: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectFirebaseUser);
  const [loading, setLoading] = useState(false);

  // Check if user was redirected after authentication
  useEffect(() => {
    if (isAuthenticated && user) {
      message.success(`Welcome ${user.displayName || "back"}!`);
    }
  }, [isAuthenticated, user]);

  const handleSignIn = async () => {
    try {
      setLoading(true);
      // Using signInWithPopup instead of redirect for better UX
      await signInWithPopup(auth, googleProvider);
      // No need to handle the result here as the AuthProvider will update the Redux store
    } catch (error: any) {
      console.error("Login failed:", error);
      message.error(`Login failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      message.info("You have been logged out");
    } catch (error: any) {
      console.error("Logout failed:", error);
      message.error(`Logout failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGoToHome = () => {
    router.push("/home");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large">
          <div
            className="p-8 rounded-md flex flex-col items-center justify-center"
            style={{ minHeight: "100px", minWidth: "200px" }}
          >
            <div className="text-center mt-4">Please wait...</div>
          </div>
        </Spin>
      </div>
    );
  }

  return (
    <>
      {isAuthenticated && user ? (
        <div className="flex flex-col items-center space-y-4">
          <Avatar
            size={80}
            src={user.photoURL || undefined}
            alt={user.displayName || "User"}
          >
            {!user.photoURL && (user.displayName?.[0] || "U")}
          </Avatar>
          <Title level={4}>Welcome, {user.displayName || "User"}!</Title>
          <Text>{user.email}</Text>

          <Space direction="vertical" style={{ width: "100%" }}>
            <Button type="primary" onClick={handleGoToHome} block size="large">
              Go to Dashboard
            </Button>

            <Button onClick={handleSignOut} block danger>
              Sign Out
            </Button>
          </Space>
        </div>
      ) : (
        <div className="space-y-4">
          <Text className="block text-center mb-6">
            Sign in to track your workouts and achieve your fitness goals
          </Text>

          <Button
            type="primary"
            icon={
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                className="w-5 h-5 mr-2"
                alt="Google"
              />
            }
            onClick={handleSignIn}
            size="large"
            block
            className="flex items-center justify-center"
          >
            Sign in with Google
          </Button>

          {/* Email/Password Login Form */}
          <EmailPasswordForm />
        </div>
      )}

      {loading && (
        <div className="absolute inset-0 flex justify-center items-center bg-black/20">
          <Spin size="large">
            <div
              className="bg-white p-4 rounded-md flex flex-col items-center justify-center"
              style={{ minHeight: "80px", minWidth: "150px" }}
            >
              <div className="text-center mt-4">Please wait...</div>
            </div>
          </Spin>
        </div>
      )}
    </>
  );
};

export default LoginButton;
