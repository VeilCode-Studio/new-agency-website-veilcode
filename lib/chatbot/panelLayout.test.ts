import test from "node:test";
import assert from "node:assert/strict";
import { getChatbotPanelClassName } from "./panelLayout.ts";

test("getChatbotPanelClassName keeps the collapsed panel compact", () => {
  const className = getChatbotPanelClassName(false);

  assert.match(className, /max-w-96/);
  assert.doesNotMatch(className, /sm:w-\[80vw\]/);
  assert.doesNotMatch(className, /sm:h-\[80dvh\]/);
});

test("getChatbotPanelClassName expands to about 80 percent on desktop with mobile-safe bounds", () => {
  const className = getChatbotPanelClassName(true);

  assert.match(className, /w-\[calc\(100vw-2rem\)\]/);
  assert.match(className, /sm:w-\[80vw\]/);
  assert.match(className, /sm:h-\[80dvh\]/);
  assert.match(className, /max-w-\[72rem\]/);
});
