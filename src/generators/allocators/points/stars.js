/**
 * @typedef { import("../../../main.js").Config } Config
 * @typedef { import("../index.js").Allocation } Allocation
 *
 * @typedef { [number, number] } Point
 */

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
  const elements = [];

  return { elements, weights: null };
}
