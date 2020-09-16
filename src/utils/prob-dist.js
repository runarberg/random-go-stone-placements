import {
  randomLcg,
  randomUniform,
} from "../../node_modules/d3-random/src/index.js";

/**
 * @typedef { [number, number] } Point
 */

/**
 * @param { string } str
 * @returns { number }
 */
function toHash(str) {
  let hash = 0xdeadbeef;

  for (const c of str) {
    hash = (hash << 5) - hash + c.codePointAt(0);
  }

  return hash;
}

/**
 * @param { number } n
 * @returns { number }
 */
function toFraction(n) {
  const str = Math.abs(n).toString(16);

  return Number.parseInt(str.slice(-8), 16) / 0xffffffff;
}

export class Seeder {
  /**
   * @param { string } words
   */
  constructor(words) {
    if (words.length === 0) {
      /**
       * @private
       * @type { (() => number)[] }
       */
      this.lcgs = [randomLcg()];
    } else {
      this.lcgs = words
        .split(" ")
        .map((wd) => randomLcg(toFraction(toHash(wd))));
    }

    /**
     * @private
     * @type { number }
     */
    this.idx = 0;
  }

  /**
   * @returns { () => number }
   */
  get next() {
    const idxCurrent = this.idx;
    this.idx = (this.idx + 1) % this.lcgs.length;
    return this.lcgs[idxCurrent];
  }
}

/**
 * Pick a point using uniform distribution in a rectangle bound
 * by two points on opposite corners, 'start' and 'end',
 * so that [start, end)
 *
 * @param { { seeder: Seeder } } config
 * @param { Point } start
 * @param { Point } end
 * @returns { Point }
 */
export function pickUniformRect({ seeder }, start, end) {
  const random = randomUniform.source(seeder.next);

  /** @type { Point } */
  return [
    Math.floor(random(start[0], end[0])()),
    Math.floor(random(start[1], end[1])()),
  ];
}

/**
 * Is the new placement in a legal position?
 *
 * @param { Point } pos
 * @param { Point[] } stones
 * @param { { preventAdjacent: boolean } } options
 * @returns { boolean }
 */
export function allowedCoord([newCol, newRow], stones, { preventAdjacent }) {
  return stones.every(([oldCol, oldRow]) => {
    if (preventAdjacent) {
      if (oldCol === newCol) {
        return newRow < oldRow - 1 || oldRow + 1 < newRow;
      }

      if (oldRow === newRow) {
        return newCol < oldCol - 1 || oldCol + 1 < newCol;
      }

      return true;
    }

    return !(oldCol === newCol && oldRow === newRow);
  });
}
