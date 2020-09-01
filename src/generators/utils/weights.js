import { range, applyConcat } from "./common.js";

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
  return applyConcat(
    (v) => range(start[1], end[1]).map((h) => [v, h]),
    range(start[0], end[0])
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
  return range(0, Math.floor(total / 2) + 1).map((smaller) =>
    [smaller, total - smaller]
  );
}

/**
 * Relative position of points on taxicab circle
 *
 * @param { number } radius
 * @returns { Point[] }
 */
function circleTaxicabRelative(radius) {
  /** @type { Point[] } */
  const vecs = [];  // relative positions

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
          !vecs.some((vec) =>
            vec[0] === candidate[0] &&
            vec[1] === candidate[1],
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
    start[0] <= point[0] && point[0] < end[0] &&
    start[1] <= point[1] && point[1] < end[1]
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
export function circleTaxicabMaker(start, end){
  return function (center, radius) {
    return (
      circleTaxicabRelative(radius).map(([dv, dh]) => {
        /** @type { [number, number] } */
        const point = [center[0] + dv, center[1] + dh];
        return point;
      }).filter((point) => isInBounds(start, end, point))
    );
  };
}

/**
 * Taxicab distance to farthest corner
 *
 * @param { Point } start
 * @param { Point } end
 * @param { Point } point
 * @returns { number }
 */
export function maxRadiusTaxicab(start, end, point) {
  return (
    Math.max(point[0] - start[0], end[0] - point[0] - 1) +
    Math.max(point[1] - start[1], end[1] - point[1] - 1)
  );
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
