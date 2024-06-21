import React from "react";
import Board from "./board/Board.jsx";
import SettingsContainer from "./settings/SettingsContainer.jsx";

const GameContainer = () => {

  return (
    <div style={{
      display: "flex", 
      flexDirection: "row", 
      justifyContent: "space-around",
      alignItems: "center"
      }}>
      <Board />
      <SettingsContainer />
    </div>
  )
}

export default GameContainer;