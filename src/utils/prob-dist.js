/**
 * @typedef { [number, number] } Point
 */

/**
 * @param { number } start
 * @param { number } end
 * @returns { number }
 */
function randomInt(start, end) {
  return Math.floor(start + Math.random() * (end - start));
}

/**
 * Pick a point using uniform distribution in a rectangle bound
 * by two points on opposite corners, 'start' and 'end',
 * so that [start, end)
 *
 * @param { Point } start
 * @param { Point } end
 * @returns { Point }
 */
export function pickUniformRect(start, end) {
  /** @type { Point } */
  return [randomInt(start[0], end[0]), randomInt(start[1], end[1])];
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
