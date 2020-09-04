import test from "ava";

//import dominoes from "../dominoes.js";

/**
 * @typedef { import("../../index.js").Allocation } Allocation
 * @typedef { import("../../../../main.js").Config } Config
 */

// npm test "./src/generators/allocators/regions/test/dominoes.test.js"

test("dominoes", (t) => {
  // only 'size', 'margins', and 'preventAdjacent' are used
  /** @type { Config } */
  /*
  const config = {
    stones: 0,
    size: 19,
    komi: 0,
    handicap: 0,
    margins: 2,
    preventAdjacent: true,
    generator: "uniform",
  };

  dominoes(7, config, true).weights.consoleLog();
  */

  t.pass();
});
