import { configureStore } from "@reduxjs/toolkit"
import boardReducer from "./reducers/boardReducer"
import settingsReducer from "./reducers/settingsReducer"

export const store = configureStore({
  reducer: {
    board: boardReducer ,
    settings: settingsReducer
  },
})