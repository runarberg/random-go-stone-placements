function allowedCoord([newCol, newRow], placements) {
  return placements.every(({col: oldCol, row: oldRow}) => {
    if (oldCol === newCol) {
      return newRow < oldRow - 1 || oldRow + 1 < newRow;
    }

    if (oldRow === newRow) {
      return newCol < oldCol - 1 || oldCol + 1 < newCol;
    }

    return true;
  });
}

function randomPos({ start = 3, end = 17 }) {
  return start + Math.floor(Math.random() * (end - start) + 1);
}

function getRandomQuadrant(quadrantMask) {
  const bits = Array.from(quadrantMask.toString(2).padStart(4, "0"), (n) =>
    Number.parseInt(n)
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

function getNextPlayer(placements, handicap) {
  if (placements.length < handicap) {
    return "B";
  }

  return placements.length % 2 === handicap % 2 ? "B" : "W";
}

function newCoord(placements, config) {
  const { size, margins, handicap, quadrant } = config;

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

  if (!allowedCoord([col, row], placements)) {
    return newCoord(placements, config);
  }

  const player = getNextPlayer(placements, handicap);

  return { col, row, player };
}

export default function randomPlacements(
  n = 0,
  config = {},
  state = { placements: [], quadrantMask: 0b1111 }
) {
  if (n <= 0) {
    return state.placements;
  }

  const coordConfig = {
    size: config.size,
    margins: config.margins,
    handicap: config.handicap,
  };

  if (config.quadrantShuffle) {
    const quadrant = getRandomQuadrant(state.quadrantMask);
    const nextMask = state.quadrantMask ^ quadrant || 0b1111;

    coordConfig.quadrant = quadrant;
    state.quadrantMask = nextMask;
  }

  state.placements.push(newCoord(state.placements, coordConfig));

  return randomPlacements(n - 1, config, state);
}
