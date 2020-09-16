import test from "ava";

import Grid from "../../../utils/grid.js";
import { Seeder } from "../../../utils/prob-dist.js";
import weightAdjusters from "../weight-adjusters.js";

/**
 * @typedef { import("../../../main.js").Config } Config
 */

// npm test "./src/placers/rectangle/test/weight-adjusters.test.js"  //

test("constant", (t) => {
  /** @type { Config } */
  const config = {
    seeder: new Seeder(""),
    stones: 0,
    size: 5,
    komi: 0,
    handicap: 0,
    margins: 0,
    preventAdjacent: true,
    allocatorType: "rectangle",
    allocatorPoint: "stars",
    allocatorRect: "whole",
    placerPoint: "pointsUnaltered",
    placerRect: "distUniform",
    weightAdjuster: "constant",
  };

  const weights = new Grid([0, 0], [5, 5]);

  t.deepEqual(weightAdjusters["constant"](config, weights, [3, 2]).values, [
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    0,
    1,
    1,
    1,
    0,
    0,
    0,
    1,
    1,
    1,
    0,
    1,
    1,
  ]);
});

test("linearTaxicabDistance", (t) => {
  /** @type { Config } */
  const config = {
    seeder: new Seeder(""),
    stones: 0,
    size: 5,
    komi: 0,
    handicap: 0,
    margins: 0,
    preventAdjacent: true,
    allocatorType: "rectangle",
    allocatorPoint: "stars",
    allocatorRect: "whole",
    placerPoint: "pointsUnaltered",
    placerRect: "distUniform",
    weightAdjuster: "constant",
  };

  const weights = new Grid([0, 0], [5, 5]);

  t.deepEqual(
    weightAdjusters["linearTaxicabDistance"](config, weights, [3, 2]).values,
    [5, 4, 3, 4, 5, 4, 3, 2, 3, 4, 3, 2, 0, 2, 3, 2, 0, 0, 0, 2, 3, 2, 0, 2, 3],
  );
});
