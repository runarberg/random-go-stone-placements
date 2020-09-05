/**
 * @typedef { import("../../../main.js").Config } Config
 *
 * @typedef { [number, number] } Point
 * @typedef { [Point, Point] } Rectangle
 */

import Grid from "../../utils/grid.js";
import { regionRect } from "../../utils/weights.js";

/**
 * @param { number } size
 * @param { Rectangle[] } rectangles
 * @returns { Grid }
 */
export function initWeightsQuadrants(size, rectangles) {
  if (size % 2 === 0) {
    return new Grid([0, 0], [size, size]).applyExcept(
      () => 0,
      rectangles.flatMap(([start, end]) => regionRect(start, end)),
    );
  }

  return rectangles
    .reduce(
      (acc, [start, end]) =>
        acc.applyAt((wgt) => wgt >> 1, regionRect(start, end)),
      new Grid([0, 0], [size, size], [], 1 << 4),
    )
    .apply((wgt) => (wgt === 1 << 4 ? 0 : wgt));
}

/**
 * @param { number } totalStones
 * @param { Config } config
 * @returns { Rectangle[] }
 */
export default function quadrants(totalStones, { size, margins }) {
  const start = margins;
  const end = size - margins;
  const centerLower = Math.floor((size - 1) / 2);
  const centerUpper = Math.ceil((size - 1) / 2);

  /** @type { Rectangle[] } */
  return [
    [
      [start, start],
      [centerLower + 1, centerLower + 1],
    ],
    [
      [start, centerUpper],
      [centerLower + 1, end],
    ],
    [
      [centerUpper, start],
      [end, centerLower + 1],
    ],
    [
      [centerUpper, centerUpper],
      [end, end],
    ],
  ];
}
