import { configureStore } from "@reduxjs/toolkit";
import workoutReducer from "./features/workouts/workoutsSlice";
import userInfoReducer from "./features/userInfo/userInfoSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      workout: workoutReducer,
      userInfo: userInfoReducer,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
