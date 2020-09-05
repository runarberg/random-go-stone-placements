import test from "ava";

import {
  regionRect,
  circleTaxicabMaker,
  medianNonzero,
  distanceToBoundaryMaker,
  distanceTaxicabMaker,
  testablesUnexported,
} from "../weights.js";

// npm test "./src/utils/test/weights.test.js"

test("regionRect", (t) => {
  t.deepEqual(regionRect([0, 0], [4, 3]), [
    [0, 0],
    [0, 1],
    [0, 2],
    [1, 0],
    [1, 1],
    [1, 2],
    [2, 0],
    [2, 1],
    [2, 2],
    [3, 0],
    [3, 1],
    [3, 2],
  ]);
  t.deepEqual(regionRect([2, 3], [5, 5]), [
    [2, 3],
    [2, 4],
    [3, 3],
    [3, 4],
    [4, 3],
    [4, 4],
  ]);
});

test("circleTaxicabMaker", (t) => {
  t.deepEqual(circleTaxicabMaker([0, 0], [6, 6])([3, 2], 3), [
    [0, 2],
    [1, 1],
    [1, 3],
    [2, 0],
    [2, 4],
    [3, 5],
    [4, 0],
    [4, 4],
    [5, 1],
    [5, 3],
  ]);
  t.deepEqual(circleTaxicabMaker([1, 2], [5, 6])([4, 5], 4), [
    [1, 4],
    [2, 3],
    [3, 2],
  ]);
  t.deepEqual(circleTaxicabMaker([0, 0], [6, 6])([3, 2], 0), [[3, 2]]);
});

test("cumulative", (t) => {
  const { cumulative } = testablesUnexported;
  t.deepEqual(cumulative([5, 6, 4, 2]), [5, 11, 15, 17]);
});

test("medianNonzero", (t) => {
  t.is(medianNonzero([9, 7, 3, 6, 3, 1, 8]), 6);
  t.is(medianNonzero([3, 5, 8, 2, 9, 1, 6, 4]), 4.5);
});

test("distanceToBoundaryMaker", (t) => {
  const distanceToBoundaryNoOuter = distanceToBoundaryMaker([0, 0], [6, 5]);

  t.is(distanceToBoundaryNoOuter([3, 2]), 3);
  t.is(distanceToBoundaryNoOuter([2, 2]), 3);
  t.is(distanceToBoundaryNoOuter([2, 3]), 2);
  t.is(distanceToBoundaryNoOuter([3, 3]), 2);
  t.is(distanceToBoundaryNoOuter([3, 4]), 1);

  const distanceToBoundaryWithOuter = distanceToBoundaryMaker(
    [1, 0],
    [5, 5],
    [0, 0],
    [6, 5],
  );

  t.is(distanceToBoundaryWithOuter([2, 2]), 2);
  t.is(distanceToBoundaryWithOuter([2, 0]), 2);
  t.is(distanceToBoundaryWithOuter([3, 2]), 2);
  t.is(distanceToBoundaryWithOuter([3, 3]), 2);
  t.is(distanceToBoundaryWithOuter([3, 4]), 2);
  t.is(distanceToBoundaryWithOuter([4, 3]), 1);
});

test("distanceTaxicabMaker", (t) => {
  const distanceTaxicab = distanceTaxicabMaker([3, 2]);

  t.is(distanceTaxicab([6, 5]), 6);
  t.is(distanceTaxicab([0, 1]), 4);
});
