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
 * @param { object } obj
 * @param { number } obj.start
 * @param { number } obj.end
 * @returns { number }
 */
function randomPos({ start = 3, end = 17 }) {
  return start + Math.floor(Math.random() * (end - start) + 1);
}

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
 * Create a new random placement
 *
 * @param { State } state
 * @param { Config } config
 * @returns { Placement }
 */
function newCoord(state, config) {
  const { placements, quadrant } = state;
  const { size, margins, handicap, preventAdjacent } = config;

  let colStart = margins + 1;
  let colEnd = size - margins;
  let rowStart = margins + 1;
  let rowEnd = size - margins;

  const mid = (size + 1) / 2;

  if (quadrant === 0b1000) {
    colEnd = mid;
    rowEnd = mid;
  } else if (quadrant === 0b0100) {
    colStart = mid;
    rowEnd = mid;
  } else if (quadrant === 0b0010) {
    colEnd = mid;
    rowStart = mid;
  } else if (quadrant === 0b0001) {
    colStart = mid;
    rowStart = mid;
  }

  const col = randomPos({ start: colStart, end: colEnd });
  const row = randomPos({ start: rowStart, end: rowEnd });

  if (!allowedCoord([col, row], placements, { preventAdjacent })) {
    return newCoord(state, config);
  }

  const player = getNextPlayer(placements, handicap);

  return { col, row, player };
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
