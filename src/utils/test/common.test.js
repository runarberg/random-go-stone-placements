import test from "ava";

import { range } from "../common.js";

// npm test "./src/utils/test/common.test.js"

test("range", (t) => {
  t.deepEqual(range(0, 5), [0, 1, 2, 3, 4]);
  t.deepEqual(range(2, 6), [2, 3, 4, 5]);
  t.deepEqual(range(3, 3), []);
});
