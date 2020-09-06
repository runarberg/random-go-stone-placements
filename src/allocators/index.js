import dominoes from "./dominoes.js";
import quadrants from "./quadrants.js";
import stars from "./stars.js";
import whole from "./whole.js";

/**
 * @typedef { import("../main.js").Config } Config
 *
 * @typedef { [number, number] } Point
 * @typedef { [Point, Point] } Rectangle
 * @typedef { Point[] | Rectangle[] } Allocation
 *
 * @typedef { "whole" | "stars" | "quadrants" | "dominoes" } Allocator
 */

// eslint-disable-next-line jsdoc/valid-types
/*
 * @type { { [name in Allocator]: (config: Config, totalStones: number) => Allocation } }
 */
const allocators = {
  whole,
  stars,
  quadrants,
  dominoes,
};

export default allocators;
