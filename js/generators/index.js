import dominoShuffle from "./domino-shuffle.js";
import quadrantShuffle from "./quadrant-shuffle.js";
import uniform from "./uniform.js";
import adaptiveWeights from "./adaptive-weights.js";

/**
 * @typedef { import("../main.js").Config } Config
 * @typedef { import("../main.js").Placement } Placement
 *
 * @typedef { "dominoShuffle" | "quadrantShuffle" | "uniform" | "adaptiveWeights" } Generator
 */

// eslint-disable-next-line jsdoc/valid-types
/**
 * @type { { [name in Generator]: (numStones: number, config: Config) =>  Placement[]} }
 */
const generators = {
  dominoShuffle,
  quadrantShuffle,
  uniform,
  adaptiveWeights,
};

export default generators;
