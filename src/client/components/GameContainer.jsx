import React from "react";
import Board from "./board/Board.jsx";
import SettingsContainer from "./settings/SettingsContainer.jsx";

const GameContainer = () => {

  return (
    <div id="gameContainer">
      <Board />
      <SettingsContainer />
    </div>
  )
}

export default GameContainer;