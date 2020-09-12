/**
 * @typedef { import("../../main.js").Config } Config
 *
 * @typedef { [number, number] } Point
 * @typedef { [Point, Point] } Rectangle
 */

import Grid from "../../utils/grid.js";
import { regionRect } from "../../utils/weights.js";

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
 * @param { Config } config
 * @param { number } totalStones
 * @returns { Rectangle[] }
 */
export default function quadrants({ size, margins, placerRect }, totalStones) {
  const start = margins;
  const end = size - margins;
  const middle = size / 2;

  let midEnd;
  let midStart;

  switch (placerRect) {
    case "distUniform":
      midEnd = middle;
      midStart = middle;
      break;
    case "weightsUniform":
    case "weightsStair":
      midEnd = Math.ceil(middle);
      midStart = Math.floor(middle);
      break;
    default:
      throw new Error("unsupported placer option");
  }

  /** @type { Rectangle[] } */
  return [
    [
      [start, start],
      [midEnd, midEnd],
    ],
    [
      [start, midStart],
      [midEnd, end],
    ],
    [
      [midStart, start],
      [end, midEnd],
    ],
    [
      [midStart, midStart],
      [end, end],
    ],
  ];
}
