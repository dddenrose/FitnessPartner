import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ref, get, set } from "firebase/database";
import { updateProfile } from "firebase/auth";
import { database, auth } from "@/app/firebase";
import type { RootState } from "../../store";

export interface FitnessGoals {
  weeklyWorkoutTarget: number;
  weeklyDurationTarget: number;
}

export interface ProfileData {
  displayName: string;
  age: number;
  height: number;
  weight: number;
  fitnessGoals: FitnessGoals;
}

interface UserProfileState {
  profile: ProfileData | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
}

const initialState: UserProfileState = {
  profile: null,
  loading: false,
  saving: false,
  error: null,
};

const defaultProfile: ProfileData = {
  displayName: "",
  age: 0,
  height: 0,
  weight: 0,
  fitnessGoals: {
    weeklyWorkoutTarget: 3,
    weeklyDurationTarget: 150,
  },
};

export const fetchUserProfile = createAsyncThunk(
  "userProfile/fetchUserProfile",
  async (userId: string) => {
    const profileRef = ref(database, `users/${userId}/profile`);
    const snapshot = await get(profileRef);
    if (snapshot.exists()) {
      return snapshot.val() as ProfileData;
    }
    const user = auth.currentUser;
    return {
      ...defaultProfile,
      displayName: user?.displayName || "",
    };
  },
);

export const saveUserProfile = createAsyncThunk(
  "userProfile/saveUserProfile",
  async (profileData: ProfileData) => {
    const user = auth.currentUser;
    if (!user) throw new Error("用戶未登入");

    const profileRef = ref(database, `users/${user.uid}/profile`);
    await set(profileRef, profileData);

    await updateProfile(user, {
      displayName: profileData.displayName,
    });

    return profileData;
  },
);

const userProfileSlice = createSlice({
  name: "userProfile",
  initialState,
  reducers: {
    clearProfileError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "讀取個人資料失敗";
      })
      .addCase(saveUserProfile.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(saveUserProfile.fulfilled, (state, action) => {
        state.saving = false;
        state.profile = action.payload;
      })
      .addCase(saveUserProfile.rejected, (state, action) => {
        state.saving = false;
        state.error = action.error.message || "儲存個人資料失敗";
      });
  },
});

export const { clearProfileError } = userProfileSlice.actions;

export const selectUserProfile = (state: RootState) =>
  state.userProfile.profile;
export const selectUserProfileLoading = (state: RootState) =>
  state.userProfile.loading;
export const selectUserProfileSaving = (state: RootState) =>
  state.userProfile.saving;
export const selectUserProfileError = (state: RootState) =>
  state.userProfile.error;

export default userProfileSlice.reducer;
