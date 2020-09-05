import test from "ava";

import stars from "../stars.js";

/**
 * @typedef { import("../../../../main.js").Config } Config
 */

// npm test "./src/generators/allocators/points/test/stars.test.js"

test("stars", (t) => {
  // only 'size' is used
  /** @type { Config } */
  const config = {
    stones: 0,
    size: 19,
    komi: 0,
    handicap: 0,
    margins: 0,
    preventAdjacent: false,
    generator: "uniform",
  };

  t.deepEqual(stars(5, config), [
    [3, 15],
    [15, 3],
    [15, 15],
    [3, 3],
    [9, 9],
  ]);

  t.deepEqual(stars(8, config), [
    [3, 15],
    [15, 3],
    [15, 15],
    [3, 3],
    [9, 3],
    [9, 15],
    [3, 9],
    [15, 9],
  ]);

  t.deepEqual(stars(12, config), [
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
