function transformColCoord(pos) {
  // Offset to account for missing "I".
  const offset = pos < 9 ? 0 : 1;
  const col = String.fromCodePoint(pos + offset + 0x40);

  return col;
}

function transformPlacement({col, row, player}, i) {
  const turn = i + 1;
  const colCoord = transformColCoord(col);
  const rowCoord = 20 - row;

  return `${turn}: ${player} ${colCoord}${rowCoord}`;
}

export default function formatText(placements) {
  return placements.map(transformPlacement).join("\n");
}
