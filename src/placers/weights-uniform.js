/**
 * @typedef { import("../main.js").Placement } Placement
 * @typedef { import("../main.js").Config } Config
 * @typedef { [number, number] } Point
 */

import { range } from "./utils/common.js";
import Grid from "./utils/grid.js";
import {
  regionRect,
  circleTaxicabMaker,
  pickIndexWithWeights,
  medianNonzero,
  distanceTaxicabMaker,
} from "./utils/weights.js";

/**
 * @param { Config } config
 * @returns { Grid }
 */
export function initWeightsQuadrants({ size, margins }) {
  /** @type { Point } */
  const start = [margins, margins];
  /** @type { Point } */
  const end = [size - margins, size - margins];

  if (size % 2 === 0) {
    return new Grid(start, end);
  }

  const middle = (size - 1) / 2;

  return new Grid(start, end, 4)
    .applyAt(
      (val) => val >> 1,
      regionRect([start[0], middle], [end[0], middle + 1])
    )
    .applyAt(
      (val) => val >> 1,
      regionRect([middle, start[1]], [middle + 1, end[1]])
    );
}

/**
 * @param { Config } config
 * @param { Allocation } allocation
 * @returns { Point[] }
 */
export default function weightsUniform(config, allocation) {
  if (typeof allocation !== "Rectangle[]") {
    throw new Error("unsupported allocation type");
  }

  const { size, margins, placer } = config;

  /** @type { Point } */
  const start = [margins, margins];
  /** @type { Point } */
  const end = [size - margins, size - margins];

  /** @type { Grid } */
  let weights;

  if (placer === "quadrants") {
    weights = initWeighsQuadrants(config);
  } else {
    weights = new Grid(start, end);
  }
  
  return allocation.reduce((stones, [start, end]) => {
    const subweights = weights.slice(start, end);

    const stn = subweights.toVh(pickIndexWithWeights(subweights.values));
    stones.push(stn);

    weights = weightAdjusters[weightAdjuster](config, weights, stn);

    return stones;
  });
}
