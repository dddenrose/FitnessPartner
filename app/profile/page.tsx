"use client";
import React, { useEffect } from "react";
import { Card, Divider, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import {
  fetchUserProfile,
  selectUserProfileLoading,
} from "@/lib/features/userProfile/userProfileSlice";
import { fetchAllWorkoutSessions } from "@/lib/features/workoutReport/workoutReportSlice";
import { selectFirebaseUser } from "@/lib/features/userInfo/userInfoSlice";
import type { AppDispatch } from "@/lib/store";
import AvatarUpload from "./components/AvatarUpload";
import BasicInfoForm from "./components/BasicInfoForm";
import FitnessSummary from "./components/FitnessSummary";
import GoalSettings from "./components/GoalSettings";

const ProfileContent: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const firebaseUser = useSelector(selectFirebaseUser);
  const loading = useSelector(selectUserProfileLoading);

  useEffect(() => {
    if (firebaseUser?.uid) {
      dispatch(fetchUserProfile(firebaseUser.uid));
      dispatch(fetchAllWorkoutSessions());
    }
  }, [firebaseUser?.uid, dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <Card>
        <div className="flex flex-col items-center">
          <AvatarUpload />
        </div>
        <Divider />
        <BasicInfoForm />
      </Card>

      <Card>
        <FitnessSummary />
      </Card>

      <Card>
        <GoalSettings />
      </Card>
    </div>
  );
};

const ProfilePage: React.FC = () => {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
};

export default ProfilePage;
