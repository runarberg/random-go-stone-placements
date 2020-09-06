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
export function initWeightsStair(start, end) {
  const distanceToBoundary = distanceToBoundaryMaker(start, end);
  const weights = new Grid(start, end);
  return weights.apply((_, idx) => distanceToBoundary(weights.toVh(idx)));
}

/**
 * @param { Point } start
 * @param { Point } end
 * @param { boolean } preventAdjacent
 * @param { Grid } weights
 * @param { Point } point
 * @returns { Grid }
 */
export function excludeNeighbors(start, end, preventAdjacent, weights, point) {
  const excluded = [point].concat(
    preventAdjacent ? circleTaxicabMaker(start, end)(point, 1) : [],
  );

  return weights.applyAt(() => 0, excluded);
}

/**
 * @typedef { { stones: Point[], weights: Grid | null } } State
 * @param { number } n
 * @param { Config } config
 * @param { State | undefined } state
 * @returns { Placement[] }
 */
export default function stair(
  n,
  config,
  state = {
    stones: [],
    weights: null,
  },
) {
  if (n <= 0) {
    return assignPlayers(
      state.stones.map(
        ([v, h]) =>
          /** @type { Point } */
          ([v + 1, h + 1]),
      ),
      config.handicap,
    );
  }

  const { size, margins, preventAdjacent } = config;
  /** @type { Point } */
  const start = [margins, margins];
  /** @type { Point } */
  const end = [size - margins, size - margins];

  if (state.weights === null) {
    state.weights = initWeightsStair(start, end);
  }

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
