import pointsUnaltered from "./points-unaltered.js";

/**
 * @typedef { import("../../main.js").Config } Config
 *
 * @typedef { [number, number] } Point
 * @typedef { "pointsUnaltered" } PlacerPoint
 */

// eslint-disable-next-line jsdoc/valid-types
/**
 * @type { { [name in PlacerPoint]: (config: Config, allocation: Point[]) =>  Point[] } }
 */
const placersPoint = {
  pointsUnaltered,
};

export default placersPoint;
