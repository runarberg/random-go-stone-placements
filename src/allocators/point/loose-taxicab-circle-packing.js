/**
 * @typedef { import("../../main.js").Config } Config
 *
 * @typedef { [number, number] } Point
 */

import distUniform from "../../placers/rectangle/dist-uniform.js";
import { range } from "../../utils/common.js";
import {
  circleTaxicabMaker,
  pickIndexWithWeights,
} from "../../utils/weights.js";
import whole from "../rectangle/whole.js";

/**
 * @param { Point } a
 * @param { Point } b
 * @returns { number }
 */
function dotProduct([a1, a2], [b1, b2]) {
  return a1 * b1 + a2 * b2;
}

/**
 * Calculate sparsity in each cardinal direction,
 * to be used as weights later
 *
 * Sparsity in each direction starts with given radius.
 * Stones on taxicab circle, if any, reduce the sparsity
 * by their component in that direction.
 *
 * @param { { size: number, margins: number } } config
 * @param { Point[] } stones
 * @param { Point } stn
 * @param { number } radius
 * @returns { { neighbors: Point[], sparsities: number[] } | null }
 */
function calcSparsities({ size, margins }, stones, stn, radius) {
  const start = margins;
  const end = size - margins;
  const circleTaxicab = circleTaxicabMaker([start, start], [end, end]);

  const neighbors = circleTaxicab(stn, 1).map(
    ([nb0, nb1]) =>
      /** @type { Point } */
      ([nb0 - stn[0], nb1 - stn[1]]),
  );
  const sparsities = neighbors.map(() => radius);

  const stonesOnCircle = circleTaxicab(stn, radius).filter(([circ0, circ1]) =>
    stones.some(([stn0, stn1]) => stn0 === circ0 && stn1 === circ1),
  );

  if (stonesOnCircle.length === 0) {
    return null;
  }

  stonesOnCircle.forEach(([circ0, circ1]) => {
    /** @type { Point } */
    const relative = [circ0 - stn[0], circ1 - stn[1]];

    neighbors.forEach((neighb, idx) => {
      const dot = dotProduct(neighb, relative);

      if (dot > 0) {
        // ensure non-negative
        sparsities[idx] = Math.max(0, sparsities[idx] - dot);
      }
    });
  });

  return { neighbors, sparsities };
}

/**
 * Example: [1, 1, 0, 0, 0] -> [1, 1, 1, 0, 0]
 *
 * @param { number[] } nums
 * @returns { number[] }
 */
function incrementAtBoundary(nums) {
  const minimum = Math.min(...nums);
  const idxIncr = nums.findIndex((val) => val === minimum);

  return nums
    .slice(0, idxIncr)
    .concat([minimum + 1])
    .concat(nums.slice(idxIncr + 1, nums.length));
}

/**
 * @param { Config } config
 * @param { number } totalStones
 * @returns { Point[] }
 */
function randomStones(config, totalStones) {
  const allocation = whole(config, totalStones);
  return distUniform(config, allocation);
}

/**
 * @param { Point[] } arr
 * @returns { Point[] }
 */
function deepcopyArray(arr) {
  /** @type { Point[] } */
  const arrNew = new Array(arr.length);

  arr.forEach(([a, b], idx) => {
    /** @type { Point } */
    arrNew[idx] = [a, b];
  });

  return arrNew;
}

export const testablesUnexported = {
  calcSparsities,
  incrementAtBoundary,
  deepcopyArray,
};

/**
 * @param { Config } config
 * @param { number } totalStones
 * @returns { Point[] }
 */
export default function looseTaxicabCirclePacking(config, totalStones) {
  const { size, margins } = config;
  // arbitrary "looseness" number
  const factorNonEmpty = size - 2 * margins;

  const stones = randomStones(config, totalStones);
  let radiiStones = stones.map(() => 1);

  let countEmpty = stones.length;
  // number of consecutive failures to tolerate
  let countNonEmpty = stones.length * factorNonEmpty;

  let stonesBackup = deepcopyArray(stones);

  while (countNonEmpty > 0) {
    for (const idxStn of range(0, stones.length)) {
      const radiusMax = radiiStones[idxStn] + Math.max(...radiiStones);
      for (const radius of range(1, radiusMax + 1)) {
        const sparsCardinal = calcSparsities(
          config,
          stones,
          stones[idxStn],
          radius,
        );
        if (sparsCardinal === null) {
          // no stones at radius
          if (radius === radiusMax) {
            countEmpty -= 1;
            if (countEmpty === 0) {
              // all stones made it at current radii

              // reset counters
              countEmpty = stones.length;
              countNonEmpty = stones.length * factorNonEmpty;

              // make backups
              stonesBackup = deepcopyArray(stones);

              // increment radius for one of the stones
              radiiStones = incrementAtBoundary(radiiStones);
            }
          }
        } else {
          // found stones at radius

          if (Math.max(...sparsCardinal.sparsities) === 0) {
            // cornered
            break;
          }

          // reset countEmpty as moving a stone might put it
          // within another stone's range
          countEmpty = stones.length;

          countNonEmpty -= 1;

          //// look ahead one step farther
          const sparsCardinalNext = calcSparsities(
            config,
            stones,
            stones[idxStn],
            radius + 1,
          );

          /** @type { number[] } */
          const sparsitiesCombined = [...sparsCardinal.sparsities];

          if (sparsCardinalNext !== null) {
            // scaling analogous to when adding fractions
            sparsCardinalNext.sparsities.forEach((sparsity, idxSpars) => {
              sparsitiesCombined[idxSpars] *= radius + 1;
              sparsitiesCombined[idxSpars] += sparsity * radius;
            });
          }

          const idxPicked = pickIndexWithWeights(config, sparsitiesCombined);

          const [dv, dh] = sparsCardinal.neighbors[idxPicked];
          const [v, h] = stones[idxStn];
          /** @type { Point } */
          stones[idxStn] = [v + dv, h + dh];

          break;
        }
      }

      if (countNonEmpty === 0) {
        break;
      }
    }
  }

  // go back to before it was still working
  return stonesBackup;
}
