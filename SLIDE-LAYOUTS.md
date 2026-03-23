# Weatherscan 4-Box Dashboard - Detailed Slide Layouts

## Panel Dimensions
- Each panel: 810px × 540px
- Header: 60px height (fixed)
- Content area: 810px × 480px (scrollable if needed)
- Padding: 20px on all sides within content area
- Usable content: 770px × 440px

---

## SPORTS PANEL (Top Left) - 810×540px

### Layout Pattern (All Slides)
```
┌──────────────────────────────────────────────┐
│ SPORTS                                  60px │
├──────────────────────────────────────────────┤
│ [League Logo] LEAGUE NAME           100px    │
│ ─────────────────────────────────────────    │
│                                               │
│ Game 1                              70px     │
│ Game 2                              70px     │
│ Game 3                              70px     │
│ Game 4                              70px     │
│ Game 5                              70px     │
│ Game 6                              70px     │
│                                      420px    │
└──────────────────────────────────────────────┘
```

### Slide 1: NFL Games
**Header Section (100px)**
- NFL logo (50px × 50px) - left aligned
- "NFL" text (36px bold) - next to logo
- Horizontal divider line (3px, white 30% opacity)

**Game Cards (6 × 70px = 420px)**
Each game card:
```
┌─────────────────────────────────────────┐
│ [Away Logo] Away Team Name   vs   Home Team Name [Home Logo]  │ 25px
│            Away Score      -      Home Score                    │ 25px
│                    STATUS TEXT                                  │ 20px
└─────────────────────────────────────────┘
```

**Layout Details:**
- Team logos: 40px × 40px
- Team names: 18px font, bold
- Scores: 24px font, bold, centered
- Status: 14px, centered
  - "LIVE" in red (#e74c3c) with pulse animation
  - Time/network in gray (#95a5a6)
- Background: rgba(0,0,0,0.3)
- Border-left: 4px solid #3498db
- Padding: 12px
- Margin-bottom: 10px

**Example Content:**
```
[🦅] Eagles        28 - 24  Cowboys [⭐]
              2nd Quarter 7:42

[🦬] Bills         14 - 10  Chiefs [🏈]
                  LIVE

[🧀] Packers       vs      Vikings [V]
              Sun 1:00 PM FOX
```

### Slide 2: NBA Games
**Same layout as NFL**

**Header:**
- NBA logo + "NBA" text

**Game Cards:**
```
[#5 Lakers] #5 Lakers    102 - 98  Celtics [#1 Celtics]
                    3rd Qtr 8:45

[Warriors] Warriors      vs       Nuggets [Nuggets]
              Tonight 8:00 PM ESPN
```

**Special Features:**
- Show team rankings if available (#1-#30)
- Live scores update color: leading team in white, trailing in gray
- Quarter display: "1st Qtr", "2nd Qtr", "3rd Qtr", "4th Qtr", "OT", "FINAL"

### Slide 3: MLB Games
**Same layout**

**Header:**
- MLB logo + "MLB" text

**Game Cards:**
```
[Yankees] Yankees        5 - 3   Red Sox [Red Sox]
              Top 7th, 2 Outs

[Dodgers] Dodgers       vs      Giants [Giants]
              7:10 PM MLB.TV
```

**Special Features:**
- Inning display: "Top 1st", "Bot 3rd", "Top 9th", "FINAL"
- Outs display when live
- Pitcher stats if available (optional)

### Slide 4: NHL Games
**Same layout**

**Header:**
- NHL logo + "NHL" text

**Game Cards:**
```
[Maple Leafs] Maple Leafs  3 - 2  Canadiens [Canadiens]
                  2nd Period 12:34

[Penguins] Penguins      vs     Capitals [Capitals]
                7:00 PM ESPN+
```

**Special Features:**
- Period display: "1st Period", "2nd Period", "3rd Period", "OT", "SO" (shootout)
- Time remaining in period
- Power play indicator if applicable

### Slide 5: College Basketball (NCAAB/NCAAW)
**Same layout**

**Header:**
- NCAA logo + "COLLEGE BASKETBALL" text (smaller font, 28px)

**Game Cards:**
```
[#3 Duke] #3 Duke        72 - 68  #12 UNC [#12 UNC]
               FINAL - Men's

[#1 South Carolina] #1 South Carolina  vs  #5 UConn [#5 UConn]
                    6:00 PM ESPN - Women's
```

**Special Features:**
- Rankings prominently displayed (#1-#25)
- "Men's" or "Women's" label in status line
- Conference tournament info if applicable

### Slide 6: Other Sports (EPL, WNBA, PWHL, WBC)
**Modified layout - show league badge per game**

**Header:**
- "OTHER SPORTS" text only (no single logo)

**Game Cards (with league badges):**
```
[EPL] Manchester United  2 - 1  Liverpool [Liverpool]
                   LIVE - 67'

[WNBA] Storm            vs     Liberty [Liberty]
              3:00 PM ABC

[PWHL] Toronto          4 - 2  Montreal [Montreal]
                FINAL - OT
```

**Layout:**
- League badge (30px × 30px) on left side of each card
- Slightly tighter spacing to fit varied content

---

## CALENDAR PANEL (Top Right) - 810×540px

### Slide 1: Today's Overview
```
┌──────────────────────────────────────────────┐
│ TODAY'S SCHEDULE                        60px │
├──────────────────────────────────────────────┤
│                                               │
│     Friday, March 7, 2026              80px  │
│                                               │
│ ┌─────────────────────────────────────┐      │
│ │ ☀️ 6:47 AM                          │ 80px │
│ │ Sunrise                             │      │
│ │ Start of daylight hours             │      │
│ └─────────────────────────────────────┘      │
│                                               │
│ ┌─────────────────────────────────────┐      │
│ │ 🌙 6:23 PM                          │ 80px │
│ │ Sunset                              │      │
│ │ End of daylight hours               │      │
│ └─────────────────────────────────────┘      │
│                                               │
│ ┌─────────────────────────────────────┐      │
│ │ ⏱️ 11h 36m                          │ 80px │
│ │ Daylight                            │      │
│ │ Total daylight hours today          │      │
│ └─────────────────────────────────────┘      │
│                                               │
│ ┌─────────────────────────────────────┐      │
│ │ 🌔 Waxing Gibbous                   │ 80px │
│ │ Moon Phase                          │      │
│ └─────────────────────────────────────┘      │
└──────────────────────────────────────────────┘
```

**Layout Details:**
- Date: 28px font, centered, bold, 30px margin-bottom
- Event cards: 4 cards × 80px each
- Card structure:
  - Emoji + Time/Value: 18px bold, purple tint (#e1bee7)
  - Title: 20px bold, white
  - Description: 14px, light gray (#bdc3c7)
- Card styling:
  - Background: rgba(0,0,0,0.3)
  - Border-left: 4px solid #9b59b6
  - Padding: 12px
  - Border-radius: 8px
  - Margin-bottom: 12px

### Slide 2: Upcoming Sports Events
```
┌──────────────────────────────────────────────┐
│ TODAY'S SCHEDULE                        60px │
├──────────────────────────────────────────────┤
│     Friday, March 7                    50px  │
│     UPCOMING GAMES                     40px  │
│                                               │
│ ┌─────────────────────────────────────┐      │
│ │ 🔴 LIVE NOW                         │ 70px │
│ │ NBA: LAL @ BOS                      │      │
│ │ 3rd Quarter, 8:42 remaining         │      │
│ └─────────────────────────────────────┘      │
│                                               │
│ ┌─────────────────────────────────────┐      │
│ │ 7:00 PM                             │ 70px │
│ │ NFL: KC @ BUF                       │      │
│ │ Sunday Night Football - NBC         │      │
│ └─────────────────────────────────────┘      │
│                                               │
│ ┌─────────────────────────────────────┐      │
│ │ 8:30 PM                             │ 70px │
│ │ NHL: TOR @ MTL                      │      │
│ │ Hockey Night in Canada              │      │
│ └─────────────────────────────────────┘      │
│                                               │
│ [More events...]                             │
└──────────────────────────────────────────────┘
```

**Layout Details:**
- Date: 24px, centered
- Section title "UPCOMING GAMES": 20px bold, purple (#9b59b6), centered
- Live events: Red border-left (#e74c3c), red time with pulse
- Scheduled events: Standard purple border
- Up to 5 events shown
- Each event card: 70px height
- Time: 18px bold (red if live, purple if upcoming)
- Title: 20px bold (league: teams)
- Description: 14px gray

### Slide 3: Tomorrow's Preview
```
┌──────────────────────────────────────────────┐
│ TODAY'S SCHEDULE                        60px │
├──────────────────────────────────────────────┤
│     Saturday, March 8, 2026            50px  │
│                                               │
│         [Weather Icon]                 100px │
│            🌤️                                 │
│                                               │
│       Partly Cloudy                    30px  │
│                                               │
│        72° / 58°                       50px  │
│      (High / Low)                             │
│                                               │
│ ┌─────────────────────────────────────┐      │
│ │ ☀️ 6:46 AM                          │ 60px │
│ │ Sunrise Tomorrow                    │      │
│ └─────────────────────────────────────┘      │
│                                               │
│ ┌─────────────────────────────────────┐      │
│ │ 🌙 6:24 PM                          │ 60px │
│ │ Sunset Tomorrow                     │      │
│ └─────────────────────────────────────┘      │
└──────────────────────────────────────────────┘
```

**Layout Details:**
- Date: 28px, centered
- Weather icon: 100px × 100px, centered, margin 20px auto
- Condition: 24px bold, centered
- Temperature: 36px bold, centered
  - High in red (#ff6b6b)
  - "/" separator in gray
  - Low in blue (#4dabf7)
- Explanation text: 14px gray, centered
- Sun cards: 2 × 60px

### Slide 4: Week at a Glance
```
┌──────────────────────────────────────────────┐
│ TODAY'S SCHEDULE                        60px │
├──────────────────────────────────────────────┤
│       WEEK AT A GLANCE                 50px  │
│                                               │
│ ┌───┬───┬───┬───┬───┬───┬───┐              │
│ │Fri│Sat│Sun│Mon│Tue│Wed│Thu│         60px │
│ ├───┼───┼───┼───┼───┼───┼───┤              │
│ │ ☀️│🌤️ │⛅│🌧️ │⛈️ │🌤️ │☀️ │        80px │
│ ├───┼───┼───┼───┼───┼───┼───┤              │
│ │72°│75°│68°│65°│62°│70°│73°│         40px │
│ │58°│60°│55°│48°│50°│55°│60°│         40px │
│ └───┴───┴───┴───┴───┴───┴───┘              │
│                                      260px   │
└──────────────────────────────────────────────┘
```

**Layout Details:**
- Title: 24px bold, centered, purple
- Grid: 7 columns (one per day)
- Each column width: ~110px
- Row 1: Day names (16px bold)
- Row 2: Weather icons (60px × 60px)
- Row 3: High temp (20px bold, red)
- Row 4: Low temp (18px, blue)
- Grid styling:
  - Background: rgba(0,0,0,0.3) per cell
  - Border: 1px solid rgba(255,255,255,0.1)
  - Padding: 8px
  - Border-radius: 8px
  - Gap: 6px between cells

---

## NEWS PANEL (Bottom Left) - 810×540px

### General Layout Pattern
```
┌──────────────────────────────────────────────┐
│ NEWS                                    60px │
├──────────────────────────────────────────────┤
│                                               │
│ ┌─────────────────────────────────────┐      │
│ │ TIME/CATEGORY                       │      │
│ │ Headline Title                      │ 100px│
│ │ Description text goes here with     │      │
│ │ details about the story...          │      │
│ │ Source Name                         │      │
│ └─────────────────────────────────────┘      │
│                                               │
│ ┌─────────────────────────────────────┐      │
│ │ TIME/CATEGORY                       │ 100px│
│ │ Headline Title                      │      │
│ │ Description...                      │      │
│ │ Source Name                         │      │
│ └─────────────────────────────────────┘      │
│                                               │
│ [More items...]                      480px   │
└──────────────────────────────────────────────┘
```

### Slide 1: Weather Alerts (Priority Slide - Only Shows When Active)
```
┌──────────────────────────────────────────────┐
│ NEWS                                    60px │
├──────────────────────────────────────────────┤
│                                               │
│ ┌─────────────────────────────────────┐      │
│ │ ⚠️ SEVERE                           │      │
│ │ Tornado Warning                     │ 120px│
│ │ A tornado warning has been issued   │      │
│ │ for your area until 8:00 PM. Take   │      │
│ │ immediate shelter in a basement or  │      │
│ │ interior room.                      │      │
│ │ National Weather Service            │      │
│ └─────────────────────────────────────┘      │
│                                               │
│ ┌─────────────────────────────────────┐      │
│ │ ⚠️ MODERATE                         │ 120px│
│ │ Flash Flood Watch                   │      │
│ │ Heavy rainfall may cause flooding   │      │
│ │ in low-lying areas...               │      │
│ │ National Weather Service            │      │
│ └─────────────────────────────────────┘      │
│                                               │
│ [More alerts if available]           480px   │
└──────────────────────────────────────────────┘
```

**Layout Details:**
- Up to 4 alert cards shown
- Card height: variable (100-140px depending on content)
- Severity colors:
  - EXTREME: Dark red border (#8b0000)
  - SEVERE: Red border (#ff0000)
  - MODERATE: Orange border (#ff8c00)
  - MINOR: Yellow border (#ffff00)
- Time/Severity: 14px bold, colored to match border
- Title: 20px bold, white
- Description: 16px, line-height 1.4, white
- Source: 12px italic, light gray (#bdc3c7)
- Card styling:
  - Border-left: 4px solid [severity color]
  - Padding: 15px
  - Margin-bottom: 12px

### Slide 2: Local Weather News
```
┌──────────────────────────────────────────────┐
│ NEWS                                    60px │
├──────────────────────────────────────────────┤
│                                               │
│ ┌─────────────────────────────────────┐      │
│ │ 6:15 PM                             │      │
│ │ Current Conditions in Lexington     │ 110px│
│ │ 72° and Partly Cloudy. Humidity at  │      │
│ │ 65% with winds SSW at 8 mph.        │      │
│ │ Local Weather Report                │      │
│ └─────────────────────────────────────┘      │
│                                               │
│ ┌─────────────────────────────────────┐      │
│ │ HEAT                                │ 110px│
│ │ Hot Weather Advisory                │      │
│ │ Temperatures reaching 95° today.    │      │
│ │ Stay hydrated and limit outdoor     │      │
│ │ activities during peak hours.       │      │
│ │ Weather Safety                      │      │
│ └─────────────────────────────────────┘      │
│                                               │
│ [More weather news if conditions warrant]    │
└──────────────────────────────────────────────┘
```

**Smart Content Rules:**
- Current conditions: Always shown first
- Heat advisory: Shown when temp ≥ 90°F
- Cold warning: Shown when temp ≤ 32°F
- Wind advisory: Shown when sustained winds ≥ 25 mph
- 2-4 cards total

### Slide 3: Sports Headlines
```
┌──────────────────────────────────────────────┐
│ NEWS                                    60px │
├──────────────────────────────────────────────┤
│                                               │
│ ┌─────────────────────────────────────┐      │
│ │ 🔴 NBA LIVE                         │      │
│ │ Lakers 102, Celtics 98              │ 100px│
│ │ Game in progress. LeBron James has  │      │
│ │ 28 points, 7 assists.               │      │
│ │ ESPN                                │      │
│ └─────────────────────────────────────┘      │
│                                               │
│ ┌─────────────────────────────────────┐      │
│ │ NFL FINAL                           │ 100px│
│ │ Chiefs 27, Bills 24                 │      │
│ │ Chiefs win. Patrick Mahomes 3 TDs.  │      │
│ │ ESPN                                │      │
│ └─────────────────────────────────────┘      │
│                                               │
│ ┌─────────────────────────────────────┐      │
│ │ MLB PRE-GAME                        │ 100px│
│ │ Yankees vs Red Sox                  │      │
│ │ First pitch 7:05 PM at Fenway Park  │      │
│ │ ESPN                                │      │
│ └─────────────────────────────────────┘      │
│                                               │
│ [4th headline if available]          480px   │
└──────────────────────────────────────────────┘
```

**Layout Details:**
- Show live and final games only (not pre-game unless no live/final)
- Up to 4 headlines
- League + Status: 14px bold, colored (red for LIVE, white for FINAL)
- Score: 20px bold in title
- Details: 16px (top performer stats if available)
- Source: ESPN logo or text

### Slide 4: Weather Forecast Summary
```
┌──────────────────────────────────────────────┐
│ NEWS                                    60px │
├──────────────────────────────────────────────┤
│                                               │
│ ┌─────────────────────────────────────┐      │
│ │ TODAY                               │      │
│ │ Partly Cloudy                       │ 110px│
│ │ High of 72°, low of 58°. Partly     │      │
│ │ cloudy conditions expected.         │      │
│ │ Lexington Forecast                  │      │
│ └─────────────────────────────────────┘      │
│                                               │
│ ┌─────────────────────────────────────┐      │
│ │ TOMORROW                            │ 110px│
│ │ Mostly Sunny                        │      │
│ │ Saturday: High 75°, Low 60°.        │      │
│ │ Lexington Forecast                  │      │
│ └─────────────────────────────────────┘      │
│                                               │
│ ┌─────────────────────────────────────┐      │
│ │ WEEKEND                             │ 110px│
│ │ Weekend Weather Outlook             │      │
│ │ Saturday: 75°/60°, Sunday: 68°/55°  │      │
│ │ Lexington Forecast                  │      │
│ └─────────────────────────────────────┘      │
└──────────────────────────────────────────────┘
```

**Layout:**
- 3 cards: Today, Tomorrow, Weekend
- Category: 14px bold, colored (#3498db for TODAY, #9b59b6 for others)
- Title: 20px bold (condition name)
- Description: 16px, forecast narrative
- Source: Location name + "Forecast"

### Slide 5: Almanac & Trivia
```
┌──────────────────────────────────────────────┐
│ NEWS                                    60px │
├──────────────────────────────────────────────┤
│                                               │
│ ┌─────────────────────────────────────┐      │
│ │ SUN & MOON                          │      │
│ │ Celestial Events for March 7        │ 120px│
│ │ Sunrise at 6:47 AM, sunset at       │      │
│ │ 6:23 PM. Moon phase: Waxing Gibbous │      │
│ │ Astronomical Almanac                │      │
│ └─────────────────────────────────────┘      │
│                                               │
│ ┌─────────────────────────────────────┐      │
│ │ TOMORROW                            │ 100px│
│ │ Tomorrow's Sun Times                │      │
│ │ Sunrise at 6:46 AM, sunset at 6:24  │      │
│ │ PM.                                 │      │
│ │ Astronomical Almanac                │      │
│ └─────────────────────────────────────┘      │
│                                               │
│ ┌─────────────────────────────────────┐      │
│ │ SEASON                              │ 100px│
│ │ Spring 2026                         │      │
│ │ Enjoy the spring season! Watch for  │      │
│ │ rapidly changing weather conditions.│      │
│ │ Seasonal Guide                      │      │
│ └─────────────────────────────────────┘      │
└──────────────────────────────────────────────┘
```

**Layout:**
- 3 informational cards
- Category: 14px bold, gold/yellow tint (#f39c12)
- Educational and seasonal information
- Moon phases, sun times, seasonal tips

### Slide 6: Community Info
```
┌──────────────────────────────────────────────┐
│ NEWS                                    60px │
├──────────────────────────────────────────────┤
│                                               │
│ ┌─────────────────────────────────────┐      │
│ │ WELCOME                             │      │
│ │ Mist Digital Cable                  │ 110px│
│ │ Your personalized 4-panel weather   │      │
│ │ and information dashboard.          │      │
│ │ Version 1.22                        │      │
│ └─────────────────────────────────────┘      │
│                                               │
│ ┌─────────────────────────────────────┐      │
│ │ INFO                                │ 110px│
│ │ Dashboard Features                  │      │
│ │ Live sports scores, current weather,│      │
│ │ extended forecasts, and your daily  │      │
│ │ schedule - all in one view.         │      │
│ │ Mist Weather Media                  │      │
│ └─────────────────────────────────────┘      │
│                                               │
│ ┌─────────────────────────────────────┐      │
│ │ TIP                                 │ 100px│
│ │ Stay Informed                       │      │
│ │ Weather alerts and warnings will    │      │
│ │ appear in this panel when issued.   │      │
│ │ Safety Reminder                     │      │
│ └─────────────────────────────────────┘      │
└──────────────────────────────────────────────┘
```

**Layout:**
- Provider/app information
- Tips for using the dashboard
- Shown when no other critical news

---

## WEATHER PANEL (Bottom Right) - 810×540px

### Slide 1: Current Conditions
```
┌──────────────────────────────────────────────┐
│ CURRENT CONDITIONS                      60px │
├──────────────────────────────────────────────┤
│                                               │
│          Lexington, KY                 40px  │
│                                               │
│      [Icon]          72°               150px │
│      🌤️                                      │
│                                               │
│       Partly Cloudy                    40px  │
│                                               │
│ ┌────────────┬────────────┐                  │
│ │ Humidity   │ Wind       │           50px   │
│ │    65%     │  SSW 8 mph │                  │
│ ├────────────┼────────────┤                  │
│ │ Pressure   │ Gusts      │           50px   │
│ │   30.12"   │  12 mph    │                  │
│ └────────────┴────────────┘          100px   │
│                                      430px    │
└──────────────────────────────────────────────┘
```

**Layout Details:**
- Location: 32px bold, centered, top margin 20px
- Icon + Temp layout:
  - Icon: 150px × 150px, left side
  - Temp: 80px bold, right side, vertically centered with icon
  - Flexbox horizontal layout
  - Centered on page
  - Gap: 30px between icon and temp
- Condition: 28px bold, centered, margin 15px
- Details Grid: 2×2 grid
  - Grid gap: 15px
  - Each cell:
    - Background: rgba(0,0,0,0.3)
    - Padding: 12px
    - Border-radius: 8px
    - Text-align: center
  - Label: 16px, gray (#bdc3c7), margin-bottom 5px
  - Value: 24px bold, white

### Slide 2: 5-Day Forecast
```
┌──────────────────────────────────────────────┐
│ CURRENT CONDITIONS                      60px │
├──────────────────────────────────────────────┤
│          Lexington, KY                 40px  │
│        5-DAY FORECAST                  40px  │
│                                               │
│ ┌───┬───┬───┬───┬───┐                       │
│ │Fri│Sat│Sun│Mon│Tue│                  40px │
│ ├───┼───┼───┼───┼───┤                       │
│ │ ☀️│🌤️ │⛅│🌧️ │⛈️ │                  80px │
│ ├───┼───┼───┼───┼───┤                       │
│ │Sunny│P.Cloudy│...│...│...│          60px │
│ ├───┼───┼───┼───┼───┤                       │
│ │72°│75°│68°│65°│62°│                  40px │
│ │58°│60°│55°│48°│50°│                  40px │
│ └───┴───┴───┴───┴───┘                       │
│                                      300px   │
└──────────────────────────────────────────────┘
```

**Layout Details:**
- Location: 32px bold, centered
- Title "5-DAY FORECAST": 24px bold, centered, margin-bottom 20px
- Grid: 5 columns × 5 rows
  - Column width: ~154px each
  - Row heights: 40px, 80px, 60px, 40px, 40px
- Row 1: Day names (16px bold)
- Row 2: Weather icons (70px × 70px, centered)
- Row 3: Condition text (14px, line-height 1.2, max 2 lines, ellipsis)
- Row 4: High temp (22px bold, red #ff6b6b)
- Row 5: Low temp (20px, blue #4dabf7)
- Grid styling:
  - Background per cell: rgba(0,0,0,0.3)
  - Padding: 10px 5px
  - Border-radius: 8px
  - Gap: 8px

### Slide 3: Today & Tonight
```
┌──────────────────────────────────────────────┐
│ CURRENT CONDITIONS                      60px │
├──────────────────────────────────────────────┤
│          Lexington, KY                 40px  │
│                                               │
│ ┌──────────────────┬──────────────────┐      │
│ │  THIS AFTERNOON  │     TONIGHT      │ 40px │
│ ├──────────────────┼──────────────────┤      │
│ │                  │                  │      │
│ │   Partly cloudy  │  Mostly clear    │      │
│ │   with a slight  │  with lows in    │ 180px│
│ │   chance of      │  the upper 50s.  │      │
│ │   showers. Highs │  Light winds     │      │
│ │   in the low     │  from the south. │      │
│ │   70s.           │                  │      │
│ │                  │                  │      │
│ │   High: 72°      │   Low: 58°       │ 40px │
│ │                  │                  │      │
│ └──────────────────┴──────────────────┘      │
│                                      300px    │
└──────────────────────────────────────────────┘
```

**Layout Details:**
- Location: 32px bold, centered, margin-bottom 20px
- 2-column grid layout
  - Column width: 50% each (385px)
  - Gap: 15px
- Column headers:
  - Background: rgba(0,0,0,0.5)
  - Padding: 12px
  - Font: 20px bold
  - Text-align: center
- Forecast text:
  - Padding: 20px
  - Font: 16px
  - Line-height: 1.5
  - Text-align: left
  - Min-height: 180px
- Temperature footer:
  - Font: 24px bold
  - High in red, Low in blue
  - Centered in each column
  - Padding: 15px
  - Background: rgba(0,0,0,0.4)

### Slide 4: Nearby Cities
```
┌──────────────────────────────────────────────┐
│ CURRENT CONDITIONS                      60px │
├──────────────────────────────────────────────┤
│          Lexington, KY                 40px  │
│        NEARBY CITIES                   40px  │
│                                               │
│ ┌───────────┬───────────┬───────────┐        │
│ │Louisville │Cincinnati │Frankfort  │  130px│
│ │   🌤️      │    ☀️     │    ⛅    │        │
│ │   70°     │   73°     │   68°     │        │
│ │  SW 6 mph │  S 8 mph  │  SSW 5 mph│        │
│ ├───────────┼───────────┼───────────┤        │
│ │Georgetown │Richmond   │Nicholasville│130px│
│ │   ☁️      │    🌤️     │    ☀️     │        │
│ │   69°     │   71°     │   72°     │        │
│ │  W 7 mph  │ SW 6 mph  │  S 9 mph  │        │
│ └───────────┴───────────┴───────────┘        │
│                                      300px    │
└──────────────────────────────────────────────┘
```

**Layout Details:**
- Location: 32px bold, centered
- Title "NEARBY CITIES": 24px bold, centered, margin-bottom 20px
- Grid: 3 columns × 2 rows
  - Column width: ~256px each
  - Row height: 130px each
- Each city cell:
  - City name: 18px bold, centered
  - Icon: 50px × 50px, centered, margin 10px auto
  - Temperature: 24px bold, centered
  - Wind: 14px, centered, gray (#bdc3c7)
  - Background: rgba(0,0,0,0.3)
  - Padding: 15px 10px
  - Border-radius: 8px
- Grid gap: 12px

### Slide 5: Weather Details Extended
```
┌──────────────────────────────────────────────┐
│ CURRENT CONDITIONS                      60px │
├──────────────────────────────────────────────┤
│          Lexington, KY                 40px  │
│       WEATHER DETAILS                  40px  │
│                                               │
│ ┌──────────┬──────────┬──────────┐           │
│ │Feels Like│ Humidity │   Wind   │    90px  │
│ │   72°    │   65%    │ SSW 8mph │           │
│ ├──────────┼──────────┼──────────┤           │
│ │  Gusts   │ Pressure │ UV Index │    90px  │
│ │  12 mph  │  30.12"  │    5     │           │
│ ├──────────┼──────────┼──────────┤           │
│ │ Sunrise  │  Sunset  │ Daylight │    90px  │
│ │ 6:47 AM  │ 6:23 PM  │ 11h 36m  │           │
│ └──────────┴──────────┴──────────┘           │
│                                      310px    │
└──────────────────────────────────────────────┘
```

**Layout Details:**
- Location: 32px bold, centered
- Title "WEATHER DETAILS": 24px bold, centered, margin-bottom 20px
- Grid: 3 columns × 3 rows
  - Column width: ~256px each
  - Row height: 90px each
- Each detail cell:
  - Label: 16px, gray (#bdc3c7), centered, margin-bottom 8px
  - Value: 24px bold, white, centered
  - Background: rgba(0,0,0,0.3)
  - Padding: 15px
  - Border-radius: 8px
  - Text-align: center
- Grid gap: 12px

---

## COLOR PALETTE

### Panel Backgrounds (Gradients)
- Sports: `linear-gradient(135deg, #2c3e50 0%, #34495e 100%)` - Dark blue-gray
- Calendar: `linear-gradient(135deg, #8e44ad 0%, #9b59b6 100%)` - Purple
- News: `linear-gradient(135deg, #c0392b 0%, #e74c3c 100%)` - Red
- Weather: `linear-gradient(135deg, #16a085 0%, #1abc9c 100%)` - Teal/green

### Text Colors
- Primary text: `#ffffff` (white)
- Secondary text: `#ecf0f1` (off-white)
- Tertiary/labels: `#bdc3c7` (light gray)
- Muted text: `#95a5a6` (gray)

### Accent Colors
- Sports accent: `#3498db` (blue)
- Calendar accent: `#9b59b6` (purple)
- News accent: `#e74c3c` (red)
- Weather accent: `#1abc9c` (teal)

### Status Colors
- Live/Active: `#e74c3c` (red) with pulse
- High temp: `#ff6b6b` (warm red)
- Low temp: `#4dabf7` (cool blue)
- Success/positive: `#2ecc71` (green)
- Warning: `#f39c12` (orange)
- Error/severe: `#c0392b` (dark red)

### Background Elements
- Card background: `rgba(0, 0, 0, 0.3)`
- Darker card: `rgba(0, 0, 0, 0.5)`
- Border/divider: `rgba(255, 255, 255, 0.1)` to `rgba(255, 255, 255, 0.3)`

---

## TYPOGRAPHY

### Font Stack
```css
font-family: 'Berthold Akzidenz Grotesk BE Bold', 'Helvetica Neue', Arial, sans-serif;
```

### Font Sizes by Element
- Panel headers: 32px bold, uppercase, letter-spacing 2px
- Slide titles: 24-28px bold
- Section headers: 20-24px bold
- Body text: 16-18px regular
- Secondary text: 14-16px regular
- Small text/captions: 12-14px regular
- Large display (temps): 80px bold
- Medium display (scores): 24-36px bold

### Line Heights
- Headers: 1.2
- Body text: 1.4-1.5
- Dense text (forecasts): 1.3

---

## ANIMATIONS & TRANSITIONS

### Fade Transitions
```css
/* Fade out */
@keyframes dashboardFadeOut {
  from { opacity: 1; transform: scale(1); }
  to { opacity: 0; transform: scale(0.98); }
}

/* Fade in */
@keyframes dashboardFadeIn {
  from { opacity: 0; transform: scale(1.02); }
  to { opacity: 1; transform: scale(1); }
}
```
- Duration: 500ms
- Easing: ease-out (fade out), ease-in (fade in)

### Live Pulse (for live events)
```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}
```
- Duration: 2s
- Infinite loop

### Slide Up/Down (Calendar only)
```css
/* Slide out */
@keyframes slideUp {
  from { transform: translateY(0); opacity: 1; }
  to { transform: translateY(-30px); opacity: 0; }
}

/* Slide in */
@keyframes slideDown {
  from { transform: translateY(30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
```

---

## RESPONSIVE CONSIDERATIONS

### Overflow Handling
- News items: Allow scrolling if content exceeds 480px height
- Sports games: Limit to 6 games, no scrolling
- Weather details: Fixed height grids, no scrolling
- Calendar events: Limit to visible area

### Text Truncation
- Team names: Max 15 characters, ellipsis
- Headlines: Max 2 lines, ellipsis
- Descriptions: Max 4 lines, ellipsis

### Icon Fallbacks
- If icon fails to load: Hide with `onerror="this.style.display='none'"`
- Emoji fallbacks available for key elements
- Alt text for accessibility

---

## ACCESSIBILITY

### Contrast Ratios
- All text on backgrounds: Minimum 4.5:1 ratio
- Headers on backgrounds: Minimum 3:1 ratio
- Use semi-transparent dark overlays on cards for legibility

### Focus States
- Not applicable for this dashboard (no interactive elements in panels)

### Screen Readers
- Semantic HTML structure
- Proper heading hierarchy
- Alt text on all images/icons

---

## DATA REQUIREMENTS

### Minimum Data for Each Slide

**Sports:**
- League name, logo URL
- Team names, logos, scores
- Game status (pre/in/post)
- Time or status text

**Calendar:**
- Current date
- Sunrise/sunset times
- Weather forecast data (tomorrow, 7-day)
- Sports schedule data

**News:**
- Weather alerts (if active)
- Current conditions
- Sports game results
- Forecast data

**Weather:**
- Current conditions (all fields)
- Extended forecast (5-7 days)
- Day descriptions (today/tonight)
- Nearby cities data
- Almanac data (sunrise/sunset)

### Fallbacks
- "Loading..." for missing data
- "No data available" for empty datasets
- Skip slides with no data
- Always show at least 1 slide per panel

---

This specification provides exact layouts for every slide. Use this to rebuild the slides with proper sizing, spacing, and visual hierarchy.
