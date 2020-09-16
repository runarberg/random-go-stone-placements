import test from "ava";

import { Seeder } from "../../../utils/prob-dist.js";
import { testablesUnexported } from "../loose-taxicab-circle-packing.js";

/**
 * @typedef { import("../../../main.js").Config } Config
 *
 * @typedef { [number, number] } Point
 */

// npm test "./src/allocators/point/test/loose-taxicab-circle-packing.test.js"  //

test("calcSparsities", (t) => {
  const { calcSparsities } = testablesUnexported;

  /** @type { Config } */
  const config = {
    seeder: new Seeder(""),
    stones: 0,
    size: 19,
    komi: 0,
    handicap: 0,
    margins: 2,
    preventAdjacent: false,
    allocatorType: "point",
    allocatorPoint: "stars",
    allocatorRect: "whole",
    placerPoint: "pointsUnaltered",
    placerRect: "distUniform",
    weightAdjuster: "constant",
  };

  /** @type { Point } */
  const originTest = [9, 8];

  /** @type { Point[] } */
  const stonesTest = [
    originTest,
    [9, 7],
    [8, 8],
    [9, 6],
    [8, 9],
    [6, 8],
    [10, 6],
    [11, 9],
    [6, 9],
    [8, 5],
    [11, 10],
  ];

  t.deepEqual(calcSparsities(config, stonesTest, originTest, 1), {
    neighbors: [
      [-1, 0],
      [0, -1],
      [0, 1],
      [1, 0],
    ],
    sparsities: [0, 0, 1, 1],
  });

  t.deepEqual(calcSparsities(config, stonesTest, originTest, 2), {
    neighbors: [
      [-1, 0],
      [0, -1],
      [0, 1],
      [1, 0],
    ],
    sparsities: [1, 0, 1, 2],
  });

  t.deepEqual(calcSparsities(config, stonesTest, originTest, 3), {
    neighbors: [
      [-1, 0],
      [0, -1],
      [0, 1],
      [1, 0],
    ],
    sparsities: [0, 1, 2, 0],
  });

  t.deepEqual(calcSparsities(config, stonesTest, originTest, 4), {
    neighbors: [
      [-1, 0],
      [0, -1],
      [0, 1],
      [1, 0],
    ],
    sparsities: [0, 1, 1, 2],
  });

  t.is(calcSparsities(config, stonesTest, originTest, 5), null);
});

test("incrementAtBoundary", (t) => {
  const { incrementAtBoundary } = testablesUnexported;

  const nums0 = [1, 1, 1, 0, 0];

  const nums1 = incrementAtBoundary(nums0);
  t.deepEqual(nums1, [1, 1, 1, 1, 0]);

  const nums2 = incrementAtBoundary(nums1);
  t.deepEqual(nums2, [1, 1, 1, 1, 1]);

  const nums3 = incrementAtBoundary(nums2);
  t.deepEqual(nums3, [2, 1, 1, 1, 1]);
});

test("deepcopyArray", (t) => {
  const { deepcopyArray } = testablesUnexported;

  /** @type { Point[] } */
  const arr0 = [
    [0, 2],
    [3, 5],
    [6, 8],
  ];

  const arr1 = deepcopyArray(arr0);

  arr1[1][0] *= 2;

  t.is(arr0[1][0], 3);
  t.is(arr1[1][0], 6);
});
