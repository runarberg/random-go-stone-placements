/**
 * @typedef { import("../main.js").Placement } Placement
 * @typedef { import("../main.js").Config } Config
 * @typedef { import("./index.js").Allocation } Allocation
 *
 * @typedef { [number, number] } Point
 * @typedef { [Point, Point] } Rectangle
 */

import Grid from "../utils/grid.js";
import {
  regionRect,
  pickIndexWithWeights,
  distanceToBoundaryMaker,
} from "../utils/weights.js";

import weightAdjusters from "./weight-adjusters.js";

/**
 * @param { Config } config
 * @returns { Grid }
 */
function initWeightsQuadrants({ size, margins }) {
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
      regionRect([start[0], middle], [end[0], middle + 1]),
    )
    .applyAt(
      (val) => val >> 1,
      regionRect([middle, start[1]], [middle + 1, end[1]]),
    );
}

/**
 * @param { Grid } weights
 * @returns { Grid }
 */
function initWeightsStair(weights) {
  const distanceToBoundary = distanceToBoundaryMaker(
    weights.start,
    weights.end,
  );
  return weights.apply(
    (val, idx) => val * distanceToBoundary(weights.toVh(idx)),
  );
}

/**
 * @param { Config } config
 * @param { Allocation } allocation
 * @returns { Point[] }
 */
function placeWithWeights(config, allocation) {
  const { size, margins, allocator, placer, weightAdjuster } = config;

  /** @type { Point } */
  const start = [margins, margins];
  /** @type { Point } */
  const end = [size - margins, size - margins];

  /** @type { Grid } */
  let weights;

  if (placer === "weightsUniform" && allocator === "quadrants") {
    weights = initWeightsQuadrants(config);
  } else {
    weights = new Grid(start, end);
  }

  return allocation.reduce((
    /** @type { Point[] } */ stones,
    [startRect, endRect],
  ) => {
    let subweights = weights.slice(startRect, endRect);

    if (placer === "weightsStair") {
      subweights = initWeightsStair(subweights);
    }

    const stn = subweights.toVh(pickIndexWithWeights(subweights.values));
    stones.push(stn);

    weights = weightAdjusters[weightAdjuster](config, weights, stn);

    return stones;
  });
}

/**
 * @param { Config } config
 * @param { Allocation } allocation
 * @returns { Point[] }
 */
export function weightsUniform(config, allocation) {
  return placeWithWeights(config, allocation);
}

/**
 * @param { Config } config
 * @param { Allocation } allocation
 * @returns { Point[] }
 */
export function weightsStair(config, allocation) {
  return placeWithWeights(config, allocation);
}
