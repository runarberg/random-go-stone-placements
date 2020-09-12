/**
 * @typedef { import("../main.js").Placement } Placement
 * @typedef { import("../main.js").Config } Config
 *
 * @typedef { object } State
 * @property { Placement[] } placements
 * @property { number } quadrantMask
 * @property { number } quadrant
 */

import { allowedCoord, getNextPlayer } from "./utils.js";

/**
 * @param { number } n
 * @param { Config } config
 * @param { State | undefined } state
 * @returns { Placement[] }
 */
export default function quadrantShuffle(
  n,
  config,
  state = { placements: [], quadrantMask: 0b1111, quadrant: 0 },
) {
  if (n <= 0) {
    return state.placements;
  }

  const nextQuadrant = getRandomQuadrant(state.quadrantMask);

  state.quadrant = nextQuadrant;
  state.quadrantMask = state.quadrantMask ^ nextQuadrant || 0b1111;
  state.placements.push(newCoord(state, config));

  return quadrantShuffle(n - 1, config, state);
}
