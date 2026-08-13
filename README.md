# Elementa

An interactive periodic table and atomic structure explorer. All 118 elements, with animated atomic models, electron configurations, periodic trends, and a bond lab that explains how atoms actually combine.

Built with React, Vite, and Tailwind CSS. No backend, no accounts, no tracking — it's a static site.

## Features

**Periodic table** — All 118 elements in the standard layout, with the lanthanide and actinide rows lifted out. Colour-coded by category, searchable by name, symbol, or atomic number, and filterable by category, state of matter, block, metal/nonmetal, radioactivity, and synthetic origin.

**Element Explorer** — Overview, Atomic Structure, Properties, Uses, and History for every element. Includes an animated atomic model where valence electrons are visually distinct from core electrons, a shell-by-shell breakdown (`K: 2/2, L: 6/8`), and electron configurations in full, noble-gas shorthand, and shell form — with a beginner/detailed explanation toggle.

**Bond Lab** — Pick two elements and see whether they bond, what forms, and why. Ionic bonds animate the electron transfer and show the resulting ion charges; covalent bonds show the actual number of shared pairs, so a double bond looks different from a triple. When a pair doesn't form a common stable compound, it says so plainly instead of inventing one.

**Periodic Trends** — Electronegativity, ionization energy, electron affinity, and metallic character rendered as a heat map across the table, with a legend and a note about known exceptions.

**Compare** — Up to four elements side by side across seven properties, scaled as bar charts.

Plus dark/light mode, full keyboard navigation, a reduced-motion toggle, and a responsive layout that keeps periods and groups intact on small screens.

## Running locally

Requires Node 18 or newer.

```bash
git clone https://github.com/YOUR-USERNAME/elementa.git
cd elementa
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server with hot reload |
| `npm run build` | Build the production site into `dist/` |
| `npm run preview` | Serve the built site locally to check it before deploying |

## Deploying to GitHub Pages

The repo ships with a workflow at `.github/workflows/deploy.yml` that builds and publishes on every push to `main`.

1. Push this repo to GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.
4. Push to `main`. The Actions tab will show the build, and your site appears at `https://YOUR-USERNAME.github.io/YOUR-REPO/`.

`vite.config.js` sets `base: './'`, so the build works at any path — a project page, a user page, or a custom domain — without further configuration.

To deploy somewhere else instead (Netlify, Vercel, Cloudflare Pages), the build command is `npm run build` and the publish directory is `dist`.

## Project structure

```
src/
├── main.jsx              # Entry point
├── App.jsx               # View routing and cross-view state
├── index.css             # Tailwind directives + design tokens
├── data/
│   ├── elements.json     # All 118 elements
│   ├── compounds.json    # Curated known compounds for the Bond Lab
│   └── index.js          # Lookups, category metadata, constants
├── lib/
│   ├── bonding.js        # Bond determination logic
│   ├── filters.js        # Search and filter predicates
│   ├── format.js         # Number, formula, and configuration formatting
│   └── trends.js         # Trend definitions and heat-map scale
├── hooks/
│   ├── useTheme.js
│   ├── useReducedMotion.js
│   └── useMediaQuery.js
└── components/           # One component per concept
```

Chemistry data lives entirely in `src/data/` — no values are hard-coded into components. Adding a property means editing the JSON, not hunting through JSX.

## How the Bond Lab decides

Bond type resolution runs in a fixed order, and each step is deliberately conservative:

1. **Same element twice** — diatomic (H₂, N₂, O₂…), metallic, network covalent (carbon), or inert.
2. **Curated compound database** — around 36 well-known compounds with verified formulas, geometry, and explanations. This always wins over any heuristic.
3. **Noble gases** — inert, unless explicitly listed above (XeF₂, XeO₃, KrF₂ are real and included).
4. **Metal + metal** — an alloy, not a fixed-formula compound.
5. **Charge-balanced ionic prediction** — only for metals with a single dominant oxidation state paired with a common anion. Results are flagged in the UI as predicted rather than verified.
6. **Otherwise** — it says the combination doesn't form a common stable compound in this simplified model.

Transition metals with variable valency are deliberately excluded from step 5. Iron can be Fe²⁺ or Fe³⁺, so guessing produces confidently wrong chemistry; those pairs must come from the curated database or get an honest refusal instead.

## Data and attribution

Element data is derived from [Bowserinator/Periodic-Table-JSON](https://github.com/Bowserinator/Periodic-Table-JSON), licensed **CC BY-SA 3.0**. See [ATTRIBUTION.md](ATTRIBUTION.md) — the share-alike terms affect how you license this repo, so read it before publishing.

Properties that have genuinely never been measured (common for elements past ~100) are stored as `null` and rendered as "Not yet measured" rather than filled in with plausible-looking estimates.

## Contributing

The most useful contribution is extending `src/data/compounds.json`. Each entry needs the two element symbols, a formula, a bond type, and a short accurate explanation:

```json
{
  "a": "H", "b": "O",
  "formula": "H2O",
  "bondType": "polar-covalent",
  "pairs": 2,
  "geometry": "bent",
  "note": "Oxygen pulls shared electrons closer, giving water's bent shape and its polarity."
}
```

`bondType` is one of `ionic`, `covalent`, `polar-covalent`, `metallic`, `network-covalent`, or `none`. Please cite a source for any chemistry you add.

## Not yet built

Molecule builder, 3D viewer, orbital shapes, and quiz mode. The compound database already carries geometry data (bent, linear, tetrahedral) that a 2D structural viewer could use without new chemistry work.

## License

Source code is MIT (see [LICENSE](LICENSE)). Element data carries its own upstream license — see [ATTRIBUTION.md](ATTRIBUTION.md).
