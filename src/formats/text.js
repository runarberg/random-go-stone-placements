/**
 * @param { number } pos
 * @returns { string }
 */
function transformColCoord(pos) {
  // Offset to account for missing "I".
  const offset = pos < 9 ? 0 : 1;
  const col = String.fromCodePoint(pos + offset + 0x40);

  return col;
}

/**
 * @typedef { import("../main.js").Placement } Placement
 *
 * @param { Placement } pos
 * @param { number } i
 * @returns { string }
 */
function transformPlacement({ col, row, player }, i) {
  const turn = i + 1;
  const colCoord = transformColCoord(col);
  const rowCoord = 20 - row;

  return `${turn}: ${player} ${colCoord}${rowCoord}`;
}

/**
 * Format placements into numbered lines
 *
 * @param { Placement[] } placements
 * @returns { string }
 */
export default function formatText(placements) {
  return placements.map(transformPlacement).join("\n");
}
