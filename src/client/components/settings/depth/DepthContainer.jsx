import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setEngineDepth } from "../../../reducers/settingsReducer";

const DepthContainer = () => {
  const depth = useSelector((state) => state.settings.engineDepth);
  const isTwoPlayer = useSelector((state) => state.settings.isTwoPlayer);

  const dispatch = useDispatch()

  return (
    <div style={{
      display: isTwoPlayer ? 'none' : 'block'
    }}>
      <h3>Set Engine Depth</h3>
      <input
      type="range"
      min="1"
      max="2.5"
      step="0.5"
      value={depth}
      onChange={(e) => dispatch(setEngineDepth(e.target.value))}
      />
      {depth}
    </div>
  )
}

export default DepthContainer;