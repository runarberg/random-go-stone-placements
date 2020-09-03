import Grid from "../utils/grid.js";

import stars from "./points/stars.js";
import dominoes from "./regions/dominoes.js";
import quadrants from "./regions/quadrants.js";

/**
 * @typedef { import("../../main.js").Config } Config
 *
 * @typedef { "dominoes" | "quadrants" | "stars" } Allocator
 *
 * @typedef { [number, number] } Point
 * @typedef { [Point, Point] } Rectangle
 * @typedef { { elements: Point[] | Rectangle[], weights: Grid | null } } Allocation
 */

// eslint-disable-next-line jsdoc/valid-types
/*
 * @type { { [name in Allocator]: (numStone: number, config: Config, needWeights: boolean) => Allocation } }
 */
const allocators = {
  dominoes,
  quadrants,
  stars,
};

export default allocators;
