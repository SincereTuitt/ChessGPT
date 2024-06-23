import { board, piece, option, player, coordinate, move, gameState, movedCastlers } from './types';
import { getMoves, updateBoard, isGameOver, getPawnJumpPrevious, updateCastlingOptions } from './legalMoves'

// minimax approach
// 1. generate the tree of evaluations to the given depth
//    a. generate all possible moves from a given position, tracking material changes
//    b. recursive call for each new position
// 2. once depth is reached or game over, evaluate position
//    a. current player makes moves to maximize score
//    b. score is w material - b material OR if stalemate OR +/- infinity if checkmate  

export function getEngineMove(
  depth: number,
  currentPlayer: player,
  boardState: board,
  movedCastlers: movedCastlers,
  pawnJumpPrevious: coordinate | false,
): move {
  const currentScore: number = calculateMaterial(boardState);

  const possibleMoves: option[] = getAllMoves(currentScore, boardState, currentPlayer, pawnJumpPrevious, movedCastlers);

  const movesWithUpdatedScores: option[] = possibleMoves.map((option: option) => {
    const newPawnJumpPrevious: coordinate | false = getPawnJumpPrevious(
      boardState,
      option.move[0],
      option.move[1],
      currentPlayer
    );

    const newMovedCastlers: movedCastlers = updateCastlingOptions(
      movedCastlers,
      boardState,
      option.move[0],
      option.move[1],
      currentPlayer
    );

    option.score = getNodeScore(
      depth - 0.5,
      currentPlayer === 'w' ? 'b' : 'w',
      option.boardState,
      newMovedCastlers,
      newPawnJumpPrevious,
      option.score)
    return option;
  })

  return chooseBestOption(currentPlayer, movesWithUpdatedScores);
}

export function getNodeScore(
  depth: number,
  currentPlayer: player,
  boardState: board,
  movedCastlers: movedCastlers,
  pawnJumpPrevious: coordinate | false,
  score: number,
): number {
  if (depth <= 0) return score;

  const possibleMoves = getAllMoves(score!, boardState, currentPlayer, pawnJumpPrevious, movedCastlers);

  if (!possibleMoves.length) {
    const mapGameStateToValue: Record<string, number> = {
      'w': Infinity,
      'b': -Infinity,
      'sm': 0,
      '3mr': 0,
      '50mr': 0,
    }
    const gameState: gameState = isGameOver(boardState, currentPlayer, pawnJumpPrevious);
    return mapGameStateToValue[gameState.toString()];

  }

  const scores: number[] = possibleMoves.map((move: option) => {
    const newPawnJumpPrevious: coordinate | false = getPawnJumpPrevious(boardState, move.move[0], move.move[1], currentPlayer);
    const newMovedCastlers: movedCastlers = updateCastlingOptions(movedCastlers, boardState, move.move[0], move.move[1], currentPlayer);
    return getNodeScore(
      depth - 0.5,
      currentPlayer === 'w' ? 'b' : 'w',
      move.boardState,
      newMovedCastlers,
      newPawnJumpPrevious,
      move.score,
    )
  })
  if (currentPlayer === 'w') return Math.max(...scores);
  else return Math.min(...scores);
}

export function calculateMaterial(boardState: board): number { // should only be called once
  let materialBalance = 0;
  const mapPieceToValue: Record<piece, number> = {
    'kw': 0,
    'kb': 0,
    '-': 0,
    'rw': 5,
    'nw': 3,
    'bw': 3,
    'qw': 9,
    'pw': 1,
    'rb': -5,
    'nb': -3,
    'bb': -3,
    'qb': -9,
    'pb': -1,
  }
  for (const row of boardState) {
    for (const square of row) {
      materialBalance += mapPieceToValue[square];
    }
  }
  return materialBalance;
}

export function chooseBestOption(
  currentPlayer: player,
  options: option[]
): move {
  let bestScore: number | undefined = undefined;
  const possibleMoves: move[] = [];
  for (const option of options) {
    if (
      bestScore === undefined
      || option.score === bestScore
    ) {
      bestScore = option.score;
      possibleMoves.push(option.move);
    }
    if (
      (currentPlayer === 'w' && option.score > bestScore)
      || (currentPlayer === 'b' && option.score < bestScore)
    ) {
      bestScore = option.score;
      possibleMoves.length = 0;
      possibleMoves.push(option.move);
    }
  }
  return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
}

export function getAllMoves(
  currentScore: number,
  boardState: board,
  currentPlayer: player,
  pawnJumpPrevious: coordinate | false,
  movedCastlers: movedCastlers,
): option[] {
  const output: option[] = [];

  const mapPieceToValue: Record<piece, number> = {
    'kw': 0,
    'kb': 0,
    '-': 0,
    'rw': 5,
    'nw': 3,
    'bw': 3,
    'qw': 9,
    'pw': 1,
    'rb': -5,
    'nb': -3,
    'bb': -3,
    'qb': -9,
    'pb': -1,
  }

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const possibleMoves = getMoves(boardState, [i, j], currentPlayer, pawnJumpPrevious, movedCastlers);
      for (const possibility of possibleMoves.moves.concat(possibleMoves.captures)) {
        const move: move = [[i, j], possibility];
        const score: number = currentScore - mapPieceToValue[boardState[possibility[0]][possibility[1]]];
        const newBoard = updateBoard(boardState, [i, j], possibility, currentPlayer);
        output.push({ move, score, boardState: newBoard });
      }
    }
  }



  return output;
}

