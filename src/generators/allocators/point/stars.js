/**
 * @typedef { import("../../../main.js").Config } Config
 *
 * @typedef { [number, number] } Point
 */

/** @type { Point[] } */
const starsAll = [
  [3, 15],
  [15, 3],
  [15, 15],
  [3, 3],
  [9, 9],
  [9, 3],
  [9, 15],
  [3, 9],
  [15, 9],
];

/**
 * @param { number } numStone
 * @param { Config } config
 * @returns { Point[] }
 */
export default function stars(numStone, { size }) {
  if (size !== 19) {
    throw new Error("only works for board size: 19");
  }

  switch (numStone) {
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
    case 7:
    case 9:
    default:
      // default covers larger than 9; tentative
      return starsAll.slice(0, numStone);
    case 6:
    case 8:
      return starsAll.slice(0, 4).concat(starsAll.slice(5, numStone + 1));
  }
}
