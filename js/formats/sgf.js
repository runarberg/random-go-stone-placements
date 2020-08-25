/**
 * @typedef { import("../main.js").Placement } Placement
 * @typedef { import("../main.js").Config } Config
 */

/**
 * Make an anchor point to a generated sgf file
 *
 * @param { HTMLAnchorElement } anchor - The download anchor element
 * @param { string } sgf - The sgf to be downloaded
 * @returns { void }
 */
export function createSGFFile(anchor, sgf) {
  const sgfFile = new File([sgf], "random-start.sgf", {
    type: "application/x-go-sgf",
  });

  if (anchor.href) {
    URL.revokeObjectURL(anchor.href);
  }

  anchor.href = URL.createObjectURL(sgfFile);
  anchor.download = sgfFile.name;
}

/**
 * @param { number } coord
 * @returns { string }
 */
function toSGFCoord(coord) {
  return String.fromCharCode(0x60 + coord);
}

/**
 * @param { Placement } placement
 * @returns { string }
 */
function transformPlacement({ col, row }) {
  return `[${toSGFCoord(col)}${toSGFCoord(row)}]`;
}

/**
 * Formats output into an sgf string
 *
 * @param { Placement[] } placements
 * @param { Pick<Config, "komi" | "size"> } config
 * @returns { string }
 */
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

  return `(;GM[1]FF[4]CA[UTF-8]AP[random-go-stones:1.0.0]KM[${komi}]SZ[${size}]DT[${date}]${
    blackStones ? `AB${blackStones}` : ""
  }${whiteStones ? `AW${whiteStones}` : ""})`;
}
