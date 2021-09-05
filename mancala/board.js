import { addEventListener, dispatchEvent } from "../inc/eventDispatcher.js";

const board = [
  // Left container
  document.querySelector(".left.container"),

  // Bottom row left to right
  ...Array.from(document.querySelectorAll(".bottom.row .hole")),

  // Right container
  document.querySelector(".right.container"),

  // Top row right to left
  ...Array.from(document.querySelectorAll(".top.row .hole")).reverse(),
];

function onHoleClick(event) {
  const index = board.findIndex(item => item === event.currentTarget);
  dispatchEvent('onHoleClick', index);
}

function setStyleForZeroQuantity(element) {
  element.classList.add("empty");
}

function setStyleForPositiveQuantity(element) {
  element.classList.remove("empty");
}

board.filter(hole => hole.classList.contains('hole'))
     .forEach(hole => hole.addEventListener('click', onHoleClick));

export default {
  updateContainers(stones) {
    stones.forEach((quantity, index) => {
      const element = board[index];
      element.textContent = quantity;
      quantity === 0 && setStyleForZeroQuantity(element);
      quantity > 0 && setStyleForPositiveQuantity(element);
    });
  },
  addEventListener
}