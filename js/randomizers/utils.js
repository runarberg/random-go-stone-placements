/**
 * @typedef { import("../main.js").Placement } Placement
 */

/**
 * Is the new placement in a leagal possition?
 *
 * @param { [number, number] } pos
 * @param { Placement[] } placements
 * @param { { preventAdjacent: boolean } } options
 * @returns { boolean }
 */
export function allowedCoord(
  [newCol, newRow],
  placements,
  { preventAdjacent },
) {
  return placements.every(({ col: oldCol, row: oldRow }) => {
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

/**
 * Is the new placement in a leagal possition?
 *
 * @param { Placement[] } placements
 * @param { number } handicap
 * @returns { "B" | "W" }
 */
export function getNextPlayer(placements, handicap) {
  if (placements.length < handicap) {
    return "B";
  }

  return placements.length % 2 === handicap % 2 ? "B" : "W";
}

/**
 * Length from start to end inclusive
 *
 * @param { number } start
 * @param { number } end
 * @returns { number }
 */
export function len(start, end) {
  return end - start + 1;
}

/**
 * List from start to end inclusive, with step size 1
 *
 * @param { number } start
 * @param { number } end
 * @returns { number[] }
 */
export function range(start, end) {
  return Array.from(Array(len(start, end)).keys()).map((val) => val + start);
}

/**
 * List of numbers to list of cumulative sums
 *
 * @param { number[] } nums
 * @returns { number[] }
 */
function cumul(nums) {
  const res = Array(nums.length);
  nums.reduce((acc, val, idx) => (res[idx] = acc + val), 0);
  return res;
}

/**
 * Random index, using relative weights
 *
 * @param { number[] } weights
 * @returns { number }
 */
export function pickIndex(weights) {
  if (weights.some((weight) => weight < 0)) {
    throw new Error("negative weight");
  }

  if (weights.every((weight) => weight === 0)) {
    throw new Error("weights all zero");
  }

  const total = weights.reduce((acc, val) => acc + val, 0);
  const nRand = Math.floor(Math.random() * total);
  return cumul(weights).findIndex((val) => {
    return val > nRand;
  });
}

/**
 * [vert, horz] -> idx
 *
 * @typedef { [number, number] } Point
 * @param { number } lenRow
 * @returns { (point: Point) => number }
 */
export function fromVhMaker(lenRow) {
  return function ([v, h]) {
    return v * lenRow + h;
  };
}

/**
 * idx -> [vert, horz]
 *
 * @param { number } lenRow
 * @returns { (idx: number) => Point }
 */
export function toVhMaker(lenRow) {
  return function (idx) {
    const v = Math.floor(idx / lenRow);
    const h = idx % lenRow;
    return [v, h];
  };
}
/**
 * Whether point is within rectangle spanned by [0, 0] and 2 lengths,
 * upper bounds excluded
 *
 * @param { Point } lens
 * @param { Point } point
 * @returns { boolean }
 */
export function isInGrid(lens, point) {
  return (
    point[0] >= 0 && point[0] < lens[0] && point[1] >= 0 && point[1] < lens[1]
  );
}

/**
 * Assign each stone to either player
 *
 * @param { Point[] } stones
 * @param { number } handicap
 * @returns { Placement[] }
 */
export function assignPlayers(stones, handicap) {
  /** @type { Placement[] } */
  const placements = [];

  stones.forEach(([col, row]) => {
    const player = getNextPlayer(placements, handicap);
    placements.push({ col, row, player });
  });

  return placements;
}
