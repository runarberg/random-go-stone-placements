import stars from "./stars.js";

/**
 * @typedef { import("../../../main.js").Config } Config
 *
 * @typedef { "stars" } PointAllocator
 *
 * @typedef { [number, number] } Point
 */

// eslint-disable-next-line jsdoc/valid-types
/*
 * @type { { [name in PointAllocator]: (totalStones: number, config: Config) => Point[] } }
 */
const pointAllocators = {
  stars,
};

export default pointAllocators;
