import distUniform from "./dist-uniform.js";
//import distNormal from "./dist-normal.js";
import weightsUniform from "./weights-uniform.js";
import weightsStair from "./weights-stair.js";

/**
 * @typedef { import("../main.js").Config } Config
 * @typedef { import("../allocators/index.js").Allocation } Allocation
 *
 * @typedef { [number, number] } Point
 * @typedef { "distUniform" | "distNormal" | "weightsUniform" | "weightsStair" } Placer
 */

// eslint-disable-next-line jsdoc/valid-types
/**
 * @type { { [name in Placer]: (config: Config, allocation: Allocation) =>  Point[] } }
 */
const placers = {
  distUniform,
  distNormal,
  weightsUniform,
  weightsStair,
};

export default placers;
