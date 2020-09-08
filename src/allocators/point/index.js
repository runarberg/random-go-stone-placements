import stars from "./stars.js";

/**
 * @typedef { import("../../main.js").Config } Config
 *
 * @typedef { [number, number] } Point
 *
 * @typedef { "stars" } AllocatorPoint
 */

// eslint-disable-next-line jsdoc/valid-types
/*
 * @type { { [name in AllocatorPoint]: (config: Config, totalStones: number) => Point[] } }
 */
const allocatorsPoint = {
  stars,
};

export default allocatorsPoint;
