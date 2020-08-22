import { getNextPlayer, allowedCoord } from "./utils.js";

function randomPos({ start = 3, end = 17 }) {
  return start + Math.floor(Math.random() * (end - start) + 1);
}

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

export default function uniform(
  n = 0,
  config = {},
  state = { placements: [] }
) {
  if (n <= 0) {
    return state.placements;
  }

  const coordConfig = {
    size: config.size,
    margins: config.margins,
    handicap: config.handicap,
    preventAdjacent: config.preventAdjacent,
  };

  state.placements.push(newCoord(state.placements, coordConfig));

  return uniform(n - 1, config, state);
}
