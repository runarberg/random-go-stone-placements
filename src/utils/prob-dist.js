/**
 * @typedef { [number, number] } Point
 */

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
