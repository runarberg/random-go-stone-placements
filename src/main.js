import allocatorsPoint from "./allocators/point/index.js";
import allocatorsRect from "./allocators/rectangle/index.js";
import formatSGF, { createSGFFile } from "./formats/sgf.js";
import drawSVG from "./formats/svg.js";
import formatText from "./formats/text.js";
import placersPoint from "./placers/point/index.js";
import placersRect from "./placers/rectangle/index.js";
import { preparePlacements } from "./utils/common.js";

/**
 * @typedef { import("./allocators/point/index.js").AllocatorPoint } AllocatorPoint
 * @typedef { import("./allocators/rectangle/index.js").AllocatorRect } AllocatorRect
 * @typedef { import("./placers/point/index.js").PlacerPoint } PlacerPoint
 * @typedef { import("./placers/rectangle/index.js").PlacerRect } PlacerRect
 * @typedef { import("./placers/rectangle/weight-adjusters.js").WeightAdjuster } WeightAdjuster
 *
 * @typedef { [number, number] } Point
 *
 * @typedef { object } Placement - A specific stone placement
 * @property { number } col - The column number
 * @property { number } row - The row number
 * @property { "B" | "W" } player - Which color stone
 *
 * @typedef { object } Config - Configuration data from the form inputs
 * @property { number } stones - Number of stones each
 * @property { number } size - The size of the board
 * @property { number } komi - Points given to white at the beginning
 * @property { number } handicap - How many extra stones for black
 * @property { number } margins - How many stone free lines from the edge
 * @property { boolean } preventAdjacent - Prevent putting stone adjacent to an existing stone
 * @property { string } allocatorType - Pre-allocate into points or rectangles?
 * @property { AllocatorPoint } allocatorPoint - Which point-based pre-allocation method to use
 * @property { AllocatorRect } allocatorRect - Which rectangle-based pre-allocation method to use
 * @property { PlacerPoint } placerPoint - Which point-based placement method to use
 * @property { PlacerRect } placerRect - Which rectangle-based placement method to use
 * @property { WeightAdjuster } weightAdjuster - If using weight-based placement method, how to adjust weights
 */

// @ts-ignore
import("focus-visible").catch((error) => {
  /* eslint-disable no-console */
  console.warn("Failed to import focus-visible");
  console.error(error);
  /* eslint-enable no-console */
});

/**
 * @param { Placement[] } placements
 * @param { object } config
 * @returns { URLSearchParams }
 */
function formatSearchParams(placements, config) {
  return new URLSearchParams([
    ...Object.entries(config),
    [
      "placements",
      placements
        .map(
          ({ col, row, player }) =>
            `${player}[${String.fromCharCode(0x60 + col)}${String.fromCharCode(
              0x60 + row,
            )}]`,
        )
        .join(""),
    ],
  ]);
}

/**
 * @param { HTMLOutputElement } output
 * @param { Placement[] } placements
 * @param { Config } config
 */
function setOutput(output, placements, config) {
  const outputData = output.querySelector("data");
  const outputPre = output.querySelector("pre");

  if (outputData && outputPre) {
    outputData.value = JSON.stringify({ ...config, placements });
    outputPre.textContent = formatText(placements);
  }

  const boardSVG = document.getElementById("demo-board");

  if (boardSVG instanceof SVGSVGElement) {
    drawSVG(boardSVG, placements, config);
  }

  const downloadAnchor = document.getElementById("download-anchor");

  if (downloadAnchor instanceof HTMLAnchorElement) {
    createSGFFile(downloadAnchor, formatSGF(placements, config));
  }
}

/**
 * @param { HTMLFormElement } form
 * @returns { Config }
 */
function getConfig(form) {
  const { elements } = form;
  const stones = elements.namedItem("stones");
  const size = elements.namedItem("size");
  const komi = elements.namedItem("komi");
  const handicap = elements.namedItem("handicap");
  const margins = elements.namedItem("margins");
  const preventAdjacent = elements.namedItem("preventAdjacent");
  const allocatorType = elements.namedItem("allocatorType");
  const allocatorPoint = elements.namedItem("allocatorPoint");
  const allocatorRect = elements.namedItem("allocatorRect");
  const placerPoint = elements.namedItem("placerPoint");
  const placerRect = elements.namedItem("placerRect");
  const weightAdjuster = elements.namedItem("weightAdjuster");

  if (
    !(stones instanceof HTMLInputElement) ||
    !(size instanceof HTMLInputElement) ||
    !(komi instanceof HTMLInputElement) ||
    !(handicap instanceof HTMLInputElement) ||
    !(margins instanceof HTMLInputElement) ||
    !(preventAdjacent instanceof HTMLInputElement) ||
    !(allocatorType instanceof RadioNodeList) ||
    !(allocatorPoint instanceof RadioNodeList) ||
    !(allocatorRect instanceof RadioNodeList) ||
    !(placerPoint instanceof RadioNodeList) ||
    !(placerRect instanceof RadioNodeList) ||
    !(weightAdjuster instanceof RadioNodeList)
  ) {
    throw new Error("DOM Failure");
  }

  const allocatorTypeValue = allocatorType.value;
  const allocatorPointValue = allocatorPoint.value;
  const allocatorRectValue = allocatorRect.value;
  const placerPointValue = placerPoint.value;
  const placerRectValue = placerRect.value;
  const weightAdjusterValue = weightAdjuster.value;

  if (allocatorTypeValue !== "point" && allocatorTypeValue !== "rectangle") {
    throw new Error("Allocator type not supported");
  }

  if (
    allocatorPointValue !== "stars" &&
    allocatorPointValue !== "looseTaxicabCirclePacking"
  ) {
    throw new Error("This point-based allocator not supported");
  }

  if (
    allocatorRectValue !== "whole" &&
    allocatorRectValue !== "quadrants" &&
    allocatorRectValue !== "dominoes"
  ) {
    throw new Error("This rectangle-based allocator not supported");
  }

  if (placerPointValue !== "pointsUnaltered" && placerPointValue !== "dummy") {
    throw new Error("This point-based placer not supported");
  }

  if (
    placerRectValue !== "distUniform" &&
    placerRectValue !== "weightsUniform" &&
    placerRectValue !== "weightsStair"
  ) {
    throw new Error("This rectangle-based placer not supported");
  }

  if (
    weightAdjusterValue !== "constant" &&
    weightAdjusterValue !== "linearTaxicabDistance"
  ) {
    throw new Error("Weight adjuster not supported");
  }

  return {
    stones: stones.valueAsNumber,
    size: size.valueAsNumber,
    komi: komi.valueAsNumber,
    handicap: handicap.valueAsNumber,
    margins: margins.valueAsNumber,
    preventAdjacent: preventAdjacent.checked,
    allocatorType: allocatorTypeValue,
    allocatorPoint: allocatorPointValue,
    allocatorRect: allocatorRectValue,
    placerPoint: placerPointValue,
    placerRect: placerRectValue,
    weightAdjuster: weightAdjusterValue,
  };
}

/**
 * @param { Event } event
 */
function handleSubmit(event) {
  event.preventDefault();

  const form = event.target;

  if (!(form instanceof HTMLFormElement)) {
    throw new Error("DOM failure");
  }

  const config = getConfig(form);
  const totalStones = config.handicap + config.stones * 2;

  /** @type { Point[] } */
  let stones;

  if (config.allocatorType === "point") {
    const allocation = allocatorsPoint[config.allocatorPoint](
      config,
      totalStones,
    );
    stones = placersPoint[config.placerPoint](config, allocation);
  } else if (config.allocatorType === "rectangle") {
    const allocation = allocatorsRect[config.allocatorRect](
      config,
      totalStones,
    );
    stones = placersRect[config.placerRect](config, allocation);
  } else {
    throw new Error("Unsupported allocator type");
  }

  const placements = preparePlacements(stones, config.handicap);
  const output = form.elements.namedItem("placements");
  if (!(output instanceof HTMLOutputElement)) {
    throw new Error("DOM failure");
  }

  setOutput(output, placements, config);

  window.history.replaceState(
    null,
    "",
    `?${formatSearchParams(placements, config)}`,
  );
}

/**
 * Fix the komi in sgf file in change
 *
 * @param { Event } event
 */
function handleKomiChange(event) {
  const input = event.target;
  if (!(input instanceof HTMLInputElement)) {
    throw new Error("DOM failure");
  }

  const { form } = input;
  if (!(form instanceof HTMLFormElement)) {
    throw new Error("DOM failure");
  }

  const output = form.elements.namedItem("placements");
  if (!(output instanceof HTMLOutputElement)) {
    throw new Error("DOM failure");
  }

  const outputData = output.querySelector("data");
  if (!outputData) {
    throw new Error("DOM failure");
  }

  if (!outputData.value) {
    return;
  }

  const { placements, ...data } = JSON.parse(outputData.value);

  data.komi = form.komi.valueAsNumber;
  outputData.value = JSON.stringify({ ...data, placements });

  const anchor = document.getElementById("download-anchor");

  if (!(anchor instanceof HTMLAnchorElement)) {
    throw new Error("DOM failure");
  }

  createSGFFile(anchor, formatSGF(placements, data));
  window.history.replaceState(
    null,
    "",
    `?${formatSearchParams(placements, data)}`,
  );
}

/**
 *
 */
function main() {
  const { searchParams } = new URL(window.location.href);
  const form = document.getElementById("generator-form");

  if (!(form instanceof HTMLFormElement)) {
    throw new Error("DOM not ready");
  }

  /** @type { Placement[] } */
  let placements = [];

  for (const [name, value] of searchParams) {
    if (name === "placements") {
      placements = value
        .split("]")
        .slice(0, -1)
        .map((str) => {
          const [player, coord] = str.split("[");

          if (player !== "B" && player !== "W") {
            throw new Error("Illegal SGF. player must be B or W");
          }

          if (!coord || coord.length !== 2) {
            throw new Error("Illegal SGF. Coordinate must be two letters");
          }

          return {
            player,
            col: (coord.codePointAt(0) ?? 0) - 0x60,
            row: (coord.codePointAt(1) ?? 0) - 0x60,
          };
        });

      continue;
    }

    const field = form.elements.namedItem(name);

    if (!field) {
      continue;
    }

    if (field instanceof HTMLInputElement && field.type === "checkbox") {
      field.checked = value === "true";
    } else if (
      field instanceof HTMLInputElement ||
      field instanceof RadioNodeList
    ) {
      field.value = value;
    }
  }

  const output = form.elements.namedItem("placements");
  if (!(output instanceof HTMLOutputElement)) {
    throw new Error("DOM failure");
  }

  setOutput(output, placements, getConfig(form));

  form.addEventListener("submit", handleSubmit);

  const komiEl = form.elements.namedItem("komi");
  if (komiEl instanceof HTMLElement) {
    komiEl.addEventListener("change", handleKomiChange);
  }
}

document.addEventListener("DOMContentLoaded", main);
