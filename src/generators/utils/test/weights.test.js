import test from "ava";

import {
  regionRect,
  circleTaxicabMaker,
  maxRadiusTaxicab,
  medianNonzero,
} from "../weights.js";

// npm test "./src/generators/utils/test/weights.test.js"

test("regionRect", (t) => {
  const insOuts = [
    [
      [ [0, 0], [4, 3] ],
      [
        [0, 0], [0, 1], [0, 2],
        [1, 0], [1, 1], [1, 2],
        [2, 0], [2, 1], [2, 2],
        [3, 0], [3, 1], [3, 2]
      ]
    ],
    [
      [ [2, 3], [5, 5] ],
      [
        [2, 3], [2, 4],
        [3, 3], [3, 4],
        [4, 3], [4, 4]
      ]
    ]
  ];

  insOuts.forEach((inOut) =>
    t.deepEqual(
      regionRect(...(inOut[0])),
      inOut[1]
    )
  );
});

/**
 * @param { number[] } a
 * @param { number[] } b
 * @returns { boolean }
 */
function orderPairs(a, b) {
  return a[0] - b[0] || a[1] - b[1];
}

test("circleTaxicabMaker", (t) => {
  const insOuts = [
    [
      [ [[0, 0], [6, 6]], [[3, 2], 3] ],
      [
        [0, 2], [1, 1], [1, 3], [2, 0], [2, 4], [3, 5],
        [4, 0], [4, 4], [5, 1], [5, 3]
      ]
    ],
    [
      [ [[1, 2], [5, 6]], [[4, 5], 4] ],
      [
        [1, 4], [2, 3], [3, 2]
      ]
    ]
  ];

  insOuts.forEach((inOut) =>
    t.deepEqual(
      circleTaxicabMaker(
        ...(inOut[0][0])
      )(...(inOut[0][1])).sort(orderPairs),
      inOut[1].sort(orderPairs)
    )
  );
});

test("maxRadiusTaxicab", (t) => {
  const insOuts = [
    [
      [ [0, 0], [6, 6], [4, 3] ],
      7
    ],
    [
      [ [2, 1], [5, 5], [4, 1] ],
      5
    ]
  ];

  insOuts.forEach((inOut) =>
    t.is(maxRadiusTaxicab(...inOut[0]), inOut[1])
  );
});

test("medianNonzero", (t) => {
  const insOuts = [
    [
      [9, 7, 3, 6, 3, 1, 8],
      6
    ],
    [
      [3, 5, 8, 2, 9, 1, 6, 4],
      4.5
    ]
  ];

  insOuts.forEach((inOut) =>
    t.is(medianNonzero(inOut[0]), inOut[1])
  );
});
