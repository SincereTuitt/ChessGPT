import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  theme: 'green',
  isTwoPlayer: true,
}

export const settingsSlice = createSlice ({
  name: 'settings',
  initialState,
  reducers: {
    changeTheme: (state, action) => {
      state.theme = action.payload;
    },
    setTwoPlayer: (state, action) => {
      state.isTwoPlayer = action.payload;
    }
  }
});

export const {changeTheme, setTwoPlayer} = settingsSlice.actions;
export default settingsSlice.reducer;