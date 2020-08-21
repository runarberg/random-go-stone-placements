// Randomly place stones via subdivision of board into rectangles
//   tsc --lib dom,es6 -t es6 --outDir ../js random-placements-domino.ts

import { len, range, pickIndex, isInGrid, fromVhMaker, toVhMaker, assignPlayers } from "./auxiliary.js";

/** Random element in list, optionally using relative weights */
function pick(
  options: number[],
  weights: number[] = Array(options.length).fill(1)
): number {
  console.assert(options.length === weights.length, 'unequal length');
  return options[pickIndex(weights)];
}

/** Numbers in trapezial shape;
*   E.g.: [1, 2, 2, 2, 1]
*   At boundary, keep numbers high: [3, 3, 3, 3, 2, 1] */
function trapez(bounds: [number, number], start: number, end: number): number[] {
  const base = len(start, end);
  if (base === 1) {  // special case: would return [0] otherwise
    return [1];
  }
  const mid = Math.floor(base/2);
  const ascending = range(1, mid);
  let res = [];
  if (start === bounds[0]) {
    res = res.concat(Array(ascending.length).fill(mid));
  } else {
    res = res.concat(ascending);
  }
  if (base % 2) {  // only for odd
    res.push(mid);
  }
  if (end === bounds[1]) {
    res = res.concat(Array(ascending.length).fill(mid));
  } else {
    res = res.concat(ascending.reverse());
  }
  return res;
}

/** Rectangle defined by northwest and southeast corner points inclusive */
class Rect {
  corners: [[number, number], [number, number]];

  constructor(nw: [number, number] = [0, 0], se: [number, number] = [0, 0]) {
    this.corners = [nw, se];
  }

  /** random point inside rectangle */
  randomPoint(bounds: [number, number]): [number, number] {
    let point: [number, number] = [this.corners[0][0], this.corners[0][1]];
    range(0, 1).forEach(axis => {
      const start = this.corners[0][axis];
      const end = this.corners[1][axis];
      const options = range(1 - 1, len(start, end) - 1);
      const weights = trapez(bounds, start, end);
      point[axis] += pick(options, weights);
    });
    return point;
  }
}

/** From line segment, get endpoint inclusive */
function segToEnd(start: number, seg: number): number {
  return start + seg - 1;
}

/** From line segments, get list of both endpoints,
*   taking into account separation between segments */
function segsToEnds(start: number, segs: number[], sep: number): [number, number][] {
  let curr = start;
  let res = Array(segs.length);
  segs.forEach((seg, idx) => {
    res[idx] = [curr, segToEnd(curr, seg)];
    curr += seg + sep;
  });
  return res;
}

/** In 2-d array, indices of neighbors in cardinal directions */
function neighbors(lens: [number, number], [v, h]: [number, number]): [number, number][] {
  let idxsNeighb = [];
  [[1, 0], [0, 1]].forEach(dir => {
    const dv = dir[0];
    const dh = dir[1];
    [-1, 1].forEach(sign => {
      const candidate: [number, number] = [v + sign*dv, h + sign*dh];
      if (isInGrid(lens, candidate)) {
        idxsNeighb.push(candidate);
      }
    });
  });
  return idxsNeighb;
}

/** Rectangles arranged in a grid, and weight for each */
class GridRects {
  private lens: [number, number];
  private weights: number[];
  readonly rects: Rect[];
  private fromVh: ([v, h]: [number, number]) => number;
  private toVh: (idx: number) => [number, number];

  constructor(
    numStone: number,
    boundLow: number,
    sepMin: number,
    lensSideRect: [number[], number[]],
  ) {
    this.lens = [lensSideRect[0].length, lensSideRect[1].length];
    this.weights = Array(this.lens[0]*this.lens[1]).fill(1 << numStone);
    this.rects = Array.from( {length:this.lens[0]*this.lens[1]}, () => (new Rect()) );
    this.fromVh = fromVhMaker(this.lens[1]);
    this.toVh = toVhMaker(this.lens[1]);
    // set northwest and southeast corner points for each rectangle
    const ends = [
      segsToEnds(boundLow, lensSideRect[0], sepMin),
      segsToEnds(boundLow, lensSideRect[1], sepMin)
    ];
    this.rects.forEach((rect, idx) => {
      const idxVh = this.toVh(idx);
      range(0, 1).forEach(axis => {
        range(0, 1).forEach(corner => {
          rect.corners[corner][axis] = ends[axis][idxVh[axis]][corner];
        });
      });
    });
  }

  private decrementWeights(idxsRect: number[]) {
    idxsRect.forEach(idx => this.weights[idx] >>= 1);
  }

  /** Random adjoining pair (= domino) of rectangles for each stone */
  randomPairs(numStone: number): Rect[] {
    let rectsStone = [];
    range(1, numStone).forEach(() => {
      // ensure pairing when picking first rectangle
      let idxFirst;
      let idxsNeighb;
      let weightsNeighb;
      do {
        idxFirst = pick(range(0, this.rects.length - 1), this.weights);  // pick from all
        idxsNeighb = neighbors(this.lens, this.toVh(idxFirst)).map(idx => this.fromVh(idx)).sort((a, b) => a - b);
        weightsNeighb = this.weights.filter((_, idx) => {
          return idxsNeighb.includes(idx);
        });
      } while (Math.max(...weightsNeighb) === 0);
      // pick the second rectangle
      const idxSecond = pick(idxsNeighb, weightsNeighb);
      // adjust the weights
      this.weights[idxFirst] = 0;
      this.decrementWeights(idxsNeighb);
      this.weights[idxSecond] = 0;
      this.decrementWeights(neighbors(this.lens, this.toVh(idxSecond)).map(idx => this.fromVh(idx)));
      // merge the pair of rectangles
      const pair = [idxFirst, idxSecond].sort((a, b) => a - b);
      rectsStone.push(new Rect(this.rects[pair[0]].corners[0], this.rects[pair[1]].corners[1]));
    });
    return rectsStone;
  }

  get lenRow(): number {
    return this.lens[1];
  }
}

/** Calculate number of rows and columns of rectangles to subdivide into */
function calcNumsRect(numStone: number): [number, number] {
  let nums: [number, number] = [0, 0];  // [numRow, numCol]
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

/** Along each axis, randomly divide the length of board into segments */
function randomSegs(
  sizeBoard: number,
  marginEdge: number,
  sepMin: number,
  bounds: [number, number],
  numsRect: [number, number]
): [number[], number[]] {
  let segments: [number[], number[]] = [[], []];
  range(0, 1).forEach(axis => {
    const lenAvailable = sizeBoard - 2*marginEdge - sepMin*(numsRect[axis] - 1);
    const lenSideMin = Math.floor(lenAvailable / numsRect[axis]);
    if (lenSideMin < 1) {
      throw new NotEnoughSpaceError();
    }
    let lenRemain = len(bounds[0], bounds[1]);
    range(1, numsRect[axis] - 1).reverse().forEach(numRectRemain => {
      const lenSideMax = lenRemain - (lenSideMin + sepMin)*numRectRemain;
      const seg = pick(range(lenSideMin, lenSideMax));
      segments[axis].push(seg);
      lenRemain -= seg + sepMin;
    });
    segments[axis].push(lenRemain);
  });
  return segments;
}

export default function randomPlacementsDomino(
  numStone: number,
  {size,
  margins,
  handicap,
  preventAdjacent = undefined,
  separation = 0}
) {
  if (preventAdjacent !== undefined) {
    if (preventAdjacent) {
      separation = 1;
    } 
  }
  const bounds: [number, number] = [1 + margins, size - margins];
  let segs;
  try {
    segs = randomSegs(size, margins, separation, bounds, calcNumsRect(numStone));
  } catch (err) {
    if (err instanceof NotEnoughSpaceError) {
      console.error('Error: not enough space on the board for the parameters');
      throw err;
    }
  }
  let stones = [];
  new GridRects(numStone, bounds[0], separation, segs).randomPairs(numStone).forEach(rct => {
    stones.push(rct.randomPoint(bounds));
  });
  return assignPlayers(stones, handicap);
}
