# MOVE System — Interactive Website

A 3D interactive website for the **MOVE System** research platform — Institute of Smart City and Management (ISCM), University of Economics Ho Chi Minh City (UEH). Designed from the `MOVE System_05Apr.pptx` brand kit and content: architectural-minimal aesthetic, burgundy/cream palette, dotted-grid background, Inter + JetBrains Mono typography, bilingual EN/VI.

---

## Two entry points

| Entry point | What it is | Best for |
| --- | --- | --- |
| `index.html` (root) | Self-contained single-file demo. All four labs live as in-page sections below the 3D hub. | Quick preview — double-click to open, no server needed. |
| `project/index.html` | Full multi-page site: 3D hub + four dedicated lab pages with interactive demos. | The real deliverable. Open via a local web server. |

---

## Folder layout

```
move-website/
├── index.html                  ← single-file demo (root entry)
├── README.md                   ← this file
└── project/                    ← full multi-page site
    ├── index.html              ← 3D hub (home)
    ├── css/
    │   └── style.css           ← design system, brand tokens, components
    ├── js/
    │   ├── hub3d.js            ← Three.js wireframe city + 4 lab pillars
    │   └── i18n.js             ← EN/VI dictionary and data-i18n engine
    ├── assets/                 ← (empty — no binary assets required)
    └── labs/
        ├── see.html            ← SEE Living Lab + hazard-spotting demo
        ├── smart.html          ← Smart Mobility + MaaS route planner
        ├── rail.html           ← CE-Rail@UEH + corridor explorer
        └── ctrlab.html         ← CtrLab + exposure risk explorer
```

---

## How to open

### Option A — single-file demo (fastest)
Double-click `index.html` in the workspace folder. The 3D hub and all four labs render in one scrolling page.

### Option B — full site (recommended)
The multi-page site needs a local web server so relative paths (`css/`, `js/`, `labs/`) resolve correctly. From the `move-website/` folder:

```
python3 -m http.server 8000
```

Then open `http://localhost:8000/project/index.html` in a modern browser. Any static server works (`npx serve`, VS Code Live Server, etc.).

---

## What's in each page

**3D hub (`project/index.html`)** — A Three.js wireframe scene: a city core at the centre and four lab pillars arranged around it. Drag to orbit, scroll to zoom, hover a pillar to highlight, click a pillar to enter that lab. Below the hub: About, Structure, People, Funding, Tech stack.

**SEE Living Lab (`labs/see.html`)** — Four packages (Sense · Engage · Evolve · Extension) and a **hazard-spotting canvas demo**: a 20-second round where you click hazards on a city scene for points.

**Smart Mobility Lab (`labs/smart.html`)** — Three research themes, the CE-M Program pillars, a **MaaS route-planner canvas demo** (click origin → destination, a three-leg multimodal route animates across the map), timeline, metrics targets (2027/2029/2030).

**CE-Rail@UEH (`labs/rail.html`)** — Rail Systems Lab + Smart Corridor Living Lab, consulting services, equipment, and a **corridor-explorer canvas demo** showing interchange nodes along the metro/rail spine.

**CtrLab (`labs/ctrlab.html`)** — Three tracks (Air · Climate · Energy) and an **Exposure Risk Explorer**: 12 HCMC districts × 12 months × three toggleable layers (PM2.5 / heat / energy load). Play button animates the year; hotspots pulse.

---

## Interaction cheatsheet

- **EN / VI toggle** — top-right of every page. Selection persists across pages via `localStorage` key `move.lang`. All strings tagged `data-i18n="…"` swap on click.
- **3D hub** — left-drag to orbit, mouse wheel to zoom, hover + click a pillar to open its lab.
- **Lab demos** — each has its own controls; read the small caption under the canvas.

---

## Design tokens

Defined once in `project/css/style.css`:

```
--burgundy: #7A1F2E   /* accents, primary buttons, pillar halos */
--cream:    #F5F2EE   /* page background */
--ink:      #1A1A1A   /* body text */
--grid:     #D8D2C8   /* dotted-grid pattern */
--gold:     #B89264   /* secondary accent */
```

Fonts are loaded from Google Fonts: **Inter** (400/500/600/700) for UI and body, **JetBrains Mono** (400/500) for labels and numerals.

---

## Browser support

Modern evergreen browsers (Chrome, Edge, Firefox, Safari). Three.js r128 is loaded from Cloudflare CDN; no build step, no dependencies to install. A WebGL-capable GPU is required for the 3D hub.

---

## Content attribution

All research content (lab scopes, publications, stakeholders, timelines, people) is sourced from `MOVE System_05Apr.pptx`. The interactive demos are original illustrative visualisations built for this site — they do not read live datasets and are not a substitute for the labs' actual research tooling.
