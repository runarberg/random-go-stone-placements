/**
 * @typedef { import("../../../main.js").Config } Config
 * @typedef { import("../index.js").Allocation } Allocation
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
 * @param { boolean } needWeights
 * @returns { Allocation }
 */
export default function stars(numStone, { size }, needWeights = false) {
  if (needWeights) {
    throw new Error("no option to return weights");
  }

  if (size !== 19) {
    throw new Error("only works for board size: 19");
  }

  /** @type { Point[] } */
  let elements;

  switch (numStone) {
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
    case 7:
    case 9:
    default:
      // default is larger than 9; tentative
      elements = starsAll.slice(size);
      break;
    case 6:
    case 8:
      elements = starsAll.slice(4).concat(starsAll.slice(5, numStone + 1));
      break;
  }

  return { elements, weights: null };
}
