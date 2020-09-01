import test from "ava";

import { range } from "../common.js";

// npm test "./src/generators/utils/test/common.test.js"

test("range", (t) => {
  const insOuts = [
    [ [0, 5], [0, 1, 2, 3, 4] ],
    [ [2, 6], [2, 3, 4, 5] ],
    [ [3, 3], [] ]
  ];

  insOuts.forEach((inOut) =>
    t.deepEqual(range(...inOut[0]), inOut[1])
  );
});
