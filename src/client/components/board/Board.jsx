import React from "react";
import { useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import Row from './Row.jsx';
import GameOver from "../settings/GameOver.jsx";
import { getPawnJumpPrevious, updateCastlingOptions, updateBoard, isGameOver } from "../../chessLogic/legalMoves.js";
import { setPawnJumpPrevious, setMovedCastlers, setNewBoard, selectSquare, setPotentialMoves, switchPlayer, setGameOver, addPreviousMove } from "../../reducers/boardReducer.js";
import '../../styles/board.css';


const Board = () => {
	const theme = useSelector((state) => state.settings.theme);
	const isTwoPlayer = useSelector((state) => state.settings.isTwoPlayer);
	const playerColor = useSelector((state) => state.settings.playerColor);
	const depth = useSelector((state) => state.settings.engineDepth);
	const currentPlayer = useSelector((state) => state.board.currentPlayer);
	const gameOver = useSelector((state) => state.board.gameOver);
	const boardState = useSelector((state) => state.board.board);
	const movedCastlers = useSelector((state) => state.board.movedCastlers);
	const pawnJumpPrevious = useSelector((state) => state.board.pawnJumpPrevious);

	const dispatch = useDispatch()

	const updateBoardStates = (moveFrom, moveTo) => {
		const newPawnJumpPrevious = getPawnJumpPrevious(boardState, moveFrom, moveTo, currentPlayer);
		const newMovedCastlers = updateCastlingOptions(
			movedCastlers,
			boardState,
			moveFrom,
			moveTo,
			currentPlayer
		);
		const updatedBoard = updateBoard(boardState, moveFrom, moveTo, currentPlayer)

		dispatch(setPawnJumpPrevious(newPawnJumpPrevious));
		dispatch(setMovedCastlers(newMovedCastlers));
		dispatch(setNewBoard(updatedBoard));
		dispatch(selectSquare(null));
		dispatch(setPotentialMoves({ moves: [], captures: [] }));
		dispatch(switchPlayer());
		dispatch(setGameOver(isGameOver(updatedBoard, currentPlayer === 'w' ? 'b' : 'w', undefined)));
		dispatch(addPreviousMove({
			move: [moveFrom, moveTo],
			board: boardState
		}))
	}

	const makeEngineMove = ((worker) => {
		worker.postMessage({
			request: 'getEngineMove',
			boardState,
			depth,
			currentPlayer,
			movedCastlers,
			pawnJumpPrevious
		});
		worker.onmessage = (e) => {
			const { move } = e.data;
			updateBoardStates(move[0], move[1]);
		}
	});

	const isBoardFlipped = (() => {
		if (
			isTwoPlayer && currentPlayer === 'b'
			|| !isTwoPlayer && playerColor === 'b'
		) return true;
	})()

	useEffect(() => {
		const worker = new Worker(new URL('../../worker.js', import.meta.url));
		if (
			!isTwoPlayer 
			&& currentPlayer !== playerColor
			&& !gameOver
		) {
			makeEngineMove(worker);
		}
		return () => {
			worker.terminate();
		}
	}, [currentPlayer, playerColor]);

	return (
		<div id='board' style={
			isBoardFlipped ? { flexDirection: "column" } : {}
		}>
			{boardState.map((row, index) => (
				<Row
					rowData={row}
					rowNumber={index}
					theme={theme}
					isBoardFlipped={isBoardFlipped}
					updateBoardStates={updateBoardStates}
					key={crypto.randomUUID()}
				/>
			))}
			<GameOver gameOver={gameOver} />
		</div>
	)
};


export default Board;