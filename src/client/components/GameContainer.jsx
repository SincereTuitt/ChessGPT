import React from "react";
import Board from "./board/Board.jsx";
import SettingsContainer from "./settings/SettingsContainer.jsx";
import King from "./GPT/King.jsx";

const GameContainer = () => {

  return (
    <div id="gameContainer">
      <King/>
      <Board />
      <SettingsContainer />
    </div>
  )
}

export default GameContainer;