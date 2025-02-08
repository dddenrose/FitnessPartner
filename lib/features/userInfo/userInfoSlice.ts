import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";

// Define a type for the slice state
interface UserInfoState {
  user: {
    name: string;
    age: number;
    email: string;
    isNavigationShow: boolean;
  };
}

// Define the initial state using that type
const initialState: UserInfoState = {
  user: {
    name: "John Doe",
    age: 25,
    email: "",
    isNavigationShow: true,
  },
};

export const counterSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserInfoState["user"]>) => {
      state.user = action.payload;
    },
    setNavigationShow: (state, action: PayloadAction<boolean>) => {
      state.user.isNavigationShow = action.payload;
    },
  },
});

export const { setUser, setNavigationShow } = counterSlice.actions;

export const selectUserInfo = (state: RootState) => state.userInfo.user;

export default counterSlice.reducer;
