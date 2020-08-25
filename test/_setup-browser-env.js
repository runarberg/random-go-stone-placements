import jsdom from "jsdom";

const { window } = new jsdom.JSDOM("", {
  url: "http://example.test",
});

globalThis.window = window;
globalThis.document = window.document;
globalThis.HTMLElement = window.HTMLElement;
globalThis.File = window.File;
globalThis.URL = window.URL;
