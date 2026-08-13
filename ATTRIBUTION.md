# Attribution

## Element data

The files `src/data/elements.json` are derived from
[**Bowserinator/Periodic-Table-JSON**](https://github.com/Bowserinator/Periodic-Table-JSON),
which is licensed under
[**Creative Commons Attribution-ShareAlike 3.0 Unported (CC BY-SA 3.0)**](https://creativecommons.org/licenses/by-sa/3.0/).
That dataset in turn draws on Wikipedia, which uses the same license.

### What was taken

Atomic number, symbol, name, atomic mass, category, phase, block, period, group,
grid position, electron shells, electron configuration (full and shorthand),
electronegativity, electron affinity, ionization energies, density, melting and
boiling points, appearance, and discovery attribution.

### What was changed

- Field names were shortened and the structure flattened.
- Elements 119+ (unconfirmed) were dropped; the set is capped at 118.
- Category strings were normalized, and a `predicted` flag was added for
  elements whose properties are theoretical rather than measured.
- `synthetic`, `radioactive`, `metalClass`, and `valence` were computed and added.
- **The upstream `summary` field (three sentences from Wikipedia per element) was
  removed entirely.** The `blurb`, `uses`, and `facts` fields in this repo are
  original text written for this project, not derived from the upstream dataset.

`src/data/compounds.json` is entirely original to this project.

### What this means for you

CC BY-SA 3.0 is a **share-alike** license. If you publish or distribute this
project, or a modified version of it:

1. **You must attribute the original dataset.** The footer in `src/App.jsx` and
   this file both do that. Keep them, or provide equivalent credit.
2. **Adaptations of the data must stay under CC BY-SA 3.0** (or a compatible
   license such as CC BY-SA 4.0). If you edit `elements.json`, your edited
   version inherits these terms.
3. **You cannot add restrictions** on top — no additional legal or technical
   measures that stop others from exercising the same rights.

The application source code is a separate work and is offered under the MIT
license (see `LICENSE`). Whether your combined project counts as a "derivative
work" of the data or merely an aggregation of two separately-licensed works is a
judgment call that depends on your jurisdiction and how you distribute it. If
that distinction matters for your use — commercial products in particular — get
advice from someone qualified rather than relying on this note. I'm not a lawyer,
and this isn't legal advice.

The simplest safe path for most people: keep the attribution, license your code
MIT, and leave the data under CC BY-SA 3.0 as it is now.

### If you'd rather avoid share-alike entirely

Replace `src/data/elements.json` with data from a public-domain or permissively
licensed source. The shape the app expects is documented in `src/data/index.js`,
and nothing else in the codebase needs to change.

## Fonts

Space Grotesk, IBM Plex Sans, and JetBrains Mono are loaded from Google Fonts.
All three are licensed under the SIL Open Font License 1.1.
