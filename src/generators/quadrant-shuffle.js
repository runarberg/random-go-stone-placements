/**
 * @typedef { import("../main.js").Placement } Placement
 * @typedef { import("../main.js").Config } Config
 *
 * @typedef { [number, number] } Point
 * @typedef { [Point, Point] } Rectangle
 * @typedef { Rectangle[] | null } Rects
 * @typedef { Grid | null } Weights
 *
 * @typedef { object } State
 * @property { Point[] } stones
 * @property { number } quadrantMask
 * @property { number } quadrant
 * @property { Rects } rects
 * @property { Weights } weights
 */

import { adjustWeights } from "./adaptive-weights.js";
import quadrants, {
  initWeightsQuadrants,
} from "./allocators/rectangle/quadrants.js";
import { excludeNeighbors } from "./stair.js";
import { assignPlayers } from "./utils/common.js";
import Grid from "./utils/grid.js";
import { pickUniformRect, allowedCoord } from "./utils/prob-dist.js";
import {
  regionRect,
  pickIndexWithWeights,
  distanceToBoundaryMaker,
} from "./utils/weights.js";

/**
 * @param { number } quadrantMask
 * @returns { number }
 */
function getRandomQuadrant(quadrantMask) {
  const bits = Array.from(quadrantMask.toString(2).padStart(4, "0"), (n) =>
    Number.parseInt(n, 10),
  ).reverse();
  const once = bits.reduce((count, bit) => count + bit, 0);

  if (once === 1) {
    return quadrantMask;
  }

  // Get a random nth of the available bits.
  const nth = Math.floor(Math.random() * once);
  let bitsLeft = nth + 1;
  const index = bits.findIndex((bit) => {
    if (bit) {
      bitsLeft -= 1;
    }

    if (bitsLeft === 0) {
      return true;
    }

    return false;
  });

  return 1 << index;
}

/**
 * @param { Config } config
 * @param { State } state
 * @returns { State }
 */
function withUniform(config, state) {
  const { size, margins, preventAdjacent } = config;
  const { stones, quadrant } = state;

  let colStart = margins + 1;
  let colEnd = size - margins + 1;
  let rowStart = margins + 1;
  let rowEnd = size - margins + 1;

  const mid = (size + 1) / 2;

  if (quadrant === 0b1000) {
    colEnd = mid + 1;
    rowEnd = mid + 1;
  } else if (quadrant === 0b0100) {
    colStart = mid;
    rowEnd = mid + 1;
  } else if (quadrant === 0b0010) {
    colEnd = mid + 1;
    rowStart = mid;
  } else if (quadrant === 0b0001) {
    colStart = mid;
    rowStart = mid;
  }

  /** @type { Point } */
  let stn;

  do {
    stn = pickUniformRect([colStart, rowStart], [colEnd, rowEnd]);
  } while (!allowedCoord(stn, stones, preventAdjacent));

  stones.push(stn);
  return state;
}

/**
 * @param { number } size
 * @param { Rectangle[] } rects
 * @returns { Grid }
 */
function initWeightsStair(size, rects) {
  return rects.reduce((acc, [nw, se]) => {
    const distanceToBoundary = distanceToBoundaryMaker(nw, se);

    return acc.applyAt(
      (val, idx) => distanceToBoundary(acc.toVh(idx)),
      regionRect(nw, se),
    );
  }, new Grid([0, 0], [size, size]));
}

/**
 * @param { number } quadrant
 * @returns { number }
 */
function calcIdxRects(quadrant) {
  return quadrant & 0b1000
    ? 0
    : quadrant & 0b0100
    ? 1
    : quadrant & 0b0010
    ? 2
    : 3;
}

/**
 * @param { Config } config
 * @param { State } state
 * @param { boolean } isAdaptive
 * @returns { State }
 */
function withStair(config, state, isAdaptive) {
  const { size, margins, preventAdjacent } = config;
  const { stones, quadrant } = state;

  /** @type { Point } */
  const start = [margins, margins];
  /** @type { Point } */
  const end = [size - margins, size - margins];

  if (state.rects === null || state.weights === null) {
    state.rects = quadrants(0, config);
    state.weights = initWeightsStair(size, state.rects);
  }

  const [nw, se] = state.rects[calcIdxRects(quadrant)];
  const subweights = state.weights.slice(nw, se);

  const stn = subweights.toVh(pickIndexWithWeights(subweights.values));
  stones.push(stn);

  if (!isAdaptive) {
    state.weights = excludeNeighbors(
      start,
      end,
      preventAdjacent,
      state.weights,
      stn,
    );
  } else {
    state.weights = adjustWeights(config, state.weights, stn);
  }

  return state;
}

/**
 * @param { Config } config
 * @param { State } state
 * @returns { State }
 */
function withAdaptive(config, state) {
  const { size } = config;
  const { stones, quadrant } = state;

  if (state.rects === null || state.weights === null) {
    state.rects = quadrants(0, config);
    state.weights = initWeightsQuadrants(size, state.rects);
  }

  const [nw, se] = state.rects[calcIdxRects(quadrant)];
  const subweights = state.weights.slice(nw, se);

  const stn = subweights.toVh(pickIndexWithWeights(subweights.values));
  stones.push(stn);

  state.weights = adjustWeights(config, state.weights, stn);
  return state;
}

/**
 * @param { number } n
 * @param { Config } config
 * @param { State | undefined } state
 * @returns { Placement[] }
 */
export default function quadrantShuffle(
  n,
  config,
  state = {
    stones: [],
    quadrantMask: 0b1111,
    quadrant: 0,
    rects: null,
    weights: null,
  },
) {
  const placementOption = "withStairAdaptive";

  if (n <= 0) {
    if (
      ["withStair", "withAdaptive", "withStairAdaptive"].includes(
        placementOption,
      )
    ) {
      state.stones = state.stones.map(
        ([v, h]) => /** @type { Point } */ ([v + 1, h + 1]),
      );
    }
    return assignPlayers(state.stones, config.handicap);
  }

  const nextQuadrant = getRandomQuadrant(state.quadrantMask);
  state.quadrant = nextQuadrant;
  state.quadrantMask = state.quadrantMask ^ nextQuadrant || 0b1111;

  /** @type { State } */
  let newState;

  switch (String(placementOption)) {
    case "withUniform":
      newState = withUniform(config, state);
      break;
    case "withStair":
      newState = withStair(config, state, false);
      break;
    case "withAdaptive":
      newState = withAdaptive(config, state);
      break;
    case "withStairAdaptive":
      newState = withStair(config, state, true);
      break;
    default:
      throw new Error("unsupported placement option");
  }

  return quadrantShuffle(n - 1, config, newState);
}
