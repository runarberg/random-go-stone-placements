/**
 * @typedef { import("../main.js").Config } Config
 *
 * @typedef { [number, number] } Point
 * @typedef { [Point, Point] } Rectangle
 */

/**
 * @param { Config } config
 * @param { number } totalStones
 * @returns { Rectangle[] }
 */
export default function whole({ size, margins }, totalStones) {
  /** @type { Point } */
  const start = [margins, margins];
  /** @type { Point } */
  const end = [size - margins, size - margins];

  /** @type { Rectangle } */
  const allowed = [start, end];

  return Array.from({ length: totalStones }, () => allowed);
}
