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
  Grid.applyAt,
  Grid.slice
`, (t) => {
  const grid0 = new Grid([0, 0], [6, 6]);

  const grid1 = grid0.applyAt((val) => 2 * val, regionRect([2, 1], [5, 4]));

  t.deepEqual(grid1.valuesAt(regionRect([3, 3], [6, 5])), [2, 1, 2, 1, 1, 1]);

  const grid2 = grid1.slice([1, 0], [4, 5]);

  t.is(grid2.lengthAlong(0), 3);
  t.is(grid2.lengthAlong(1), 5);

  t.deepEqual(grid2.valuesAt(regionRect([1, 2], [4, 3])), [1, 2, 2]);
});
