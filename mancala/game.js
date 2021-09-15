import { addEventListener, dispatchEvent } from "../inc/eventDispatcher.js";
import gameData from './gameData.js';
import { sortByStonesAsc } from "../inc/utils.js";

function getStones() {
  return [...gameData.stones];
}

function emitUpdate() {
  dispatchEvent('onStonesUpdated', getStones());
}

function emitFinishMove() {
  dispatchEvent('onMoveStonesFinished');
}

function emitMoveAgain() {
  dispatchEvent('onMoveStonesAgain');
}

function emitGameEnd() {
  dispatchEvent('onGameEnd');
}

function getIndexFromDifference(index, distance) {
  const max = gameData.stones.length;
  const nextIndex = index + distance;
  return nextIndex < max ? nextIndex : nextIndex - max;
}

function currentContainerIsFromTheOpponent(index) {
  return index === gameData.playerContainers[currentOpponent()]
}

function stoneQuantityToAdd(index) {
  return currentContainerIsFromTheOpponent(index) ? 0 : 1;
}

function currentOpponent() {
  return opponentFromPlayer(gameData.currentPlayer);
}

function opponentFromPlayer(playerIndex) {
  return playerIndex === 1 ? 0 : 1;
}

function hasEndedOnTheOwnerContainer(index) {
  return index === gameData.playerContainers[gameData.currentPlayer];
}

function stonesInRows() {
  return gameData.playerHoles.map(columns => {
    return columns.reduce((acc, curr) => acc + gameData.stones[curr], 0);
  });
}

function checkGameEndCondition() {
  const totals = stonesInRows();
  const isAnyRowEmpty = totals.findIndex(total => total === 0) > -1;
  isAnyRowEmpty && emitGameEnd();
}

function hasEndedOnEmptyHole(index) {
  const isHole = gameData.playerContainers.includes(index) === false;
  const hasOneStone = gameData.stones[index] === 1; // 1 because is filled with the last stone before the check, so 1 means it was empty
  return isHole && hasOneStone;
}

function addAndSubtractStones(fillTo, takeFrom){
  gameData.stones[fillTo] = gameData.stones[fillTo] + gameData.stones[takeFrom];
  gameData.stones[takeFrom] = 0;
}

function takeAllStonesFromTheOppositeRow(index) {
  let oppositeIndex;
  gameData.playerHoles.forEach((row, rowIndex) => {
    const colIndex = row.findIndex(col => col === index);
    const oppositeRowIndex = opponentFromPlayer(rowIndex);
    if(colIndex > -1){
      oppositeIndex = gameData.playerHoles[oppositeRowIndex][colIndex];    
    }
  })
  addAndSubtractStones(index, oppositeIndex);
}

function setQuantityForAllStones(newQuantity, indexToIgnore = []) {
  gameData.stones = gameData.stones.map((currentQuantity, index) => {
    const isSetAllowed = indexToIgnore.includes(index) === false;
    return isSetAllowed ? newQuantity : currentQuantity;
  });
}

function getPlayerTotalStones() {
  return gameData.playerContainers.map((index, key) => ({
    player: key,
    stones: gameData.stones[index]
  }));
}

function stoneMovementEnd(finalIndex) {
  if (hasEndedOnTheOwnerContainer(finalIndex)) {
    emitMoveAgain();
  } else {
    emitFinishMove();
  }
  if (hasEndedOnEmptyHole(finalIndex)) {
    takeAllStonesFromTheOppositeRow(finalIndex);
    emitUpdate();
  }
  checkGameEndCondition();
}

function getNextIndexAndUpdateStones(index, indexCursor) {
  const nextIndex = getIndexFromDifference(index + 1, indexCursor);
  const stones = stoneQuantityToAdd(nextIndex);
  gameData.stones[nextIndex] += stones;
  return { stones, nextIndex }
}

export default {
  setLeftContainer(quantity) {
    gameData.stones[0] = quantity;
  },
  setRightContainer(quantity) {
    gameData.stones[7] = quantity;
  },
  resetStones(options) {
    setQuantityForAllStones(options.initialStonesPerHole);
    this.setLeftContainer(options.player1Stones);
    this.setRightContainer(options.player2stones);
    emitUpdate();
  },
  resetPlayer() {
    gameData.currentPlayer = 0;
  },
  nextPlayer() {
    gameData.currentPlayer = gameData.currentPlayer === 0 ? 1 : 0;
  },
  getPlayer() {
    return gameData.currentPlayer;
  },
  moveStones(index) {
    const quantityPicked = gameData.stones[index];
    let quantityMoved = 0;
    let indexCursor = 0;
    let endIndex;
    gameData.stones[index] = 0;
    const interval = setInterval(() => {
      if (quantityPicked !== quantityMoved) {
        const { stones, nextIndex } = getNextIndexAndUpdateStones(index, indexCursor);
        quantityMoved += stones;
        indexCursor += 1;
        endIndex = nextIndex;
        emitUpdate();
      } else {
        clearInterval(interval);
        stoneMovementEnd(endIndex);
      }
    }, 400);
    emitUpdate();
  },
  isHoleEmpty(index) {
    return gameData.stones[index] === 0;
  },
  addRemainingStonesToTheOwner() {
    const totals = stonesInRows();
    gameData.playerContainers.forEach((index, key) => {
      gameData.stones[index] += totals[key];
    });
    setQuantityForAllStones(0, gameData.playerContainers);
    emitUpdate();
  },
  winnerPlayer() {
    const stonesInContainers = getPlayerTotalStones();
    stonesInContainers.sort(sortByStonesAsc);
    const winner = stonesInContainers.pop().player;
    return winner;
  },
  addEventListener
};