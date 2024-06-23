import React from "react";
import Square from './Square.jsx';


const Row = ({ rowData, rowNumber, theme, isBoardFlipped, updateBoardStates }) => {
  const getSquareColor = (columnNumber) => {
    return rowNumber % 2 === columnNumber % 2 ? 'dark' : 'light';
  };

  return (
    <div className="row" style={
			isBoardFlipped ? {flexDirection: "row-reverse"} : {}
		}>
      {rowData.map((square, index) => (
        <Square
          colorType={ getSquareColor(index)}
          piece={square}
          theme={theme}
          coordinate={[rowNumber, index]}
          updateBoardStates={updateBoardStates}
          key={crypto.randomUUID()}
        />
      ))}
    </div>
  )
}

export default Row;