import game from "./mancala/game.js";
import board from "./mancala/board.js";
import title from "./mancala/title.js";
import curtain from "./mancala/curtain.js";
import { wait } from "./inc/utils.js";


function updatePlayerTitle() {
  const player = game.getPlayer() + 1;
  title.setText(`Player ${player}`);
  title.setPosition(player)
}

function gameStart() {
  curtain.hide();
  game.resetStones({
    player1Stones: 0,
    player2stones: 0,
    initialStonesPerHole: 4
  });
  game.resetPlayer();
  updatePlayerTitle();
}

board.addEventListener('onHoleClick', index => {
  const holeHasStones = game.isHoleEmpty(index) === false;
  holeHasStones && game.moveStones(index);
});

game.addEventListener('onStonesUpdated', stones => {
  board.updateContainers(stones);
});

game.addEventListener('onMoveStonesAgain', () => {
  title.setText(`Move again player ${game.getPlayer() + 1}`);
});

game.addEventListener('onMoveStonesFinished', () => {
  game.nextPlayer();
  updatePlayerTitle();
});

game.addEventListener('onGameEnd', async () => {
  game.addRemainingStonesToTheOwner();
  title.setText(`Player ${game.winnerPlayer() + 1} wins!`);
  await wait(3);
  curtain.show();
  title.setText(`Click anywhere to play again`);
});

curtain.addEventListener("click", gameStart);

gameStart();