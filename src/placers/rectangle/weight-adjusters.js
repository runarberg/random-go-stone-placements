/**
 * @typedef { import("../../main.js").Config } Config
 *
 * @typedef { [number, number] } Point
 * @typedef { "constant" | "linearTaxicabDistance" } WeightAdjuster
 */

import Grid from "../../utils/grid.js";
import {
  circleTaxicabMaker,
  distanceTaxicabMaker,
  medianNonzero,
} from "../../utils/weights.js";

/**
 * @param { Config } config
 * @param { Grid } weights
 * @param { Point } point
 * @returns { Grid }
 */
function excludeNeighbors(config, weights, point) {
  const { size, margins, preventAdjacent } = config;

  /** @type { Point } */
  const start = [margins, margins];
  /** @type { Point } */
  const end = [size - margins, size - margins];

  const excluded = [point].concat(
    preventAdjacent ? circleTaxicabMaker(start, end)(point, 1) : [],
  );

  return weights.applyAt(() => 0, excluded);
}

/**
 * @param { Config } config
 * @param { Grid } weights
 * @param { Point } point
 * @returns { Grid }
 */
function constant(config, weights, point) {
  return excludeNeighbors(config, weights, point);
}

/**
 * @param { Config } config
 * @param { Grid } weights
 * @param { Point } point
 * @returns { Grid }
 */
function linearTaxicabDistance(config, weights, point) {
  const distanceTaxicab = distanceTaxicabMaker(point);

  const weightsNew = excludeNeighbors(config, weights, point)
    // multiply weight by taxicab distance
    .apply((wgt, idx) => wgt * distanceTaxicab(weights.toVh(idx)));

  // cut off peaks if too high
  const weightMax = 2 * medianNonzero(weightsNew.values);
  return weightsNew.apply((wgt) => Math.min(wgt, weightMax));
}

// eslint-disable-next-line jsdoc/valid-types
/**
 * @type { { [name in WeightAdjuster]: (config: Config, weights: Grid, point: Point) =>  Grid } }
 */
const weightAdjusters = {
  constant,
  linearTaxicabDistance,
};

export default weightAdjusters;
