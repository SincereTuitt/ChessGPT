import React from "react";
import { useSelector } from "react-redux";

const PromotionOptions = () => {
  const currentPlayer = useSelector((state) => state.board.currentPlayer);

  const promotionPieces = ['q', 'r', 'n', 'b'];
  const options = promotionPieces.map((piece) => piece + currentPlayer);

  return (
    <div
      className="promotionOptions"
    >
      {options.map((option) => (
        <button className={`bg-${option}`}></button>
      ))}
      <button id="closePromotion"> x </button>
    </div>
  )
};

export default PromotionOptions;