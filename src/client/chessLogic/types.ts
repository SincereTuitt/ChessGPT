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
}