"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getMoves(boardState, selectedSquare, currentPlayer) {
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
            output = kingMoves(boardState, selectedSquare, currentPlayer);
            break;
        case 'p':
            output = pawnMoves(boardState, selectedSquare, currentPlayer);
            break;
        default:
            break;
    }
    output.moves = output.moves.filter((move) => {
        const updatedBoard = updateBoard(boardState, selectedSquare, move);
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
function updateBoard(currentBoard, [previousRow, previousColumn], [nextRow, nextColumn]) {
    const newBoard = JSON.parse(JSON.stringify(currentBoard));
    newBoard[nextRow][nextColumn] = currentBoard[previousRow][previousColumn];
    newBoard[previousRow][previousColumn] = '-';
    return newBoard;
}
exports.updateBoard = updateBoard;
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
function pawnMoves(boardState, selectedSquare, currentPlayer) {
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
function kingMoves(boardState, selectedSquare, currentPlayer) {
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
    return output;
}
exports.kingMoves = kingMoves;
