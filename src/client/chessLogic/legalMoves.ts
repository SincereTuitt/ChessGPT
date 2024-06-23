import { board, coordinate, moves, piece, player, movedCastlers, gameState } from './types';

export function getMoves(
  boardState: board,
  selectedSquare: coordinate,
  currentPlayer: player,
  pawnJumpPrevious?: coordinate | false,
  movedCastlers?: movedCastlers
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
      output = kingMoves(boardState, selectedSquare, currentPlayer, movedCastlers);
      break;
    case 'p':
      output = pawnMoves(boardState, selectedSquare, currentPlayer, pawnJumpPrevious);
      break;
    default:
      break;
  }

  // filter out moves that endanger the king
  output.moves = output.moves.filter((move) => {
    const updatedBoard: board = updateBoard(boardState, selectedSquare, move, currentPlayer);
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

export function noLegalMoves( 
  boardState: board, 
  currentPlayer: player, 
  pawnJumpPrevious?: coordinate
): boolean {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (boardState[i][j] !== '-' && boardState[i][j][1] === currentPlayer) {
          const possibleMoves: moves = getMoves(boardState, [i, j], currentPlayer, pawnJumpPrevious);
          if (possibleMoves.moves.length || possibleMoves.captures.length) return false;
        }
      }
    }
    return true;
}

export function isGameOver( 
  boardState: board, 
  currentPlayer: player, 
  pawnJumpPrevious: coordinate | false
): gameState {
  if (
    isInCheck(boardState, currentPlayer) 
    && noLegalMoves(boardState, currentPlayer, pawnJumpPrevious)
  ) return currentPlayer === 'w' ? 'b' : 'w'
  if (
    !isInCheck(boardState, currentPlayer) 
    && noLegalMoves(boardState, currentPlayer, pawnJumpPrevious)
  ) return 'sm'
  return false;
}

export function getPawnJumpPrevious(
  boardState: board,
  [previousRow, previousColumn]: coordinate,
  [nextRow, nextColumn]: coordinate,
  currentPlayer: player
): coordinate | false {
  const piece: piece = boardState[previousRow][previousColumn];
  if (
    piece[0] === 'p'
    && previousRow === (currentPlayer === 'w' ? 1 : 6)
    && nextRow === (currentPlayer === 'w' ? 3 : 4)
  ) return [nextRow, nextColumn];
  return false;
  
}

export function updateBoard(
  currentBoard: board, 
  [previousRow, previousColumn]: coordinate, 
  [nextRow, nextColumn]: coordinate,
  currentPlayer: player
): board {
  const newBoard: board = JSON.parse(JSON.stringify(currentBoard));
  const currentPiece = currentBoard[previousRow][previousColumn][0];

  // handle en passant
  if (
    currentPiece === 'p'
    && currentBoard[nextRow][nextColumn] === '-'
    && previousColumn !== nextColumn
  ) newBoard[currentPlayer === 'w' ? nextRow - 1 : nextRow + 1][nextColumn] = '-';

  // handle castling
  if (
    currentPiece === 'k'
    && previousColumn === 4
    && nextColumn === 6
  ) {
    newBoard[previousRow][7] = '-';
    newBoard[previousRow][5] = `r${currentPlayer}`;
  }
  if (
    currentPiece === 'k'
    && previousColumn === 4
    && nextColumn === 2
  ) {
    newBoard[previousRow][0] = '-';
    newBoard[previousRow][3] = `r${currentPlayer}`;
  }
  
  newBoard[nextRow][nextColumn] = currentBoard[previousRow][previousColumn];
  newBoard[previousRow][previousColumn] = '-';
  return newBoard;
}

export function updateCastlingOptions(
  previousCastlers: movedCastlers, 
  boardState: board,
  previousSquare: coordinate,
  nextSquare: coordinate,
  currentPlayer: player
): movedCastlers {
  const newMovedCastlers: movedCastlers = {...previousCastlers}

  const currentPiece: piece = boardState[previousSquare[0]][previousSquare[1]];
  const capturedPiece: piece = boardState[nextSquare[0]][nextSquare[1]];
  const opponent: player = currentPlayer === 'w' ? 'b' : 'w';

  if (currentPiece[0] === 'k') newMovedCastlers[`k${currentPlayer}`] = true;
  if (
    currentPiece[0] === 'r' 
    && previousSquare[0] === (currentPlayer === 'w' ? 0 : 7)
    && previousSquare[1] === 0
  ) newMovedCastlers[`r${currentPlayer}0`] = true;
  if (
    currentPiece[0] === 'r' 
    && previousSquare[0] === (currentPlayer === 'w' ? 0 : 7)
    && previousSquare[1] === 7
  ) newMovedCastlers[`r${currentPlayer}7`] = true;
  if (
    capturedPiece[0] === 'r' 
    && nextSquare[0] === (currentPlayer === 'w' ? 7 : 0)
    && nextSquare[1] === 7
  ) newMovedCastlers[`r${opponent}7`] = true;
  if (
    capturedPiece[0] === 'r' 
    && nextSquare[0] === (currentPlayer === 'w' ? 7 : 0)
    && nextSquare[1] === 0
  ) newMovedCastlers[`r${opponent}0`] = true;

  return newMovedCastlers;
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
  currentPlayer: player,
  pawnJumpPrevious?: coordinate
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
        boardState[row + 1][column + 1]
        && boardState[row + 1][column + 1] !== '-'
        && boardState[row + 1][column + 1][1] !== currentPlayer
      ) output.captures.push([row + 1, column + 1]);
      if (
        boardState[row + 1][column - 1]
        && boardState[row + 1][column - 1] !== '-'
        && boardState[row + 1][column - 1][1] !== currentPlayer
      ) output.captures.push([row + 1, column - 1]);

      // check if pawn can en passant
      if (pawnJumpPrevious
        && pawnJumpPrevious[0] === row
        && pawnJumpPrevious[1] === column + 1
      ) output.captures.push([row + 1, column + 1]);
      if (pawnJumpPrevious
        && pawnJumpPrevious[0] === row
        && pawnJumpPrevious[1] === column - 1
      ) output.captures.push([row + 1, column - 1]);
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
        boardState[row - 1][column + 1]
        && boardState[row - 1][column + 1] !== '-'
        && boardState[row - 1][column + 1][1] !== currentPlayer
      ) output.captures.push([row - 1, column + 1]);
      if (
        boardState[row - 1][column - 1]
        && boardState[row - 1][column - 1] !== '-'
        && boardState[row - 1][column - 1][1] !== currentPlayer
      ) output.captures.push([row - 1, column - 1]);

      // check if pawn can en passant
      if (pawnJumpPrevious
        && pawnJumpPrevious[0] === row
        && pawnJumpPrevious[1] === column + 1
      ) output.captures.push([row - 1, column + 1]);
      if (pawnJumpPrevious
        && pawnJumpPrevious[0] === row
        && pawnJumpPrevious[1] === column - 1
      ) output.captures.push([row - 1, column - 1]);
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
  currentPlayer: player,
  movedCastlers?: Record<string, boolean>
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
  ];
  possibleMoves.forEach((move: coordinate): void => {
    const i: number = move[0];
    const j: number = move[1];
    if (i > 7 || i < 0 || j > 7 || j < 0) return;
    const square: piece = boardState[i][j];
    if (square === '-') output.moves.push([i, j]);
    else if (square[1] !== currentPlayer) output.captures.push([i, j]);
  });

  //handle castling
  if (movedCastlers && !movedCastlers['k' + currentPlayer] && !isInCheck(boardState, currentPlayer)) {
    // intermediate positions
    const boardClone: board = JSON.parse(JSON.stringify(boardState));
    boardClone[row][column] = '-';
    boardClone[row][5] = `k${currentPlayer}`;
    
    // kingside
    if (
      !movedCastlers['r' + currentPlayer + '7']
      && boardState[row][5] === '-'
      && boardState[row][6] === '-'
      && !isInCheck(boardClone, currentPlayer)
    ) output.moves.push([row, 6]);
    
    //queenside
    boardClone[row][5] = '-';
    boardClone[row][3] = `k${currentPlayer}`;
    if (
      !movedCastlers['r' + currentPlayer + '0']
      && boardState[row][1] === '-'
      && boardState[row][2] === '-'
      && boardState[row][3] === '-'
      && !isInCheck(boardClone, currentPlayer)
    ) output.moves.push([row, 2]);
  }

  return output;
}


