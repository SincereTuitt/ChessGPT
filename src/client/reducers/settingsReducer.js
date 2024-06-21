import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  theme: 'green',
}

export const settingsSlice = createSlice ({
  name: 'settings',
  initialState,
  reducers: {
    changeTheme: (state, action) => {
      state.theme = action.payload;
    }
  }
});

export const {changeTheme} = settingsSlice.actions;
export default settingsSlice.reducer;