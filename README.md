# QVAC Weekly Meal Prep Planner

Enter a dietary preference and how many days you want to prep for, and an on-device AI outlines what to batch-cook for the week — not detailed recipes. No cloud call, no API key.

## Run

```bash
npm install
npm start
```

Then open http://localhost:32012

## QVAC SDK version

`@qvac/sdk` ^0.19.0 (see `package.json`).

## How it works

Built on [Tether's QVAC SDK](https://www.npmjs.com/package/@qvac/sdk) — all inference runs on-device, no cloud call, no API key. The app loads `LLAMA_3_2_1B_INST_Q4_0` locally with `loadModel()`, generates with `completion()` (streamed via `tokenStream`), and releases the model with `unloadModel()` on shutdown.

## Example

Input: `{"preference":"vegan, high-protein","days":"6"}`

Output (from a real run):
```json
{"preference":"vegan, high-protein","days":6,"steps":[
  "Batch-cook a large quantity of vegan chickpeas to use in salads, curries, or as a protein-rich snack.",
  "Make a big batch of roasted sweet potato and black bean tacos or burritos for a week's worth of meals.",
  "Prepare a variety of roasted vegetable bowls with different grains and sauces.",
  "Make a batch of vegan protein-rich falafel or patties to use in salads or as a wrap filling.",
  "Batch-cook a large batch of quinoa and roasted vegetables to use in salads or as a base for bowls."
]}
```

## License

MIT
