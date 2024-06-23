import { calculateMaterial, chooseBestOption, getAllMoves, getEngineMove, getNodeScore } from "../engine.ts";
import { board, option, piece } from "../types";
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
const options: option[] = [
  {
    move: [[0, 0], [4, 4]],
    score: 3,
    boardState: initialBoard
  },
  {
    move: [[1, 1], [1, 2]],
    score: -50,
    boardState: initialBoard
  },
  {
    move: [[3, 4], [4, 4]],
    score: -Infinity,
    boardState: initialBoard
  },
]

describe('calculateMaterial', (): void => {
  it('should return the correct value', (): void => {
    const board: board = JSON.parse(JSON.stringify(initialBoard));
    expect(calculateMaterial(board)).toBe(0);
    board[0][0] = '-';
    board[0][7] = 'qb';
    expect(calculateMaterial(board)).toBe(-19);
  })
})
describe('chooseBestOption', (): void => {
  it('should return the best option', () => {
    expect(chooseBestOption('w', options)).toEqual([[0, 0], [4, 4]]);
  })
  it('should always choose checkmate (+/- infinity)', () => {
    expect(chooseBestOption('b', options)).toEqual([[3, 4], [4, 4]]);
  })
})
describe('getAllMoves', (): void => {
  it('should return all the possible of moves', (): void => {
    const possibleMoves = getAllMoves(0, initialBoard, 'w', undefined, canCastle)
    expect(possibleMoves).toHaveLength(20);
    expect(possibleMoves[0]).toHaveProperty('score');
    expect(possibleMoves[0]).toHaveProperty('move');
    expect(possibleMoves[0]).toHaveProperty('boardState');
  })
})
describe('getNodeScores', (): void => {
  it('should return a number', (): void => {
    expect(getNodeScore(1, 'w', initialBoard, canCastle, false, 0)).toBe(0);
  })
})
describe('getEngineMove', (): void => {
  let board;
  beforeEach(() => board = JSON.parse(JSON.stringify(emptyBoard)));
  it('should return a move', (): void => {
    const bestMove = getEngineMove(.5, 'w', initialBoard, canCastle, false)
    expect(bestMove).toHaveLength(2);
    expect(bestMove[0]).toHaveLength(2);
    expect(bestMove[1]).toHaveLength(2);
  })
  it('should capture a free piece', (): void => {
    board[0][0] = 'qw';
    board[0][7] = 'rb';
    expect(getEngineMove(.5, 'b', board, cannotCastle, false)).toEqual([[0, 7], [0, 0]]);
  })
  it('should deliver checkmate in 1', (): void => {
    board[0][0] = 'kw';
    board[1][7] = 'rb';
    board[2][6] = 'rb';
    expect(getEngineMove(1, 'b', board, cannotCastle, false)).toEqual([[2, 6], [0, 6]]);
  })
  it('should choose checkmate over material', (): void => {
    board[0][0] = 'kw';
    board[1][7] = 'rb';
    board[2][6] = 'rb';
    board[2][7] = 'rw';
    expect(getEngineMove(1, 'b', board, cannotCastle, false)).toEqual([[2, 6], [0, 6]]);
  })
})

