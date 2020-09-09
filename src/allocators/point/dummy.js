/**
 * @typedef { import("../../main.js").Config } Config
 *
 * @typedef { [number, number] } Point
 */

/**
 * @param { Config } config
 * @param { number } totalStones
 * @returns { Point[] }
 */
export default function dummy({ size }, totalStones) {
  /** @type { Point[] } */
  return Array.from(
    { length: totalStones },
    () => /** @type { Point } */ ([size, size]),
  );
}
