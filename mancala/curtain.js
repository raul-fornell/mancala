import { addEventListener, dispatchEvent } from "../inc/eventDispatcher.js";

const curtain = document.querySelector(".curtain");

curtain.addEventListener("click", () => {
  dispatchEvent('click');
});

export default {
  show() {
    curtain.style.display = "block";
  },
  hide() {
    curtain.style.display = "none";
  },
  addEventListener
}