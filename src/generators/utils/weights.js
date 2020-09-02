import { range } from "./common.js";

/**
 * Points in rectangular region, bound by [start, end)
 *
 * @typedef { [number, number] } Point
 *
 * @param { Point } start
 * @param { Point } end
 * @returns { Point[] }
 */
export function regionRect(start, end) {
  const vs = range(start[0], end[0]);
  const hs = range(start[1], end[1]);

  return vs.flatMap((v) =>
    hs.map(
      (h) =>
        /** @type { Point } */
        ([v, h]),
    ),
  );
}

/**
 * Every pair [a, b] where a + b === total
 * and a <= b
 *
 * @param { number } total
 * @returns { Point[] }
 */
function pairsWithTotal(total) {
  return range(0, Math.floor(total / 2) + 1).map((smaller) => [
    smaller,
    total - smaller,
  ]);
}

/**
 * Relative position of points on taxicab circle
 *
 * @param { number } radius
 * @returns { Point[] }
 */
function circleTaxicabRelative(radius) {
  /** @type { Point[] } */
  const vecs = []; // relative positions

  pairsWithTotal(radius).forEach(([a, b]) => {
    const diagMatrix = [
      [a, b],
      [b, a],
    ];

    diagMatrix.forEach(([vert, horz]) => {
      const signMatrix = [
        [1, 1],
        [-1, 1],
        [1, -1],
        [-1, -1],
      ];

      signMatrix.forEach(([signV, signH]) => {
        /** @type { Point } */
        const candidate = [signV * vert, signH * horz];

        if (
          !vecs.some(
            (vec) => vec[0] === candidate[0] && vec[1] === candidate[1],
          )
        ) {
          vecs.push(candidate);
        }
      });
    });
  });

  return vecs;
}

/**
 * Whether point is in rectangle bound by
 * 2 points, start and end, at opposite corners,
 * so that [start, end)
 *
 * @param { Point } start
 * @param { Point } end
 * @param { Point } point
 * @returns { boolean }
 */
function isInBounds(start, end, point) {
  return (
    start[0] <= point[0] &&
    point[0] < end[0] &&
    start[1] <= point[1] &&
    point[1] < end[1]
  );
}

/**
 * Points on taxicab circle with given center and radius,
 * within bounds defined by start and end
 *
 * @param { Point } start
 * @param { Point } end
 * @returns { (center: Point, radius: number) => Point[] }
 */
export function circleTaxicabMaker(start, end) {
  return function (center, radius) {
    return circleTaxicabRelative(radius)
      .map(
        ([dv, dh]) =>
          /** @type { [number, number] } */
          ([center[0] + dv, center[1] + dh]),
      )
      .filter((point) => isInBounds(start, end, point));
  };
}

/**
 * From list of numbers to list of cumulative sums
 *
 * @param { number[] } nums
 * @returns { number[] }
 */
function cumulative(nums) {
  const cumul = Array(nums.length);
  nums.reduce((acc, val, idx) => (cumul[idx] = acc + val), 0);
  return cumul;
}

/**
 * Random index, using relative weights
 *
 * @param { number[] } weights
 * @returns { number }
 */
export function pickIndex(weights) {
  if (weights.some((weight) => weight < 0)) {
    throw new Error("Negative weight");
  }

  if (weights.every((weight) => weight === 0)) {
    throw new Error("Weights all zero");
  }

  const total = weights.reduce((acc, val) => acc + val, 0);
  const nRand = Math.random() * total;
  return cumulative(weights).findIndex((val) => val > nRand);
}

/**
 * Random element in list, optionally using relative weights
 *
 * @param { number[] } options
 * @param { number[] } weights
 * @returns { number }
 */
export function pick(
  options,
  weights = Array.from({ length: options.length }).fill(1),
) {
  if (options.length !== weights.length) {
    throw new Error("Unequal length");
  }

  return options[pickIndex(weights)];
}

/**
 * Median of list of numbers, skipping 0s
 *
 * @param { number[] } nums
 * @returns { number }
 */
export function medianNonzero(nums) {
  const ascending = nums.slice().sort((a, b) => a - b);
  const idxStart = ascending.findIndex((val) => val > 0);
  const lengthNonzero = ascending.length - idxStart;
  const idxMiddle = idxStart + Math.floor(lengthNonzero / 2);

  if (lengthNonzero % 2) {
    // odd length
    return ascending[idxMiddle];
  }
  // even length
  return (ascending[idxMiddle - 1] + ascending[idxMiddle]) / 2;
}

/**
 * Distance to nearest side in rectangular region
 * bounded by 2 points on opposite corners [start, end)
 *
 * If any of the sides of inner rectangle coincides with
 * a side of outer rectangle (if provided), that side
 * won't be used for distance calculation
 *
 * @param { Point } start
 * @param { Point } end
 * @param { Point } startOuter
 * @param { Point } endOuter
 * @returns { (point: Point) => number }
 */
export function distanceToBoundaryMaker(
  start,
  end,
  startOuter = [-1, -1],
  endOuter = [-1, -1],
) {
  return function (point) {
    const distanceMax = Math.min(end[0] - start[0] - 1, end[1] - start[1] - 1);

    return Math.min(
      start[0] === startOuter[0] ? distanceMax : point[0] - start[0],
      start[1] === startOuter[1] ? distanceMax : point[1] - start[1],
      end[0] === endOuter[0] ? distanceMax : end[0] - point[0] - 1,
      end[1] === endOuter[1] ? distanceMax : end[1] - point[1] - 1,
    );
  };
}

/**
 * @param { Point } origin
 * @returns { (point: Point) => number }
 */
export function distanceTaxicabMaker(origin) {
  return function (point) {
    return Math.abs(origin[0] - point[0]) + Math.abs(origin[1] - point[1]);
  };
}

export const testablesUnexported = {
  cumulative,
};
