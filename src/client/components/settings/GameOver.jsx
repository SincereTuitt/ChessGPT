import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { resetGame } from "../../reducers/boardReducer";
import '../../styles/settings.css';

const GameOver = ({ gameOver }) => {
  const theme = useSelector((state) => state.settings.theme);
  const state = useSelector((state) => state.board);

  const dispatch = useDispatch();

  const gameOverMessage = (() => {
    const map = {
      b: 'Black wins by checkmate!',
      w: 'White wins by checkmate!',
      sm: 'Draw by stalemate!',
      '3fr': 'Draw by three-fold repetition!',
      '50mr': 'Draw by fifty move rule!',
    }
    return map[gameOver];
  })();

  return (
    <div id="gameOver" style={{
      display: gameOver ? 'block' : 'none'
    }}>
      <div>
        <div>
          <h2>Game Over</h2>
          <h4>{gameOverMessage}</h4>
          <button
            style={{ backgroundColor: `dark${theme}` }}
            onClick={() => dispatch(resetGame())}
          >Play again</button>
          <button onClick={() => console.log(state)}>test</button>
        </div>
      </div>
    </div>
  )
};

export default React.memo(GameOver);