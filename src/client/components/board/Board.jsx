import React from "react";
import { useEffect } from 'react';
import { useSelector } from "react-redux";
import Row from './Row.jsx'
import '../../styles/board.css'


const Board = () => {
	const theme = useSelector((state) => state.settings.theme);
	const isTwoPlayer = useSelector((state) => state.board.isTwoPlayer);
	const currentPlayer = useSelector((state) => state.board.currentPlayer);
	const boardState = useSelector((state) => state.board);
	const currentPosition = boardState.board;

	const isBoardFlipped = (() => {
		if (isTwoPlayer && currentPlayer === 'b') return true;
	})()


	return (
		<div id='board' style={
			isBoardFlipped ? {flexDirection: "column"} : {}
		}>
			{currentPosition.map((row, index) => (
				<Row
					rowData={row}
					key={crypto.randomUUID()}
					rowNumber={index}
					theme={theme}
					isBoardFlipped={isBoardFlipped}
				/>
			))}
		</div>
	)
};


export default Board;