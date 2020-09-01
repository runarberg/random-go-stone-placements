import test from "ava";

import {
  regionRect,
  circleTaxicabMaker,
  maxRadiusTaxicab,
  medianNonzero,
} from "../weights.js";

// npm test "./src/generators/utils/test/weights.test.js"

test("regionRect", (t) => {
  t.deepEqual(regionRect([0, 0], [4, 3]), [
    [0, 0], [0, 1], [0, 2],
    [1, 0], [1, 1], [1, 2],
    [2, 0], [2, 1], [2, 2],
    [3, 0], [3, 1], [3, 2]
  ]);
  t.deepEqual(regionRect([2, 3], [5, 5]), [
    [2, 3], [2, 4],
    [3, 3], [3, 4],
    [4, 3], [4, 4]
  ]);
});

/**
 * @param { [number, number] } a
 * @param { [number, number] } b
 * @returns { number }
 */
function orderPairs(a, b) {
  return a[0] - b[0] || a[1] - b[1];
}

test("circleTaxicabMaker", (t) => {
  t.deepEqual(
    circleTaxicabMaker([0, 0], [6, 6])([3, 2], 3).sort(orderPairs), [
      [0, 2], [1, 1], [1, 3], [2, 0], [2, 4], [3, 5],
      [4, 0], [4, 4], [5, 1], [5, 3]
    ]
  );
  t.deepEqual(
    circleTaxicabMaker([1, 2], [5, 6])([4, 5], 4).sort(orderPairs), [
      [1, 4], [2, 3], [3, 2]
    ]
  );
});

test("maxRadiusTaxicab", (t) => {
  t.is(maxRadiusTaxicab([0, 0], [6, 6], [4, 3]), 7);
  t.is(maxRadiusTaxicab([2, 1], [5, 5], [4, 1]), 5);
});

test("medianNonzero", (t) => {
  t.is(medianNonzero([9, 7, 3, 6, 3, 1, 8]), 6);
  t.is(medianNonzero([3, 5, 8, 2, 9, 1, 6, 4]), 4.5);
});
