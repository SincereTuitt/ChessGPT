import { rookMoves, knightMoves, bishopMoves, kingMoves, queenMoves, pawnMoves, getMoves } from "../legalMoves";
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

xdescribe('getMoves', (): void => {
  it('should return an empty moves object when the selected square is empty', (): void => {
    const emptyMoves: moves = getMoves(initialBoard, [3, 3], 'w');
    expect(emptyMoves.moves).toHaveLength(0);
    expect(emptyMoves.captures).toHaveLength(0);
  })
  it('should return an empty moves object when the selected piece does not belong to the current player', (): void => {
    const emptyMoves: moves = getMoves(initialBoard, [1, 6], 'w');
    expect(emptyMoves.moves).toHaveLength(0);
    expect(emptyMoves.captures).toHaveLength(0);
  })
  const board = JSON.parse(JSON.stringify(emptyBoard));
  board[0][0] = 'kb';
  board[7][1] = 'rw';
  board[1][7] = 'rw';
  it('should not allow the king to move into check', (): void => {
    const emptyMoves: moves = getMoves(board, [0, 0], 'b');
    expect(emptyMoves.moves).toHaveLength(0);
    expect(emptyMoves.captures).toHaveLength(0);
  })
  board[3][3] = 'rb';
  board[5][5] = 'qw';
  it('should not allow a piece blocking check to move', (): void => {
    const emptyMoves: moves = getMoves(board, [3, 3], 'b');
    expect(emptyMoves.moves).toHaveLength(0);
    expect(emptyMoves.captures).toHaveLength(0);
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
xdescribe ('queenMoves', (): void => {
  const board = JSON.parse(JSON.stringify(emptyBoard));
  board[0][0] = 'qw';
  board[0][1] = 'nw';
  board[1][0] = 'nw';
  board[1][1] = 'nw';
  it('should return an empty moves object when the queen is trapped', (): void => {
    const emptyMoves = queenMoves(board, [0, 0], 'w');
    expect(emptyMoves.moves).toHaveLength(0);
    expect(emptyMoves.captures).toHaveLength(0);
  })
  board[0][1] = '-';
  board[1][0] = '-';
  board[1][1] = '-';
  it('should return all of the squares the queen can move to', (): void => {
    const moves = queenMoves(board, [0, 0], 'w');
    expect(moves.moves).toHaveLength(21);
    expect(moves.captures).toHaveLength(0);
  })
  board[0][5] = 'bb';
  board[7][0] = 'rb';
  board[2][2] = 'rb';
  it('should return all of the squares the queen can capture', (): void => {
    const moves = queenMoves(board, [0, 0], 'w');
    expect(moves.moves).toHaveLength(11);
    expect(moves.captures).toHaveLength(3);
    
  })
  board[2][2] = 'rw';
  it('should not allow the queen to capture its own pieces', (): void => {
    const moves = queenMoves(board, [0, 0], 'w');
    expect(moves.moves).toHaveLength(11);
    expect(moves.captures).toHaveLength(2);

  })
}) 
xdescribe ('knightMoves', (): void => {
  const board = JSON.parse(JSON.stringify(emptyBoard));
  board[0][0] = 'nb';
  board[2][1] = 'nb';
  board[1][2] = 'nb';
  it('should return an empty moves object when the knight is trapped', (): void => {
    const emptyMoves = knightMoves(board, [0, 0], 'b');
    expect(emptyMoves.moves).toHaveLength(0);
    expect(emptyMoves.captures).toHaveLength(0);
  })
  board[2][1] = '-';
  board[1][2] = '-';
  board[3][3] = 'nb';
  it('should return all of the squares the knight can move to', (): void => {
    const moves = knightMoves(board, [3, 3], 'b');
    expect(moves.moves).toHaveLength(8);
    expect(moves.captures).toHaveLength(0);
  })
  board[2][1] = 'bw';
  board[4][5] = 'rw';
  it('should return all of the squares the knight can capture', (): void => {
    const moves = knightMoves(board, [3, 3], 'b');
    expect(moves.moves).toHaveLength(6);
    expect(moves.captures).toHaveLength(2);
    
  })
  board[5][2] = 'rb';
  it('should not allow the knight to capture its own pieces', (): void => {
    const moves = knightMoves(board, [3, 3], 'b');
    expect(moves.moves).toHaveLength(5);
    expect(moves.captures).toHaveLength(2);

  })
}) 
xdescribe ('bishopMoves', (): void => {
  const board = JSON.parse(JSON.stringify(emptyBoard));
  board[0][0] = 'bw';
  board[1][1] = 'nw';
  it('should return an empty moves object when the bishop is trapped', (): void => {
    const emptyMoves = bishopMoves(board, [0, 0], 'w');
    expect(emptyMoves.moves).toHaveLength(0);
    expect(emptyMoves.captures).toHaveLength(0);
  })
  board[0][0] = '-';
  board[0][0] = '-';
  board[3][3] = 'bw'
  it('should return all of the squares the bishop can move to', (): void => {
    const moves = bishopMoves(board, [3, 3], 'w');
    expect(moves.moves).toHaveLength(13);
    expect(moves.captures).toHaveLength(0);
  })
  board[2][2] = 'bb';
  board[5][1] = 'rb';
  it('should return all of the squares the bishop can capture', (): void => {
    const moves = bishopMoves(board, [3, 3], 'w');
    expect(moves.moves).toHaveLength(8);
    expect(moves.captures).toHaveLength(2);
    
  })
  board[4][4] = 'rw';
  it('should not allow the bishop to capture its own pieces', (): void => {
    const moves = bishopMoves(board, [3, 3], 'w');
    expect(moves.moves).toHaveLength(4);
    expect(moves.captures).toHaveLength(2);

  })
}) 
xdescribe ('kingMoves', (): void => {
  const board = JSON.parse(JSON.stringify(emptyBoard));
  board[0][0] = 'kw';
  board[0][1] = 'nw';
  board[1][0] = 'nw';
  board[1][1] = 'nw';
  it('should return an empty moves object when the king is trapped', (): void => {
    const emptyMoves = kingMoves(board, [0, 0], 'w');
    expect(emptyMoves.moves).toHaveLength(0);
    expect(emptyMoves.captures).toHaveLength(0);
  })
  board[4][4] = 'kw';
  it('should return all of the squares the king can move to', (): void => {
    const moves = kingMoves(board, [4, 4], 'w');
    expect(moves.moves).toHaveLength(8);
    expect(moves.captures).toHaveLength(0);
  })
  board[4][5] = 'bb';
  board[3][4] = 'rb';
  it('should return all of the squares the king can capture', (): void => {
    const moves = kingMoves(board, [4, 4], 'w');
    expect(moves.moves).toHaveLength(6);
    expect(moves.captures).toHaveLength(2);
    
  })
  board[5][5] = 'rw';
  it('should not allow the king to capture its own pieces', (): void => {
    const moves = kingMoves(board, [4, 4], 'w');
    expect(moves.moves).toHaveLength(5);
    expect(moves.captures).toHaveLength(2);

  })
}) 
xdescribe ('pawnMoves', (): void => {
  const board = JSON.parse(JSON.stringify(emptyBoard));
  board[1][1] = 'pw';
  board[2][1] = 'rw';
  it('should return an empty moves object when the pawn is trapped', (): void => {
    const emptyMoves = pawnMoves(board, [1, 1], 'w');
    expect(emptyMoves.moves).toHaveLength(0);
    expect(emptyMoves.captures).toHaveLength(0);
  })
  board[2][1] = '-';
  board[5][5] = 'pb';
  it('should return all of the squares the pawn can move to', (): void => {
    const whiteMoves = pawnMoves(board, [1, 1], 'w');
    const blackMoves = pawnMoves(board, [5, 5], 'b');
    expect(whiteMoves.moves).toHaveLength(2);
    expect(whiteMoves.captures).toHaveLength(0);
    expect(blackMoves.moves).toHaveLength(1);
    expect(blackMoves.captures).toHaveLength(0);
  })
  board[4][4] = 'pw';
  it('should return all of the squares the pawn can capture', (): void => {
    const moves = pawnMoves(board, [5, 5], 'b');
    expect(moves.moves).toHaveLength(1);
    expect(moves.captures).toHaveLength(1);
    
  })
  board[4][6] = 'pb';
  it('should not allow the pawn to capture its own pieces', (): void => {
    const moves = pawnMoves(board, [5, 5], 'b');
    expect(moves.moves).toHaveLength(1);
    expect(moves.captures).toHaveLength(1);

  })
}) 