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
  },
});

export const { playAudio, stopAudio } = audioSlice.actions;
export default audioSlice.reducer;
