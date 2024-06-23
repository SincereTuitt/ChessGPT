/* this file handles expensive functions that would block the UI, namely 
calculating engine moves */

import { getEngineMove } from "./chessLogic/engine";

self.addEventListener('message', (e) => {
  switch (e.data.request) {
    case 'getEngineMove':
      const {
        depth,
        currentPlayer,
        boardState,
        movedCastlers,
        pawnJumpPrevious
      } = e.data;
      const move = getEngineMove(
        depth, 
        currentPlayer, 
        boardState, 
        movedCastlers, 
        pawnJumpPrevious
      )
      postMessage({move})
      break;
    default:
      break;
  }
})