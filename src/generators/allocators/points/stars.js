/**
 * @typedef { import("../../../main.js").Config } Config
 * @typedef { import("../index.js").Allocation } Allocation
 *
 * @typedef { [number, number] } Point
 */

/**
 * @param { Config } config
 * @param { boolean } needWeights
 * @returns { Allocation }
 */
export default function stars(config, needWeights = false) {
  if (needWeights) {
    throw new Error("no option to return weights");
  }

  /** @type { Point[] } */
  const elements = [];

  return { elements, weights: null };
}
