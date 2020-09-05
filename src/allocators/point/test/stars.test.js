import test from "ava";

import stars from "../stars.js";

/**
 * @typedef { import("../../../main.js").Config } Config
 */

// npm test "./src/allocators/point/test/stars.test.js"  //

test("stars", (t) => {
  /** @type { Config } */
  const config = {
    stones: 0,
    size: 19,
    komi: 0,
    handicap: 0,
    margins: 0,
    preventAdjacent: false,
    allocatorType: "point",
    allocatorPoint: "stars",
    allocatorRect: "whole",
    placerPoint: "pointsUnaltered",
    placerRect: "distUniform",
    weightAdjuster: "constant",
  };

  t.deepEqual(stars(config, 5), [
    [3, 15],
    [15, 3],
    [15, 15],
    [3, 3],
    [9, 9],
  ]);

  t.deepEqual(stars(config, 8), [
    [3, 15],
    [15, 3],
    [15, 15],
    [3, 3],
    [9, 3],
    [9, 15],
    [3, 9],
    [15, 9],
  ]);

  t.deepEqual(stars(config, 9), [
    [3, 15],
    [15, 3],
    [15, 15],
    [3, 3],
    [9, 9],
    [9, 3],
    [9, 15],
    [3, 9],
    [15, 9],
  ]);
});
