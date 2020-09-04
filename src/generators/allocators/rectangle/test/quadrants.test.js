import test from "ava";

import { regionRect } from "../../../utils/weights.js";
import quadrants, { initWeightsQuadrants } from "../quadrants.js";

/**
 * @typedef { import("../../../../main.js").Config } Config
 *
 * @typedef { [number, number] } Point
 * @typedef { [Point, Point] } Rectangle
 */

// npm test "./src/generators/allocators/regions/test/quadrants.test.js"

test("quadrants", (t) => {
  // only 'size' and 'margins' are used
  /** @type { Config } */
  const configOdd = {
    stones: 0,
    size: 19,
    komi: 0,
    handicap: 0,
    margins: 2,
    preventAdjacent: false,
    generator: "uniform",
  };

  // first argument 'numStone' is not used
  const weightsOdd = initWeightsQuadrants(
    configOdd.size,
    quadrants(0, configOdd),
  );

  t.deepEqual(weightsOdd.valuesAt(regionRect([0, 8], [4, 11])), [
    0,
    0,
    0,
    0,
    0,
    0,
    8,
    4,
    8,
    8,
    4,
    8,
  ]);

  t.deepEqual(weightsOdd.valuesAt(regionRect([8, 8], [11, 11])), [
    8,
    4,
    8,
    4,
    1,
    4,
    8,
    4,
    8,
  ]);

  // only 'size' and 'margins' are used
  /** @type { Config } */
  const configEven = {
    stones: 0,
    size: 20,
    komi: 0,
    handicap: 0,
    margins: 2,
    preventAdjacent: false,
    generator: "uniform",
  };

  // first argument 'numStone' is not used
  const weightsEven = initWeightsQuadrants(
    configEven.size,
    quadrants(0, configEven),
  );

  t.deepEqual(weightsEven.valuesAt(regionRect([0, 8], [4, 11])), [
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    1,
    1,
    1,
    1,
    1,
  ]);

  t.deepEqual(weightsEven.valuesAt(regionRect([8, 8], [11, 11])), [
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
  ]);
});
