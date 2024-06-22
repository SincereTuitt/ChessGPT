import { board, coordinate, moves, piece, player } from './types';

export function getMoves(
  boardState: board,
  selectedSquare: coordinate,
  currentPlayer: player
): moves {

  const selectedPiece: piece = boardState[selectedSquare[0]][selectedSquare[1]];
  const output: moves = { moves: [], captures: [] }
  if (selectedPiece === '-' || selectedPiece[1] !== currentPlayer) return output;

  switch (selectedPiece[0]) {
    case '':

      break;

    default:
      break;
  }

  return output;
}

export function pawnMoves(boardState: board, selectedSquare: coordinate,): moves {
  const output: moves = { moves: [], captures: [] }
  return output;
}

export function rookMoves(boardState: board, selectedSquare: coordinate,): moves {
  const output: moves = { moves: [], captures: [] }
  return output;
}

export function knightMoves(boardState: board, selectedSquare: coordinate,): moves {
  const output: moves = { moves: [], captures: [] }
  return output;
}

export function bishopMoves(boardState: board, selectedSquare: coordinate,): moves {
  const output: moves = { moves: [], captures: [] }
  return output;
}

export function queenMoves(boardState: board, selectedSquare: coordinate,): moves {
  const output: moves = { moves: [], captures: [] }
  return output;
}

export function kingMoves(boardState: board, selectedSquare: coordinate,): moves {
  const output: moves = { moves: [], captures: [] }
  return output;
}


