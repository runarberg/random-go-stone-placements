/**
 * @typedef { import("../main.js").Placement } Placement
 * @typedef { import("../main.js").Config } Config
 */

import { getNextPlayer, allowedCoord } from "./utils.js";

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
 * Create a new random placement
 *
 * @param { Placement[] } placements
 * @param { Config } config
 * @returns { Placement }
 */
function newCoord(placements, config) {
  const { size, margins, handicap, preventAdjacent } = config;

  const start = margins + 1;
  const end = size - margins;
  const col = randomPos({ start, end });
  const row = randomPos({ start, end });

  if (!allowedCoord([col, row], placements, { preventAdjacent })) {
    return newCoord(placements, config);
  }

  const player = getNextPlayer(placements, handicap);

  return { col, row, player };
}

/**
 * @typedef { { placements: Placement[] } } State
 * @param { number } n
 * @param { Config } config
 * @param { State | undefined } state
 * @returns { Placement[] }
 */
export default function uniform(n, config, state = { placements: [] }) {
  if (n <= 0) {
    return state.placements;
  }

  state.placements.push(newCoord(state.placements, config));

  return uniform(n - 1, config, state);
}
