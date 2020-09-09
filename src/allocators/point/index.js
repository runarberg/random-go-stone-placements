import dummy from "./dummy.js";
import stars from "./stars.js";

/**
 * @typedef { import("../../main.js").Config } Config
 *
 * @typedef { [number, number] } Point
 *
 * @typedef { "stars" | "dummy" } AllocatorPoint
 */

// eslint-disable-next-line jsdoc/valid-types
/*
 * @type { { [name in AllocatorPoint]: (config: Config, totalStones: number) => Point[] } }
 */
const allocatorsPoint = {
  stars,
  dummy,
};

export default allocatorsPoint;
