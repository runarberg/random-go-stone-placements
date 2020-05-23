const SQUARE_SIZE = 100 / 19;
const STONE_RADIUS = SQUARE_SIZE - 2.5;

function crel(tag, attrs = {}) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", tag);

  Object.entries(attrs).forEach(([name, value]) => {
    el.setAttribute(name, value);
  });

  return el;
}

export default function drawSVG(svg, placements) {
  const board =
    document.querySelector("board") ||
    crel("g", {
      class: "board",
      transform: `translate(${STONE_RADIUS}, ${STONE_RADIUS})`,
    });

  if (!svg.querySelector(".gridlines")) {
    const gridlines = crel("g", {
      class: "gridlines",
    });

    for (let i = 0; i < 19; i += 1) {
      const hLine = crel("line", {
        x1: 0,
        x2: 100 - SQUARE_SIZE,
        y1: i * SQUARE_SIZE,
        y2: i * SQUARE_SIZE,
      });

      const vLine = crel("line", {
        x1: i * SQUARE_SIZE,
        x2: i * SQUARE_SIZE,
        y1: 0,
        y2: 100 - SQUARE_SIZE,
      });

      gridlines.appendChild(hLine);
      gridlines.appendChild(vLine);
    }

    board.appendChild(gridlines);
  }

  if (!svg.querySelector(".starpoints")) {
    const starpoints = crel("g", {
      class: "starpoints",
    });

    const hoshiStart = 3 * SQUARE_SIZE;
    const hoshiSpace = 6 * SQUARE_SIZE;

    for (let cx = hoshiStart; cx < 100; cx += hoshiSpace) {
      for (let cy = hoshiStart; cy < 100; cy += hoshiSpace) {
        starpoints.appendChild(crel("circle", { cx, cy, r: 1 }));
      }
    }

    board.appendChild(starpoints);
  }

  {
    const stones =
      svg.querySelector(".stones") || crel("g", { class: "stones" });

    placements.forEach(([col, row], i) => {
      const player = i % 2 === 0 ? "black" : "white";
      const cx = (col - 1) * SQUARE_SIZE;
      const cy = (row - 1) * SQUARE_SIZE;
      const stone = stones.querySelector(`.stone:nth-child(${i + 1})`);

      if (stone) {
        stone.setAttribute("cx", cx);
        stone.setAttribute("cy", cy);
      } else {
        stones.appendChild(
          crel("circle", {
            cx,
            cy,
            r: STONE_RADIUS,
            class: "stone",
            "data-player": player,
          })
        );
      }

      while (stones.children[placements.length]) {
        stones.children[placements.length].remove();
      }

      board.appendChild(stones);
    });
  }

  svg.appendChild(board);
}
