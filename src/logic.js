// QVAC Weekly Meal Prep Planner — core logic.
// Given a dietary preference and a number of prep days, outlines what to
// batch-cook — not detailed recipes.

import { completion } from "@qvac/sdk";

function looksUnusable(text) {
  if (!text || text.trim().length === 0) return true;
  const bad = ["i cannot", "i can't", "as an ai", "i'm not able", "i am not able"];
  const lower = text.toLowerCase();
  return bad.some((phrase) => lower.includes(phrase));
}

function clampDays(raw) {
  const n = parseInt(raw, 10);
  if (Number.isNaN(n)) return 5;
  return Math.max(1, Math.min(7, n));
}

function fallbackOutline(preference, days) {
  return [
    `Batch-cook a big tray of a ${preference}-friendly protein or main to portion across ${days} day(s).`,
    "Roast a large batch of mixed vegetables to mix and match with different meals.",
    "Cook a base grain or starch (rice, quinoa, or potatoes) in bulk for the week.",
    "Prep a simple sauce or dressing to keep meals from tasting repetitive.",
    "Portion everything into containers by day so grab-and-go stays easy.",
  ].slice(0, Math.min(5, days + 2));
}

function parseSteps(text) {
  return text
    .split("\n")
    .map((l) => l.replace(/^[\s\-*\d.)]+/, "").trim())
    .filter((l) => l.length > 3);
}

export async function planWeek(modelId, body) {
  const preference = (body.preference || "").trim();
  const daysRaw = (body.days || "").trim();
  if (!preference) {
    const err = new Error("Please enter a dietary preference first.");
    err.statusCode = 400;
    throw err;
  }
  const days = clampDays(daysRaw || "5");

  const run = completion({
    modelId,
    history: [
      {
        role: "system",
        content:
          "You are a meal-prep planning assistant. Given a dietary preference " +
          "and a number of days to prep for, outline what to BATCH-COOK — not " +
          "detailed step-by-step recipes. Reply with 4-6 short bullet lines, " +
          "each one batch-cooking task (e.g. a protein, a grain, vegetables, a " +
          "sauce). No preamble, no recipe steps, no dollar amounts.",
      },
      { role: "user", content: "Preference: vegetarian, high-protein. Days to prep: 4" },
      {
        role: "assistant",
        content:
          "Batch-cook a large pot of lentils or chickpeas as the main protein base.\n" +
          "Bake a tray of marinated tofu or tempeh cubes for variety.\n" +
          "Roast a big batch of mixed seasonal vegetables.\n" +
          "Cook a bulk pot of quinoa or brown rice as the shared grain base.\n" +
          "Make a batch of a versatile sauce (tahini or peanut) to tie meals together.",
      },
      { role: "user", content: `Preference: ${preference}. Days to prep: ${days}` },
    ],
    stream: true,
    completionOpts: { temperature: 0.6, maxTokens: 260 },
  });

  let text = "";
  for await (const token of run.tokenStream) text += token;
  text = text.trim().replace(/^here'?s[^:\n]*:\s*/i, "").trim();

  let steps = looksUnusable(text) ? [] : parseSteps(text);
  // A single stray line isn't a usable batch-cook outline either — fall
  // back rather than showing a one-item "plan".
  if (steps.length < 2) steps = fallbackOutline(preference, days);
  steps = steps.slice(0, 6);

  return { preference, days, steps };
}
