// Randomly place stones via weight field over the board
//   tsc --lib dom,es6 -t es6 --outDir ../js random-placements-field.ts

import { range, pickIndex, isInGrid, fromVhMaker, toVhMaker, assignPlayers } from "./auxiliary.js"

/** [a, b] where a + b === total */
function pairsWithTotal(total: number): [number, number][] {
  let pairs: [number, number][] = [];
  range(0, Math.floor(total/2)).forEach(smaller => {
    pairs.push([smaller, total - smaller]);
  });
  return pairs;
}

/** Relative positions of points on taxicab circle */
function circleTaxicab(radius: number): [number, number][] {
  let vecs: [number, number][] = [];  // relative positions
  pairsWithTotal(radius).forEach(pair => {
    const [a, b] = pair;
    [[a, b], [b, a]].forEach(reflectionDiag => {
      const [vert, horz] = reflectionDiag;
      [[1, 1], [-1, 1], [1, -1], [-1, -1]].forEach(reflectionAxis => {
        const [signV, signH] = reflectionAxis;
        const candidate: [number, number] = [signV * vert, signH * horz];
        // Array.includes didn't work for [number, number]
        if (!vecs.some(vec =>
          vec[0] === candidate[0] &&
          vec[1] === candidate[1]
        )) {
          vecs.push(candidate);
        }
      });
    });
  });
  return vecs;
}

/** Larger of the two */
function larger(a: number, b: number): number {
  if (a > b) {
    return a;
  } else {
    return b;
  }
}

/** Field of weights over the board */
class Board {
  private size: number;
  private weights: number[];
  private separation: number;
  private toVh: (idx: number) => [number, number];
  private fromVh: ([v, h]: [number, number]) => number;

  constructor(size: number, separation: number) {
    this.size = size;
    this.weights = Array(this.size**2).fill(1);
    this.separation = separation;
    this.toVh = toVhMaker(size);
    this.fromVh = fromVhMaker(size);
  }

  /** Taxicab distance to farthest corner */
  maxRadius(center: number) {
    const [v, h] = this.toVh(center);
    const maxVH = this.size - 1;
    return larger(v, maxVH - v) + larger(h, maxVH - h);
  }

  /** Points at given taxicab distance, in flat index */
  indicesCircleTaxicab(center: number, radius: number): number[] {
    return circleTaxicab(radius)
      .map(vec => {
      const [dv, dh] = vec;
      const [v, h] = this.toVh(center);
      const vh: [number, number] = [v + dv, h + dh];
      return vh;
    }).filter(vh => isInGrid([this.size, this.size], vh))
      .map(vh => this.fromVh(vh));
  }

  placeStone(): [number, number] {
    const stone = pickIndex(this.weights);
    /// points to exclude for future placements
    this.weights[stone] = 0;
    // within separation
    range(1, this.separation).forEach(radius => { 
      this.indicesCircleTaxicab(stone, radius).forEach(point => {
        this.weights[point] = 0;
      });
    });
    /// points to increase weight
    range(1 + 1 + (this.separation - 1), this.maxRadius(stone)).forEach(radius => {
      this.indicesCircleTaxicab(stone, radius).forEach(point => {
        if (this.weights[point] > 0) {
          this.weights[point] *= (radius - 1);
        }
      });
    });
    return this.toVh(stone);
  }
}

export default function randomPlacementsField(
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
  let boardInner = new Board(size - 2*margins, separation);
  let stonesInner = [];
  range(1, numStone).forEach( _ => {
    stonesInner.push(boardInner.placeStone());
  });
  const stonesOuter = stonesInner.map(stn => {
    const [v, h] = stn;
    // '1 +' makes coordinates start at 1 instead of 0
    const vhOuter: [number, number] = [1 + margins + v, 1 + margins + h];
    return vhOuter;
  });
  return assignPlayers(stonesOuter, handicap);
}
