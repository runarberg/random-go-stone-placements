import test from "ava";

//import dominoes, { initWeightsDominoes } from "../dominoes.js";

/**
 * @typedef { import("../../../../main.js").Config } Config
 */

// To test, remove commenting before import and inside test
//
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

  initWeightsDominoes(config.size, dominoes(7, config)).consoleLog();
  */

  t.pass();
});
