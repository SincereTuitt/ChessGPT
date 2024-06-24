import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { hourglass } from "ldrs";
hourglass.register('loading-icon');
import king from '../../assets/kingImage.png';
import '../../styles/king.css';

const King = () => {
  const isTwoPlayer = useSelector((state) => state.settings.isTwoPlayer);
  const playerColor = useSelector((state) => state.settings.playerColor);
  const currentPlayer = useSelector((state) => state.board.currentPlayer);
  const gameOver = useSelector((state) => state.board.gameOver);
  const previousMoves = useSelector((state) => state.board.previousMoves);
  const [text, setText] = useState('I will lead my army to victory or die trying!');
  const [isLoading, setIsLoading] = useState(false);

  // returns a string describing each move, to be interpreted by OpenAI API
  const generateMoveInfo = (
    movedPiece,
    capturedPiece,
    movementType,
    isEngineMove,
    isGameOver
  ) => {
    if (capturedPiece === '-') capturedPiece = null;

    let outputText = '';
    const mapAbrreviationToName = {
      p: 'pawn',
      b: 'bishop',
      r: 'rook',
      n: 'knight',
      k: 'king',
      q: 'queen',
    }
    const mapAbbreviationToGameState = {
      b: "checkmate",
      w: "checkmate",
      sm: "stalemate",
      "3fr": "three-fold repetition",
      "50mr": "50 move rule"
    }

    if (isGameOver) {
      outputText += isEngineMove ? 'You don\'t move. ' : 'I don\'t move. ';
      if (isGameOver === '3fr' || isGameOver === '50mr' || isGameOver === 'sm') {
        outputText += `Draw by ${mapAbbreviationToGameState[isGameOver]}`;
      }
      else if (!isEngineMove) {
        outputText += 'I win by checkmate. You lose';
      } else outputText += 'You win by checkmate. I lose';

      return isGameOver + outputText;
    }

    else {
      if (capturedPiece && isEngineMove) {
        outputText += `Your ${mapAbrreviationToName[movedPiece]} captured my ${mapAbrreviationToName[capturedPiece]}`;
      }
      if (capturedPiece && !isEngineMove) {
        outputText += `My ${mapAbrreviationToName[movedPiece]} captured your ${mapAbrreviationToName[capturedPiece]}`;
      }
      if (!capturedPiece && !isEngineMove) {
        outputText += `My ${mapAbrreviationToName[movedPiece]} ${movementType}`;
      }
      if (!capturedPiece && isEngineMove) {
        outputText += `Your ${mapAbrreviationToName[movedPiece]} ${movementType}`;
      }
      return outputText;
    }
  }

  // get text response by requesting server to make call to OpenAI
  const getKingText = async (
    playerMoveFrom,
    playerMoveTo,
    engineMoveFrom,
    engineMoveTo,
    statePlayerMove,
    stateEngineMove
  ) => {
    const engineColor = playerColor === 'b' ? 'w' : 'b';

    const getMovementType = (moveFrom, moveTo, color) => {
      if (
        (moveTo[0] > moveFrom[0] && color === 'b')
        || (moveTo[0] < moveFrom[0] && color === 'w')
      ) return "retreats";
      if (
        (moveTo[0] < moveFrom[0] && color === 'b')
        || (moveTo[0] > moveFrom[0] && color === 'w')
      ) return "advances";
      return "moves laterally";
    }

    const playerMoveInfo =
      statePlayerMove
        ? generateMoveInfo(
          statePlayerMove[playerMoveFrom[0]][playerMoveFrom[1]][0],
          statePlayerMove[playerMoveTo[0]][playerMoveTo[1]][0],
          getMovementType(playerMoveFrom, playerMoveTo, playerColor),
          false,
          gameOver
        )
        : '-'
    const engineMoveInfo =
      stateEngineMove
        ? generateMoveInfo(
          stateEngineMove[engineMoveFrom[0]][engineMoveFrom[1]][0],
          stateEngineMove[engineMoveTo[0]][engineMoveTo[1]][0],
          getMovementType(engineMoveFrom, engineMoveTo, engineColor),
          true,
          gameOver
        )
        : '-';

    try {
      const response = await fetch(`${process.env.HOST}/gpt/${encodeURIComponent(playerMoveInfo)}/${encodeURIComponent(engineMoveInfo)}`);
      if (!response.ok) throw new Error();
      setIsLoading(false);
      const responseData = await response.json();
      setText(responseData.kingMessage);
    } catch (err) {
      console.log({ err });
      setIsLoading(false);
      setText(genericText[Math.floor(Math.random * genericText.length)]);
    }
  }

  // random pre-written response for when API call fails
  const genericText = [
    "My army will make you suffer!",
    "You're going down!",
    "For victory!",
    "We fight for our people and our honor",
    "My soldiers are the most powerful in all the lands. You don't stand a chance",
    "Your defeat will bring us great honor"
  ]

  useEffect(() => {
    // OpenAI API call
    if ((currentPlayer === playerColor && !isTwoPlayer && previousMoves.length) && !gameOver) {
      const [playerMoveFrom, playerMoveTo] =
        previousMoves.length > 1
          ? previousMoves[previousMoves.length - 2].move
          : [null, null];
      const [engineMoveFrom, engineMoveTo] = previousMoves[previousMoves.length - 1].move;
      const statePlayerMove =
        previousMoves.length > 1
          ? previousMoves[previousMoves.length - 2].board
          : null;
      const stateEngineMove = previousMoves[previousMoves.length - 1].board;
      getKingText(
        playerMoveFrom,
        playerMoveTo,
        engineMoveFrom,
        engineMoveTo,
        statePlayerMove,
        stateEngineMove
      );
    }
    if (!isTwoPlayer && gameOver) {
      let playerMoveFrom, playerMoveTo, engineMoveFrom, engineMoveTo, statePlayerMove, stateEngineMove;
      if (currentPlayer === playerColor) {
        [playerMoveFrom, playerMoveTo] = previousMoves[previousMoves.length - 2].move;
        [engineMoveFrom, engineMoveTo] = previousMoves[previousMoves.length - 1].move;
        statePlayerMove = previousMoves[previousMoves.length - 2].board;
        stateEngineMove = previousMoves[previousMoves.length - 1].board;
      } else {
        [playerMoveFrom, playerMoveTo] = previousMoves[previousMoves.length - 1].move;
        statePlayerMove = previousMoves[previousMoves.length - 1].board;
        [engineMoveFrom, engineMoveTo, stateEngineMove] = [null, null, null];
      }
      getKingText(
        playerMoveFrom,
        playerMoveTo,
        engineMoveFrom,
        engineMoveTo,
        statePlayerMove,
        stateEngineMove
      );
    }

    // set loading animation while waiting for engine move and server response
    if (currentPlayer !== playerColor && !isTwoPlayer) {
      setIsLoading(true);
    }
    return () => {

    }
  }, [currentPlayer])

  return (
    <div
      id="kingContainer"
      style={{ display: isTwoPlayer ? "none" : "block" }}
    >
      <img src={king} />
      {
        isLoading
          ?
          <loading-icon></loading-icon>
          :
          <h3>{text}</h3>
      }

    </div>
  )
}

export default King