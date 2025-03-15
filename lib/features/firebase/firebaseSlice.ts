import { firebaseConfig } from "@/app/firebase";
import { createSlice } from "@reduxjs/toolkit";
import { initializeApp } from "firebase/app";

const app = initializeApp(firebaseConfig);

export interface TFirebaseState {
  app: typeof app;
}

export const firebaseSlice = createSlice({
  name: "firebase",
  initialState: {
    app,
  },
  reducers: {},
});

export default firebaseSlice.reducer;
