import React, { useState } from "react";
import { useSelector } from "react-redux";

const Square = ({ piece, colorType, theme }) => {
  const squareColor = (() => {
    let color = colorType + theme;
    if (color === 'lightred') color = '#ff575f';
    return color;
  })();

  return (
    <button
      className={`square bg-${piece}`}
      style={{
        backgroundColor: squareColor,
      }}

    >
    </button>
  )
}

export default Square;