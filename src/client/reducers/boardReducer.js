import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	board: [
		['rw', 'nw', 'bw', 'qw', 'kw', 'bw', 'nw', 'rw'],
		['pw', 'pw', 'pw', 'pw', 'pw', 'pw', 'pw', 'pw'],
		['-', '-', '-', '-', '-', '-', '-', '-'],
		['-', '-', '-', '-', '-', '-', '-', '-'],
		['-', '-', '-', '-', '-', '-', '-', '-'],
		['-', '-', '-', '-', '-', '-', '-', '-'],
		['pb', 'pb', 'pb', 'pb', 'pb', 'pb', 'pb', 'pb'],
		['rb', 'nb', 'bb', 'qb', 'kb', 'bb', 'nb', 'rb'],
	],
	currentPlayer: 'w',
	selectedSquare: null,
	potentialMoves: { moves: [], captures: [] },
	isTwoPlayer: true,
	pawnJumpedLastTurn: false, // set to coordinate of pawn that moves two squares
	movedCastlers: { rb0: false, rb7: false, kb: false, rw0: false, rw7: false, kw: false },
	gameOver: false // can be w (white wins), b (black wins), sm (stalemate), 3mr(3 move rep), 50mr(50 moves)
};

export const boardSlice = createSlice({
	name: 'board',
	initialState,
	reducers: {
		selectSquare: (state, action) => {
			state.selectedSquare = action.payload;
		},
		setPotentialMoves: (state, action) => {
			state.potentialMoves = action.payload;
		},
		setNewBoard: (state, action) => {
			state.board = action.payload
		},
		switchPlayer: (state) => {
			state.currentPlayer = state.currentPlayer === 'w' ? 'b' : 'w';
		},
		setPawnJumpPrevious: (state, action) => {
			state.pawnJumpedLastTurn = action.payload;
		},
		setMovedCastlers: (state, action) => {
			state.movedCastlers = action.payload;
		},
		setGameOver: (state, action) => {
			state.gameOver = action.payload;
		},
		resetGame: (state) => {
			return initialState;
		}
	}
});

export const { selectSquare, setPotentialMoves, setNewBoard, switchPlayer, setPawnJumpPrevious, setMovedCastlers, setGameOver, resetGame } = boardSlice.actions;
export default boardSlice.reducer;