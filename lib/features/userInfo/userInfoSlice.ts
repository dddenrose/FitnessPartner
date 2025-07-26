import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";
import { User as FirebaseUser } from "firebase/auth";

// Define a type for the slice state
interface UserInfoState {
  user: {
    name: string;
    age: number;
    email: string;
    isNavigationShow: boolean;
    photoURL?: string;
    uid?: string;
  };
  isAuthenticated: boolean;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
}

// Define the initial state using that type
const initialState: UserInfoState = {
  user: {
    name: "John Doe",
    age: 25,
    email: "",
    isNavigationShow: true,
    photoURL: "",
    uid: "",
  },
  isAuthenticated: false,
  firebaseUser: null,
  loading: true,
};

export const userInfoSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserInfoState["user"]>) => {
      state.user = action.payload;
    },
    setNavigationShow: (state, action: PayloadAction<boolean>) => {
      state.user.isNavigationShow = action.payload;
    },
    setFirebaseUser: (state, action: PayloadAction<FirebaseUser | null>) => {
      state.firebaseUser = action.payload;
      state.isAuthenticated = !!action.payload;

      if (action.payload) {
        state.user = {
          ...state.user,
          name: action.payload.displayName || state.user.name,
          email: action.payload.email || state.user.email,
          photoURL: action.payload.photoURL || state.user.photoURL,
          uid: action.payload.uid,
        };
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    logout: (state) => {
      state.firebaseUser = null;
      state.isAuthenticated = false;
      state.user = {
        ...initialState.user,
        isNavigationShow: state.user.isNavigationShow,
      };
    },
  },
});

export const {
  setUser,
  setNavigationShow,
  setFirebaseUser,
  setLoading,
  logout,
} = userInfoSlice.actions;

export const selectUserInfo = (state: RootState) => state.userInfo.user;
export const selectIsAuthenticated = (state: RootState) =>
  state.userInfo.isAuthenticated;
export const selectFirebaseUser = (state: RootState) =>
  state.userInfo.firebaseUser;

export default userInfoSlice.reducer;
