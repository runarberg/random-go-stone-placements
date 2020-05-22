function toSGFCoord(coord) {
  return String.fromCharCode(0x60 + coord);
}

export default function formatSGF(placements) {
  const [date] = new Date().toISOString().split("T");

  let blackStones = "AB";
  let whiteStones = "AW";

  placements.forEach(([col, row], i) => {
    const coord = `[${toSGFCoord(col)}${toSGFCoord(row)}]`;

    if (i % 2 === 0) {
      blackStones += coord;
    } else {
      whiteStones += coord;
    }
  });

  return `(;GM[1]FF[4]CA[UTF-8]AP[random-go-stones:1.0.0]KM[6.5]SZ[19]DT[${date}]${blackStones}${whiteStones})`;
}
