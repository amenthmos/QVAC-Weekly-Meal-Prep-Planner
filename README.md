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

## License

MIT
