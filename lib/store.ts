import { configureStore } from "@reduxjs/toolkit";
import workoutReducer from "./features/workouts/workoutsSlice";
import userInfoReducer from "./features/userInfo/userInfoSlice";
import execriseReducer from "./features/execrise/execriseSlice";
import audioReducer from "./features/audio/audioSlice";
import FirebaseReducer from "./features/firebase/firebaseSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      workout: workoutReducer,
      userInfo: userInfoReducer,
      execrise: execriseReducer,
      audio: audioReducer,
      firebase: FirebaseReducer,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
