# RustCockpit WebRCON

[![Deploy to GitHub Pages](https://github.com/foofoodog/RustCockpit/actions/workflows/deploy.yml/badge.svg)](https://github.com/foofoodog/RustCockpit/actions/workflows/deploy.yml)
[![Live Demo](https://img.shields.io/badge/Demo-Live%20on%20GitHub%20Pages-22c55e?style=flat&logo=github)](https://foofoodog.github.io/RustCockpit/)

A modern, high-performance web administration cockpit for Rust Dedicated Servers built on WebSocket WebRCON. Fully self-contained, client-side, and engineered for server owners, administrators, and event operators.

- Live Demo: [https://foofoodog.github.io/RustCockpit/](https://foofoodog.github.io/RustCockpit/)
- Full Visual Tour: [screenshots.md](screenshots.md)

---

## Key Features

### Clean Hierarchical Navigation
Organized into four primary sections with an active contextual sub-navigation bar:
- **Server:** Overview, Rules & Convars, Automation & Tasks
- **Monitoring:** Live Console, Map & Radar, Combat & Raid Feed, In-Game Chat
- **Players:** Player Directory, Plugins & Permissions
- **Arsenal:** Item Browser, Kits & Loadouts, World Prefabs

---

### Progressive Web App (PWA) and Offline Ready
- **Desktop and Mobile Installation:** Install RustCockpit directly from Chrome, Edge, Safari, or mobile browsers as a standalone application with a taskbar icon, window controls, and quick-launch shortcuts.
- **Offline Application Shell:** Service Worker caches the application shell, scripts, styles, the 2.57 MB item sprite sheet, and monument POI vector graphics.
- **LAN and Air-Gapped Operation:** Connect directly to local dedicated servers (`127.0.0.1`) or private LAN servers (`192.168.x.x`), or review items, kits, and rules without an active internet connection.
- **In-App Install Trigger:** Features an install prompt button in the header when available and displays an offline status indicator when disconnected from external networks.

---

### Ultra-Fast Item Browser (1,317 Items)
- **Single WebP Sprite Sheet:** All 1,317 official Rust items packed into a single 2.57 MB WebP sprite sheet (a 99.3% file size reduction from individual assets) with zero individual HTTP requests.
- **Instant Rendering:** Pixel-perfect CSS background offsets with dynamic scaling (72px in the grid, 56px in modals).
- **16 Categories:** All, Weapons, Construction, Items, Resources, Attire, Tools, Medical, Food, Ammo, Traps, Misc, Components, Electrical, Fun, Vehicles, and DLC/Packs.
- **DLC and Special Content Detection:** Highlights 197+ DLC items (Abyss Pack, Sunburn, Voice Props, Instruments, Arctic, Lumberjack, Frontier, Medieval, Lunar New Year) with distinctive badges and admin spawning permissions guidance.
- **Direct Player Delivery:** One-click item delivery to Console/Self or any connected player with quantity presets and max stack buttons.

---

### Kits and Custom Loadout Spawner
- **Built-in Presets:**
  - Full Metal AK-47: Metal armor, hoodie, pants, boots, tactical gloves, AK-47, 5.56 ammo, and medical syringes.
  - Roadsign SAR: Semi-Auto Rifle, coffee can helmet, roadsign armor, ammo, and syringes.
  - Heavy Raid Breacher: Heavy plate set, rocket launcher, HV rockets, timed C4, and syringes.
  - Base Builder Starter: Building plan, hammer, Tool Cupboard, 5k wood, 5k stone, 2k metal fragments, doors, and code locks.
  - Electrician Toolkit: Wire tool, large battery, solar panels, electrical branches, switches, splitters, and ceiling lights.
  - Emergency Medic Kit: Large medkits, syringes, bandages, and anti-radiation pills.
- **Visual Kit Creator:** Select items visually with sprites, set custom quantities, and persist kits to local storage.
- **Sequential Batch Delivery:** One-click batch delivery of an entire kit to any target player.

---

## Interactive Live Map and Radar
- **Monument Points of Interest:** Real-time marker overlays with custom vector icons for major radtowns, safe zones, harbors, oil rigs, underwater labs, and quarries.
- **Live Player Tracking:** Real-time marker pins showing online players with status radar pings.
- **Click-to-Teleport:** Click anywhere on the map or select any monument to inspect coordinates (X, Z), copy teleport commands, execute teleports immediately (`teleportpos x y z`), or spawn vehicles at coordinates.

---

## Live Combat, Raid and Anti-Cheat Feed
- **Combat Kill Feed:** Real-time parser for player vs. player deaths, suicides, and weapon types.
- **Raid Detector:** Classifies active Timed Explosive (C4), Rocket, Satchel, and MLRS detonations and structural destruction events with distinct visual badges.
- **Anti-Cheat Violation Ticker:** Displays automated server kicks, flyhack violations, speedhack warnings, and eyehack logs with quick moderation actions.

---

## Server Rules and Convars Manager
- **Live Gameplay Controls:** Adjust `decay.scale`, `decay.upkeep`, `server.stability`, `server.radiation`, `server.pve`, and `relationshipmanager.maxteamsize` with live sliders and toggle switches.
- **Day and Night Cycles:** Custom duration sliders for daytime (`env.daylength`) and timescale.
- **AI Controls:** Live toggles and presets for `ai.move`, `ai.think`, and `ai.ignoreplayers`.
- **World Events and Patrol Heli:** Manage `heli.lifetimeminutes`, `heli.guns`, `cargoship.event_duration_minutes`, and manual event calls.
- **Persistence and Cleanups:** Configure `server.saveinterval`, `server.itemdespawn`, `server.corpsedespawn`, and manual save buttons.
- **Wounded and Recovery:** Manage player crawling and wounded recovery chances.
- **Ruleset Presets:** Quick-apply "Vanilla Competitive", "Build and Creative Sandbox", or "Solo Hardcore" rulesets.

---

## Server Automation and Scheduled Tasks
- **Graceful Restart Wizard:** Multi-stage countdown (1m, 5m, 10m) that broadcasts scheduled warnings to players, performs `server.save`, and triggers `restart` with a one-click abort option.
- **Recurring Chat Announcer:** Configure repeating broadcast messages (rules, Discord links, wipe notices) on customizable intervals.
- **Wipe Day Assistant:** Map seed randomizer, world size slider (2000m to 5000m), and server hostname configuration.

---

## World Entity and Vehicle Spawner
One-click physical entity instantiation into the live game world:
- **Air:** Minicopter, Scrap Transport Heli, Attack Helicopter, Hot Air Balloon.
- **Land:** Modular Cars (2/3/4 modules), Motorbike, Bicycle, Snowmobile.
- **Water:** Tugboat, RHIB, Rowboat, Solo/Duo Submarines.
- **Deployables:** Workbenches (T1, T2, T3), Research Table, Repair Bench.
- **Events:** Call Patrol Helicopter, Bradley APC, or Cargo Plane.

---

## Oxide and uMod Plugin Manager with Permissions Matrix
- **Plugin Management:** Table with status indicators, memory usage, reload, unload, and real-time compilation error banners.
- **Twisty Expanding Permissions Grid:** Each plugin row expands to reveal a group-based permissions matrix.
- **Permission Toggles:** Grant or revoke permissions (`oxide.grant group <group> <perm>`) with live checkmarks and batch actions ("Grant All", "Revoke All").
- **Core Oxide Permissions:** Integrated management of core system permissions.

---

## Live Console with Autocomplete and Command History
- **Multi-Level History:** Arrow key (<kbd>↑</kbd> and <kbd>↓</kbd>) navigation through 100 historical commands with draft preservation.
- **Tab Completion:** Tab key auto-completes command names with a trailing space without premature execution.
- **Active Argument Helper:** Shows live syntax guides, parameter templates, clickable player SteamID chips, and quick argument pills as you type.

---

## Multi-Server Profile Switcher
- Manage multiple server connection profiles (e.g., Local Dedicated, Main 2x, Staging Test).
- One-click profile switching from the header dropdown without retyping passwords.
- 100% Client-side single page app — credentials remain in your browser's local storage.

---

## Getting Started

### 1. Clone and Install Dependencies
```bash
git clone https://github.com/foofoodog/RustCockpit.git
cd RustCockpit
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5000](http://localhost:5000) in your browser.

### 3. Docker Deployment

#### Live Development with Hot-Reload (Recommended for local dev)
Runs Vite inside Docker and mounts your local folder. Any code edits you make in `src/` are picked up instantly without restarting:
```bash
docker compose -f docker-compose.dev.yml up -d
```
Open [http://localhost:5000](http://localhost:5000).

#### Production Nginx Container
Compiles an optimized static production build served by a minimal Alpine Nginx image:
```bash
docker compose up -d --build
```
Open [http://localhost:5000](http://localhost:5000).

### 4. Build for Production (Static Files)
```bash
npm run build
```
The output in `dist/` is pure static HTML/CSS/JS and can be hosted anywhere (Nginx, Caddy, GitHub Pages, Cloudflare Pages, or Docker).

---

## Security and Privacy
- RustCockpit connects directly from your web browser to your Rust server's WebSocket WebRCON port (default: `28016`).
- No credentials, logs, or chat messages ever leave your machine or pass through an intermediary backend.

---

## License
MIT License.
