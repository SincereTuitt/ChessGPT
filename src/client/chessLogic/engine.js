"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const legalMoves_1 = require("./legalMoves");
function getEngineMove(depth, currentPlayer, boardState, movedCastlers, pawnJumpPrevious) {
    const currentScore = calculateMaterial(boardState);
    const possibleMoves = getAllMoves(currentScore, boardState, currentPlayer, pawnJumpPrevious, movedCastlers);
    const movesWithUpdatedScores = possibleMoves.map((option) => {
        const newPawnJumpPrevious = legalMoves_1.getPawnJumpPrevious(boardState, option.move[0], option.move[1], currentPlayer);
        const newMovedCastlers = legalMoves_1.updateCastlingOptions(movedCastlers, boardState, option.move[0], option.move[1], currentPlayer);
        option.score = getNodeScore(depth - 0.5, currentPlayer === 'w' ? 'b' : 'w', option.boardState, newMovedCastlers, newPawnJumpPrevious, option.score);
        return option;
    });
    return chooseBestOption(currentPlayer, movesWithUpdatedScores);
}
exports.getEngineMove = getEngineMove;
function getNodeScore(depth, currentPlayer, boardState, movedCastlers, pawnJumpPrevious, score) {
    if (depth <= 0)
        return score;
    const possibleMoves = getAllMoves(score, boardState, currentPlayer, pawnJumpPrevious, movedCastlers);
    if (!possibleMoves.length) {
        const mapGameStateToValue = {
            'w': Infinity,
            'b': -Infinity,
            'sm': 0,
            '3mr': 0,
            '50mr': 0,
        };
        const gameState = legalMoves_1.isGameOver(boardState, currentPlayer, pawnJumpPrevious);
        return mapGameStateToValue[gameState.toString()];
    }
    const scores = possibleMoves.map((move) => {
        const newPawnJumpPrevious = legalMoves_1.getPawnJumpPrevious(boardState, move.move[0], move.move[1], currentPlayer);
        const newMovedCastlers = legalMoves_1.updateCastlingOptions(movedCastlers, boardState, move.move[0], move.move[1], currentPlayer);
        return getNodeScore(depth - 0.5, currentPlayer === 'w' ? 'b' : 'w', move.boardState, newMovedCastlers, newPawnJumpPrevious, move.score);
    });
    if (currentPlayer === 'w')
        return Math.max(...scores);
    else
        return Math.min(...scores);
}
exports.getNodeScore = getNodeScore;
function calculateMaterial(boardState) {
    let materialBalance = 0;
    const mapPieceToValue = {
        'kw': 0,
        'kb': 0,
        '-': 0,
        'rw': 5,
        'nw': 3,
        'bw': 3,
        'qw': 9,
        'pw': 1,
        'rb': -5,
        'nb': -3,
        'bb': -3,
        'qb': -9,
        'pb': -1,
    };
    for (const row of boardState) {
        for (const square of row) {
            materialBalance += mapPieceToValue[square];
        }
    }
    return materialBalance;
}
exports.calculateMaterial = calculateMaterial;
function chooseBestOption(currentPlayer, options) {
    let bestScore = undefined;
    const possibleMoves = [];
    for (const option of options) {
        if (bestScore === undefined
            || option.score === bestScore) {
            bestScore = option.score;
            possibleMoves.push(option.move);
        }
        if ((currentPlayer === 'w' && option.score > bestScore)
            || (currentPlayer === 'b' && option.score < bestScore)) {
            bestScore = option.score;
            possibleMoves.length = 0;
            possibleMoves.push(option.move);
        }
    }
    return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
}
exports.chooseBestOption = chooseBestOption;
function getAllMoves(currentScore, boardState, currentPlayer, pawnJumpPrevious, movedCastlers) {
    const output = [];
    const mapPieceToValue = {
        'kw': 0,
        'kb': 0,
        '-': 0,
        'rw': 5,
        'nw': 3,
        'bw': 3,
        'qw': 9,
        'pw': 1,
        'rb': -5,
        'nb': -3,
        'bb': -3,
        'qb': -9,
        'pb': -1,
    };
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const possibleMoves = legalMoves_1.getMoves(boardState, [i, j], currentPlayer, pawnJumpPrevious, movedCastlers);
            for (const possibility of possibleMoves.moves.concat(possibleMoves.captures)) {
                const move = [[i, j], possibility];
                const score = currentScore - mapPieceToValue[boardState[possibility[0]][possibility[1]]];
                const newBoard = legalMoves_1.updateBoard(boardState, [i, j], possibility, currentPlayer);
                output.push({ move, score, boardState: newBoard });
            }
        }
    }
    return output;
}
exports.getAllMoves = getAllMoves;
