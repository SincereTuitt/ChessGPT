import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectSquare, setPotentialMoves, setNewBoard, switchPlayer, setPawnJumpPrevious, setMovedCastlers } from "../../reducers/boardReducer";
import { getMoves, updateBoard, updateCastlingOptions } from "../../chessLogic/legalMoves";

const Square = ({ piece, colorType, theme, coordinate }) => {
  const selectedSquare = useSelector((state) => state.board.selectedSquare);
  const currentPlayer = useSelector((state) => state.board.currentPlayer);
  const boardState = useSelector((state) => state.board.board);
  const potentialMoves = useSelector((state) => state.board.potentialMoves);
  const pawnJumpPrevious = useSelector((state) => state.board.pawnJumpedLastTurn);
  const movedCastlers = useSelector((state) => state.board.movedCastlers);

  const dispatch = useDispatch();

  const squareColor = (() => {
    if (
      selectedSquare
      && selectedSquare[0] === coordinate[0]
      && selectedSquare[1] === coordinate[1]
    ) return '#b8a306';
    let color = colorType + theme;
    if (color === 'lightred') color = '#ff575f';
    return color;
  })();

  const isPotentialSquare = (() => {
    return potentialMoves.moves.some(([a, b]) => a === coordinate[0] && b === coordinate[1]);
  })();

  const isPotentialCapture = (() => {
    return potentialMoves.captures.some(([a, b]) => a === coordinate[0] && b === coordinate[1]);
  })();

  const updateBoardStates = () => {
    const selectedPiece = boardState[selectedSquare[0]][selectedSquare[1]];
    function setEnPassantPossible() {
      if (
        selectedPiece[0] === 'p'
        && selectedSquare[0] === (currentPlayer === 'w' ? 1 : 6)
        && coordinate[0] === (currentPlayer === 'w' ? 3 : 4)
      ) dispatch(setPawnJumpPrevious(coordinate));
      else dispatch(setPawnJumpPrevious(false));
    }
    setEnPassantPossible();
    dispatch(setMovedCastlers(updateCastlingOptions(
      movedCastlers,
      boardState,
      selectedSquare,
      coordinate,
      currentPlayer
    )))
    dispatch(setNewBoard(updateBoard(boardState, selectedSquare, coordinate, currentPlayer)));
    dispatch(selectSquare(null));
    dispatch(setPotentialMoves({moves: [], captures: []}));
    dispatch(switchPlayer());
  }

  const clickFunction = () => {
    // if curren't player's piece, select this square
    if (piece[1] === currentPlayer) {
      dispatch(selectSquare(coordinate));
      dispatch(setPotentialMoves(getMoves(boardState, coordinate, currentPlayer, pawnJumpPrevious, movedCastlers)));
    }
    
    // if square selected already and clicked square not in potentialSquares, set selected to null 
    else if (selectedSquare && !isPotentialSquare && !isPotentialCapture) {
      dispatch(selectSquare(null));
      dispatch(setPotentialMoves({moves: [], captures: []}));
    }
    
    // if square selected already and clicked square in potentialMoves, update board
    else if (selectSquare && isPotentialSquare || isPotentialCapture) {
      updateBoardStates();
    }
  }

  return (
    <button
      onClick={clickFunction}
      className={`square bg-${piece}`}
      style={{
        backgroundColor: squareColor,
      }}

    >
      <div className={
        (isPotentialSquare ? 'potentialSquare ' : ' ') + (isPotentialCapture ? 'potentialCapture ' : '')
        }></div>
    </button>
  )
}

export default Square;