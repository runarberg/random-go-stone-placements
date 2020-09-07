import distUniform from "./dist-uniform.js";
//import distNormal from "./dist-normal.js";
import { weightsUniform, weightsStair } from "./place-with-weights.js";
import pointsUnaltered from "./points-unaltered.js";

/**
 * @typedef { import("../main.js").Config } Config
 * @typedef { import("../allocators/index.js").Allocation } Allocation
 *
 * @typedef { [number, number] } Point
 * @typedef { "pointsUnaltered" | "distUniform" | "weightsUniform" | "weightsStair" } Placer
 */

// eslint-disable-next-line jsdoc/valid-types
/**
 * @type { { [name in Placer]: (config: Config, allocation: Allocation) =>  Point[] } }
 */
const placers = {
  distUniform,
  //distNormal,
  pointsUnaltered,
  weightsUniform,
  weightsStair,
};

export default placers;
