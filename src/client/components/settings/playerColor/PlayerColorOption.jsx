import React from "react";
import { useDispatch } from "react-redux";
import { setPlayerColor } from "../../../reducers/settingsReducer";
import { resetGame } from "../../../reducers/boardReducer";

const PlayerColorOption = ({ isSelected, name }) => {
  const dispatch = useDispatch();

  const clickFunction = () => {
    dispatch(setPlayerColor(name[0].toLowerCase()));
    dispatch(resetGame());
  }

  return (
    <div>
      <button
        className={isSelected ? 'settingSelected' : 'settingNotSelected'}
        onClick={clickFunction}
      ></button>
      &nbsp;
      {name}
    </div>
  )
}

export default PlayerColorOption;