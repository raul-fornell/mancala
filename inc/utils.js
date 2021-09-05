export function wait(seconds) {
  return new Promise(res => setTimeout(res, seconds * 1000));
}

export function sortByStonesAsc(a, b) {
  if (a.stones < b.stones) return -1;
  if (a.stones > b.stones) return 1;
  return 0;
}