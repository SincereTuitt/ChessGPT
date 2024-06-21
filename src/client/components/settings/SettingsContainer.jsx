import React from "react";
import { useSelector } from "react-redux";
import ThemeContainer from "./ThemeContainer.jsx";
import '../../styles/settings.css';

const SettingsContainer = () => {
  const theme = useSelector((state) => state.settings.theme);
  const getColors = () => {
    const headerColor = 'dark' + theme;
    let backgroundColor = 'light' + theme;
    if (theme === 'red') backgroundColor = '#ff575f';
    return [headerColor, backgroundColor];
  }
  const colorScheme = getColors();

  return (
    <div id="settings" style={{backgroundColor: colorScheme[1]}}>
      <div id="settingsHeader" style={{backgroundColor: colorScheme[0]}}>
        <h3>Settings</h3>
      </div>
      <ThemeContainer />
    </div> 
  )
}

export default SettingsContainer;