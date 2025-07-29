import { configureStore } from "@reduxjs/toolkit";
import workoutReducer from "./features/workouts/workoutsSlice";
import userInfoReducer from "./features/userInfo/userInfoSlice";
import execriseReducer from "./features/execrise/execriseSlice";
import audioReducer from "./features/audio/audioSlice";
import FirebaseReducer from "./features/firebase/firebaseSlice";
import workoutReportReducer from "./features/workoutReport/workoutReportSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      workout: workoutReducer,
      userInfo: userInfoReducer,
      execrise: execriseReducer,
      audio: audioReducer,
      firebase: FirebaseReducer,
      workoutReport: workoutReportReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          // 忽略特定路徑下的非序列化值檢查
          ignoredActions: [
            "firebase/setApp",
            "execise/setMode",
            "userInfo/setFirebaseUser",
          ],
          // 忽略特定的 action paths
          ignoredActionPaths: [
            "payload.app",
            "meta.arg.app",
            "payload.firebaseUser",
          ],
          // 忽略特定的狀態路徑
          ignoredPaths: ["firebase.app", "userInfo.firebaseUser"],
        },
      }),
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
