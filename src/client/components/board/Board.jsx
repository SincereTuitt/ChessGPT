import React from "react";
import { useEffect } from 'react';
import { useSelector } from "react-redux";
import Row from './Row.jsx'
import '../../styles/board.css'


const Board = () => {
	const theme = useSelector((state) => state.settings.theme);
	console.log({theme})

	const boardState = useSelector((state) => state.board);
	const currentPosition = boardState.board;


	return (
		<div id='board'>
			{currentPosition.map((row, index) => (
				<Row
					rowData={row}
					key={crypto.randomUUID()}
					rowNumber={index}
					theme={theme}
				/>
			))}
		</div>
	)
};


export default Board;