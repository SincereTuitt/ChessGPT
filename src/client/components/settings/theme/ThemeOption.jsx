import React from "react";
import { useDispatch } from "react-redux";
import { changeTheme } from "../../../reducers/settingsReducer";

const ThemeOption = ({ isSelected, name }) => {
  const dispatch = useDispatch();

  return (
    <div>
      <button
        className={isSelected ? 'settingSelected' : 'settingNotSelected'}
        onClick={() => dispatch(changeTheme(name))}
      ></button>
      &nbsp;
      {name[0].toUpperCase() + name.slice(1)}
    </div>
  )
}

export default ThemeOption;