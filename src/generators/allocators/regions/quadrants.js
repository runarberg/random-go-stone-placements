/**
 * @typedef { import("../../../main.js").Config } Config
 * @typedef { import("../index.js").Allocation } Allocation
 *
 * @typedef { [number, number] } Point
 * @typedef { [Point, Point] } Rectangle
 */

import Grid from "../../utils/grid.js";
import { regionRect, distanceToBoundaryMaker } from "../../utils/weights.js";

/**
 * @param { number } numStone
 * @param { Config } config
 * @param { boolean } needWeights
 * @returns { Allocation }
 */
export default function quadrants(
  numStone,
  { size, margins },
  needWeights = false,
) {
  /** @type { Point } */
  const start = [0, 0];
  /** @type { Point } */
  const end = [size, size];
  const centerLower = Math.floor((size - 1) / 2);
  const centerUpper = Math.ceil((size - 1) / 2);

  /** @type { Rectangle[] } */
  const elements = [
    [start, [centerLower + 1, centerLower + 1]],
    [
      [0, centerUpper],
      [centerLower + 1, size],
    ],
    [
      [centerUpper, 0],
      [size, centerLower + 1],
    ],
    [[centerUpper, centerUpper], end],
  ];

  if (!needWeights) {
    return { elements, weights: null };
  }

  const distanceToBoundary = distanceToBoundaryMaker(start, end);

  const weights = new Grid(start, end).applyAt(
    () => 0,
    regionRect(start, end).filter(
      (point) => distanceToBoundary(point) <= margins,
    ),
  );

  if (centerLower !== centerUpper) {
    return { elements, weights };
  }

  return {
    elements,
    weights: weights
      .applyExcept(
        (val) => 2 * val,
        regionRect([0, centerLower], [size, centerLower + 1]),
      )
      .applyExcept(
        (val) => 2 * val,
        regionRect([centerLower, 0], [centerLower + 1, size]),
      ),
  };
}
