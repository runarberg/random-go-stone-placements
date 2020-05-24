import randomPlacements from "./random-placements.js";
import formatText from "./formats/text.js";
import formatSGF from "./formats/sgf.js";
import drawSVG from "./formats/svg.js";

function createSGFFile(downloadAnchor, sgf) {
  const sgfFile = new File(
    [sgf],
    "random-start.sgf",
   {      type: "application/x-go-sgf",    }
  );

  if (downloadAnchor.href) {
    URL.revokeObjectURL(downloadAnchor.href);
  }

  downloadAnchor.href = URL.createObjectURL(sgfFile);
  downloadAnchor.download = sgfFile.name;
}

function main() {
  const form = document.getElementById("generator-form");
  const svg = document.getElementById("demo-board");
  const outputData = document.getElementById("output-data");
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

    outputData.value = JSON.stringify({ ...formData, placements });
    placementsPre.textContent = formatText(placements);
    drawSVG(svg, placements, formData);
    createSGFFile(downloadAnchor, formatSGF(placements, formData));
  });

  // Fix the komi in sgf file in change
  form.komi.addEventListener('change', () => {
    if (!outputData.value) {
      return;
    }

    const { placements, ...data } = JSON.parse(outputData.value);
    data.komi = form.komi.valueAsNumber;

    outputData.value = JSON.stringify({ ...data, placements });
    createSGFFile(downloadAnchor, formatSGF(placements, data));
  });
}

document.addEventListener("DOMContentLoaded", main);
