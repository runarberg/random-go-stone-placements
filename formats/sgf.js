function toSGFCoord(coord) {
  return String.fromCharCode(0x60 + coord);
}

function transformPlacement({ col, row }) {
  return `[${toSGFCoord(col)}${toSGFCoord(row)}]`;
}

export default function formatSGF(placements, { komi, size }) {
  const [date] = new Date().toISOString().split("T");

  const blackStones = placements
    .filter(({ player }) => player === "B")
    .map(transformPlacement)
    .join("");

  const whiteStones = placements
    .filter(({ player }) => player === "W")
    .map(transformPlacement)
    .join("");

  return `(;GM[1]FF[4]CA[UTF-8]AP[random-go-stones:1.0.0]KM[${komi}]SZ[${size}]DT[${date}]AB${blackStones}AW${whiteStones})`;
}
