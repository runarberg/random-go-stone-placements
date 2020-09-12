import dominoes from "./dominoes.js";
import quadrants from "./quadrants.js";
import whole from "./whole.js";

/**
 * @typedef { import("../../main.js").Config } Config
 *
 * @typedef { [number, number] } Point
 * @typedef { [Point, Point] } Rectangle
 *
 * @typedef { "whole" | "quadrants" | "dominoes" } AllocatorRect
 */

// eslint-disable-next-line jsdoc/valid-types
/*
 * @type { { [name in AllocatorRect]: (config: Config, totalStones: number) => Rectangle[] } }
 */
const allocatorsRect = {
  whole,
  quadrants,
  dominoes,
};

export default allocatorsRect;
