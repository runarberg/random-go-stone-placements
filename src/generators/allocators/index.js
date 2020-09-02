import Grid from "../utils/grid.js";

import stars from "./points/stars.js";
import dominoes from "./regions/dominoes.js";
import quadrants from "./regions/quadrants.js";

/**
 * @typedef { import("../../main.js").Config } Config
 *
 * @typedef { "dominoes" | "quadrants" | "stars" } Allocator
 *
 * @typedef { { elements: Object[], weights: Grid } } Allocation
 */

// eslint-disable-next-line jsdoc/valid-types
/*
 * @type { { [name in Allocator]: (config: Config, needWeights: boolean) => Allocation } }
 */
const allocators = {
  dominoes,
  quadrants,
  stars,
};

export default allocators;
