const title = document.querySelector(".title");

export default {
  setText(value) {
    title.textContent = value;
  },
  setPosition(player) {
    switch (player) {
      case 1:
        title.classList.remove("bottom");
        break;
      case 2:
        title.classList.add("bottom");
        break;
    }
  }
}