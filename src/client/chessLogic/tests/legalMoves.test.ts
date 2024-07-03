import { rookMoves, knightMoves, bishopMoves, kingMoves, queenMoves, pawnMoves, getMoves, isInCheck, updateBoard, updateCastlingOptions, noLegalMoves, isGameOver, getPawnJumpPrevious } from "../legalMoves.ts";
import { board, coordinate, moves, piece, player } from '../types';

const initialBoard: board = [
  ['rw', 'nw', 'bw', 'qw', 'kw', 'bw', 'nw', 'rw'],
  ['pw', 'pw', 'pw', 'pw', 'pw', 'pw', 'pw', 'pw'],
  ['-', '-', '-', '-', '-', '-', '-', '-'],
  ['-', '-', '-', '-', '-', '-', '-', '-'],
  ['-', '-', '-', '-', '-', '-', '-', '-'],
  ['-', '-', '-', '-', '-', '-', '-', '-'],
  ['pb', 'pb', 'pb', 'pb', 'pb', 'pb', 'pb', 'pb'],
  ['rb', 'nb', 'bb', 'qb', 'kb', 'bb', 'nb', 'rb'],
]
const emptyBoard: board = [
  ['-', '-', '-', '-', '-', '-', '-', '-'],
  ['-', '-', '-', '-', '-', '-', '-', '-'],
  ['-', '-', '-', '-', '-', '-', '-', '-'],
  ['-', '-', '-', '-', '-', '-', '-', '-'],
  ['-', '-', '-', '-', '-', '-', '-', '-'],
  ['-', '-', '-', '-', '-', '-', '-', '-'],
  ['-', '-', '-', '-', '-', '-', '-', '-'],
  ['-', '-', '-', '-', '-', '-', '-', '-'],
]
const canCastle = {rb0: false, rb7: false, kb: false, rw0: false, rw7: false, kw: false};
const cannotCastle = {rb0: true, rb7: true, kb: true, rw0: true, rw7: true, kw: true};

describe('isInCheck', (): void => {
  let board: board;
  beforeEach(() => {
    board = JSON.parse(JSON.stringify(emptyBoard));
  })

  it('should return true if an enemy piece sees the king', (): void => {
    board[0][0] = 'kw';
    board[0][7] = 'rb';
    expect(isInCheck(board, 'w')).toBe(true);
    board[0][7] = '-';
    board[1][2] = 'nb';
    expect(isInCheck(board, 'w')).toBe(true);
    board[1][2] = '-';
    board[4][4] = 'qb';
    expect(isInCheck(board, 'w')).toBe(true);
  })
  it('should return false if not in check', (): void => {
    board[0][0] = 'kb';
    board[1][6] = 'rw';
    board[3][4] = 'qw';
    board[5][5] = 'nw';
    board[2][2] = 'pw';
    expect(isInCheck(board, 'b')).toBe(false);
  })
  it('should return false if a friendly piece blocks check', (): void => {
    board[0][0] = 'kb';
    board[0][7] = 'rw';
    board[0][4] = 'rb';
    board[5][5] = 'bw';
    board[3][3] = 'bb';
    expect(isInCheck(board, 'b')).toBe(false);
  })
  it('should return true when the enemy king is adjacent', (): void => { // not technically check ofc
    board[0][0] = 'kw';
    board[1][1] = 'kb';
    expect(isInCheck(board, 'w')).toBe(true);
    board[1][1] = '-';
    board[0][1] = 'kb';
    expect(isInCheck(board, 'b')).toBe(true);
  })
})
describe('updateBoard', (): void => {
  let board: board = JSON.parse(JSON.stringify(emptyBoard));
  beforeEach(() => board = JSON.parse(JSON.stringify(emptyBoard)))
  it('should move a piece to an empty square', (): void => {
    const expectedBoard: board = JSON.parse(JSON.stringify(emptyBoard));
    board[0][0] = 'rw';
    expectedBoard[0][7] = 'rw';
    const newBoard = updateBoard(board, [0, 0], [0, 7], 'w');
    expect(JSON.stringify(newBoard)).toBe(JSON.stringify(expectedBoard));
  })
  it('should replace a piece on a non-empty square', (): void => {
    const board: board = JSON.parse(JSON.stringify(emptyBoard));
    const expectedBoard: board = JSON.parse(JSON.stringify(emptyBoard));
    board[0][0] = 'rw';
    board[0][7] = 'rb';
    expectedBoard[0][7] = 'rw';
    const newBoard = updateBoard(board, [0, 0], [0, 7], 'w');
    expect(JSON.stringify(newBoard)).toBe(JSON.stringify(expectedBoard));
  })
  it('should capture an en passanted pawn', (): void => {
    const board: board = JSON.parse(JSON.stringify(emptyBoard));
    const expectedBoard: board = JSON.parse(JSON.stringify(emptyBoard));
    board[4][4] = 'pw';
    board[4][3] = 'pb';
    expectedBoard[5][3] = 'pw';
    expect(JSON.stringify(updateBoard(board, [4, 4], [5, 3], 'w'))).toBe(JSON.stringify(expectedBoard));
  })
  it('should move the king and rook when castling', (): void => {
    board[0][4] = 'kw';
    board[0][7] = 'rw';
    const updatedBoard: board = updateBoard(board, [0, 4], [0, 6], 'w');
    expect(updatedBoard[0][6]).toBe('kw');
    expect(updatedBoard[0][5]).toBe('rw');
    board[7][4] = 'kb';
    board[7][0] = 'rb';
    const updatedBoard2: board = updateBoard(board, [7, 4], [7, 2], 'b');
    expect(updatedBoard2[7][2]).toBe('kb');
    expect(updatedBoard2[7][3]).toBe('rb');
  })
  it('should promote a pawn that moves to the back rank', ():void => {
    board[6][4] = 'pw';
    expect(updateBoard(board, [6, 4], [7, 4], 'w', 'nw')[7][4]).toBe('nw');
  })
  it('should promote a pawn that captures to move to the back rank', ():void => {
    board[1][4] = 'pw';
    board[0][5] = 'qw';
    expect(updateBoard(board, [1, 4], [0, 5], 'b', 'qb')[0][5]).toBe('qb');
  })
})
describe('updateCastlingOptions', (): void => {
  let board: board;
  beforeEach(() => board = JSON.parse(JSON.stringify(emptyBoard)));
  it('should not update if no king or rook was moved or captured', (): void => {
    board[0][0] = 'qb';
    const newCastlingRights = updateCastlingOptions(canCastle, board, [0, 0], [0, 5], 'b');
    expect(newCastlingRights).toEqual(canCastle);
  })
  it('should remove castling rights if king moved', (): void => {
    board[0][4] = 'kw';
    const newCastlingRights = updateCastlingOptions(canCastle, board, [0, 4], [0, 5], 'w');
    expect(newCastlingRights.kw).toBe(true);
  })
  it('should remove castling rights if rook moved', (): void => {
    board[0][0] = 'rw';
    const newCastlingRights = updateCastlingOptions(canCastle, board, [0, 0], [0, 5], 'w');
    expect(newCastlingRights.rw0).toBe(true);
  })
  it('should remove castling rights if rook captured', (): void => {
    board[0][0] = 'rw';
    board[7][0] = 'rb'
    const newCastlingRights = updateCastlingOptions(canCastle, board, [7, 0], [0, 0], 'b');
    expect(newCastlingRights.rw0).toBe(true);
  })
})
describe('getMoves', (): void => {
  it('should return an empty moves object when the selected square is empty', (): void => {
    const emptyMoves: moves = getMoves(initialBoard, [3, 3], 'w');
    expect(emptyMoves.moves).toHaveLength(0);
    expect(emptyMoves.captures).toHaveLength(0);
  })
  it('should return an empty moves object when the selected piece does not belong to the current player', (): void => {
    const emptyMoves: moves = getMoves(initialBoard, [6, 6], 'w');
    expect(emptyMoves.moves).toHaveLength(0);
    expect(emptyMoves.captures).toHaveLength(0);
  })
  let board = JSON.parse(JSON.stringify(emptyBoard));
  beforeEach((): void => {board = JSON.parse(JSON.stringify(emptyBoard));})

  it('should not allow the king to move into check', (): void => {
    board[0][0] = 'kb';
    board[7][1] = 'rw';
    board[1][7] = 'rw';
    const emptyMoves: moves = getMoves(board, [0, 0], 'b', undefined, cannotCastle);
    expect(emptyMoves.moves).toHaveLength(0);
    expect(emptyMoves.captures).toHaveLength(0);
  })
  it('should not allow a piece blocking check to move', (): void => {
    board[0][0] = 'kb';
    board[3][3] = 'rb';
    board[5][5] = 'qw';
    const emptyMoves: moves = getMoves(board, [3, 3], 'b');
    expect(emptyMoves.moves).toHaveLength(0);
    expect(emptyMoves.captures).toHaveLength(0);
  })
  it('should allow all moves that do not put the king in danger', (): void => {
    board[0][0] = 'kb';
    board[3][3] = 'bb';
    board[7][7] = 'qw';
    const moves: moves = getMoves(board, [3, 3], 'b');
    expect(moves.moves).toHaveLength(5);
    expect(moves.captures).toHaveLength(1);
  })
  it('should return an empty moves object if the player is checkmated', (): void => {
    board[0][0] = 'kw';
    board[2][7] = 'rw';
    board[1][7] = 'rb';
    board[0][6] = 'rb';
    const moves: moves = getMoves(board, [2, 7], 'w');
    expect(moves.moves).toHaveLength(0);
    expect(moves.captures).toHaveLength(0);
  })
})
describe ('rookMoves', (): void => {
  const board = JSON.parse(JSON.stringify(emptyBoard));
  it('should return an empty moves object when the rook is trapped', (): void => {
    board[0][0] = 'rw';
    board[0][1] = 'nw';
    board[1][0] = 'nw';
    const emptyMoves = rookMoves(board, [0, 0], 'w');
    expect(emptyMoves.moves).toHaveLength(0);
    expect(emptyMoves.captures).toHaveLength(0);
  })
  it('should return all of the squares the rook can move to', (): void => {
    board[0][1] = '-';
    board[1][0] = '-';
    const moves = rookMoves(board, [0, 0], 'w');
    expect(moves.moves).toHaveLength(14);
    expect(moves.captures).toHaveLength(0);
  })
  it('should return all of the squares the rook can capture', (): void => {
    board[0][5] = 'bb';
    board[7][0] = 'rb';
    const moves = rookMoves(board, [0, 0], 'w');
    expect(moves.moves).toHaveLength(10);
    expect(moves.captures).toHaveLength(2);
    
  })
  it('should not allow the rook to capture its own pieces', (): void => {
    board[6][0] = 'rw';
    const moves = rookMoves(board, [0, 0], 'w');
    expect(moves.moves).toHaveLength(9);
    expect(moves.captures).toHaveLength(1);

  })
}) 
describe ('queenMoves', (): void => {
  const board = JSON.parse(JSON.stringify(emptyBoard));
  it('should return an empty moves object when the queen is trapped', (): void => {
    board[0][0] = 'qw';
    board[0][1] = 'nw';
    board[1][0] = 'nw';
    board[1][1] = 'nw';
    const emptyMoves = queenMoves(board, [0, 0], 'w');
    expect(emptyMoves.moves).toHaveLength(0);
    expect(emptyMoves.captures).toHaveLength(0);
  })
  it('should return all of the squares the queen can move to', (): void => {
    board[0][1] = '-';
    board[1][0] = '-';
    board[1][1] = '-';
    const moves = queenMoves(board, [0, 0], 'w');
    expect(moves.moves).toHaveLength(21);
    expect(moves.captures).toHaveLength(0);
  })
  it('should return all of the squares the queen can capture', (): void => {
    board[0][5] = 'bb';
    board[7][0] = 'rb';
    board[2][2] = 'rb';
    const moves = queenMoves(board, [0, 0], 'w');
    expect(moves.moves).toHaveLength(11);
    expect(moves.captures).toHaveLength(3);
    
  })
  it('should not allow the queen to capture its own pieces', (): void => {
    board[2][2] = 'rw';
    const moves = queenMoves(board, [0, 0], 'w');
    expect(moves.moves).toHaveLength(11);
    expect(moves.captures).toHaveLength(2);

  })
}) 
describe ('knightMoves', (): void => {
  const board = JSON.parse(JSON.stringify(emptyBoard));
  it('should return an empty moves object when the knight is trapped', (): void => {
    board[0][0] = 'nb';
    board[2][1] = 'nb';
    board[1][2] = 'nb';
    const emptyMoves = knightMoves(board, [0, 0], 'b');
    expect(emptyMoves.moves).toHaveLength(0);
    expect(emptyMoves.captures).toHaveLength(0);
  })
  it('should return all of the squares the knight can move to', (): void => {
    board[2][1] = '-';
    board[1][2] = '-';
    board[3][3] = 'nb';
    const moves = knightMoves(board, [3, 3], 'b');
    expect(moves.moves).toHaveLength(8);
    expect(moves.captures).toHaveLength(0);
  })
  it('should return all of the squares the knight can capture', (): void => {
    board[2][1] = 'bw';
    board[4][5] = 'rw';
    const moves = knightMoves(board, [3, 3], 'b');
    expect(moves.moves).toHaveLength(6);
    expect(moves.captures).toHaveLength(2);
    
  })
  it('should not allow the knight to capture its own pieces', (): void => {
    board[5][2] = 'rb';
    const moves = knightMoves(board, [3, 3], 'b');
    expect(moves.moves).toHaveLength(5);
    expect(moves.captures).toHaveLength(2);
  })
}) 
describe ('bishopMoves', (): void => {
  const board = JSON.parse(JSON.stringify(emptyBoard));
  it('should return an empty moves object when the bishop is trapped', (): void => {
    board[0][0] = 'bw';
    board[1][1] = 'nw';
    const emptyMoves = bishopMoves(board, [0, 0], 'w');
    expect(emptyMoves.moves).toHaveLength(0);
    expect(emptyMoves.captures).toHaveLength(0);
  })
  it('should return all of the squares the bishop can move to', (): void => {
    board[0][0] = '-';
    board[1][1] = '-';
    board[3][3] = 'bw'
    const moves = bishopMoves(board, [3, 3], 'w');
    expect(moves.moves).toHaveLength(13);
    expect(moves.captures).toHaveLength(0);
  })
  it('should return all of the squares the bishop can capture', (): void => {
    board[2][2] = 'bb';
    board[5][1] = 'rb';
    const moves = bishopMoves(board, [3, 3], 'w');
    expect(moves.moves).toHaveLength(8);
    expect(moves.captures).toHaveLength(2);
    
  })
  it('should not allow the bishop to capture its own pieces', (): void => {
    board[4][4] = 'rw';
    const moves = bishopMoves(board, [3, 3], 'w');
    expect(moves.moves).toHaveLength(4);
    expect(moves.captures).toHaveLength(2);

  })
}) 
describe ('kingMoves', (): void => {
  let board = JSON.parse(JSON.stringify(emptyBoard));
  beforeEach(() => board = JSON.parse(JSON.stringify(emptyBoard)));
  it('should return an empty moves object when the king is trapped', (): void => {
    board[0][0] = 'kw';
    board[0][1] = 'nw';
    board[1][0] = 'nw';
    board[1][1] = 'nw';
    const emptyMoves = kingMoves(board, [0, 0], 'w', cannotCastle);
    expect(emptyMoves.moves).toHaveLength(0);
    expect(emptyMoves.captures).toHaveLength(0);
  })
  it('should return all of the squares the king can move to', (): void => {
    board[4][4] = 'kw';
    const moves = kingMoves(board, [4, 4], 'w', cannotCastle);
    expect(moves.moves).toHaveLength(8);
    expect(moves.captures).toHaveLength(0);
  })
  it('should return all of the squares the king can capture', (): void => {
    board[4][4] = 'kw';
    board[4][5] = 'bb';
    board[3][4] = 'rb';
    const moves = kingMoves(board, [4, 4], 'w', cannotCastle);
    expect(moves.moves).toHaveLength(6);
    expect(moves.captures).toHaveLength(2);
    
  })
  it('should not allow the king to capture its own pieces', (): void => {
    board[4][4] = 'kw';
    board[5][5] = 'rw';
    const moves = kingMoves(board, [4, 4], 'w', cannotCastle);
    expect(moves.moves).toHaveLength(7);
    expect(moves.captures).toHaveLength(0);
  })
  it('should not let the king castle while in check', (): void => {
    board[0][4] = 'kw';
    board[0][0] = 'rw';
    board[0][7] = 'rw';
    board[7][4] = 'qb';
    const moves = kingMoves(board, [0, 4], 'w', canCastle);
    expect(moves.moves).toHaveLength(5);
  })
  it('should not let the king castle through check', (): void => {
    board[7][4] = 'kb';
    board[7][0] = 'rb';
    board[7][7] = 'rb';
    board[0][5] = 'qw';
    const moves = kingMoves(board, [7, 4], 'b', canCastle);
    expect(moves.moves).toHaveLength(6);
  })
  it('should not let the king castle through pieces', (): void => {
    board[7][4] = 'kb';
    board[7][6] = 'nw';
    board[7][1] = 'nb';
    board[7][0] = 'rb';
    board[7][7] = 'rb';
    const moves = kingMoves(board, [7, 4], 'b', canCastle);
    expect(moves.moves).toHaveLength(5);
  })
  it('should let the king castle when legal', (): void => {
    board[0][4] = 'kw';
    board[0][0] = 'rw';
    board[0][7] = 'rw';
    const moves = kingMoves(board, [0, 4], 'w', canCastle);
    expect(moves.moves).toHaveLength(7);
  })
}) 
describe ('pawnMoves', (): void => {
  const board = JSON.parse(JSON.stringify(emptyBoard));
  it('should return an empty moves object when the pawn is trapped', (): void => {
    board[1][1] = 'pw';
    board[2][1] = 'rw';
    const emptyMoves = pawnMoves(board, [1, 1], 'w');
    expect(emptyMoves.moves).toHaveLength(0);
    expect(emptyMoves.captures).toHaveLength(0);
  })
  it('should return all of the squares the pawn can move to', (): void => {
    board[2][1] = '-';
    board[5][5] = 'pb';
    const whiteMoves = pawnMoves(board, [1, 1], 'w');
    const blackMoves = pawnMoves(board, [5, 5], 'b');
    expect(whiteMoves.moves).toHaveLength(2);
    expect(whiteMoves.captures).toHaveLength(0);
    expect(blackMoves.moves).toHaveLength(1);
    expect(blackMoves.captures).toHaveLength(0);
  })
  it('should return all of the squares the pawn can capture', (): void => {
    board[4][4] = 'pw';
    const moves = pawnMoves(board, [5, 5], 'b');
    expect(moves.moves).toHaveLength(1);
    expect(moves.captures).toHaveLength(1);
    
  })
  it('should not allow the pawn to capture its own pieces', (): void => {
    board[4][6] = 'pb';
    const moves = pawnMoves(board, [5, 5], 'b');
    expect(moves.moves).toHaveLength(1);
    expect(moves.captures).toHaveLength(1);

  })
  it('should allow en passant only of a pawn that advanced two squares in the previous move', (): void => {
    board[4][3] = 'pb';
    board[4][5] = 'pb';
    board[5][5] = '-';
    const moves = pawnMoves(board, [4, 4], 'w', [4, 3]);
    expect(moves.moves).toHaveLength(1);
    expect(moves.captures).toHaveLength(1);
  })
}) 
describe ('noLegalMoves', (): void => {
  let board: board;
  beforeEach(() => board = JSON.parse(JSON.stringify(emptyBoard)));
  it('should return true if player is checkmated', (): void => {
    board[0][0] = 'kw';
    board[1][7] = 'rb';
    board[2][7] = 'rw';
    board[0][6] = 'rb';
    expect(noLegalMoves(board, 'w', undefined)).toBe(true);
  })
  it('should return true if player is stalemated', (): void => {
    board[0][0] = 'kw';
    board[6][1] = 'rb';
    board[1][6] = 'rb'; 
    expect(noLegalMoves(board, 'w', undefined)).toBe(true);
  })
  it('should return false if the player is in check but can block', (): void => {
    board[0][0] = 'kw';
    board[0][5] = 'rb';
    board[1][6] = 'rb'; 
    board[1][3] = 'nw';
    expect(noLegalMoves(board, 'w', undefined)).toBe(false);
  })
  it ('should return false if the player is in check but can move the king', (): void => {
    board[0][0] = 'kw';
    board[0][5] = 'rb';
    expect(noLegalMoves(board, 'w', undefined)).toBe(false);
  })
})
describe('getPawnJumpPrevious', (): void => {
  let board: board;
  beforeEach(() => board = JSON.parse(JSON.stringify(emptyBoard)));
  it('should return false if a piece other than a pawn moves', (): void => {
    board[1][0] = 'qw';
    expect(getPawnJumpPrevious(board, [1, 0], [3, 0], 'w')).toBe(false);
  })
  it('should return false if a pawn moves only one square', (): void => {
    board[1][0] = 'pw';
    expect(getPawnJumpPrevious(board, [1, 0], [2, 0], 'w')).toBe(false);
  })
  it('should return a coordinate if a pawn advances two squares', (): void => {
    board[1][0] = 'pw';
    expect(getPawnJumpPrevious(board, [1, 0], [3, 0], 'w')).toEqual([3, 0]);
  })
})
describe ('isGameOver', (): void => {
  it('should return false if there are legal moves', (): void => {
    const board = JSON.parse(JSON.stringify(initialBoard));
    expect(isGameOver(initialBoard, 'w', undefined)).toBe(false);
  })
  it('should return "w" or "b" if a player has won', (): void => {
    const board = JSON.parse(JSON.stringify(emptyBoard));
    board[0][0] = 'kw';
    board[0][5] = 'rb';
    board[1][6] = 'rb'; 
    expect(isGameOver(board, 'w', undefined)).toBe('b');
    board[0][0] = 'kb';
    board[0][5] = 'rw';
    board[1][6] = 'rw'; 
    expect(isGameOver(board, 'b', undefined)).toBe('w');
  })
  it('should return "sm" if the game is stalemated', (): void => {
    const board = JSON.parse(JSON.stringify(emptyBoard));
    board[0][0] = 'kw';
    board[6][1] = 'rb';
    board[1][6] = 'rb'; 
    expect(isGameOver(board, 'w', undefined)).toBe('sm');
  })
})