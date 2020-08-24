/**
 * Randomly place stones via weight field over the board
 *
 * @typedef { import("../main.js").Placement } Placement
 * @typedef { import("../main.js").Config } Config
 * @typedef { [number, number] } Point
 */
import {
  range,
  pickIndex,
  isInGrid,
  fromVhMaker,
  toVhMaker,
  assignPlayers,
} from "./utils.js";

/**
 * Every pair [a, b] where a + b === total
 *
 * @param { number } total
 * @returns { Point[] }
 */
function pairsWithTotal(total) {
  /** @type { Point[] } */
  const pairs = [];

  range(0, Math.floor(total / 2)).forEach((smaller) => {
    pairs.push([smaller, total - smaller]);
  });

  return pairs;
}

/**
 * Relative positions of points on taxicab circle
 *
 * @param { number } radius
 * @returns { Point[] }
 */
function circleTaxicab(radius) {
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
        /** @type {Point} */
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
 * Larger of the two
 *
 * @param { number } a
 * @param { number } b
 * @returns { number }
 */
function larger(a, b) {
  if (a > b) {
    return a;
  }

  return b;
}

/**
 * Field of weights over the board
 */
class Board {
  /**
   * @param { number } size
   * @param { number } separation
   */
  constructor(size, separation) {
    /** @type { number } */
    this.size = size;

    /** @type { number[] } */
    this.weights = Array.from({ length: Math.pow(this.size, 2) }).fill(1);

    /** @type { number } */
    this.separation = separation;

    /** @type { (idx: number) => Point } */
    this.toVh = toVhMaker(size);

    /** @type { (point: Point) => number } */
    this.fromVh = fromVhMaker(size);
  }

  /**
   * Taxicab distance to farthest corner
   *
   * @param { number } center
   * @returns { number }
   */
  maxRadius(center) {
    const [v, h] = this.toVh(center);
    const maxVH = this.size - 1;

    return larger(v, maxVH - v) + larger(h, maxVH - h);
  }

  /**
   * Points at given taxicab distance, in flat index
   *
   * @param { number } center
   * @param { number } radius
   * @returns { number[] }
   */
  indicesCircleTaxicab(center, radius) {
    return circleTaxicab(radius)
      .map(([dv, dh]) => {
        const [v, h] = this.toVh(center);
        /** @type { Point } */
        const vh = [v + dv, h + dh];

        return vh;
      })
      .filter((vh) => isInGrid([this.size, this.size], vh))
      .map((vh) => this.fromVh(vh));
  }

  /**
   * @returns { Point }
   */
  placeStone() {
    const stone = pickIndex(this.weights);

    // points to exclude for future placements
    this.weights[stone] = 0;

    // within separation
    range(1, this.separation).forEach((radius) => {
      this.indicesCircleTaxicab(stone, radius).forEach((point) => {
        this.weights[point] = 0;
      });
    });

    /// points to increase weight
    range(1 + this.separation, this.maxRadius(stone)).forEach((radius) => {
      this.indicesCircleTaxicab(stone, radius).forEach((point) => {
        this.weights[point] *= radius;
      });
    });

    return this.toVh(stone);
  }
}

/**
 * @param { number } numStone
 * @param { Config } config
 * @returns { Placement[] }
 */
export default function weightField(
  numStone,
  { size, margins, handicap, preventAdjacent },
) {
  // TODO: Allow any separation.
  const separation = preventAdjacent ? 1 : 0;
  const boardInner = new Board(size - 2 * margins, separation);

  /** @type { Point[] } */
  const stonesInner = [];

  range(1, numStone).forEach(() => {
    stonesInner.push(boardInner.placeStone());
  });

  const stonesOuter = stonesInner.map(([v, h]) => {
    /** @type { Point } */
    // '1 +' makes coordinates start at 1 instead of 0
    const vhOuter = [1 + margins + v, 1 + margins + h];

    return vhOuter;
  });

  return assignPlayers(stonesOuter, handicap);
}
