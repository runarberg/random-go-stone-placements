import randomPlacements from "./random-placements.js";
import formatText from "./formats/text.js";
import formatSGF from "./formats/sgf.js";
import drawSVG from "./formats/svg.js";

function main() {
  const form = document.getElementById("generator-form");
  const svg = document.getElementById("demo-board");
  const placementsPre = document.getElementById("placements");
  const downloadAnchor = document.getElementById("download-anchor");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const stones = form.querySelector('input[name="stones"]');
    const quadrantShuffle = form.querySelector('input[name="quadrant-shuffle"]').checked;
    const placements = randomPlacements(stones.valueAsNumber * 2, { quadrantShuffle });

    placementsPre.textContent = formatText(placements);
    drawSVG(svg, placements);

    const sgfFile = new File([formatSGF(placements)], "random-start.sgf", {
      type: "application/x-go-sgf",
    });

    downloadAnchor.href = URL.createObjectURL(sgfFile);
  });
}

document.addEventListener("DOMContentLoaded", main);
