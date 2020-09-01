/**
 * @typedef { import("../../../main.js").Config } Config
 * @typedef { import("../index.js").Allocation } Allocation
 *
 * @typedef { [number, number] } Point
 */

import Grid from "../../utils/grid.js";

/**
 * @param { Config } config
 * @param { boolean } needBoard
 * @returns { Allocation }
 */
export default function stars(config, needBoard = false) {
  /** @type { Point[] } */
  const elements = [];

  if (needBoard) {
    return { elements, board: new Grid([0, 0], [1, 1]) };
  }

  return { elements, board: new Grid([0, 0], [1, 1]) };
}
