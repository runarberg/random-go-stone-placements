/**
 * @typedef { import("../../main.js").Config } Config
 *
 * @typedef { [number, number] } Point
 * @typedef { [Point, Point] } Rectangle
 */

import { range } from "../../utils/common.js";
import Grid from "../../utils/grid.js";
import { Seeder } from "../../utils/prob-dist.js";
import {
  orderPairs,
  circleTaxicabMaker,
  pickIndexWithWeights,
  pickWithWeights,
} from "../../utils/weights.js";

/**
 * Number of cells along each axis required
 * in preparation for placing dominoes
 *
 * @param { number } totalStones
 * @returns { Point }
 */
function calcNumsCell(totalStones) {
  /** @type { Point } */
  const nums = [0, 0]; // [numVertical, numHorizontal]
  let parity = 1;

  // the factor of 3 seems to allow randomly placing
  // dominoes without running out of space
  // even in worst case
  while (nums[0] * nums[1] < totalStones * 3) {
    if (parity % 2) {
      nums[0] += 1;
    } else {
      nums[1] += 1;
    }
    parity += 1;
  }

  return nums;
}

/**
 * @param { Point } start
 * @param { Point } end
 * @returns { (point: Point) => Point[] }
 */
function neighborsMaker(start, end) {
  const circleTaxicab = circleTaxicabMaker(start, end);
  return function (point) {
    return circleTaxicab(point, 1);
  };
}

/**
 * Random adjoining pair of cells (= domino) for each stone
 *
 * @param { { seeder: Seeder } } config
 * @param { Point } numsCell
 * @param { number } totalStones
 * @returns { Rectangle[] }
 */
function randomDominoes(config, numsCell, totalStones) {
  let weights = new Grid([0, 0], numsCell, 1 << totalStones);

  const neighbors = neighborsMaker([0, 0], numsCell);

  return range(0, totalStones).map(() => {
    /** @type { Point } */
    let first;

    /** @type { Point[] } */
    let neighborsFirst;

    /** @type { number[] } */
    let weightsNeighbsFirst;

    // ensure pairing when picking first cell
    do {
      first = weights.toVh(pickIndexWithWeights(config, weights.values));
      neighborsFirst = neighbors(first);
      weightsNeighbsFirst = weights.valuesAt(neighborsFirst);
    } while (Math.max(...weightsNeighbsFirst) === 0);

    const second = weights.toVh(
      pickWithWeights(
        config,
        weights.fromVhes(neighborsFirst),
        weightsNeighbsFirst,
      ),
    );

    // adjust weights
    weights = weights
      .applyAt(() => 0, [first])
      .applyAt((val) => val >> 1, neighborsFirst)
      .applyAt(() => 0, [second])
      .applyAt((val) => val >> 1, neighbors(second));

    const pair = [first, second].sort(orderPairs);
    /** @type { Rectangle } */
    return [pair[0], pair[1]];
  });
}

/**
 * Along each axis, randomly divide the length of board into segments
 *
 * @param { { seeder: Seeder, size: number, margins: number, preventAdjacent: boolean } } config
 * @param { Point } numsSeg
 * @returns { [Point[], Point[]] }
 */
function randomSegments(config, numsSeg) {
  const { size, margins, preventAdjacent } = config;
  const start = margins;
  const end = size - margins;
  const separation = preventAdjacent ? 1 : 0;

  // segment: [start, end)
  /** @type { [Point[], Point[]] } */
  const segments = [[], []];

  range(0, 2).forEach((axis) => {
    const lenAvailable = end - start - separation * (numsSeg[axis] - 1);
    const lenSegMin = Math.floor(lenAvailable / numsSeg[axis]);

    if (lenSegMin < 1) {
      throw new Error("not enough space on the board for the parameters");
    }

    let lenRemain = end - start;
    let coordinate = start;

    range(1, numsSeg[axis])
      .reverse()
      .forEach((numSegRemain) => {
        const lenSegMax = lenRemain - (lenSegMin + separation) * numSegRemain;
        const lenSeg = pickWithWeights(config, range(lenSegMin, lenSegMax + 1));

        /** @type { Point } */
        segments[axis].push([coordinate, coordinate + lenSeg]);

        coordinate += lenSeg + separation;
        lenRemain -= lenSeg + separation;
      });
    /** @type { Point } */
    segments[axis].push([coordinate, coordinate + lenRemain]);
  });

  return segments;
}

/**
 * @param { Config } config
 * @param { number } totalStones
 * @returns { Rectangle[] }
 */
export default function dominoes(config, totalStones) {
  const numsCell = calcNumsCell(totalStones);
  const segs = randomSegments(config, numsCell);

  return randomDominoes(config, calcNumsCell(totalStones), totalStones).map(
    ([first, second]) =>
      /** @type { Rectangle } */ ([
        // nw corner from first, se corner from second
        [segs[0][first[0]][0], segs[1][first[1]][0]],
        [segs[0][second[0]][1], segs[1][second[1]][1]],
      ]),
  );
}
