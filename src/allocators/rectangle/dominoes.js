/**
 * @typedef { import("../../main.js").Config } Config
 *
 * @typedef { [number, number] } Point
 * @typedef { [Point, Point] } Rectangle
 */

import { range } from "../../utils/common.js";
import Grid from "../../utils/grid.js";
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
 * @param { Point } numsCell
 * @param { number } totalStones
 * @returns { Rectangle[] }
 */
function randomDominoes(numsCell, totalStones) {
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
      first = weights.toVh(pickIndexWithWeights(weights.values));
      neighborsFirst = neighbors(first);
      weightsNeighbsFirst = weights.valuesAt(neighborsFirst);
    } while (Math.max(...weightsNeighbsFirst) === 0);

    const second = weights.toVh(
      pickWithWeights(weights.fromVhes(neighborsFirst), weightsNeighbsFirst),
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
 * @param { number } start
 * @param { number } end
 * @param { number } separationMin
 * @param { Point } numsSeg
 * @returns { [Point[], Point[]] }
 */
function randomSegments(start, end, separationMin, numsSeg) {
  // segment: [start, end)
  /** @type { [Point[], Point[]] } */
  const segments = [[], []];

  range(0, 2).forEach((axis) => {
    const lenAvailable = end - start - separationMin * (numsSeg[axis] - 1);
    const lenSegMin = Math.floor(lenAvailable / numsSeg[axis]);

    if (lenSegMin < 1) {
      throw new Error("not enough space on the board for the parameters");
    }

    let lenRemain = end - start;
    let coordinate = start;

    range(1, numsSeg[axis])
      .reverse()
      .forEach((numSegRemain) => {
        const lenSegMax =
          lenRemain - (lenSegMin + separationMin) * numSegRemain;
        const lenSeg = pickWithWeights(range(lenSegMin, lenSegMax + 1));

        /** @type { Point } */
        segments[axis].push([coordinate, coordinate + lenSeg]);

        coordinate += lenSeg + separationMin;
        lenRemain -= lenSeg + separationMin;
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
export default function dominoes(
  { size, margins, preventAdjacent },
  totalStones,
) {
  const start = margins;
  const end = size - margins;
  const separation = preventAdjacent ? 1 : 0;
  const numsCell = calcNumsCell(totalStones);
  const segs = randomSegments(start, end, separation, numsCell);

  return randomDominoes(calcNumsCell(totalStones), totalStones).map(
    ([first, second]) =>
      /** @type { Rectangle } */ ([
        // nw corner from first, se corner from second
        [segs[0][first[0]][0], segs[1][first[1]][0]],
        [segs[0][second[0]][1], segs[1][second[1]][1]],
      ]),
  );
}
