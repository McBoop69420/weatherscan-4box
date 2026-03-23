# Weatherscan 4-Box Dashboard - Cycling Panel Plan

## Overview
Transform the static 4-panel dashboard into a dynamic cycling display where each quadrant rotates through multiple "slides" of related content.

---

## Panel 1: Sports (Top Left)

### Cycling Strategy
Rotate through leagues and game groupings every 10 seconds

### Slides:
1. **NFL Games** (if available)
   - Show up to 6 NFL games
   - Team logos, scores, live status
   - Display "NFL" badge

2. **NBA Games** (if available)
   - Show up to 6 NBA games
   - Team logos, scores, live status
   - Display "NBA" badge

3. **MLB Games** (if available)
   - Show up to 6 MLB games
   - Team logos, scores, live status
   - Display "MLB" badge

4. **NHL Games** (if available)
   - Show up to 6 NHL games
   - Team logos, scores, live status
   - Display "NHL" badge

5. **College Sports** (NCAAB/NCAAW combined)
   - Show up to 6 college basketball games
   - Rankings displayed for Top 25 teams
   - Display "NCAAB/NCAAW" badge

6. **Other Sports** (EPL, WNBA, PWHL, WBC)
   - Rotate through remaining leagues
   - Show available games

### Fallback:
- If no games for a league, skip that slide
- If no games at all, show "No games scheduled" message
- Minimum 1 slide, maximum 6 slides

### Transition:
- Fade out current league (500ms)
- Fade in next league (500ms)
- 10-second display time per league
- Loop continuously

---

## Panel 2: Calendar/Schedule (Top Right)

### Cycling Strategy
Rotate through different time views and schedules every 12 seconds

### Slides:
1. **Today's Overview**
   - Current date (large display)
   - Sunrise/sunset times
   - Day length
   - Moon phase (if available)

2. **Upcoming Sports Events**
   - Next 5 scheduled games (any league)
   - Game time, teams, league
   - "UPCOMING" or "LIVE" status

3. **Tomorrow's Preview**
   - Tomorrow's date
   - Tomorrow's sunrise/sunset
   - Weather forecast for tomorrow (high/low)
   - Brief condition description

4. **Week at a Glance**
   - 7-day weather forecast summary
   - High/low temps for each day
   - Icons for each day
   - Compact list view

5. **This Week's Events**
   - Upcoming sports events for next 7 days
   - Major games only (primetime/featured)
   - Date and time for each

### Fallback:
- Always show at least Today's Overview
- Skip slides with no data (e.g., if no sports events)

### Transition:
- Slide up animation (500ms)
- 12-second display time per slide
- Loop continuously

---

## Panel 3: News (Bottom Left)

### Cycling Strategy
Rotate through different news categories every 10 seconds

### Slides:
1. **Weather Alerts** (Priority - always first if active)
   - Active warnings and watches
   - Severity level (color-coded)
   - Alert description
   - Issued by National Weather Service

2. **Local Weather News**
   - Today's weather summary
   - Notable conditions (extreme temps, precipitation)
   - Weather records for today
   - Historical weather facts

3. **Sports Headlines**
   - Top scores from completed games
   - Notable performances (player stats)
   - League standings highlights
   - "Final score" summaries

4. **Weather Forecast Summary**
   - Extended forecast narrative
   - Weekend weather preview
   - Week ahead summary
   - Travel weather outlook

5. **Almanac & Trivia**
   - Moon phase information
   - Sunrise/sunset comparison (vs yesterday)
   - Historical weather events for this date
   - Seasonal information

6. **Community Info** (Placeholder)
   - Provider information (from apperanceSettings)
   - App version and features
   - Tips for using the dashboard
   - Links to more information

### Fallback:
- If no weather alerts, skip slide 1
- Always show at least 2 slides
- Generate placeholder content if needed

### Transition:
- Fade transition (400ms)
- 10-second display time per slide
- Loop continuously

---

## Panel 4: Weather (Bottom Right)

### Cycling Strategy
Rotate through different weather data displays every 15 seconds

### Slides:
1. **Current Conditions**
   - Large temperature display
   - Weather icon
   - Condition description
   - Humidity, wind, pressure, gusts (4-grid)

2. **5-Day Forecast**
   - 5 columns for 5 days
   - Day name, icon, high/low
   - Compact layout
   - Precipitation chance if available

3. **Detailed Today & Tonight**
   - Two-column layout: Today | Tonight
   - Icons for each period
   - High/low temperatures
   - Detailed descriptions
   - Wind and precipitation info

4. **Hourly Forecast** (if available)
   - Next 6-8 hours
   - Hour-by-hour temps
   - Icons for conditions
   - Precipitation probability
   - Wind speed

5. **Nearby Cities**
   - 4-6 nearby locations
   - City name, temp, icon
   - Wind information
   - Comparison to main location

6. **Weather Details Extended**
   - UV Index (current and forecast)
   - Visibility
   - Dew point
   - Wind chill or Heat index
   - Barometric trend (rising/falling)
   - Cloud cover percentage

### Fallback:
- Always show at least Current Conditions
- Skip unavailable data slides

### Transition:
- Cross-fade transition (600ms)
- 15-second display time per slide
- Loop continuously

---

## Implementation Architecture

### File Structure
```
webroot/
├── js/
│   ├── dashboard.js           (existing - to be refactored)
│   ├── dashboard-sports.js    (new - sports panel cycling)
│   ├── dashboard-calendar.js  (new - calendar panel cycling)
│   ├── dashboard-news.js      (new - news panel cycling)
│   ├── dashboard-weather.js   (new - weather panel cycling)
│   └── dashboard-core.js      (new - shared cycling utilities)
├── dashboard.css              (existing - add slide animations)
└── index.html                 (existing - no changes needed)
```

### Core Cycling System

**dashboard-core.js** - Shared cycling engine:
```javascript
class PanelCycler {
  constructor(panelSelector, slides, slideLength) {
    this.panel = panelSelector
    this.slides = slides          // Array of slide render functions
    this.slideLength = slideLength // Display time in ms
    this.currentIndex = 0
    this.isRunning = false
  }

  start() {
    // Begin cycling
    this.showSlide(0)
    this.isRunning = true
    this.scheduleNext()
  }

  showSlide(index) {
    // Fade out current, render new slide, fade in
    this.fadeOut(() => {
      this.slides[index]()        // Call render function
      this.fadeIn()
    })
  }

  scheduleNext() {
    setTimeout(() => {
      this.currentIndex = (this.currentIndex + 1) % this.slides.length
      this.showSlide(this.currentIndex)
      if (this.isRunning) this.scheduleNext()
    }, this.slideLength)
  }

  fadeOut(callback) {
    $(this.panel).fadeOut(500, callback)
  }

  fadeIn() {
    $(this.panel).fadeIn(500)
  }

  stop() {
    this.isRunning = false
  }
}
```

### Panel-Specific Implementation

Each panel module exports an array of slide render functions:

**dashboard-sports.js:**
```javascript
var sportsCycler;

function initSportsCycler() {
  const slides = [
    renderNFLSlide,
    renderNBASlide,
    renderMLBSlide,
    renderNHLSlide,
    renderCollegeSlide,
    renderOtherSportsSlide
  ]

  // Filter out slides with no data
  const activeSlides = slides.filter(slide => hasDataForSlide(slide))

  sportsCycler = new PanelCycler('.sports-content', activeSlides, 10000)
  sportsCycler.start()
}

function renderNFLSlide() {
  // Build HTML for NFL games only
  // Inject into .sports-games-list
}

// ... more render functions
```

### Data Refresh Strategy

**Current behavior:**
- `updateAllPanels()` called every 30 seconds
- Fetches new data and re-renders

**New behavior:**
- Keep data refresh at 30 seconds
- Cycling continues independently
- When data refreshes, update the currently displayed slide
- Don't interrupt the cycling timer

**Implementation:**
```javascript
// In dashboard.js
function updateAllPanels() {
  // Refresh data without stopping cyclers
  if (sportsCycler && sportsCycler.isRunning) {
    // Update data, re-render current slide only
    sportsCycler.refreshCurrentSlide()
  }
  // Same for other cyclers...
}
```

---

## Timing & Synchronization

### Individual Slide Lengths
- **Sports**: 10 seconds per league
- **Calendar**: 12 seconds per view
- **News**: 10 seconds per category
- **Weather**: 15 seconds per display

### Total Cycle Times
- **Sports**: 60 seconds (6 leagues × 10s)
- **Calendar**: 60 seconds (5 views × 12s)
- **News**: 60 seconds (6 categories × 10s)
- **Weather**: 90 seconds (6 displays × 15s)

### Synchronization
- **No sync needed** - Each panel runs independently
- Staggered start times create visual interest
- Sports → Calendar → News → Weather (500ms delay between each)

---

## CSS Animations

### Fade Transitions
```css
@keyframes dashboardFadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

@keyframes dashboardFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.panel-content.transitioning-out {
  animation: dashboardFadeOut 500ms ease-out;
}

.panel-content.transitioning-in {
  animation: dashboardFadeIn 500ms ease-in;
}
```

### Slide Transitions (Calendar-specific)
```css
@keyframes slideUp {
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(-20px);
    opacity: 0;
  }
}

@keyframes slideIn {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
```

---

## Data Requirements

### Existing Data (Already Available)
- ✅ `sportsRawData` - All sports leagues and games
- ✅ `weatherData.currentConditions` - Current weather
- ✅ `weatherData.extendedForecast` - 5-day forecast
- ✅ `weatherData.dayDesc` - Today/Tonight detailed forecast
- ✅ `weatherData.nearbyCities` - Nearby locations
- ✅ `weatherData.almanac` - Sunrise/sunset/moon
- ✅ `weatherData.alerts` - Weather warnings
- ✅ `weatherData.uvIndex` - UV information

### New Data Needed
- ❌ **Hourly forecast** - Need to add to data.js
- ❌ **Tomorrow's forecast** - Can derive from extendedForecast[1]
- ❌ **Dew point, visibility, cloud cover** - May need API expansion
- ❌ **Barometric trend** - Need historical pressure data
- ❌ **Week's sports schedule** - Filter from sportsRawData by date

### API Considerations
- Current weather.com API may provide hourly data
- Check data.js `grabData()` function for available fields
- May need to add new API calls for extended data

---

## Progressive Implementation Plan

### Phase 1: Core Cycling Engine
1. Create `dashboard-core.js` with PanelCycler class
2. Add CSS animations for transitions
3. Test with simple dummy slides

### Phase 2: Sports Panel
1. Create `dashboard-sports.js`
2. Implement league-specific render functions
3. Filter slides based on available data
4. Test cycling with live sports data

### Phase 3: Weather Panel
1. Create `dashboard-weather.js`
2. Implement all 6 weather displays
3. Add hourly forecast support (if API allows)
4. Test cycling with live weather data

### Phase 4: Calendar Panel
1. Create `dashboard-calendar.js`
2. Implement all 5 calendar views
3. Add slide-up animation
4. Test with sports schedule integration

### Phase 5: News Panel
1. Create `dashboard-news.js`
2. Implement all 6 news categories
3. Generate smart content from weather/sports data
4. Test content rotation

### Phase 6: Integration & Polish
1. Integrate all cyclers into main dashboard.js
2. Implement data refresh without interrupting cycles
3. Add error handling and fallbacks
4. Performance optimization
5. Final testing

---

## Error Handling

### No Data Scenarios
- **Sports**: "No games scheduled" message
- **Weather**: Show current conditions only
- **Calendar**: Always show today's date at minimum
- **News**: Show provider info and tips

### API Failures
- Keep cycling with stale data
- Show "Updating..." message if data > 5 minutes old
- Log errors to console
- Retry data fetch after 1 minute

### Performance
- Limit DOM manipulation during transitions
- Use CSS transforms instead of jQuery animate where possible
- Debounce data refresh calls
- Clear intervals on page unload

---

## Testing Checklist

### Unit Testing
- [ ] PanelCycler starts and stops correctly
- [ ] Slide transitions work smoothly
- [ ] Data filtering removes empty slides
- [ ] Each panel render function produces valid HTML

### Integration Testing
- [ ] All 4 panels cycle independently
- [ ] Data refresh doesn't interrupt cycling
- [ ] Transitions are smooth across all panels
- [ ] No memory leaks after extended running

### Visual Testing
- [ ] Text is readable in all slides
- [ ] Icons load correctly
- [ ] Colors and contrast are good
- [ ] Layout doesn't break with long content
- [ ] Scrolling works when content overflows

### Data Testing
- [ ] Test with no sports games
- [ ] Test with all sports active
- [ ] Test with weather alerts
- [ ] Test with no weather alerts
- [ ] Test with missing weather data fields

---

## Future Enhancements

### User Controls
- Pause/resume button for each panel
- Manual slide navigation (previous/next buttons)
- Panel-specific settings (cycle speed, enabled slides)
- Save preferences to localStorage

### Content Expansion
- RSS news feed integration
- Custom event calendar (Google Calendar API)
- Traffic and commute information
- Air quality index
- Pollen count

### Visual Enhancements
- Customizable color themes per panel
- Background images/videos
- Animated weather icons
- Chart visualizations (temperature trends)

### Smart Features
- Auto-prioritize panels with active alerts
- Slow down/speed up based on content amount
- Machine learning for optimal slide ordering
- Voice announcements for critical alerts

---

## Configuration

### Global Settings (config.js)
```javascript
var dashboardSettings = {
  enableCycling: true,           // Master toggle
  sportsCycleTime: 10000,        // 10 seconds per league
  calendarCycleTime: 12000,      // 12 seconds per view
  newsCycleTime: 10000,          // 10 seconds per category
  weatherCycleTime: 15000,       // 15 seconds per display
  transitionSpeed: 500,          // Fade transition speed (ms)
  dataRefreshInterval: 30000,    // Refresh data every 30s
  staggeredStart: true,          // Start panels with delay
  staggerDelay: 500,             // 500ms between panel starts
}
```

### Per-Panel Configuration
```javascript
var sportsSlides = {
  enabled: ['nfl', 'nba', 'mlb', 'nhl', 'ncaa', 'other'],
  maxGamesPerSlide: 6,
  showLogos: true,
  showRankings: true,
}

var weatherSlides = {
  enabled: ['current', 'forecast5day', 'todayTonight', 'hourly', 'nearby', 'details'],
  showUV: true,
  showMoonPhase: true,
}

// etc...
```

---

## Success Metrics

### Performance Goals
- Smooth 60fps transitions
- < 100ms render time per slide
- < 50MB total memory usage
- No frame drops during cycling

### User Experience Goals
- Content is readable for entire display duration
- Transitions feel natural and not jarring
- Information density is appropriate
- All data is current and accurate

### Technical Goals
- Modular, maintainable code
- Comprehensive error handling
- Efficient data usage (no redundant API calls)
- Easy to add new slide types

---

## Notes

- This plan builds on the existing dashboard implementation
- All current functionality is preserved
- Cycling is additive, not replacement
- Can be enabled/disabled via configuration
- Designed to work with existing weatherscan data sources
