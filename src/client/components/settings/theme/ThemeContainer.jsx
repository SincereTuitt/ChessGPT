import React from "react";
import { useSelector } from "react-redux";
import ThemeOption from "./ThemeOption.jsx";

const ThemeContainer = () => {
  const currentTheme = useSelector((state) => state.settings.theme);
  const themeOptions = ['green', 'blue', 'red', 'gray'];

  return (
    <div>
      <h3>Choose theme</h3>
      {themeOptions.map((theme, index) => (
        <ThemeOption
          isSelected={theme === currentTheme}
          name={theme}
          key={crypto.randomUUID()}
        />
      ))}
    </div>
  )
}

export default ThemeContainer;