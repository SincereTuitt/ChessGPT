import React from "react";
import Square from './Square.jsx';


const Row = ({ rowData, rowNumber, theme }) => {
  const getSquareColor = (columnNumber) => {
    return rowNumber % 2 === columnNumber % 2 ? 'dark' : 'light';
  };

  return (
    <div className="row">
      {rowData.map((square, index) => (
        <Square
          colorType={ getSquareColor(index)}
          piece={rowData[index]}
          theme={theme}
          key={crypto.randomUUID()}
        />
      ))}
    </div>
  )
}

export default Row;