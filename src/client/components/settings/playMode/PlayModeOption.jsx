import React from "react";
import { useDispatch } from "react-redux";
import { setTwoPlayer } from "../../../reducers/settingsReducer";
import { resetGame } from "../../../reducers/boardReducer";

const PlayModeOption = ({ isSelected, name }) => {
  const dispatch = useDispatch();

  const clickFunction = () => {
    dispatch(setTwoPlayer(name === 'Two Player'));
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

export default PlayModeOption;