import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";

// Define a type for the slice state
interface UserInfoState {
  user: {
    name: string;
    age: number;
    email: string;
  };
}

// Define the initial state using that type
const initialState: UserInfoState = {
  user: {
    name: "John Doe",
    age: 25,
    email: "",
  },
};

export const counterSlice = createSlice({
  name: "userInfo",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserInfoState["user"]>) => {
      state.user = action.payload;
    },
  },
});

export const { setUser } = counterSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectUserInfo = (state: RootState) => state.userInfo.user;

export default counterSlice.reducer;
