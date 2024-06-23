import React from "react";
import { useSelector } from "react-redux";
import PlayerColorOption from "./PlayerColorOption.jsx";

const PlayerColorContainer = () => {
  const isTwoPlayer = useSelector((state) => state.settings.isTwoPlayer);
  const playerColor = useSelector((state) => state.settings.playerColor);

  return (
    <div style={{
      display: isTwoPlayer ? 'none' : 'block'
    }}>
      <h3>Play as</h3>
      <PlayerColorOption
        name={'Black'}
        isSelected={playerColor === 'b'}
      />
      <PlayerColorOption
        name={'White'}
        isSelected={playerColor === 'w'}
      />
    </div>
  )
}

export default PlayerColorContainer;