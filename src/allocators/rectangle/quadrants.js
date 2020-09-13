/**
 * @typedef { import("../../main.js").Config } Config
 *
 * @typedef { [number, number] } Point
 * @typedef { [Point, Point] } Rectangle
 */

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
 * @param { number } quadrant
 * @returns { number }
 */
function calcIdxQuadrant(quadrant) {
  return quadrant === 0b1000
    ? 0
    : quadrant === 0b0100
    ? 1
    : quadrant === 0b0010
    ? 2
    : quadrant === 0b0001
    ? 3
    : -1;
}

/**
 * @typedef { object } State
 * @property { number } quadrantMask
 * @property { number[] } indexes
 *
 * @param { number } n
 * @param { State | undefined } state
 * @returns { number[] }
 */
function getIndexesQuadrants(
  n,
  state = {
    quadrantMask: 0b1111,
    indexes: [],
  },
) {
  if (n <= 0) {
    return state.indexes;
  }

  const nextQuadrant = getRandomQuadrant(state.quadrantMask);
  state.indexes.push(calcIdxQuadrant(nextQuadrant));
  state.quadrantMask = state.quadrantMask ^ nextQuadrant || 0b1111;

  return getIndexesQuadrants(n - 1, state);
}

/**
 * @param { Config } config
 * @param { number } totalStones
 * @returns { Rectangle[] }
 */
export default function quadrants({ size, margins, placer }, totalStones) {
  const start = margins;
  const end = size - margins;
  const middle = size / 2;

  let midEnd;
  let midStart;

  switch (placer) {
    case "distUniform":
      midEnd = middle;
      midStart = middle;
      break;
    case "weightsUniform":
    case "weightsStair":
      midEnd = Math.ceil(middle);
      midStart = Math.floor(middle);
      break;
    default:
      throw new Error("unsupported placer option");
  }

  /** @type { Rectangle[] } */
  const quadrantsAll = [
    [
      [start, start],
      [midEnd, midEnd],
    ],
    [
      [start, midStart],
      [midEnd, end],
    ],
    [
      [midStart, start],
      [end, midEnd],
    ],
    [
      [midStart, midStart],
      [end, end],
    ],
  ];

  return getIndexesQuadrants(totalStones).map((idx) => quadrantsAll[idx]);
}
