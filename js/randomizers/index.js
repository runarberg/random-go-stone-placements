import dominoShuffle from "./domino-shuffle.js";
import quadrantShuffle from "./quadrant-shuffle.js";
import uniform from "./uniform.js";
import weightField from "./weight-field.js";

/**
 * @typedef { import("../main.js").Config } Config
 * @typedef { import("../main.js").Placement } Placement
 *
 * @typedef { "dominoShuffle" | "quadrantShuffle" | "uniform" | "weightField" } Randomizer
 */

// eslint-disable-next-line jsdoc/valid-types
/**
 * @type { { [name in Randomizer]: (numStones: number, config: Config) =>  Placement[]} }
 */
const randomizers = {
  dominoShuffle,
  quadrantShuffle,
  uniform,
  weightField,
};

export default randomizers;