/**
 * @typedef { import("../main.js").Placement } Placement
 * @typedef { import("../main.js").Config } Config
 *
 * @typedef { [number, number] } Point
 * @typedef { [Point, Point] } Rectangle
 */

import { adjustWeights } from "./adaptive-weights.js";
import { assignPlayers } from "./utils/common.js";
import Grid from "./utils/grid.js";
import {
  pickIndexWithWeights,
  circleTaxicabMaker,
  distanceToBoundaryMaker,
} from "./utils/weights.js";

/**
 * @param { Point } start
 * @param { Point } end
 * @returns { Grid }
 */
function initWeightsStair(start, end) {
  const distanceToBoundary = distanceToBoundaryMaker(start, end);
  const weights = new Grid(start, end);
  return weights.apply((val, idx) => val * distanceToBoundary(weights.toVh(idx)));
}

/**
 * @param { Config } config
 * @param { Allocation } allocation
 * @returns { Point[] }
 */
export default function weightsStair(
  n,
  config,
  state = {
    stones: [],
    weights: null,
  },
) {

  const { size, margins, preventAdjacent } = config;

  const stn = state.weights.toVh(pickIndexWithWeights(state.weights.values));
  state.stones.push(stn);

  const placementOption = "withAdaptive";

  if (placementOption === "withAdaptive") {
    state.weights = adjustWeights(config, state.weights, stn);
  } else {
    state.weights = excludeNeighbors(
      start,
      end,
      preventAdjacent,
      state.weights,
      stn,
    );
  }

  return stair(n - 1, config, state);
}
