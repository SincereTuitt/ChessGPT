"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getMoves(boardState, selectedSquare, currentPlayer, pawnJumpPrevious, movedCastlers) {
    const selectedPiece = boardState[selectedSquare[0]][selectedSquare[1]];
    let output = { moves: [], captures: [] };
    if (selectedPiece === '-' || selectedPiece[1] !== currentPlayer)
        return output;
    switch (selectedPiece[0]) {
        case 'r':
            output = rookMoves(boardState, selectedSquare, currentPlayer);
            break;
        case 'n':
            output = knightMoves(boardState, selectedSquare, currentPlayer);
            break;
        case 'b':
            output = bishopMoves(boardState, selectedSquare, currentPlayer);
            break;
        case 'q':
            output = queenMoves(boardState, selectedSquare, currentPlayer);
            break;
        case 'k':
            output = kingMoves(boardState, selectedSquare, currentPlayer, movedCastlers);
            break;
        case 'p':
            output = pawnMoves(boardState, selectedSquare, currentPlayer, pawnJumpPrevious);
            break;
        default:
            break;
    }
    output.moves = output.moves.filter((move) => {
        const updatedBoard = updateBoard(boardState, selectedSquare, move, currentPlayer);
        return !isInCheck(updatedBoard, currentPlayer);
    });
    return output;
}
exports.getMoves = getMoves;
function isInCheck(boardState, currentPlayer) {
    let kingRow;
    let kingColumn;
    loop1: for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (boardState[i][j] === 'k' + currentPlayer) {
                [kingRow, kingColumn] = [i, j];
                break loop1;
            }
        }
    }
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const currentSquare = boardState[i][j];
            if (currentSquare === '-' || currentSquare[1] === currentPlayer)
                continue;
            let capturableSquares;
            switch (currentSquare[0]) {
                case 'r':
                    capturableSquares = rookMoves(boardState, [i, j], currentPlayer === 'w' ? 'b' : 'w').captures;
                    if (capturableSquares.some(([a, b]) => a === kingRow && b === kingColumn))
                        return true;
                    break;
                case 'n':
                    capturableSquares = knightMoves(boardState, [i, j], currentPlayer === 'w' ? 'b' : 'w').captures;
                    if (capturableSquares.some(([a, b]) => a === kingRow && b === kingColumn))
                        return true;
                    break;
                case 'b':
                    capturableSquares = bishopMoves(boardState, [i, j], currentPlayer === 'w' ? 'b' : 'w').captures;
                    if (capturableSquares.some(([a, b]) => a === kingRow && b === kingColumn))
                        return true;
                    break;
                case 'q':
                    capturableSquares = queenMoves(boardState, [i, j], currentPlayer === 'w' ? 'b' : 'w').captures;
                    if (capturableSquares.some(([a, b]) => a === kingRow && b === kingColumn))
                        return true;
                    break;
                case 'k':
                    capturableSquares = kingMoves(boardState, [i, j], currentPlayer === 'w' ? 'b' : 'w').captures;
                    if (capturableSquares.some(([a, b]) => a === kingRow && b === kingColumn))
                        return true;
                    break;
                case 'p':
                    capturableSquares = pawnMoves(boardState, [i, j], currentPlayer === 'w' ? 'b' : 'w').captures;
                    if (capturableSquares.some(([a, b]) => a === kingRow && b === kingColumn))
                        return true;
                    break;
                default:
                    break;
            }
        }
    }
    return false;
}
exports.isInCheck = isInCheck;
function updateBoard(currentBoard, [previousRow, previousColumn], [nextRow, nextColumn], currentPlayer) {
    const newBoard = JSON.parse(JSON.stringify(currentBoard));
    const currentPiece = currentBoard[previousRow][previousColumn][0];
    if (currentPiece === 'p'
        && currentBoard[nextRow][nextColumn] === '-'
        && previousColumn !== nextColumn)
        newBoard[currentPlayer === 'w' ? nextRow - 1 : nextRow + 1][nextColumn] = '-';
    if (currentPiece === 'k'
        && previousColumn === 4
        && nextColumn === 6) {
        newBoard[previousRow][7] = '-';
        newBoard[previousRow][5] = `r${currentPlayer}`;
    }
    if (currentPiece === 'k'
        && previousColumn === 4
        && nextColumn === 2) {
        newBoard[previousRow][0] = '-';
        newBoard[previousRow][3] = `r${currentPlayer}`;
    }
    newBoard[nextRow][nextColumn] = currentBoard[previousRow][previousColumn];
    newBoard[previousRow][previousColumn] = '-';
    return newBoard;
}
exports.updateBoard = updateBoard;
function updateCastlingOptions(previousCastlers, boardState, previousSquare, nextSquare, currentPlayer) {
    const newMovedCastlers = Object.assign({}, previousCastlers);
    const currentPiece = boardState[previousSquare[0]][previousSquare[1]];
    const capturedPiece = boardState[nextSquare[0]][nextSquare[1]];
    const opponent = currentPlayer === 'w' ? 'b' : 'w';
    if (currentPiece[0] === 'k')
        newMovedCastlers[`k${currentPlayer}`] = true;
    if (currentPiece[0] === 'r'
        && previousSquare[0] === (currentPlayer === 'w' ? 0 : 7)
        && previousSquare[1] === 0)
        newMovedCastlers[`r${currentPlayer}0`] = true;
    if (currentPiece[0] === 'r'
        && previousSquare[0] === (currentPlayer === 'w' ? 0 : 7)
        && previousSquare[1] === 7)
        newMovedCastlers[`r${currentPlayer}7`] = true;
    if (capturedPiece[0] === 'r'
        && nextSquare[0] === (currentPlayer === 'w' ? 7 : 0)
        && nextSquare[1] === 7)
        newMovedCastlers[`r${opponent}7`] = true;
    if (capturedPiece[0] === 'r'
        && nextSquare[0] === (currentPlayer === 'w' ? 7 : 0)
        && nextSquare[1] === 0)
        newMovedCastlers[`r${opponent}0`] = true;
    return newMovedCastlers;
}
exports.updateCastlingOptions = updateCastlingOptions;
function rookMoves(boardState, selectedSquare, currentPlayer) {
    const output = { moves: [], captures: [] };
    const row = selectedSquare[0];
    const column = selectedSquare[1];
    for (let i = row + 1, j = column; i < 8; i++) {
        const square = boardState[i][j];
        if (square === '-')
            output.moves.push([i, j]);
        else if (square[1] === currentPlayer)
            break;
        else {
            output.captures.push([i, j]);
            break;
        }
    }
    for (let i = row - 1, j = column; i >= 0; i--) {
        const square = boardState[i][j];
        if (square === '-')
            output.moves.push([i, j]);
        else if (square[1] === currentPlayer)
            break;
        else {
            output.captures.push([i, j]);
            break;
        }
    }
    for (let i = row, j = column + 1; j < 8; j++) {
        const square = boardState[i][j];
        if (square === '-')
            output.moves.push([i, j]);
        else if (square[1] === currentPlayer)
            break;
        else {
            output.captures.push([i, j]);
            break;
        }
    }
    for (let i = row, j = column - 1; j >= 0; j--) {
        const square = boardState[i][j];
        if (square === '-')
            output.moves.push([i, j]);
        else if (square[1] === currentPlayer)
            break;
        else {
            output.captures.push([i, j]);
            break;
        }
    }
    return output;
}
exports.rookMoves = rookMoves;
function pawnMoves(boardState, selectedSquare, currentPlayer, pawnJumpPrevious) {
    const output = { moves: [], captures: [] };
    const row = selectedSquare[0];
    const column = selectedSquare[1];
    switch (currentPlayer) {
        case 'w':
            if (boardState[row + 1][column] === '-')
                output.moves.push([row + 1, column]);
            if (row === 1
                && boardState[row + 1][column] === '-'
                && boardState[row + 2][column] === '-')
                output.moves.push([row + 2, column]);
            if (boardState[row + 1][column + 1]
                && boardState[row + 1][column + 1] !== '-'
                && boardState[row + 1][column + 1][1] !== currentPlayer)
                output.captures.push([row + 1, column + 1]);
            if (boardState[row + 1][column - 1]
                && boardState[row + 1][column - 1] !== '-'
                && boardState[row + 1][column - 1][1] !== currentPlayer)
                output.captures.push([row + 1, column - 1]);
            if (pawnJumpPrevious
                && pawnJumpPrevious[0] === row
                && pawnJumpPrevious[1] === column + 1)
                output.captures.push([row + 1, column + 1]);
            if (pawnJumpPrevious
                && pawnJumpPrevious[0] === row
                && pawnJumpPrevious[1] === column - 1)
                output.captures.push([row + 1, column - 1]);
            break;
        case 'b':
            if (boardState[row - 1][column] === '-')
                output.moves.push([row - 1, column]);
            if (row === 6
                && boardState[row - 1][column] === '-'
                && boardState[row - 2][column] === '-')
                output.moves.push([row - 2, column]);
            if (boardState[row - 1][column + 1]
                && boardState[row - 1][column + 1] !== '-'
                && boardState[row - 1][column + 1][1] !== currentPlayer)
                output.captures.push([row - 1, column + 1]);
            if (boardState[row - 1][column - 1]
                && boardState[row - 1][column - 1] !== '-'
                && boardState[row - 1][column - 1][1] !== currentPlayer)
                output.captures.push([row - 1, column - 1]);
            if (pawnJumpPrevious
                && pawnJumpPrevious[0] === row
                && pawnJumpPrevious[1] === column + 1)
                output.captures.push([row - 1, column + 1]);
            if (pawnJumpPrevious
                && pawnJumpPrevious[0] === row
                && pawnJumpPrevious[1] === column - 1)
                output.captures.push([row - 1, column - 1]);
            break;
        default:
            break;
    }
    return output;
}
exports.pawnMoves = pawnMoves;
function knightMoves(boardState, selectedSquare, currentPlayer) {
    const output = { moves: [], captures: [] };
    const row = selectedSquare[0];
    const column = selectedSquare[1];
    const possibleMoves = [
        [row + 1, column + 2],
        [row + 1, column - 2],
        [row - 1, column + 2],
        [row - 1, column - 2],
        [row + 2, column + 1],
        [row + 2, column - 1],
        [row - 2, column + 1],
        [row - 2, column - 1],
    ];
    possibleMoves.forEach((coordinate) => {
        const [i, j] = coordinate;
        if (i > 7 || j > 7 || i < 0 || j < 0)
            return;
        const square = boardState[i][j];
        if (square === '-')
            output.moves.push([i, j]);
        else if (square[1] !== currentPlayer)
            output.captures.push([i, j]);
    });
    return output;
}
exports.knightMoves = knightMoves;
function bishopMoves(boardState, selectedSquare, currentPlayer) {
    const output = { moves: [], captures: [] };
    const row = selectedSquare[0];
    const column = selectedSquare[1];
    for (let i = row + 1, j = column + 1; i < 8 && j < 8; i++, j++) {
        const square = boardState[i][j];
        if (square === '-')
            output.moves.push([i, j]);
        else if (square[1] === currentPlayer)
            break;
        else {
            output.captures.push([i, j]);
            break;
        }
    }
    for (let i = row + 1, j = column - 1; i < 8 && j >= 0; i++, j--) {
        const square = boardState[i][j];
        if (square === '-')
            output.moves.push([i, j]);
        else if (square[1] === currentPlayer)
            break;
        else {
            output.captures.push([i, j]);
            break;
        }
    }
    for (let i = row - 1, j = column + 1; i >= 0 && j < 8; i--, j++) {
        const square = boardState[i][j];
        if (square === '-')
            output.moves.push([i, j]);
        else if (square[1] === currentPlayer)
            break;
        else {
            output.captures.push([i, j]);
            break;
        }
    }
    for (let i = row - 1, j = column - 1; i >= 0 && j >= 0; i--, j--) {
        const square = boardState[i][j];
        if (square === '-')
            output.moves.push([i, j]);
        else if (square[1] === currentPlayer)
            break;
        else {
            output.captures.push([i, j]);
            break;
        }
    }
    return output;
}
exports.bishopMoves = bishopMoves;
function queenMoves(boardState, selectedSquare, currentPlayer) {
    const diagnolMoves = bishopMoves(boardState, selectedSquare, currentPlayer);
    const straightMoves = rookMoves(boardState, selectedSquare, currentPlayer);
    return {
        moves: diagnolMoves.moves.concat(straightMoves.moves),
        captures: diagnolMoves.captures.concat(straightMoves.captures),
    };
}
exports.queenMoves = queenMoves;
function kingMoves(boardState, selectedSquare, currentPlayer, movedCastlers) {
    const output = { moves: [], captures: [] };
    const row = selectedSquare[0];
    const column = selectedSquare[1];
    const possibleMoves = [
        [row + 1, column + 1],
        [row + 1, column - 1],
        [row - 1, column + 1],
        [row - 1, column - 1],
        [row - 1, column],
        [row + 1, column],
        [row, column + 1],
        [row, column - 1],
    ];
    possibleMoves.forEach((move) => {
        const i = move[0];
        const j = move[1];
        if (i > 7 || i < 0 || j > 7 || j < 0)
            return;
        const square = boardState[i][j];
        if (square === '-')
            output.moves.push([i, j]);
        else if (square[1] !== currentPlayer)
            output.captures.push([i, j]);
    });
    if (movedCastlers && !movedCastlers['k' + currentPlayer] && !isInCheck(boardState, currentPlayer)) {
        const boardClone = JSON.parse(JSON.stringify(boardState));
        boardClone[row][column] = '-';
        boardClone[row][5] = `k${currentPlayer}`;
        if (!movedCastlers['r' + currentPlayer + '7']
            && boardState[row][5] === '-'
            && boardState[row][6] === '-'
            && !isInCheck(boardClone, currentPlayer))
            output.moves.push([row, 6]);
        boardClone[row][5] = '-';
        boardClone[row][3] = `k${currentPlayer}`;
        if (!movedCastlers['r' + currentPlayer + '0']
            && boardState[row][1] === '-'
            && boardState[row][2] === '-'
            && boardState[row][3] === '-'
            && !isInCheck(boardClone, currentPlayer))
            output.moves.push([row, 2]);
    }
    return output;
}
exports.kingMoves = kingMoves;
