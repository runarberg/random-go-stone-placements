import ava from "ava"; // eslint-disable-line ava/use-test
import sinon from "sinon";

import formatSGF, { createSGFFile } from "./sgf.js";

/**
 * @typedef { import("ava").TestInterface<{ clock: import("sinon").SinonFakeTimers }> } Test
 */

const test = /** @type { Test } */ (ava);

test.beforeEach((t) => {
  t.context.clock = sinon.useFakeTimers(new Date("1933-10-16"));
});

test.afterEach((t) => {
  t.context.clock.restore();
});

test("no placements", (t) => {
  t.is(
    formatSGF([], { komi: 6.5, size: 19 }),
    "(;GM[1]FF[4]CA[UTF-8]AP[random-go-stones:1.0.0]KM[6.5]SZ[19]DT[1933-10-16])",
  );
});

test("custom size", (t) => {
  t.is(
    formatSGF([], { komi: 6.5, size: 13 }),
    "(;GM[1]FF[4]CA[UTF-8]AP[random-go-stones:1.0.0]KM[6.5]SZ[13]DT[1933-10-16])",
  );
});

test("custom komi", (t) => {
  t.is(
    formatSGF([], { komi: 0, size: 19 }),
    "(;GM[1]FF[4]CA[UTF-8]AP[random-go-stones:1.0.0]KM[0]SZ[19]DT[1933-10-16])",
  );
});

test("only black", (t) => {
  t.is(
    formatSGF([{ col: 1, row: 1, player: "B" }], { komi: 0, size: 19 }),
    "(;GM[1]FF[4]CA[UTF-8]AP[random-go-stones:1.0.0]KM[0]SZ[19]DT[1933-10-16]AB[aa])",
  );
});

test("only white", (t) => {
  t.is(
    formatSGF(
      [
        { col: 1, row: 1, player: "W" },
        { col: 19, row: 19, player: "W" },
      ],
      { komi: 0, size: 19 },
    ),
    "(;GM[1]FF[4]CA[UTF-8]AP[random-go-stones:1.0.0]KM[0]SZ[19]DT[1933-10-16]AW[aa][ss])",
  );
});

test("altering black and white", (t) => {
  t.is(
    formatSGF(
      [
        { col: 16, row: 4, player: "B" },
        { col: 4, row: 16, player: "B" },
        { col: 16, row: 16, player: "B" },
        { col: 4, row: 4, player: "B" },
        { col: 10, row: 10, player: "W" },
        { col: 10, row: 4, player: "B" },
        { col: 10, row: 16, player: "W" },
      ],
      { komi: 0, size: 19 },
    ),
    "(;GM[1]FF[4]CA[UTF-8]AP[random-go-stones:1.0.0]KM[0]SZ[19]DT[1933-10-16]AB[pd][dp][pp][dd][jd]AW[jj][jp])",
  );
});

test("createSGFFile", (t) => {
  const origCreateObjectURL = globalThis.URL.createObjectURL;
  const origRevokeObjectURL = globalThis.URL.revokeObjectURL;

  globalThis.URL.createObjectURL = sinon.fake.returns("blob:null/foo");
  globalThis.URL.revokeObjectURL = sinon.fake();

  t.teardown(() => {
    globalThis.URL.createObjectURL = origCreateObjectURL;
    globalThis.URL.revokeObjectURL = origRevokeObjectURL;
  });

  const anchor = document.createElement("a");

  createSGFFile(anchor, "");

  t.is(anchor.href, "blob:null/foo");
  t.is(anchor.download, "random-start.sgf");
});

test("createSGFFile revokes an existing url", (t) => {
  const origCreateObjectURL = globalThis.URL.createObjectURL;
  const origRevokeObjectURL = globalThis.URL.revokeObjectURL;

  globalThis.URL.createObjectURL = sinon.fake.returns("blob:null/foo");
  globalThis.URL.revokeObjectURL = sinon.fake();

  t.teardown(() => {
    globalThis.URL.createObjectURL = origCreateObjectURL;
    globalThis.URL.revokeObjectURL = origRevokeObjectURL;
  });

  const anchor = document.createElement("a");
  anchor.href = "blob:null/old";

  createSGFFile(anchor, "");

  // @ts-ignore
  t.true(globalThis.URL.revokeObjectURL.calledWith("blob:null/old"));
});
