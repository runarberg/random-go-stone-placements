/**
 * @typedef { import("../../main.js").Placement } Placement
 */

/**
 * Is the new placement in a legal position?
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
 * Choose black or white for next stone
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
 * Assign black or white to each stone
 *
 * @typedef { [number, number] } Point
 *
 * @param { Point[] } stones
 * @param { number } handicap
 * @returns { Placement[] }
 */
export function assignPlayers(stones, handicap) {
  /** @type { Placement[] } */
  const placements = [];

  stones.forEach(([col, row]) =>
    placements.push({
      col,
      row,
      player: getNextPlayer(placements, handicap),
    }),
  );

  return placements;
}

/**
 * List on [start, end) with step-size 1
 *
 * @param { number } start
 * @param { number } end
 * @returns { number[] }
 */
export function range(start, end) {
  return Array.from({ length: end - start }, (_, i) => i + start);
}

/**
 * Apply function that returns list on
 * each element in another list and
 * combine outputs into a single list
 *
 * @param { (arg: any) => any[] } func
 * @param { any[] } argsArray
 * @returns { any[] }
 */
export function applyConcat(func, argsArray) {
  /** @type { any[] } */
  let res = [];

  argsArray.forEach((arg) => {
    res = res.concat(func(arg));
  });
  return res;
}
