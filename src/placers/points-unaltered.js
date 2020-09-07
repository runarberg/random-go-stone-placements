/**
 * @typedef { import("../main.js").Config } Config
 * @typedef { import("./index.js").Allocation } Allocation
 *
 * @typedef { [number, number] } Point
 */

/**
 * @param { Config } config
 * @param { Allocation } allocation
 * @returns { Point[] }
 */
export default function pointsUnaltered(config, allocation) {
  return allocation;
}
