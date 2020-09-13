import allocators from "./allocators/index.js";
import placers from "./placers/index.js";

/**
 * @typedef { [number, number] } Stone
 * @param { import("./main.js").Config } config
 * @returns { Stone[] }
 */
export default function genearte(config) {
  const { allocator, generator, placer } = config;

  if (!allocator) {
    throw new Error("No allocator defined");
  }

  const totalStones = config.handicap + config.stones * 2;

  if (
    generator === "point" &&
    (allocator === "stars" || allocator === "looseTaxicabCirclePacking") &&
    (placer === "pointsUnaltered" || placer === "dummy")
  ) {
    const allocate = allocators[generator][allocator];
    const place = placers[generator][placer];

    const allocations = allocate(config, totalStones);

    return place(config, allocations);
  }

  if (
    generator === "rectangle" &&
    (allocator === "whole" ||
      allocator === "quadrants" ||
      allocator === "dominoes") &&
    (placer === "distUniform" ||
      placer === "weightsUniform" ||
      placer === "weightsStair")
  ) {
    const allocate = allocators[generator][allocator];
    const place = placers[generator][placer];

    const allocations = allocate(config, totalStones);

    return place(config, allocations);
  }

  throw new Error("allocator not exist in generator");
}
