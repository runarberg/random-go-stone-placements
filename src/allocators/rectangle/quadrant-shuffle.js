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
 * @param { number } quadrantMask
 * @returns { number }
 */
function getRandomQuadrant(quadrantMask) {
  const bits = Array.from(quadrantMask.toString(2).padStart(4, "0"), (n) =>
    Number.parseInt(n, 10),
  ).reverse();
  const once = bits.reduce((count, bit) => count + bit, 0);

  if (once === 1) {
    return quadrantMask;
  }

  // Get a random nth of the available bits.
  const nth = Math.floor(Math.random() * once);
  let bitsLeft = nth + 1;
  const index = bits.findIndex((bit) => {
    if (bit) {
      bitsLeft -= 1;
    }

    if (bitsLeft === 0) {
      return true;
    }

    return false;
  });

  return 1 << index;
}

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
