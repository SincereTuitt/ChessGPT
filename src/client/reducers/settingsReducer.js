import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  theme: 'green',
  isTwoPlayer: true,
  playerColor: 'w',
  engineDepth: 2
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
    },
    setPlayerColor: (state, action) => {
      state.playerColor = action.payload;
    },
    setEngineDepth: (state, action) => {
      state.engineDepth = action.payload;
    }
  }
});

export const {changeTheme, setTwoPlayer, setPlayerColor, setEngineDepth} = settingsSlice.actions;
export default settingsSlice.reducer;