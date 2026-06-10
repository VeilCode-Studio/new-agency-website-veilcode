import test from "node:test";
import assert from "node:assert/strict";
import { getChoiceGroup } from "./choiceGroups.ts";

test("getChoiceGroup uses the active question instead of recap keywords", () => {
  const group = getChoiceGroup([
    {
      role: "assistant",
      content:
        "Got it — I’ve set the timeline to 1–3 months. That fits our typical mobile timeline (8–14 weeks) and is feasible for an MVP with core features. Who are the primary users you’re targeting — general consumers, athletes, patients/clinical users, corporate wellness participants, coaches/nutritionists, or something else?",
    },
  ]);

  assert.equal(group?.label, "Select one or more user groups");
  assert.deepEqual(group?.options, [
    "Customers",
    "Internal team",
    "Admins/managers",
    "Partners/vendors",
    "Field staff",
  ]);
});

test("getChoiceGroup uses neutral audience options for general scoping questions", () => {
  const group = getChoiceGroup([
    {
      role: "assistant",
      content:
        "I can help scope that. What outcome are you trying to achieve, and who will use the finished tool or system?",
    },
  ]);

  assert.equal(group?.label, "Select one or more user groups");
  assert.deepEqual(group?.options, [
    "Customers",
    "Internal team",
    "Admins/managers",
    "Partners/vendors",
    "Field staff",
  ]);
});

test("getChoiceGroup does not let earlier budget and timeline mentions override the final outcome question", () => {
  const group = getChoiceGroup([
    {
      role: "assistant",
      content:
        "The next step is a short discovery for AI Automation. I need the primary outcome, target users, data sources or tools involved, preferred timeline, and budget range. What is the main outcome you want from this project?",
    },
  ]);

  assert.equal(group?.label, "Select one or more outcomes");
});

test("getChoiceGroup still returns timeline options when the active question asks for timeline", () => {
  const group = getChoiceGroup([
    {
      role: "assistant",
      content: "That sounds like a mobile MVP. What timeline are you working toward?",
    },
  ]);

  assert.equal(group?.label, "Select a timeline");
});
