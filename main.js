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

    const formData = {
      stones: form.stones.valueAsNumber,
      size: form.size.valueAsNumber,
      komi: form.komi.valueAsNumber,
      handicap: form.handicap.valueAsNumber,
      margins: form.margins.valueAsNumber,
      preventAdjacent: form.preventAdjacent.checked,
      quadrantShuffle: form.quadrantShuffle.checked,
    };

    const placements = randomPlacements(
      formData.handicap + formData.stones * 2,
      formData
    );

    placementsPre.textContent = formatText(placements);
    drawSVG(svg, placements, formData);

    const sgfFile = new File(
      [formatSGF(placements, formData)],
      "random-start.sgf",
      {
        type: "application/x-go-sgf",
      }
    );

    downloadAnchor.href = URL.createObjectURL(sgfFile);
    downloadAnchor.download = sgfFile.name;
  });
}

document.addEventListener("DOMContentLoaded", main);
