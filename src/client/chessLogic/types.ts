export type coordinate = [number, number];
export type piece = 'kw' | 'qw' | 'rw' | 'bw' | 'nw' | 'pw' | 'kb' | 'qb' | 'rb' | 'bb' | 'nb' | 'pb' | '-';
export type board = piece[][];
export type player = 'w' | 'b';
export type moves = {moves: coordinate[], captures: coordinate[]};