/**
 * @typedef { import("../main.js").Placement } Placement
 * @typedef { import("../main.js").Config } Config
 *
 * @typedef { [number, number] } Point
 * @typedef { [Point, Point] } Rectangle
 */

import { adjustWeights } from "./adaptive-weights.js";
import dominoes from "./allocators/rectangle/dominoes.js";
import { assignPlayers } from "./utils/common.js";
import Grid from "./utils/grid.js";
import { pickUniformRect } from "./utils/prob-dist.js";
import { pickIndex, distanceToBoundaryMaker } from "./utils/weights.js";

/**
 * @param { Rectangle[] } rectangles
 * @returns { Point[] }
 */
function withUniform(rectangles) {
  return rectangles.map(([start, end]) => pickUniformRect(start, end));
}

/**
 * @param { Config } config
 * @param { Rectangle[] } rectangles
 * @returns { Point[] }
 */
function withStair(config, rectangles) {
  const { size, margins } = config;
  const start = margins;
  const end = size - margins;

  return rectangles.reduce((/** @type { Point[] } */ acc, [nw, se]) => {
    const distanceToBoundary = distanceToBoundaryMaker(
      nw,
      se,
      [start, start],
      [end, end],
    );

    const blank = new Grid(nw, se);

    acc.push(
      blank.toVh(
        pickIndex(
          blank.apply((_, idx) => distanceToBoundary(blank.toVh(idx))).values,
        ),
      ),
    );

    return acc;
  }, []);
}

/**
 * @param { Config } config
 * @param { Rectangle[] } rectangles
 * @returns { Point[] }
 */
function withAdaptive(config, rectangles) {
  const { size } = config;
  let weights = new Grid([0, 0], [size, size]);

  return rectangles.reduce((/** @type { Point[] } */ acc, [nw, se]) => {
    const subweights = weights.slice(nw, se);
    const stone = subweights.toVh(pickIndex(subweights.values));
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
  const placementOption = "withUniform";

  const rectangles = dominoes(totalStones, config);

  /** @type { Point[] } */
  let stones;

  switch (String(placementOption)) {
    case "withUniform":
      stones = withUniform(rectangles);
      break;
    case "withStair":
      stones = withStair(config, rectangles);
      break;
    case "withAdaptive":
      stones = withAdaptive(config, rectangles);
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
