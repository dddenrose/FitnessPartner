import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";
import { list } from "./const";

// Define a type for the slice state
interface WorkoutState {
  list: WorkoutItem[];
}

// Define the initial state using that type
const initialState: WorkoutState = {
  list,
};

export const counterSlice = createSlice({
  name: "workout",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    decrement: (state) => {
      state.list = state.list
        ?.map((item, index) => {
          if (index !== 0) return item;

          if (item?.execriseTimes) {
            return {
              ...item,
              execriseTimes: item.execriseTimes - 1,
            };
          } else if (item?.restTimes) {
            return {
              ...item,
              restTimes: item.restTimes - 1,
            };
          } else if (item?.set) {
            return {
              ...item,
              times: item.set - 1,
              execriseTimes: state.list?.[0]?.requiredItem?.time,
              restTimes: state.list?.[0]?.requiredItem?.rest,
            };
          } else if (item?.prepareTimes) {
            return {
              ...item,
              prepareTimes: item.prepareTimes - 1,
            };
          } else {
            return null;
          }
        })
        ?.filter((ele) => ele) as WorkoutItem[];
    },
    skip: (state) => {
      state.list = state.list?.slice(1);
    },
    switchList: (state, action: PayloadAction<number>) => {
      const id = action.payload;

      const target = state.list?.find((item) => item?.id === id);

      if (!target) return;

      const result = state.list?.filter((item) => item?.id !== id);

      state.list = [target, ...result];
    },
  },
});

export const { decrement, skip, switchList } = counterSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectList = (state: RootState) => state.workout.list;

export default counterSlice.reducer;
