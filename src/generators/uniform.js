/**
 * @typedef { import("../main.js").Placement } Placement
 * @typedef { import("../main.js").Config } Config
 *
 * @typedef { [number, number] } Point
 */

import { assignPlayers } from "./utils/common.js";
import { pickUniformRect, allowedCoord } from "./utils/prob-dist.js";

/**
 * @typedef { { stones: Point[] } } State
 * @param { number } n
 * @param { Config } config
 * @param { State | undefined } state
 * @returns { Placement[] }
 */
export default function uniform(n, config, state = { stones: [] }) {
  if (n <= 0) {
    return assignPlayers(state.stones, config.handicap);
  }

  const { size, margins, preventAdjacent } = config;

  // coordinates start at 1; [start, end)
  const start = margins + 1;
  const end = size - margins + 1;

  /** @type { Point } */
  let stn;

  do {
    stn = pickUniformRect([start, start], [end, end]);
  } while (!allowedCoord(stn, state.stones, preventAdjacent));

  state.stones.push(stn);

  return uniform(n - 1, config, state);
}
