# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Weatherscan Local XL is a web-based recreation of "Weatherscan Local" from The Weather Channel. It's a full-stack application with a Node.js/Express backend and HTML/CSS/JavaScript frontend that displays weather data in a broadcast-style slide presentation.

Best used with mainland United States locations. Optimized for Google Chrome. Online demo: `local.weatherscan.net`

## Commands

```bash
npm install    # Install dependencies (run from project root)
npm start      # Start Express server on port 8080
```

The application runs at `http://localhost:8080` after starting.

**Electron wrapper** (optional desktop mode):
```bash
npm start                           # Start Express server (in root directory)
cd electron-wrapper && npm install  # First time setup
cd electron-wrapper && npm start    # Launch Electron wrapper
```

**weatherscanPOP variant:**
```bash
cd weatherscanPOP
npm install
npm start      # Runs on same port 8080 - cannot run alongside main project
```

## Architecture

### Backend (`app.js`)
- Express server on port 8080, binds to `0.0.0.0`
- Serves static files from `webroot/`
- `GET /airports` — proxies FAA airport delay data from `nasstatus.faa.gov` (CORS workaround)
- `GET /sports` — proxies ESPN scoreboard API for NFL, NBA, MLB, NHL, EPL; filters to today's games by ET date

### Frontend (`webroot/`)

**CRITICAL: Script load order matters** (defined in `index.html`):
1. `js/config.js` — global variables and package definitions
2. `js/extras.js` — utility functions (shuffle, formatMinutes, differenceUTC)
3. `js/location.js` — `locationSettings` / `locationConfig` objects + `locationJS()`
4. `js/settingspanel.js` — setup wizard UI
5. `js/radar.js` — radar map init
6. `js/slides.js` — `slidePrograms` object + `showSlides()` engine
7. `js/crawl.js` — alert/ad crawl
8. `js/main.js` — window scaling on resize
9. `js/data.js` — `weatherData` object (empty schema)
10. `js/audio.js` — `AudioManager` class
11. `js/map.js` — map utility helpers
12. `js/dashboard-core.js` — `PanelCycler` class + helpers
13. `js/dashboard-sports.js` — sports panel
14. `js/dashboard-weather.js` — weather panel
15. `js/dashboard-calendar.js` — calendar panel
16. `js/dashboard-news.js` — news panel
17. `js/dashboard.js` — main dashboard controller

### Startup Sequence
1. Page loads; if `apperanceSettings.skipSettings == false`, the settings panel wizard runs first
2. `locationJS()` fires, resolving all locations via weather.com API calls into `locationConfig`
3. After `apperanceSettings.startupTime` ms, the startup screen fades and `showSlides()` begins iterating through packages

### Slide Engine (`js/slides.js`)
- `slidePrograms` — object where each key is a slide function name (e.g. `"currentConditions"`) and value is the render function
- `showSlides()` — reads `slideSettings.order` array, iterates through packages/slides sequentially using `idx` counter
- Each slide function calls `slideCallBack()` when done, which increments `idx` and calls `showSlides()` again
- `slideLength` (default 10000ms) is the base unit; some slides use `slideLength * 2`
- `slideDivs` maps function names to their CSS selector strings — note: `extraDayDesc` and `extraExtendedForecast` entries are missing the leading `.` (existing quirk in the source)

### Slide Package Configuration (`js/config.js`)
Slide packages are arrays of `{function: "slideFunctionName"}` objects grouped under a `group` name. The `slideSettings.order` array controls which packages play and in what order. Defined packages:
- `introPackage`, `forecastPackage`, `extraLocalPackage`, `miniCorePackage`
- `spanishForecastPackage`, `golfPackage`, `healthPackage`, `airportPackage`
- `mainPackage`, `airportOnlyPackage`, `nearbyCitiesPackage` — custom interleaved variants

### Location Resolution (`js/location.js`)
`locationSettings` (user config) → `locationGrab()` → weather.com API → populates `locationConfig` (runtime resolved data).

For each sub-location category (extraCity, eightCities, airport, golf), there are `auto*` variants (geocode-based discovery) and `manual*` variants (explicit config). The `autoFind` flag in `locationSettings` selects which path runs.

URL query string (`?CityName`) triggers search-based auto-location as a fallback.

### Key Global Objects
| Object | File | Purpose |
|--------|------|---------|
| `weatherData` | `data.js` | Central store for all fetched weather (empty schema, populated at runtime) |
| `locationSettings` | `location.js` | User-configured location inputs |
| `locationConfig` | `location.js` | Runtime-resolved coordinates/names after API calls |
| `apperanceSettings` | `config.js` | UI settings — note the typo `apperance` is intentional in source |
| `slideSettings` | `config.js` | Active slide order/packages |
| `audioSettings` | `config.js` | Music shuffle/playback config |
| `dashboardSettings` | `config.js` | Dashboard cycling config including `followedTeams` array |

### Required API Keys

Configure in `webroot/js/config.js` (lines 1–2):
- `api_key` — weather.com API key
- `map_key` — mapbox.com API key

### weatherscanPOP/
A secondary variant of the project (separate `app.js` + `webroot/`) with its own `package.json`. Runs independently on port 8080 — cannot run simultaneously with the main project. Shares the same architecture but is a distinct build.

**Important**: When making changes to core functionality, consider whether the change should apply to both main and weatherscanPOP variants. They share architecture but have separate codebases.

### Dependencies Note
`node-fetch` is pinned to v2 (`"node-fetch": "^2.7.0"`) — v3 uses ESM and will break `require()` in `app.js`. If airport data fails, run `npm i node-fetch@2` from the project root.

### Electron Wrapper (`electron-wrapper/`)
Optional desktop wrapper. Loads `http://localhost:8080` in a frameless 1920×1080 always-on-top window. Start the Express server first, then from `electron-wrapper/`:
```bash
npm install
npm start  # electron .
```

## Dashboard (4-Box Cycling System)

**Status**: Implemented as of March 2026

### Architecture
The dashboard is a separate viewing mode from the traditional slide rotation. It displays a 4-panel grid that cycles different content types within each panel:

**Files:**
- `webroot/js/dashboard-core.js` — `PanelCycler` class (base cycling engine)
- `webroot/js/dashboard-sports.js` — Sports panel cycling logic
- `webroot/js/dashboard-calendar.js` — Calendar/schedule panel cycling
- `webroot/js/dashboard-news.js` — News panel cycling
- `webroot/js/dashboard-weather.js` — Weather panel cycling
- `webroot/js/dashboard.js` — Main controller, initialization, data refresh
- `webroot/dashboard.css` — Dashboard-specific styles

### PanelCycler Class
The `PanelCycler` base class powers all 4 panels:
- Takes array of slide render functions
- Handles fade transitions (default 500ms)
- Schedules next slide after configurable delay
- Supports `start()`, `stop()`, `goToSlide(n)`, `refreshCurrentSlide()`, `updateSlides(arr)` operations
- Per-slide duration override: attach `.duration` property to a render function to override `slideLength` for that slide
- Independent timers per panel (no global sync)
- Helper functions in `dashboard-core.js`: `filterSlidesByData(defs)`, `createPlaceholderSlide(msg, selector)`, `staggeredStart(cyclers, delay)`

### Configuration (`config.js`)
```javascript
dashboardSettings = {
  enableCycling: true,           // Master toggle
  sportsCycleTime: 10000,        // 10s per league
  calendarCycleTime: 12000,      // 12s per view
  newsCycleTime: 10000,          // 10s per category
  weatherCycleTime: 15000,       // 15s per display
  transitionSpeed: 500,          // Fade speed (ms)
  dataRefreshInterval: 30000,    // Data refresh (30s)
  staggeredStart: true,          // Stagger panel starts
  staggerDelay: 500,             // Delay between starts
  followedTeams: [               // Highlight specific teams in sports panel
    { name: 'Team Name', abbreviation: 'ABC', league: 'MLB', label: "TODAY'S GAME", theme: 'theme-key' },
  ],
}
```

### Panel Implementation Pattern
Each panel module (`dashboard-*.js`) follows this structure:
1. Define slide render functions (each builds HTML for one content type)
2. Filter slides based on available data (skip if no data)
3. Create `PanelCycler` instance with active slides
4. Expose `init*Cycler()` function called by main controller
5. Expose `refresh*Panel()` for data updates without interrupting cycle

### Data Refresh Strategy
- `updateAllPanels()` called every 30 seconds
- Data fetched from ESPN API (`/sports`), FAA API (`/airports`), weather.com
- Cycling timers continue independently
- Only currently displayed slide re-renders on refresh
- No cycle interruption or reset on data update

### Adding New Dashboard Features
To add new slides to an existing panel:
1. Create render function in appropriate `dashboard-*.js` file
2. Add to slides array in `init*Cycler()` function
3. Update filter logic if slide requires specific data
4. Document in `DASHBOARD-PLAN.md` and `SLIDE-LAYOUTS.md`

### Detailed Documentation
See `DASHBOARD-PLAN.md` for full cycling strategy and `SLIDE-LAYOUTS.md` for exact pixel-perfect layouts of all slides.

## Common Development Patterns

### Modifying Slide Behavior
When editing slide rendering logic:
1. Identify if slide is traditional (`js/slides.js`) or dashboard (`js/dashboard-*.js`)
2. Read existing code to understand data dependencies
3. Test with both populated and empty data states
4. Check browser console for errors (script load order issues are common)

### Adding New API Data
To fetch new data types:
1. Add proxy endpoint to `app.js` if external API needs CORS bypass
2. Add fetch call in `js/data.js` or relevant dashboard module
3. Update data refresh intervals as needed
4. Consider caching strategy (weather data vs sports scores have different staleness tolerance)

### Debugging Tips
- **Script not loading**: Check `index.html` load order — dependencies must load before dependents
- **Slide not showing**: Verify `slideSettings.order` in `config.js` includes the slide's package
- **Dashboard panel blank**: Check browser console — likely missing data or render function error
- **Cycling not working**: Verify `dashboardSettings.enableCycling = true` in `config.js`
- **API failures**: Check Express server logs for proxy endpoint errors
