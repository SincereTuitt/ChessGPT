"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const legalMoves_1 = require("../legalMoves");
const initialBoard = [
    ['rw', 'nw', 'bw', 'qw', 'kw', 'bw', 'nw', 'rw'],
    ['pw', 'pw', 'pw', 'pw', 'pw', 'pw', 'pw', 'pw'],
    ['-', '-', '-', '-', '-', '-', '-', '-'],
    ['-', '-', '-', '-', '-', '-', '-', '-'],
    ['-', '-', '-', '-', '-', '-', '-', '-'],
    ['-', '-', '-', '-', '-', '-', '-', '-'],
    ['pb', 'pb', 'pb', 'pb', 'pb', 'pb', 'pb', 'pb'],
    ['rb', 'nb', 'bb', 'qb', 'kb', 'bb', 'nb', 'rb'],
];
const emptyBoard = [
    ['-', '-', '-', '-', '-', '-', '-', '-'],
    ['-', '-', '-', '-', '-', '-', '-', '-'],
    ['-', '-', '-', '-', '-', '-', '-', '-'],
    ['-', '-', '-', '-', '-', '-', '-', '-'],
    ['-', '-', '-', '-', '-', '-', '-', '-'],
    ['-', '-', '-', '-', '-', '-', '-', '-'],
    ['-', '-', '-', '-', '-', '-', '-', '-'],
    ['-', '-', '-', '-', '-', '-', '-', '-'],
];
describe('isInCheck', () => {
    let board;
    beforeEach(() => {
        board = JSON.parse(JSON.stringify(emptyBoard));
    });
    it('should return true if an enemy piece sees the king', () => {
        board[0][0] = 'kw';
        board[0][7] = 'rb';
        expect(legalMoves_1.isInCheck(board, 'w')).toBe(true);
        board[0][7] = '-';
        board[1][2] = 'nb';
        expect(legalMoves_1.isInCheck(board, 'w')).toBe(true);
        board[1][2] = '-';
        board[4][4] = 'qb';
        expect(legalMoves_1.isInCheck(board, 'w')).toBe(true);
    });
    it('should return false if not in check', () => {
        board[0][0] = 'kb';
        board[1][6] = 'rw';
        board[3][4] = 'qw';
        board[5][5] = 'nw';
        board[2][2] = 'pw';
        expect(legalMoves_1.isInCheck(board, 'b')).toBe(false);
    });
    it('should return false if a friendly piece blocks check', () => {
        board[0][0] = 'kb';
        board[0][7] = 'rw';
        board[0][4] = 'rb';
        board[5][5] = 'bw';
        board[3][3] = 'bb';
        expect(legalMoves_1.isInCheck(board, 'b')).toBe(false);
    });
    it('should return true when the enemy king is adjacent', () => {
        board[0][0] = 'kw';
        board[1][1] = 'kb';
        expect(legalMoves_1.isInCheck(board, 'w')).toBe(true);
        board[1][1] = '-';
        board[0][1] = 'kb';
        console.log({ board });
        expect(legalMoves_1.isInCheck(board, 'b')).toBe(true);
    });
});
describe('updateBoard', () => {
    it('should move a piece to an empty square', () => {
        const board = JSON.parse(JSON.stringify(emptyBoard));
        const expectedBoard = JSON.parse(JSON.stringify(emptyBoard));
        board[0][0] = 'rw';
        expectedBoard[0][7] = 'rw';
        const newBoard = legalMoves_1.updateBoard(board, [0, 0], [0, 7]);
        expect(JSON.stringify(newBoard)).toBe(JSON.stringify(expectedBoard));
    });
    it('should replace a piece on a non-empty square', () => {
        const board = JSON.parse(JSON.stringify(emptyBoard));
        const expectedBoard = JSON.parse(JSON.stringify(emptyBoard));
        board[0][0] = 'rw';
        board[0][7] = 'rb';
        expectedBoard[0][7] = 'rw';
        const newBoard = legalMoves_1.updateBoard(board, [0, 0], [0, 7]);
        expect(JSON.stringify(newBoard)).toBe(JSON.stringify(expectedBoard));
    });
});
describe('getMoves', () => {
    it('should return an empty moves object when the selected square is empty', () => {
        const emptyMoves = legalMoves_1.getMoves(initialBoard, [3, 3], 'w');
        expect(emptyMoves.moves).toHaveLength(0);
        expect(emptyMoves.captures).toHaveLength(0);
    });
    it('should return an empty moves object when the selected piece does not belong to the current player', () => {
        const emptyMoves = legalMoves_1.getMoves(initialBoard, [6, 6], 'w');
        expect(emptyMoves.moves).toHaveLength(0);
        expect(emptyMoves.captures).toHaveLength(0);
    });
    let board = JSON.parse(JSON.stringify(emptyBoard));
    beforeEach(() => { board = JSON.parse(JSON.stringify(emptyBoard)); });
    it('should not allow the king to move into check', () => {
        board[0][0] = 'kb';
        board[7][1] = 'rw';
        board[1][7] = 'rw';
        const emptyMoves = legalMoves_1.getMoves(board, [0, 0], 'b');
        expect(emptyMoves.moves).toHaveLength(0);
        expect(emptyMoves.captures).toHaveLength(0);
    });
    it('should not allow a piece blocking check to move', () => {
        board[0][0] = 'kb';
        board[3][3] = 'rb';
        board[5][5] = 'qw';
        const emptyMoves = legalMoves_1.getMoves(board, [3, 3], 'b');
        expect(emptyMoves.moves).toHaveLength(0);
        expect(emptyMoves.captures).toHaveLength(0);
    });
    it('should allow all moves that do not put the king in danger', () => {
        board[0][0] = 'kb';
        board[3][3] = 'bb';
        board[7][7] = 'qw';
        const moves = legalMoves_1.getMoves(board, [3, 3], 'b');
        expect(moves.moves).toHaveLength(5);
        expect(moves.captures).toHaveLength(1);
    });
});
describe('rookMoves', () => {
    const board = JSON.parse(JSON.stringify(emptyBoard));
    it('should return an empty moves object when the rook is trapped', () => {
        board[0][0] = 'rw';
        board[0][1] = 'nw';
        board[1][0] = 'nw';
        const emptyMoves = legalMoves_1.rookMoves(board, [0, 0], 'w');
        expect(emptyMoves.moves).toHaveLength(0);
        expect(emptyMoves.captures).toHaveLength(0);
    });
    it('should return all of the squares the rook can move to', () => {
        board[0][1] = '-';
        board[1][0] = '-';
        const moves = legalMoves_1.rookMoves(board, [0, 0], 'w');
        expect(moves.moves).toHaveLength(14);
        expect(moves.captures).toHaveLength(0);
    });
    it('should return all of the squares the rook can capture', () => {
        board[0][5] = 'bb';
        board[7][0] = 'rb';
        const moves = legalMoves_1.rookMoves(board, [0, 0], 'w');
        expect(moves.moves).toHaveLength(10);
        expect(moves.captures).toHaveLength(2);
    });
    it('should not allow the rook to capture its own pieces', () => {
        board[6][0] = 'rw';
        const moves = legalMoves_1.rookMoves(board, [0, 0], 'w');
        expect(moves.moves).toHaveLength(9);
        expect(moves.captures).toHaveLength(1);
    });
});
describe('queenMoves', () => {
    const board = JSON.parse(JSON.stringify(emptyBoard));
    it('should return an empty moves object when the queen is trapped', () => {
        board[0][0] = 'qw';
        board[0][1] = 'nw';
        board[1][0] = 'nw';
        board[1][1] = 'nw';
        const emptyMoves = legalMoves_1.queenMoves(board, [0, 0], 'w');
        expect(emptyMoves.moves).toHaveLength(0);
        expect(emptyMoves.captures).toHaveLength(0);
    });
    it('should return all of the squares the queen can move to', () => {
        board[0][1] = '-';
        board[1][0] = '-';
        board[1][1] = '-';
        const moves = legalMoves_1.queenMoves(board, [0, 0], 'w');
        expect(moves.moves).toHaveLength(21);
        expect(moves.captures).toHaveLength(0);
    });
    it('should return all of the squares the queen can capture', () => {
        board[0][5] = 'bb';
        board[7][0] = 'rb';
        board[2][2] = 'rb';
        const moves = legalMoves_1.queenMoves(board, [0, 0], 'w');
        expect(moves.moves).toHaveLength(11);
        expect(moves.captures).toHaveLength(3);
    });
    it('should not allow the queen to capture its own pieces', () => {
        board[2][2] = 'rw';
        const moves = legalMoves_1.queenMoves(board, [0, 0], 'w');
        expect(moves.moves).toHaveLength(11);
        expect(moves.captures).toHaveLength(2);
    });
});
describe('knightMoves', () => {
    const board = JSON.parse(JSON.stringify(emptyBoard));
    it('should return an empty moves object when the knight is trapped', () => {
        board[0][0] = 'nb';
        board[2][1] = 'nb';
        board[1][2] = 'nb';
        const emptyMoves = legalMoves_1.knightMoves(board, [0, 0], 'b');
        expect(emptyMoves.moves).toHaveLength(0);
        expect(emptyMoves.captures).toHaveLength(0);
    });
    it('should return all of the squares the knight can move to', () => {
        board[2][1] = '-';
        board[1][2] = '-';
        board[3][3] = 'nb';
        const moves = legalMoves_1.knightMoves(board, [3, 3], 'b');
        expect(moves.moves).toHaveLength(8);
        expect(moves.captures).toHaveLength(0);
    });
    it('should return all of the squares the knight can capture', () => {
        board[2][1] = 'bw';
        board[4][5] = 'rw';
        const moves = legalMoves_1.knightMoves(board, [3, 3], 'b');
        expect(moves.moves).toHaveLength(6);
        expect(moves.captures).toHaveLength(2);
    });
    it('should not allow the knight to capture its own pieces', () => {
        board[5][2] = 'rb';
        const moves = legalMoves_1.knightMoves(board, [3, 3], 'b');
        expect(moves.moves).toHaveLength(5);
        expect(moves.captures).toHaveLength(2);
    });
});
describe('bishopMoves', () => {
    const board = JSON.parse(JSON.stringify(emptyBoard));
    it('should return an empty moves object when the bishop is trapped', () => {
        board[0][0] = 'bw';
        board[1][1] = 'nw';
        const emptyMoves = legalMoves_1.bishopMoves(board, [0, 0], 'w');
        expect(emptyMoves.moves).toHaveLength(0);
        expect(emptyMoves.captures).toHaveLength(0);
    });
    it('should return all of the squares the bishop can move to', () => {
        board[0][0] = '-';
        board[1][1] = '-';
        board[3][3] = 'bw';
        const moves = legalMoves_1.bishopMoves(board, [3, 3], 'w');
        expect(moves.moves).toHaveLength(13);
        expect(moves.captures).toHaveLength(0);
    });
    it('should return all of the squares the bishop can capture', () => {
        board[2][2] = 'bb';
        board[5][1] = 'rb';
        const moves = legalMoves_1.bishopMoves(board, [3, 3], 'w');
        expect(moves.moves).toHaveLength(8);
        expect(moves.captures).toHaveLength(2);
    });
    it('should not allow the bishop to capture its own pieces', () => {
        board[4][4] = 'rw';
        const moves = legalMoves_1.bishopMoves(board, [3, 3], 'w');
        expect(moves.moves).toHaveLength(4);
        expect(moves.captures).toHaveLength(2);
    });
});
describe('kingMoves', () => {
    const board = JSON.parse(JSON.stringify(emptyBoard));
    it('should return an empty moves object when the king is trapped', () => {
        board[0][0] = 'kw';
        board[0][1] = 'nw';
        board[1][0] = 'nw';
        board[1][1] = 'nw';
        const emptyMoves = legalMoves_1.kingMoves(board, [0, 0], 'w');
        expect(emptyMoves.moves).toHaveLength(0);
        expect(emptyMoves.captures).toHaveLength(0);
    });
    it('should return all of the squares the king can move to', () => {
        board[4][4] = 'kw';
        const moves = legalMoves_1.kingMoves(board, [4, 4], 'w');
        expect(moves.moves).toHaveLength(8);
        expect(moves.captures).toHaveLength(0);
    });
    it('should return all of the squares the king can capture', () => {
        board[4][5] = 'bb';
        board[3][4] = 'rb';
        const moves = legalMoves_1.kingMoves(board, [4, 4], 'w');
        expect(moves.moves).toHaveLength(6);
        expect(moves.captures).toHaveLength(2);
    });
    it('should not allow the king to capture its own pieces', () => {
        board[5][5] = 'rw';
        const moves = legalMoves_1.kingMoves(board, [4, 4], 'w');
        expect(moves.moves).toHaveLength(5);
        expect(moves.captures).toHaveLength(2);
    });
});
describe('pawnMoves', () => {
    const board = JSON.parse(JSON.stringify(emptyBoard));
    it('should return an empty moves object when the pawn is trapped', () => {
        board[1][1] = 'pw';
        board[2][1] = 'rw';
        const emptyMoves = legalMoves_1.pawnMoves(board, [1, 1], 'w');
        expect(emptyMoves.moves).toHaveLength(0);
        expect(emptyMoves.captures).toHaveLength(0);
    });
    it('should return all of the squares the pawn can move to', () => {
        board[2][1] = '-';
        board[5][5] = 'pb';
        const whiteMoves = legalMoves_1.pawnMoves(board, [1, 1], 'w');
        const blackMoves = legalMoves_1.pawnMoves(board, [5, 5], 'b');
        expect(whiteMoves.moves).toHaveLength(2);
        expect(whiteMoves.captures).toHaveLength(0);
        expect(blackMoves.moves).toHaveLength(1);
        expect(blackMoves.captures).toHaveLength(0);
    });
    it('should return all of the squares the pawn can capture', () => {
        board[4][4] = 'pw';
        const moves = legalMoves_1.pawnMoves(board, [5, 5], 'b');
        expect(moves.moves).toHaveLength(1);
        expect(moves.captures).toHaveLength(1);
    });
    it('should not allow the pawn to capture its own pieces', () => {
        board[4][6] = 'pb';
        const moves = legalMoves_1.pawnMoves(board, [5, 5], 'b');
        expect(moves.moves).toHaveLength(1);
        expect(moves.captures).toHaveLength(1);
    });
});
