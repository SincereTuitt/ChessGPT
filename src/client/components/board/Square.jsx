import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectSquare, setPotentialMoves, setNewBoard, switchPlayer } from "../../reducers/boardReducer";
import { getMoves, updateBoard } from "../../chessLogic/legalMoves";

const Square = ({ piece, colorType, theme, coordinate }) => {
  const selectedSquare = useSelector((state) => state.board.selectedSquare);
  const currentPlayer = useSelector((state) => state.board.currentPlayer);
  const boardState = useSelector((state) => state.board.board);
  const potentialMoves = useSelector((state) => state.board.potentialMoves);

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


  const clickFunction = () => {
    // if curren't player's piece, select this square
    if (piece[1] === currentPlayer) {
      dispatch(selectSquare(coordinate));
      dispatch(setPotentialMoves(getMoves(boardState, coordinate, currentPlayer)));
    }
    
    // if square selected already and clicked square not in potentialSquares, set selected to null 
    else if (selectedSquare && !isPotentialSquare && !isPotentialCapture) {
      dispatch(selectSquare(null));
      dispatch(setPotentialMoves({moves: [], captures: []}));
    }
    
    // if square selected already and clicked square in potentialMoves, update board
    else if (selectSquare && isPotentialSquare || isPotentialCapture) {
      dispatch(setNewBoard(updateBoard(boardState, selectedSquare, coordinate)));
      dispatch(selectSquare(null));
      dispatch(setPotentialMoves({moves: [], captures: []}));
      dispatch(switchPlayer());
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