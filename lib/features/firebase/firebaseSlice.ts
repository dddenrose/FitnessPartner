import { createSlice } from "@reduxjs/toolkit";

// Firebase 狀態應該只包含可序列化的資料
// 而不是 Firebase 應用實例本身
export interface TFirebaseState {
  isInitialized: boolean;
  authLoaded: boolean;
  error: string | null;
}

export const firebaseSlice = createSlice({
  name: "firebase",
  initialState: {
    isInitialized: false,
    authLoaded: false,
    error: null,
  } as TFirebaseState,
  reducers: {
    setFirebaseInitialized: (state, action) => {
      state.isInitialized = action.payload;
    },
    setAuthLoaded: (state, action) => {
      state.authLoaded = action.payload;
    },
    setFirebaseError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { 
  setFirebaseInitialized, 
  setAuthLoaded,
  setFirebaseError 
} = firebaseSlice.actions;

export default firebaseSlice.reducer;
