import test from "ava";

import formatText from "./text.js";

test("empty", (t) => {
  t.is(formatText([]), "");
});

test("omits the i from the latin column", (t) => {
  t.is(formatText([{ col: 8, row: 19, player: "B" }]), "1: B H1");
  t.is(formatText([{ col: 9, row: 19, player: "W" }]), "1: W J1");
});

test("map the lower right to the upper right quadrant", (t) => {
  t.is(formatText([{ col: 1, row: 1, player: "B" }]), "1: B A19");
  t.is(formatText([{ col: 19, row: 1, player: "W" }]), "1: W T19");
  t.is(formatText([{ col: 1, row: 19, player: "B" }]), "1: B A1");
  t.is(formatText([{ col: 19, row: 19, player: "W" }]), "1: W T1");
});

test("newlines between placements", (t) => {
  t.is(
    formatText([
      { col: 16, row: 4, player: "B" },
      { col: 4, row: 4, player: "W" },
      { col: 16, row: 16, player: "B" },
      { col: 4, row: 16, player: "W" },
    ]),
    "1: B Q16\n2: W D16\n3: B Q4\n4: W D4",
  );
});
