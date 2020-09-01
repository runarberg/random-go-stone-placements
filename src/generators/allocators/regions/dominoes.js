/**
 * @typedef { import("../../../main.js").Config } Config
 * @typedef { import("../index.js").Allocation } Allocation
 *
 * @typedef { [number, number] } Point
 * @typedef { [Point, Point] } Rectangle
 */

import Grid from "../../utils/grid.js";

/*
function neighborsMaker(start, end) {
  const circleTaxicab = circleTaxicabMaker(start, end);
  return function (point) {
    return circleTaxicab(point, 1);
  }
}
*/

/**
 * @param { Config } config
 * @param { boolean } needBoard
 * @returns { Allocation }
 */
export default function dominoes(config, needBoard = false) {
  /** @type { Rectangle[] } */
  const elements = [];

  if (needBoard) {
    return { elements, board: Grid([0, 0], [1, 1]) };
  }

  return { elements, board: null };
}
