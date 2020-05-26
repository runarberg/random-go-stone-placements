import randomPlacements from "./random-placements.js";
import formatText from "./formats/text.js";
import formatSGF from "./formats/sgf.js";
import drawSVG from "./formats/svg.js";

import("https://cdn.jsdelivr.net/npm/focus-visible@5").catch((error) => {
  console.warn("Failed to import focus-visible");
  console.error(error);
});

function createSGFFile(downloadAnchor, sgf) {
  const sgfFile = new File([sgf], "random-start.sgf", {
    type: "application/x-go-sgf",
  });

  if (downloadAnchor.href) {
    URL.revokeObjectURL(downloadAnchor.href);
  }

  downloadAnchor.href = URL.createObjectURL(sgfFile);
  downloadAnchor.download = sgfFile.name;
}

function formatSearchParams(placements, formData) {
  return new URLSearchParams([
    ...Object.entries(formData),
    [
      "placements",
      placements
        .map(
          ({ col, row, player }) =>
            `${player}[${String.fromCharCode(0x60 + col)}${String.fromCharCode(
              0x60 + row
            )}]`
        )
        .join(""),
    ],
  ]);
}

function setOutput(output, placements, data) {
  const outputData = output.querySelector("data");
  const outputPre = output.querySelector("pre");

  outputData.value = JSON.stringify({ ...data, placements });
  outputPre.textContent = formatText(placements);

  drawSVG(document.getElementById("demo-board"), placements, data);

  createSGFFile(
    document.getElementById("download-anchor"),
    formatSGF(placements, data)
  );
}

function getFormData(form) {
  return {
    stones: form.stones.valueAsNumber,
    size: form.size.valueAsNumber,
    komi: form.komi.valueAsNumber,
    handicap: form.handicap.valueAsNumber,
    margins: form.margins.valueAsNumber,
    preventAdjacent: form.preventAdjacent.checked,
    quadrantShuffle: form.quadrantShuffle.checked,
  };
}

function handleSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const formData = getFormData(form);

  const placements = randomPlacements(
    formData.handicap + formData.stones * 2,
    formData
  );

  setOutput(form.placements, placements, formData);

  window.history.replaceState(
    null,
    "",
    `?${formatSearchParams(placements, formData)}`
  );
}

// Fix the komi in sgf file in change
function handleKomiChange(event) {
  const { form } = event.target;
  const output = form.placements;
  const outputData = output.querySelector("data");

  if (!outputData.value) {
    return;
  }

  const { placements, ...data } = JSON.parse(outputData.value);

  data.komi = form.komi.valueAsNumber;
  outputData.value = JSON.stringify({ ...data, placements });

  createSGFFile(
    document.getElementById("download-anchor"),
    formatSGF(placements, data)
  );

  window.history.replaceState(
    null,
    "",
    `?${formatSearchParams(placements, data)}`
  );
}

function main() {
  const { searchParams } = new URL(window.location);
  const form = document.getElementById("generator-form");
  let placements;

  for (const [name, value] of searchParams) {
    if (name === "placements") {
      placements = value
        .split("]")
        .slice(0, -1)
        .map((str) => {
          const [player, coord] = str.split("[");

          return {
            player,
            col: coord.codePointAt(0) - 0x60,
            row: coord.codePointAt(1) - 0x60,
          };
        });
    } else if (form[name].type === "checkbox") {
      form[name].checked = value === "true";
    } else {
      form[name].value = value;
    }

    if (placements) {
      setOutput(form.placements, placements, getFormData(form));
    }
  }

  form.addEventListener("submit", handleSubmit);
  form.komi.addEventListener("change", handleKomiChange);
}

document.addEventListener("DOMContentLoaded", main);
