import test from "ava";

import whole from "../whole.js";

/**
 * @typedef { import("../../../main.js").Config } Config
 */

// npm test "./src/allocators/rectangle/test/whole.test.js"  //

test("whole", (t) => {
  /** @type { Config } */
  const config = {
    stones: 0,
    size: 19,
    komi: 0,
    handicap: 0,
    margins: 2,
    preventAdjacent: false,
    generator: "rectangle",
    allocator: "whole",
    placer: "distUniform",
    weightAdjuster: "constant",
  };

  t.deepEqual(whole(config, 3), [
    [
      [2, 2],
      [17, 17],
    ],
    [
      [2, 2],
      [17, 17],
    ],
    [
      [2, 2],
      [17, 17],
    ],
  ]);
});
