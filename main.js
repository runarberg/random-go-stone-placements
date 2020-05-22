import randomPlacements from "./random-placements.js";
import formatText from "./formats/text.js";
import formatSGF from "./formats/sgf.js";

function main() {
  const form = document.getElementById("generator-form");
  const placementsPre = document.getElementById("placements");
  const downloadAnchor = document.getElementById("download-anchor");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const input = form.querySelector('input[name="stones"]');
    const placements = randomPlacements(input.valueAsNumber * 2);

    placementsPre.textContent = formatText(placements);

    const sgfFile = new File([formatSGF(placements)], "random-start.sgf", {
      type: "application/x-go-sgf",
    });

    downloadAnchor.href = URL.createObjectURL(sgfFile);
  });
}

document.addEventListener("DOMContentLoaded", main);
