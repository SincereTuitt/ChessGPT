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

export function rookMoves(
  boardState: board,
  selectedSquare: coordinate,
  currentPlayer: player
): moves {
  const output: moves = { moves: [], captures: [] }
  const row: number = selectedSquare[0];
  const column: number = selectedSquare[1];

  // get row moves
  for (let i = row + 1, j = column; i < 8; i++) {
    const square: piece = boardState[i][j];
    if (square === '-') output.moves.push([i, j]);
    else if (square[1] === currentPlayer) break;
    else {
      output.captures.push([i, j]);
      break;
    }
  }
  for (let i = row - 1, j = column; i >= 0; i--) {
    const square: piece = boardState[i][j];
    if (square === '-') output.moves.push([i, j]);
    else if (square[1] === currentPlayer) break;
    else {
      output.captures.push([i, j]);
      break;
    }
  }

  // get column moves
  for (let i = row, j = column + 1; j < 8; j++) {
    const square: piece = boardState[i][j];
    if (square === '-') output.moves.push([i, j]);
    else if (square[1] === currentPlayer) break;
    else {
      output.captures.push([i, j]);
      break;
    }
  }
  for (let i = row, j = column - 1; j >= 0; j--) {
    const square: piece = boardState[i][j];
    if (square === '-') output.moves.push([i, j]);
    else if (square[1] === currentPlayer) break;
    else {
      output.captures.push([i, j]);
      break;
    }
  }
  return output;
}

export function pawnMoves(
  boardState: board,
  selectedSquare: coordinate,
  currentPlayer: player
): moves {
  const output: moves = { moves: [], captures: [] }
  return output;
}

export function knightMoves(
  boardState: board,
  selectedSquare: coordinate,
  currentPlayer: player
): moves {
  const output: moves = { moves: [], captures: [] }
  const row = selectedSquare[0];
  const column = selectedSquare[1];
  const possibleMoves: coordinate[] = [
    [row + 1, column + 2],
    [row + 1, column - 2],
    [row - 1, column + 2],
    [row - 1, column - 2],
    [row + 2, column + 1],
    [row + 2, column - 1],
    [row - 2, column + 1],
    [row - 2, column - 1],
  ]
  possibleMoves.forEach((coordinate) => {
    const [i, j]: coordinate = coordinate;
    if (i > 7 || j > 7 || i < 0 || j < 0) return;
    const square: piece = boardState[i][j];
    if (square === '-') output.moves.push([i, j]);
    else if (square[1] !== currentPlayer) output.captures.push([i, j]);
  })
  return output;
}

export function bishopMoves(
  boardState: board,
  selectedSquare: coordinate,
  currentPlayer: player
): moves {
  const output: moves = { moves: [], captures: [] }
  const row: number = selectedSquare[0];
  const column: number = selectedSquare[1];

  for (let i = row + 1, j = column + 1; i < 8 && j < 8; i++, j++) {
    const square: piece = boardState[i][j];
    if (square === '-') output.moves.push([i, j]);
    else if (square[1] === currentPlayer) break;
    else {
      output.captures.push([i, j]);
      break;
    }
  }
  for (let i = row + 1, j = column - 1; i < 8 && j >= 0; i++, j--) {
    const square: piece = boardState[i][j];
    if (square === '-') output.moves.push([i, j]);
    else if (square[1] === currentPlayer) break;
    else {
      output.captures.push([i, j]);
      break;
    }
  }
  for (let i = row - 1, j = column + 1; i >= 0 && j < 8; i--, j++) {
    const square: piece = boardState[i][j];
    if (square === '-') output.moves.push([i, j]);
    else if (square[1] === currentPlayer) break;
    else {
      output.captures.push([i, j]);
      break;
    }
  }
  for (let i = row - 1, j = column - 1; i >= 0 && j >= 0; i--, j++) {
    const square: piece = boardState[i][j];
    if (square === '-') output.moves.push([i, j]);
    else if (square[1] === currentPlayer) break;
    else {
      output.captures.push([i, j]);
      break;
    }
  }
  return output;
}

export function queenMoves(
  boardState: board,
  selectedSquare: coordinate,
  currentPlayer: player
): moves {
  const diagnolMoves: moves = bishopMoves(boardState, selectedSquare, currentPlayer);
  const straightMoves: moves = rookMoves(boardState, selectedSquare, currentPlayer);
  return {
    moves: diagnolMoves.moves.concat(straightMoves.moves),
    captures: diagnolMoves.captures.concat(straightMoves.captures),
  };
}

export function kingMoves(
  boardState: board,
  selectedSquare: coordinate,
  currentPlayer: player
): moves {
  const output: moves = { moves: [], captures: [] }
  return output;
}


