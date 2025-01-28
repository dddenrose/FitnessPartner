import { createSlice } from "@reduxjs/toolkit";

const audioSlice = createSlice({
  name: "audio",
  initialState: {
    isGlobalPlaying: false,
  },
  reducers: {
    playAudio: (state) => {
      state.isGlobalPlaying = true;
    },
    stopAudio: (state) => {
      state.isGlobalPlaying = false;
    },
    setIsGlobalPlaying: (state, action) => {
      state.isGlobalPlaying = action.payload;
    },
  },
});

export const { playAudio, stopAudio, setIsGlobalPlaying } = audioSlice.actions;
export default audioSlice.reducer;
