/**
 * Randomly place stones via subdivision of board into rectangles
 *
 * @typedef { import("../main.js").Placement } Placement
 * @typedef { import("../main.js").Config } Config
 */
import {
  len,
  range,
  pickIndex,
  isInGrid,
  fromVhMaker,
  toVhMaker,
  assignPlayers,
} from "./utils.js";

/**
 * Random element in list, optionally using relative weights
 *
 * @param { number[] } options
 * @param { number[] } weights
 * @returns { number }
 */
function pick(
  options,
  weights = Array.from({ length: options.length }).fill(1),
) {
  if (options.length !== weights.length) {
    throw new Error("Unequal length");
  }

  return options[pickIndex(weights)];
}

/**
 * Numbers in trapezial shape;
 * E.g.: [1, 2, 2, 2, 1]
 * At boundary, keep numbers high: [3, 3, 3, 3, 2, 1]
 *
 * @param { [number, number] } bounds
 * @param { number } start
 * @param { number } end
 * @returns { number[] }
 */
function trapez(bounds, start, end) {
  const base = len(start, end);

  if (base === 1) {
    // special case: would return [0] otherwise
    return [1];
  }

  const mid = Math.floor(base / 2);
  const ascending = range(1, mid);

  /** @type { number[] } */
  let res = [];

  if (start === bounds[0]) {
    res = res.concat(Array.from({ length: ascending.length }).fill(mid));
  } else {
    res = res.concat(ascending);
  }

  if (base % 2 === 1) {
    // only for odd
    res.push(mid);
  }

  if (end === bounds[1]) {
    res = res.concat(Array.from({ length: ascending.length }).fill(mid));
  } else {
    res = res.concat(ascending.reverse());
  }

  return res;
}

/**
 * Rectangle defined by northwest and southeast corner points inclusive
 *
 * @typedef { [number, number] } Point
 */
class Rect {
  /**
   * @param { Point } nw
   * @param { Point } se
   */
  constructor(nw = [0, 0], se = [0, 0]) {
    /** @type { [Point, Point] } */
    this.corners = [nw, se];
  }

  /**
   * Random point inside rectangle
   *
   * @param { Point } bounds
   * @returns { Point }
   */
  randomPoint(bounds) {
    /** @type { Point } */
    const point = [this.corners[0][0], this.corners[0][1]];

    range(0, 1).forEach((axis) => {
      const start = this.corners[0][axis];
      const end = this.corners[1][axis];
      const options = range(1 - 1, len(start, end) - 1);
      const weights = trapez(bounds, start, end);
      point[axis] += pick(options, weights);
    });

    return point;
  }
}

/**
 * From line segment, get endpoint inclusive
 *
 * @param { number } start
 * @param { number } seg
 * @returns { number }
 */
function segToEnd(start, seg) {
  return start + seg - 1;
}

/**
 * From line segments, get list of both endpoints, taking into account
 * separation between segments
 *
 * @param { number } start
 * @param { number[] } segs
 * @param { number } sep
 * @returns { Point[] }
 */
function segsToEnds(start, segs, sep) {
  let curr = start;
  const res = Array.from({ length: segs.length });

  segs.forEach((seg, idx) => {
    res[idx] = [curr, segToEnd(curr, seg)];
    curr += seg + sep;
  });

  return res;
}

/**
 * In 2-d array, indices of neighbors in cardinal directions
 *
 * @param { Point } lens
 * @param { Point } vh
 * @returns { Point[] }
 */
function neighbors(lens, [v, h]) {
  /** @type { Point[] } */
  const idxsNeighb = [];

  /** @type { Point[] } */
  const idMatrix = [
    [1, 0],
    [0, 1],
  ];

  idMatrix.forEach(([dv, dh]) => {
    [-1, 1].forEach((sign) => {
      /** @type { Point } */
      const candidate = [v + sign * dv, h + sign * dh];

      if (isInGrid(lens, candidate)) {
        idxsNeighb.push(candidate);
      }
    });
  });

  return idxsNeighb;
}

/**
 * Rectangles arranged in a grid, and weight for each
 */
class GridRects {
  /**
   * @param { number } numStone
   * @param { number } boundLow
   * @param { number } sepMin
   * @param { [number[], number[]] } lensSideRect
   */
  constructor(numStone, boundLow, sepMin, lensSideRect) {
    /**
     * @private
     * @type { Point }
     */
    this.lens = [lensSideRect[0].length, lensSideRect[1].length];

    /**
     * @private
     * @type { number[] }
     */
    this.weights = Array.from({ length: this.lens[0] * this.lens[1] }).fill(
      1 << numStone,
    );

    /**
     * @readonly
     * @type { Rect[] }
     */
    this.rects = Array.from(
      { length: this.lens[0] * this.lens[1] },
      () => new Rect(),
    );

    /**
     * @private
     * @type { (point: Point) => number }
     */
    this.fromVh = fromVhMaker(this.lens[1]);

    /**
     * @private
     * @type { (idx: number) => Point }
     */
    this.toVh = toVhMaker(this.lens[1]);

    // set northwest and southeast corner points for each rectangle
    const ends = [
      segsToEnds(boundLow, lensSideRect[0], sepMin),
      segsToEnds(boundLow, lensSideRect[1], sepMin),
    ];
    this.rects.forEach((rect, idx) => {
      const idxVh = this.toVh(idx);
      range(0, 1).forEach((axis) => {
        range(0, 1).forEach((corner) => {
          rect.corners[corner][axis] = ends[axis][idxVh[axis]][corner];
        });
      });
    });
  }

  /**
   * @param { number[] } idxsRect
   */
  decrementWeights(idxsRect) {
    idxsRect.forEach((idx) => (this.weights[idx] >>= 1));
  }

  /**
   * Random adjoining pair (= domino) of rectangles for each stone
   *
   * @param { number } numStone
   * @returns { Rect[] }
   */
  randomPairs(numStone) {
    /** @type { Rect[] } */
    const rectsStone = [];

    range(1, numStone).forEach(() => {
      // ensure pairing when picking first rectangle
      /** @type { number } */
      let idxFirst;

      /** @type { number[] } */
      let idxsNeighb;

      /** @type { number[] } */
      let weightsNeighb;

      do {
        idxFirst = pickIndex(this.weights);

        idxsNeighb = neighbors(this.lens, this.toVh(idxFirst))
          .map((idx) => this.fromVh(idx))
          .sort((a, b) => a - b);

        weightsNeighb = this.weights.filter((_, idx) => idxsNeighb.includes(idx));
      } while (Math.max(...weightsNeighb) === 0);

      // pick the second rectangle
      const idxSecond = pick(idxsNeighb, weightsNeighb);

      // adjust the weights
      this.weights[idxFirst] = 0;
      this.decrementWeights(idxsNeighb);
      this.weights[idxSecond] = 0;
      this.decrementWeights(
        neighbors(this.lens, this.toVh(idxSecond)).map((idx) =>
          this.fromVh(idx),
        ),
      );

      // merge the pair of rectangles
      const pair = [idxFirst, idxSecond].sort((a, b) => a - b);

      rectsStone.push(
        new Rect(
          this.rects[pair[0]].corners[0],
          this.rects[pair[1]].corners[1],
        ),
      );
    });

    return rectsStone;
  }

  get lenRow() {
    return this.lens[1];
  }
}

/**
 * Calculate number of rows and columns of rectangles to subdivide into
 *
 * @param { number } numStone
 * @returns { Point }
 */
function calcNumsRect(numStone) {
  /** @type { Point } */
  const nums = [0, 0]; // [numRow, numCol]
  let parity = 1;
  // so far, the factor of 3 seems to allow randomly placing
  //   pair of rectangles (= dominoes) without running out of space

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

class NotEnoughSpaceError extends Error {}

/**
 * Along each axis, randomly divide the length of board into segments
 *
 * @param { number } sizeBoard
 * @param { number } marginEdge
 * @param { number } sepMin
 * @param { Point } bounds
 * @param { Point } numsRect
 * @returns { [number[], number[]] }
 */
function randomSegs(sizeBoard, marginEdge, sepMin, bounds, numsRect) {
  /** @type { [number[], number[]] } */
  const segments = [[], []];

  range(0, 1).forEach((axis) => {
    const lenAvailable =
      sizeBoard - 2 * marginEdge - sepMin * (numsRect[axis] - 1);
    const lenSideMin = Math.floor(lenAvailable / numsRect[axis]);

    if (lenSideMin < 1) {
      throw new NotEnoughSpaceError();
    }

    let lenRemain = len(bounds[0], bounds[1]);

    range(1, numsRect[axis] - 1)
      .reverse()
      .forEach((numRectRemain) => {
        const lenSideMax = lenRemain - (lenSideMin + sepMin) * numRectRemain;
        const seg = pick(range(lenSideMin, lenSideMax));
        segments[axis].push(seg);
        lenRemain -= seg + sepMin;
      });

    segments[axis].push(lenRemain);
  });

  return segments;
}

/**
 * @param { number } numStone
 * @param { Config } config
 * @returns { Placement[] }
 */
export default function dominoShuffle(
  numStone,
  { size, margins, handicap, preventAdjacent },
) {
  // TODO: Allow any separation.
  const separation = preventAdjacent ? 1 : 0;

  /** @type { Point } */
  const bounds = [1 + margins, size - margins];

  /** @type { [number[], number[]] } */
  let segs;
  try {
    segs = randomSegs(
      size,
      margins,
      separation,
      bounds,
      calcNumsRect(numStone),
    );
  } catch (error) {
    if (error instanceof NotEnoughSpaceError) {
      throw new Error(
        "Error: not enough space on the board for the parameters",
      );
    } else {
      throw error;
    }
  }

  /** @type { Point[] } */
  const stones = [];

  new GridRects(numStone, bounds[0], separation, segs)
    .randomPairs(numStone)
    .forEach((rct) => {
      stones.push(rct.randomPoint(bounds));
    });

  return assignPlayers(stones, handicap);
}
