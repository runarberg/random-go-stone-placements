/**
 * @typedef { import("../../main.js").Config } Config
 *
 * @typedef { [number, number] } Point
 * @typedef { [Point, Point] } Rectangle
 */

import { pickUniformRect, allowedCoord } from "./utils/prob-dist.js";

/**
 * @param { Config } config
 * @param { Allocation } allocation
 * @returns { Point[] }
 */
export default function distUniform(config, allocation) {
  if (typeof allocation !== "Rectangle[]") {
    throw new Error("unsupported allocation type");
  }

  const { preventAdjacent } = config;
  
  return allocation.reduce((stones, [start, end]) => {
    /** @type { Point } */
    let stn;

    do {
      stn = pickUniformRect(start, end);
    } while (!allowedCoord(stn, stones, preventAdjacent));

    stones.push(stn);
    return stones;
  }, []);
}
