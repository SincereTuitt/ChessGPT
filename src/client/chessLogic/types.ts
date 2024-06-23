export type coordinate = [number, number];
export type piece = 'kw' | 'qw' | 'rw' | 'bw' | 'nw' | 'pw' | 'kb' | 'qb' | 'rb' | 'bb' | 'nb' | 'pb' | '-';
export type board = piece[][];
export type player = 'w' | 'b';
export type moves = {moves: coordinate[], captures: coordinate[]};
export interface movedCastlers {
  rb0: boolean, 
  rb7: boolean, 
  kb: boolean, 
  rw0: boolean, 
  rw7: boolean, 
  kw: boolean
};
export type gameState = 'w' | 'b' | 'sm' | '3mr' | '50mr' | false;
export type move = [coordinate, coordinate];
export interface option {
  score: number,
  move: move,
  boardState: board
};