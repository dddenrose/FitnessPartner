import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userInfoReducer from "./features/userInfo/userInfoSlice";
import audioReducer from "./features/audio/audioSlice";
import FirebaseReducer from "./features/firebase/firebaseSlice";
import workoutReportReducer from "./features/workoutReport/workoutReportSlice";
import exerciseReducer from "./features/exercise/exerciseSlice";
import themeReducer from "./features/theme/themeSlice";
import bpmDetectorReducer from "./features/bpmDetector/bpmDetectorSlice";
import userProfileReducer from "./features/userProfile/userProfileSlice";

// Redux-Persist imports
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; // 默認使用 localStorage

// 配置 Redux-Persist
const exercisePersistConfig = {
  key: "exercise",
  storage,
  whitelist: [
    "currentExercise",
    "remainingExercises",
    "completedExercises",
    "initialWorkoutPlan",
    "sessionInfo",
    "workoutType",
    "status",
  ], // 只持久化這些欄位
};

const workoutReportPersistConfig = {
  key: "workoutReport",
  storage,
  whitelist: ["reports"], // 持久化報告數據
};

const themePersistConfig = {
  key: "theme",
  storage,
  whitelist: ["mode"], // 持久化主題模式
};

// 合併所有 reducers
const rootReducer = combineReducers({
  userInfo: userInfoReducer,
  exercise: persistReducer(exercisePersistConfig, exerciseReducer),
  audio: audioReducer,
  firebase: FirebaseReducer,
  workoutReport: persistReducer(
    workoutReportPersistConfig,
    workoutReportReducer,
  ),
  theme: persistReducer(themePersistConfig, themeReducer),
  bpmDetector: bpmDetectorReducer,
  userProfile: userProfileReducer,
});

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          // 忽略 Redux-Persist 的 actions
          ignoredActions: [
            FLUSH,
            REHYDRATE,
            PAUSE,
            PERSIST,
            PURGE,
            REGISTER,
            "firebase/setApp",
            "exercise/setMode",
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
    // 啟用 Redux DevTools
    devTools: process.env.NODE_ENV !== "production",
  });
};

// 創建 persistor
export const makePersistedStore = () => {
  const store = makeStore();
  const persistor = persistStore(store);
  return { store, persistor };
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
