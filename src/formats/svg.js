const SVGNS = "http://www.w3.org/2000/svg";

/**
 * @typedef { object } Options
 * @property { Object<string, boolean> } [class]
 * @property { Object<string, string | boolean | number> } [data]
 * @property { string } [text]
 * @property { Object<string, string> } [attrs]
 *
 * @typedef { object } ParentOptions
 * @property { Element } appendTo
 * @property { string } query
 *
 * @param { string } tag
 * @param { Options } options
 * @param { ParentOptions } parentOptions
 * @returns { SVGElement }
 */
function crel(
  tag,
  { class: classList = {}, data = {}, text = "", attrs = {} },
  { appendTo, query },
) {
  const update = appendTo.querySelector(query);
  const el = update || document.createElementNS(SVGNS, tag);

  if (!(el instanceof SVGElement)) {
    // type inference failure
    throw new Error("unreachable");
  }

  Object.entries(attrs).forEach(([name, value]) => {
    el.setAttribute(name, value);
  });

  Object.entries(classList).forEach(([name, add]) => {
    if (add) {
      el.classList.add(name);
    } else {
      el.classList.remove(name);
    }
  });

  Object.entries(data).forEach(([name, value]) => {
    if (value === null) {
      delete el.dataset[name];
    } else {
      el.dataset[name] = `${value}`;
    }
  });

  el.textContent = text;

  if (appendTo && !update) {
    appendTo.appendChild(el);
  }

  return el;
}

/**
 * Draws placements on an SVG canvas
 *
 * @typedef { import("../main.js").Placement } Placement
 * @typedef { import("../main.js").Config } Config
 *
 * @param { SVGSVGElement } svg - The SVG root canvas element to be drawn on
 * @param { Placement[] } placements - The stone placements to be drawn
 * @param { Config } config - The config params behind the placements
 */
export default function drawSVG(svg, placements, { size }) {
  const SQUARE_SIZE = 100 / size;
  const STONE_RADIUS = SQUARE_SIZE / 2 - 0.35;

  const board = crel(
    "g",
    {
      class: { board: true },
      data: { size },
      attrs: {
        transform: `translate(${STONE_RADIUS}, ${STONE_RADIUS})`,
        "aria-label": `${size}×${size} board`,
      },
    },
    { appendTo: svg, query: ".board" },
  );

  {
    const gridlines = crel(
      "g",
      {
        class: { gridlines: true },
        attrs: {
          "aria-hidden": "true",
        },
      },
      { appendTo: board, query: ".gridlines" },
    );

    const hLines = crel(
      "g",
      { class: { "h-lines": true } },
      { appendTo: gridlines, query: ".h-lines" },
    );

    const vLines = crel(
      "g",
      { class: { "v-lines": true } },
      { appendTo: gridlines, query: ".v-lines" },
    );

    for (let i = 0; i < size; i += 1) {
      const query = `line:nth-child(${i + 1})`;
      crel(
        "line",
        {
          attrs: {
            x1: "0",
            x2: `${100 - SQUARE_SIZE}`,
            y1: `${i * SQUARE_SIZE}`,
            y2: `${i * SQUARE_SIZE}`,
          },
          class: { "h-line": true },
        },
        { appendTo: hLines, query },
      );

      crel(
        "line",
        {
          attrs: {
            x1: `${i * SQUARE_SIZE}`,
            x2: `${i * SQUARE_SIZE}`,
            y1: "0",
            y2: `${100 - SQUARE_SIZE}`,
          },
          class: { "v-line": true },
        },
        { appendTo: vLines, query },
      );
    }

    while (hLines.children[size]) {
      hLines.children[size].remove();
    }

    while (vLines.children[size]) {
      vLines.children[size].remove();
    }
  }

  {
    const starpoints = crel(
      "g",
      { class: { starpoints: true }, attrs: { "aria-hidden": "true" } },
      { appendTo: board, query: ".starpoints" },
    );

    const r = `${Math.max(0.666, SQUARE_SIZE / 10)}`;
    const hoshiStart = size < 13 ? 2 : 3;
    const hoshiSpace =
      size % 2 === 0
        ? size - hoshiStart * 2 - 1
        : (size - hoshiStart * 2 - 1) / 2;

    let i = 0;

    for (let col = hoshiStart; col < size - 1; col += hoshiSpace) {
      for (let row = hoshiStart; row < size - 1; row += hoshiSpace) {
        i += 1;

        const cx = `${col * SQUARE_SIZE}`;
        const cy = `${row * SQUARE_SIZE}`;

        crel(
          "circle",
          {
            attrs: { cx, cy, r },
            class: { starpoint: true },
          },
          { appendTo: starpoints, query: `.starpoint:nth-child(${i})` },
        );
      }
    }

    while (starpoints.children[i]) {
      starpoints.children[i].remove();
    }
  }

  {
    const stones = crel(
      "g",
      {
        attrs: { "aria-label": "stones" },
        class: { stones: true },
      },
      { appendTo: board, query: ".stones" },
    );

    placements.forEach(({ col, row, player }, i) => {
      const cx = `${(col - 1) * SQUARE_SIZE}`;
      const cy = `${(row - 1) * SQUARE_SIZE}`;
      const r = `${STONE_RADIUS}`;
      const fill = player === "B" ? "black" : "white";

      const stone = crel(
        "circle",
        {
          attrs: { cx, cy, r, fill },
          class: { stone: true },
          data: { player },
        },

        { appendTo: stones, query: `.stone:nth-child(${i + 1})` },
      );

      crel(
        "title",
        {
          text: `${fill} ${String.fromCodePoint(0x40 + col)}${size - row + 1}`,
        },
        { appendTo: stone, query: "title" },
      );

      while (stones.children[placements.length]) {
        stones.children[placements.length].remove();
      }
    });
  }
}
