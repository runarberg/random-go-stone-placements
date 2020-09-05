/**
 * @typedef { import("../../main.js").Placement } Placement
 */

/**
 * Choose black or white for next stone
 *
 * @param { Placement[] } placements
 * @param { number } handicap
 * @returns { "B" | "W" }
 */
function getNextPlayer(placements, handicap) {
  if (placements.length < handicap) {
    return "B";
  }

  return placements.length % 2 === handicap % 2 ? "B" : "W";
}

/**
 * Assign black or white to each stone
 *
 * @typedef { [number, number] } Point
 *
 * @param { Point[] } stones
 * @param { number } handicap
 * @returns { Placement[] }
 */
export function assignPlayers(stones, handicap) {
  /** @type { Placement[] } */
  const placements = [];

  stones.forEach(([col, row]) =>
    placements.push({
      col,
      row,
      player: getNextPlayer(placements, handicap),
    }),
  );

  return placements;
}

/**
 * List on [start, end) with step-size 1
 *
 * @param { number } start
 * @param { number } end
 * @returns { number[] }
 */
export function range(start, end) {
  return Array.from({ length: end - start }, (_, i) => i + start);
}
