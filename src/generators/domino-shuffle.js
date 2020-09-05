/**
 * @typedef { import("../main.js").Placement } Placement
 * @typedef { import("../main.js").Config } Config
 *
 * @typedef { [number, number] } Point
 * @typedef { [Point, Point] } Rectangle
 */

import { adjustWeights } from "./adaptive-weights.js";
import dominoes from "./allocators/rectangle/dominoes.js";
import { initWeightsStair } from "./stair.js";
import { assignPlayers } from "./utils/common.js";
import Grid from "./utils/grid.js";
import { pickUniformRect } from "./utils/prob-dist.js";
import { pickIndexWithWeights } from "./utils/weights.js";

/**
 * @param { Rectangle[] } rectangles
 * @returns { Point[] }
 */
function withUniform(rectangles) {
  return rectangles.map(([start, end]) => pickUniformRect(start, end));
}

/**
 * @param { Rectangle[] } rectangles
 * @returns { Point[] }
 */
function withStair(rectangles) {
  return rectangles.reduce((/** @type { Point[] } */ acc, [nw, se]) => {
    const weights = initWeightsStair(nw, se);
    acc.push(weights.toVh(pickIndexWithWeights(weights.values)));
    return acc;
  }, []);
}

/**
 * @param { Config } config
 * @param { Rectangle[] } rectangles
 * @param { boolean } isStair
 * @returns { Point[] }
 */
function withAdaptive(config, rectangles, isStair) {
  const { size, margins } = config;

  /** @type { Grid } */
  let weights;

  if (!isStair) {
    weights = new Grid([0, 0], [size, size]);
  } else {
    /** @type { Point } */
    const start = [margins, margins];
    /** @type { Point } */
    const end = [size - margins, size - margins];

    weights = initWeightsStair(start, end);
  }

  return rectangles.reduce((/** @type { Point[] } */ acc, [nw, se]) => {
    const subweights = weights.slice(nw, se);
    const stone = subweights.toVh(pickIndexWithWeights(subweights.values));
    acc.push(stone);

    weights = adjustWeights(config, weights, stone);

    return acc;
  }, []);
}

/**
 * @param { number } totalStones
 * @param { Config } config
 * @returns { Placement[] }
 */
export default function dominoShuffle(totalStones, config) {
  const placementOption = "withStairAdaptive";

  const rectangles = dominoes(totalStones, config);

  /** @type { Point[] } */
  let stones;

  switch (String(placementOption)) {
    case "withUniform":
      stones = withUniform(rectangles);
      break;
    case "withStair":
      stones = withStair(rectangles);
      break;
    case "withAdaptive":
      stones = withAdaptive(config, rectangles, false);
      break;
    case "withStairAdaptive":
      stones = withAdaptive(config, rectangles, true);
      break;
    default:
      throw new Error("unsupported placement option");
  }

  return assignPlayers(
    stones.map(
      ([v, h]) =>
        /** @type { Point } */
        ([1 + v, 1 + h]),
    ),
    config.handicap,
  );
}
