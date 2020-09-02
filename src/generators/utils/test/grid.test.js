import test from "ava";

import Grid from "../grid.js";
import { regionRect } from "../weights.js";

// npm test "./src/generators/utils/test/grid.test.js"

test("Grid.toVh", (t) => {
  t.deepEqual(new Grid([0, 0], [6, 6]).toVh(14), [2, 2]);
  t.deepEqual(new Grid([2, 1], [5, 4]).toVh(5), [3, 3]);
});

test(`
  Grid.valuesAt,
  Grid.apply,
  Grid.applyAt,
  Grid.applyExcept,
  Grid.slice
`, (t) => {
  const gridInit = new Grid([0, 0], [6, 6]);

  const gridApply = gridInit.apply((val) => 2 * val);

  t.is(
    gridApply.values.reduce((acc, val) => acc + val, 0),
    72,
  );

  const gridApplyAt = gridInit.applyAt(
    (val) => 2 * val,
    regionRect([2, 1], [5, 4]),
  );

  t.deepEqual(gridApplyAt.valuesAt(regionRect([3, 3], [6, 5])), [
    2,
    1,
    2,
    1,
    1,
    1,
  ]);

  const gridApplyExcept = gridInit.applyExcept(
    (val) => 2 * val,
    regionRect([2, 1], [5, 4]),
  );

  t.deepEqual(gridApplyExcept.valuesAt(regionRect([3, 3], [6, 5])), [
    1,
    2,
    1,
    2,
    2,
    2,
  ]);

  const gridSlice = gridApplyAt.slice([1, 0], [4, 5]);

  t.is(gridSlice.lengthAlong(0), 3);
  t.is(gridSlice.lengthAlong(1), 5);

  t.deepEqual(gridSlice.valuesAt(regionRect([1, 2], [4, 3])), [1, 2, 2]);
});
