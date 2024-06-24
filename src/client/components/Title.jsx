import React from "react";
import { useSelector } from "react-redux";

const Title = () => {
  const theme = useSelector((state) => state.settings.theme);

  return (
    <h1 id="title" style={{
      color: theme,
      textAlign: 'center'
    }}>
      ChessGPT!
    </h1>
  )
}

export default Title;