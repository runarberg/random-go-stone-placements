import distUniform from "./dist-uniform.js";
//import distNormal from "./dist-normal.js";
import { weightsUniform, weightsStair } from "./place-with-weights.js";

/**
 * @typedef { import("../../main.js").Config } Config
 *
 * @typedef { [number, number] } Point
 * @typedef { [Point, Point] } Rectangle
 * @typedef { "distUniform" | "weightsUniform" | "weightsStair" } PlacerRect
 */

// eslint-disable-next-line jsdoc/valid-types
/**
 * @type { { [name in PlacerRect]: (config: Config, allocation: Rectangle[]) =>  Point[] } }
 */
const placersRect = {
  distUniform,
  //distNormal,
  weightsUniform,
  weightsStair,
};

export default placersRect;
