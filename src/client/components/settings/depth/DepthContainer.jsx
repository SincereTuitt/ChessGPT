import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setEngineDepth } from "../../../reducers/settingsReducer";

const DepthContainer = () => {
  const depth = useSelector((state) => state.settings.engineDepth) * 2;
  const isTwoPlayer = useSelector((state) => state.settings.isTwoPlayer);

  const dispatch = useDispatch()

  return (
    <div style={{
      display: isTwoPlayer ? 'none' : 'block'
    }}>
      <h3>Set Engine Depth</h3>
      <input
      type="range"
      min="2"
      max="4"
      step="1"
      value={depth}
      onChange={(e) => {dispatch(setEngineDepth(e.target.value / 2)); console.log(depth);}}
      />
      {depth}
    </div>
  )
}

export default DepthContainer;