/**
 * @typedef { import("../main.js").Config } Config
 * @typedef { import("./index.js").Allocation } Allocation
 *
 * @typedef { [number, number] } Point
 * @typedef { [Point, Point] } Rectangle
 */

import { pickUniformRect, allowedCoord } from "../utils/prob-dist.js";

/**
 * @param { Config } config
 * @param { Allocation } allocation
 * @returns { Point[] }
 */
export default function distUniform(config, allocation) {
  const { preventAdjacent } = config;

  return allocation.reduce((/** @type { Point[] } */ stones, [start, end]) => {
    /** @type { Point } */
    let stn;

    do {
      stn = pickUniformRect(start, end);
    } while (!allowedCoord(stn, stones, preventAdjacent));

    stones.push(stn);
    return stones;
  }, []);
}
