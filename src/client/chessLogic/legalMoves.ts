import { board, coordinate, moves, piece, player } from './types';

export function getMoves(
  boardState: board,
  selectedSquare: coordinate,
  currentPlayer: player
): moves {

  const selectedPiece: piece = boardState[selectedSquare[0]][selectedSquare[1]];
  let output: moves = { moves: [], captures: [] }

  // no legal moves if not current player's piece
  if (selectedPiece === '-' || selectedPiece[1] !== currentPlayer) return output;

  switch (selectedPiece[0]) {
    case 'r':
      output = rookMoves(boardState, selectedSquare, currentPlayer);
      break;
    case 'n':
      output = knightMoves(boardState, selectedSquare, currentPlayer);
      break;
    case 'b':
      output = bishopMoves(boardState, selectedSquare, currentPlayer);
      break;
    case 'q':
      output = queenMoves(boardState, selectedSquare, currentPlayer);
      break;
    case 'k':
      output = kingMoves(boardState, selectedSquare, currentPlayer);
      break;
    case 'p':
      output = pawnMoves(boardState, selectedSquare, currentPlayer);
      break;
    default:
      break;
  }

  // filter out moves that endanger the king
  output.moves = output.moves.filter((move) => {
    const updatedBoard: board = updateBoard(boardState, selectedSquare, move);
    return !isInCheck(updatedBoard, currentPlayer);
  })

  return output;
}

export function isInCheck(boardState: board, currentPlayer: player): boolean {
  // find king location
  let kingRow: number;
  let kingColumn: number;
  loop1:
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (boardState[i][j] === 'k' + currentPlayer) {
        [kingRow, kingColumn] = [i, j];
        break loop1;
      }
    }
  }

  // for each enemy piece, check if it attacks king
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const currentSquare: piece = boardState[i][j];
      if (currentSquare === '-' || currentSquare[1] === currentPlayer) continue;
      let capturableSquares: coordinate[];
      switch (currentSquare[0]) {
        case 'r':
          capturableSquares = rookMoves(boardState, [i, j], currentPlayer === 'w' ? 'b' : 'w').captures;
          if (capturableSquares.some(([a, b]) => a === kingRow && b === kingColumn)) return true;
          break;
        case 'n':
          capturableSquares = knightMoves(boardState, [i, j], currentPlayer === 'w' ? 'b' : 'w').captures;
          if (capturableSquares.some(([a, b]) => a === kingRow && b === kingColumn)) return true;
          break;
        case 'b':
          capturableSquares = bishopMoves(boardState, [i, j], currentPlayer === 'w' ? 'b' : 'w').captures;
          if (capturableSquares.some(([a, b]) => a === kingRow && b === kingColumn)) return true;
          break;
        case 'q':
          capturableSquares = queenMoves(boardState, [i, j], currentPlayer === 'w' ? 'b' : 'w').captures;
          if (capturableSquares.some(([a, b]) => a === kingRow && b === kingColumn)) return true;
          break;
        case 'k':
          capturableSquares = kingMoves(boardState, [i, j], currentPlayer === 'w' ? 'b' : 'w').captures;
          console.log('king captures', { capturableSquares }, [kingRow, kingColumn])
          if (capturableSquares.some(([a, b]) => a === kingRow && b === kingColumn)) return true;
          break;
        case 'p':
          capturableSquares = pawnMoves(boardState, [i, j], currentPlayer === 'w' ? 'b' : 'w').captures;
          if (capturableSquares.some(([a, b]) => a === kingRow && b === kingColumn)) return true;
          break;
        default:
          break;
      }
    }
  }

  return false
}

export function updateBoard(currentBoard: board, [previousRow, previousColumn]: coordinate, [nextRow, nextColumn]: coordinate): board {
  const newBoard: board = JSON.parse(JSON.stringify(currentBoard));
  newBoard[nextRow][nextColumn] = currentBoard[previousRow][previousColumn];
  newBoard[previousRow][previousColumn] = '-';
  return newBoard;
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
  const row: number = selectedSquare[0];
  const column: number = selectedSquare[1];

  switch (currentPlayer) {
    case 'w':
      // check if pawn can advance
      if (boardState[row + 1][column] === '-') output.moves.push([row + 1, column]);

      // check if pawn can move two squares
      if (
        row === 1
        && boardState[row + 1][column] === '-'
        && boardState[row + 2][column] === '-'
      ) output.moves.push([row + 2, column]);

      // check if pawn can capture
      if (
        boardState[row + 1][column + 1] !== '-'
        && boardState[row + 1][column + 1][1] !== currentPlayer
      ) output.captures.push([row + 1, column + 1]);
      if (
        boardState[row + 1][column - 1] !== '-'
        && boardState[row + 1][column - 1][1] !== currentPlayer
      ) output.captures.push([row + 1, column - 1]);
      // @TODO check if pawn can en passant
      // @TODO handle promotion
      break;

    case 'b':
      // check if pawn can advance
      if (boardState[row - 1][column] === '-') output.moves.push([row - 1, column]);

      // check if pawn can move two squares
      if (
        row === 6
        && boardState[row - 1][column] === '-'
        && boardState[row - 2][column] === '-'
      ) output.moves.push([row - 2, column]);

      // check if pawn can capture
      if (
        boardState[row - 1][column + 1] !== '-'
        && boardState[row - 1][column + 1][1] !== currentPlayer
      ) output.captures.push([row - 1, column + 1]);
      if (
        boardState[row - 1][column - 1] !== '-'
        && boardState[row - 1][column - 1][1] !== currentPlayer
      ) output.captures.push([row - 1, column - 1]);
      // @TODO check if pawn can en passant
      // @TODO handle promotion
      break;

    default:
      break;
  }
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
  for (let i = row - 1, j = column - 1; i >= 0 && j >= 0; i--, j--) {
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
  const row: number = selectedSquare[0];
  const column: number = selectedSquare[1];
  const possibleMoves: coordinate[] = [
    [row + 1, column + 1],
    [row + 1, column - 1],
    [row - 1, column + 1],
    [row - 1, column - 1],
    [row - 1, column],
    [row + 1, column],
    [row, column + 1],
    [row, column - 1],
  ]
  possibleMoves.forEach((move: coordinate): void => {
    const i: number = move[0];
    const j: number = move[1];
    if (i > 7 || i < 0 || j > 7 || j < 0) return;
    const square: piece = boardState[i][j];
    if (square === '-') output.moves.push([i, j]);
    else if (square[1] !== currentPlayer) output.captures.push([i, j]);
  })
  return output;
}


