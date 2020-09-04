/**
 * @typedef { import("../../../main.js").Config } Config
 * @typedef { import("../index.js").Allocation } Allocation
 *
 * @typedef { [number, number] } Point
 * @typedef { [Point, Point] } Rectangle
 */

import { range } from "../../utils/common.js";
import Grid from "../../utils/grid.js";
import {
  regionRect,
  orderPairs,
  circleTaxicabMaker,
  pickIndex,
  pick,
} from "../../utils/weights.js";

/**
 * Number of cells along each axis required
 * in preparation for placing dominoes
 *
 * @param { number } numStone
 * @returns { Point }
 */
function calcNumsCell(numStone) {
  /** @type { Point } */
  const nums = [0, 0]; // [numVertical, numHorizontal]
  let parity = 1;

  // the factor of 3 seems to allow randomly placing
  // dominoes without running out of space
  // even in worst case
  while (nums[0] * nums[1] < numStone * 3) {
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
 * @param { number } numStone
 * @returns { Rectangle[] }
 */
function randomDominoes(numsCell, numStone) {
  let weights = new Grid([0, 0], numsCell, [], 1 << numStone);

  const neighbors = neighborsMaker([0, 0], numsCell);

  return range(0, numStone).map(() => {
    /** @type { Point } */
    let first;

    /** @type { Point[] } */
    let neighborsFirst;

    /** @type { number[] } */
    let weightsNeighbsFirst;

    // ensure pairing when picking first cell
    do {
      first = weights.toVh(pickIndex(weights.values));
      neighborsFirst = neighbors(first);
      weightsNeighbsFirst = weights.valuesAt(neighborsFirst);
    } while (Math.max(...weightsNeighbsFirst) === 0);

    const second = weights.toVh(
      pick(weights.fromVhes(neighborsFirst), weightsNeighbsFirst),
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
        const lenSeg = pick(range(lenSegMin, lenSegMax + 1));

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
 * @param { number } numStone
 * @param { Config } config
 * @param { boolean } needWeights
 * @returns { Allocation }
 */
export default function dominoes(
  numStone,
  { size, margins, preventAdjacent },
  needWeights = false,
) {
  const start = margins;
  const end = size - margins;
  const separation = preventAdjacent ? 1 : 0;
  const numsCell = calcNumsCell(numStone);
  const segs = randomSegments(start, end, separation, numsCell);

  /** @type { Rectangle[] } */
  const elements = randomDominoes(calcNumsCell(numStone), numStone).map(
    ([first, second]) =>
      /** @type { Rectangle } */ ([
        // nw corner from first, se corner from second
        [segs[0][first[0]][0], segs[1][first[1]][0]],
        [segs[0][second[0]][1], segs[1][second[1]][1]],
      ]),
  );

  if (!needWeights) {
    return { elements, weights: null };
  }

  return {
    elements,
    weights: new Grid([0, 0], [size, size]).applyExcept(
      () => 0,
      elements.flatMap(([nw, se]) => regionRect(nw, se)),
    ),
  };
}
