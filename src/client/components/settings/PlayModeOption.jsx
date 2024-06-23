import React from "react";
import { useDispatch } from "react-redux";
import { setTwoPlayer } from "../../reducers/settingsReducer";

const PlayModeOption = ({ isSelected, name }) => {
  const dispatch = useDispatch();
 
  return (
    <div>
      <button
        className={isSelected ? 'settingSelected' : 'settingNotSelected'}
        onClick={() => dispatch(setTwoPlayer(name === 'Two Player'))}
      ></button>
      &nbsp;
      {name}
    </div>
  )
}

export default PlayModeOption;