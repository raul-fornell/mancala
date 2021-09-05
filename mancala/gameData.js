export default {
  currentPlayer: 0,
  playerContainers: [0, 7], // Index 0 for player 1, index 1 for player 2 convention
  playerHoles: [
    [13, 12, 11, 10, 9, 8],
    [1, 2, 3, 4, 5, 6],
  ],
  stones: [
    // Left container (0)
    0,

    // Bottom row left to right
    0, 0, 0, 0, 0, 0,

    // Right container (7)
    0,

    // Top row right to left
    0, 0, 0, 0, 0, 0
  ],
}