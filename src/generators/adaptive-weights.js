/**
 * @typedef { import("../main.js").Placement } Placement
 * @typedef { import("../main.js").Config } Config
 * @typedef { [number, number] } Point
 */

import { range, assignPlayers } from "./utils/common.js";
import Grid from "./utils/grid.js";
import {
  regionRect,
  circleTaxicabMaker,
  pickIndex,
  medianNonzero,
  distanceTaxicabMaker,
} from "./utils/weights.js";

/**
 * @param { number } totalStones
 * @param { Config } config
 * @returns { Placement[] }
 */
export default function adaptiveWeights(
  totalStones,
  { size, margins, handicap, preventAdjacent },
) {
  const separation = preventAdjacent ? 1 : 0;

  /** @type { Point } */
  const start = [margins, margins];
  /** @type { Point } */
  const end = [size - margins, size - margins];

  const circleTaxicab = circleTaxicabMaker(start, end);

  /** @type { Point[] } */
  const stones = [];

  range(0, totalStones).reduce(
    (weights) => {
      const stone = weights.toVh(pickIndex(weights.values));
      stones.push(stone);

      const distanceTaxicab = distanceTaxicabMaker(stone);

      const weightsNew = weights
        // exclude within separation
        .applyAt(
          () => 0,
          range(0, separation + 1).flatMap((radius) =>
            circleTaxicab(stone, radius),
          ),
        )
        // multiply weight by taxicab distance
        .apply(
          /** @type { (wgt: number, idx: number) => number } */
          (wgt, idx) => wgt * distanceTaxicab(weights.toVh(idx)),
        );

      // cut off peaks if too high
      const weightMax = 2 * medianNonzero(weightsNew.values);
      return weightsNew.apply((wgt) => Math.min(wgt, weightMax));
    },
    // exclude margins
    new Grid([0, 0], [size, size]).applyExcept(() => 0, regionRect(start, end)),
  );

  return assignPlayers(
    stones.map(
      ([v, h]) =>
        // make coordinates start at 1 instead of 0
        /** @type { Point } */
        ([1 + v, 1 + h]),
    ),
    handicap,
  );
}
