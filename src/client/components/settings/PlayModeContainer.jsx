import React from "react";
import { useSelector } from "react-redux";
import PlayModeOption from "./PlayModeOption.jsx";

const PlayModeContainer = () => {
  const isTwoPlayer = useSelector((state) => state.settings.isTwoPlayer);

  return (
    <div>
      <h3>Choose how you play</h3>
      <PlayModeOption
        name={'Single Player'}
        isSelected={!isTwoPlayer}
      />
      <PlayModeOption
        name={'Two Player'}
        isSelected={isTwoPlayer}
      />
    </div>
  )
}

export default PlayModeContainer;