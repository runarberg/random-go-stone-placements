import dominoes from "./dominoes.js";
import quadrants from "./quadrants.js";

/**
 * @typedef { import("../../../main.js").Config } Config
 *
 * @typedef { "dominoes" | "quadrants" } RectAllocator
 *
 * @typedef { [number, number] } Point
 * @typedef { [Point, Point] } Rectangle
 */

// eslint-disable-next-line jsdoc/valid-types
/*
 * @type { { [name in RectAllocator]: (totalStones: number, config: Config) => Rectangle[] } }
 */
const rectAllocators = {
  dominoes,
  quadrants,
};

export default rectAllocators;
