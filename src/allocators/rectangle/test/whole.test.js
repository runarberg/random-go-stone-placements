import test from "ava";

import { Seeder } from "../../../utils/prob-dist.js";
import whole from "../whole.js";

/**
 * @typedef { import("../../../main.js").Config } Config
 */

// npm test "./src/allocators/rectangle/test/whole.test.js"  //

test("whole", (t) => {
  /** @type { Config } */
  const config = {
    seeder: new Seeder(""),
    stones: 0,
    size: 19,
    komi: 0,
    handicap: 0,
    margins: 2,
    preventAdjacent: false,
    allocatorType: "rectangle",
    allocatorPoint: "stars",
    allocatorRect: "whole",
    placerPoint: "pointsUnaltered",
    placerRect: "distUniform",
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
