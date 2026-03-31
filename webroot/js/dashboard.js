if (typeof window.dashboardSettings === 'undefined') {
  window.dashboardSettings = {
    enableCycling: true,
    sportsCycleTime: 10000,
    calendarCycleTime: 12000,
    newsCycleTime: 10000,
    weatherCycleTime: 15000,
    transitionSpeed: 500,
    sportsDataRefreshInterval: 10000,
    dataRefreshInterval: 30000,
    staggeredStart: true,
    staggerDelay: 500,
    followedTeams: []
  };
}

if (typeof window.sportsRawData === 'undefined') {
  window.sportsRawData = null;
}
// 4-Box Dashboard Controller - Cycling Edition

var dashboardUpdateInterval;
var sportsUpdateInterval;
var allCyclersInitialized = false;

function getDashboardTeamLogoUrl(team) {
  return team?.logo || team?.logos?.[0]?.href || '';
}

function getDashboardCyclers() {
  return [sportsCycler, calendarCycler, newsCycler, weatherCycler].filter(Boolean);
}

function advanceCyclerByDirection(cycler, direction) {
  if (!cycler || !cycler.isRunning || !cycler.slides || cycler.slides.length < 2) {
    return false;
  }

  const total = cycler.slides.length;
  const nextIndex = (cycler.currentIndex + direction + total) % total;
  cycler.goToSlide(nextIndex);
  return true;
}

window.advanceWeatherscanDashboardSlide = function(direction = 1) {
  const cyclers = getDashboardCyclers();
  let advanced = false;

  cyclers.forEach((cycler) => {
    if (advanceCyclerByDirection(cycler, direction)) {
      advanced = true;
    }
  });

  return advanced;
};

window.advanceSlidesNow = function(direction = 1) {
  if (window.advanceWeatherscanDashboardSlide && window.advanceWeatherscanDashboardSlide(direction)) {
    return true;
  }

  if (window.advanceClassicSlides) {
    return window.advanceClassicSlides() !== false;
  }

  return false;
};

// Initialize dashboard with cycling panels
function initDashboard() {
  console.log("Initializing 4-Box Cycling Dashboard...");

  // Wait for data to be available
  setTimeout(() => {
    if (dashboardSettings?.enableCycling) {
      initAllCyclers();
    } else {
      // Fallback to static panels
      updateAllPanels();
      dashboardUpdateInterval = setInterval(updateAllPanels, 30000);
    }
  }, 3000);
}

// Initialize all panel cyclers
function initAllCyclers() {
  console.log("Starting panel cyclers...");

  if (dashboardSettings?.staggeredStart) {
    // Stagger the start of each cycler
    const cyclers = [
      { init: initSportsCycler, delay: 0 },
      { init: initCalendarCycler, delay: dashboardSettings.staggerDelay || 500 },
      { init: initNewsCycler, delay: (dashboardSettings.staggerDelay || 500) * 2 },
      { init: initWeatherCycler, delay: (dashboardSettings.staggerDelay || 500) * 3 }
    ];

    cyclers.forEach(cycler => {
      setTimeout(() => {
        try {
          cycler.init();
        } catch (error) {
          console.error("Error initializing cycler:", error);
        }
      }, cycler.delay);
    });
  } else {
    // Start all at once
    try {
      initSportsCycler();
      initCalendarCycler();
      initNewsCycler();
      initWeatherCycler();
    } catch (error) {
      console.error("Error initializing cyclers:", error);
    }
  }

  allCyclersInitialized = true;

  // Sports scores benefit from a faster refresh cadence than the other panels.
  const sportsRefreshInterval = dashboardSettings?.sportsDataRefreshInterval || 10000;
  sportsUpdateInterval = setInterval(() => {
    if (allCyclersInitialized) {
      refreshSportsPanel();
    }
  }, sportsRefreshInterval);

  // Set up general data refresh interval (refresh without interrupting cycles)
  const refreshInterval = dashboardSettings?.dataRefreshInterval || 30000;
  dashboardUpdateInterval = setInterval(refreshAllPanels, refreshInterval);
}

// Refresh all panels without interrupting cycles
function refreshAllPanels() {
  console.log("Refreshing panel data...");

  if (allCyclersInitialized) {
    refreshWeatherPanel();
    refreshNewsPanel();
    refreshCalendarPanel();
  }
}

// Legacy update function (for static mode)
function updateAllPanels() {
  updateSportsPanel();
  updateWeatherPanel();
  updateNewsPanel();
  updateCalendarPanel();
}

// SPORTS PANEL
function updateSportsPanel() {
  const container = $(".sports-games-list");
  container.empty();

  if (!sportsRawData || sportsRawData.length === 0) {
    container.html('<div style="text-align: center; padding: 40px; font-size: 18px;">No games available</div>');
    return;
  }

  let gameCount = 0;
  const maxGames = 6; // Show max 6 games

  for (let league of sportsRawData) {
    if (!league.events || league.events.length === 0) continue;

    for (let event of league.events) {
      if (gameCount >= maxGames) break;

      // Only show live and upcoming games
      const status = event.status?.type?.state || '';
      if (status !== 'in' && status !== 'pre') continue;

      const gameHtml = createSportsGameHTML(league, event);
      container.append(gameHtml);
      gameCount++;
    }

    if (gameCount >= maxGames) break;
  }

  if (gameCount === 0) {
    container.html('<div style="text-align: center; padding: 40px; font-size: 18px;">No live or upcoming games</div>');
  }
}

function createSportsGameHTML(league, event) {
  const status = event.status?.type?.state || '';
  const isLive = status === 'in';
  const statusText = isLive ? 'LIVE' : (event.status?.type?.shortDetail || 'Upcoming');

  const homeTeam = event.competitions?.[0]?.competitors?.find(c => c.homeAway === 'home');
  const awayTeam = event.competitions?.[0]?.competitors?.find(c => c.homeAway === 'away');

  if (!homeTeam || !awayTeam) return '';

  const homeScore = homeTeam.score || '0';
  const awayScore = awayTeam.score || '0';
  const homeLogo = getDashboardTeamLogoUrl(homeTeam.team);
  const awayLogo = getDashboardTeamLogoUrl(awayTeam.team);
  const homeName = homeTeam.team?.shortDisplayName || homeTeam.team?.displayName || '';
  const awayName = awayTeam.team?.shortDisplayName || awayTeam.team?.displayName || '';
  const leagueBadgeHtml = league.logo
    ? `<img src="${league.logo}" alt="${league.league}">`
    : `<span>${league.league}</span>`;

  return `
    <div class="sports-game">
      <div class="sports-game-header">
        <div class="sports-league-badge">
          ${leagueBadgeHtml}
        </div>
        <div class="sports-league-name">${league.league}</div>
      </div>
      <div class="sports-game-matchup">
        <div class="sports-team">
          <img class="sports-team-logo" src="${awayLogo}" alt="${awayName}">
          <span class="sports-team-name">${awayName}</span>
        </div>
        ${isLive ? `<span class="sports-score">${awayScore} - ${homeScore}</span>` : '<span class="sports-score">vs</span>'}
        <div class="sports-team">
          <span class="sports-team-name">${homeName}</span>
          <img class="sports-team-logo" src="${homeLogo}" alt="${homeName}">
        </div>
      </div>
      <div class="sports-status ${isLive ? 'live' : ''}">${statusText}</div>
    </div>
  `;
}

// WEATHER PANEL
function updateWeatherPanel() {
  if (!weatherData || !weatherData.currentConditions) {
    $(".weather-content").html('<div style="text-align: center; padding: 40px; font-size: 18px;">Loading weather...</div>');
    return;
  }

  const current = weatherData.currentConditions;
  const location = locationConfig?.mainCity?.displayname || current.cityname || 'Unknown Location';

  $(".weather-location").text(location);
  $(".weather-temp").html(current.temp + '°');
  $(".weather-condition").text(current.condition || 'Unknown');

  // Set weather icon
  const iconUrl = current.icon ? `images/icons/${current.icon}.png` : '';
  $(".weather-icon").css('background-image', `url('${iconUrl}')`);

  // Update details
  const detailsHTML = `
    <div class="weather-detail-item">
      <div class="weather-detail-label">Humidity</div>
      <div class="weather-detail-value">${current.humidity || '--'}%</div>
    </div>
    <div class="weather-detail-item">
      <div class="weather-detail-label">Wind</div>
      <div class="weather-detail-value">${current.wind || '--'} ${current.windspeed || '--'}</div>
    </div>
    <div class="weather-detail-item">
      <div class="weather-detail-label">Pressure</div>
      <div class="weather-detail-value">${current.pressure || '--'}"</div>
    </div>
    <div class="weather-detail-item">
      <div class="weather-detail-label">Gusts</div>
      <div class="weather-detail-value">${current.gusts || '--'} mph</div>
    </div>
  `;

  $(".weather-details").html(detailsHTML);
}

// NEWS PANEL
function updateNewsPanel() {
  const container = $(".news-feed");

  // For now, show weather alerts as "news"
  if (!weatherData || !weatherData.alerts || !weatherData.alerts.warnings || weatherData.alerts.warnings.length === 0) {
    container.html(getPlaceholderNews());
    return;
  }

  container.empty();

  const alerts = weatherData.alerts.warnings.slice(0, 4); // Show up to 4 alerts

  alerts.forEach(alert => {
    const alertHTML = `
      <div class="news-item">
        <div class="news-item-time">${alert.severity || 'ALERT'}</div>
        <div class="news-item-title">${alert.warningtitle || alert.headline || 'Weather Alert'}</div>
        <div class="news-item-description">${alert.warningdesc || 'No description available'}</div>
        <div class="news-item-source">National Weather Service</div>
      </div>
    `;
    container.append(alertHTML);
  });

  if (alerts.length === 0) {
    container.html(getPlaceholderNews());
  }
}

function getPlaceholderNews() {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  return `
    <div class="news-item">
      <div class="news-item-time">${timeStr}</div>
      <div class="news-item-title">No Active Weather Alerts</div>
      <div class="news-item-description">There are currently no weather alerts or warnings for your area.</div>
      <div class="news-item-source">National Weather Service</div>
    </div>
    <div class="news-item">
      <div class="news-item-time">INFO</div>
      <div class="news-item-title">Weatherscan 4-Box Dashboard</div>
      <div class="news-item-description">Welcome to your personalized weather dashboard. Weather alerts and warnings will appear here when issued.</div>
      <div class="news-item-source">Mist Weather Media</div>
    </div>
  `;
}

// CALENDAR PANEL
function updateCalendarPanel() {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  $(".calendar-date").text(dateStr);

  const eventsContainer = $(".calendar-events");
  eventsContainer.html(getTodaySchedule());
}

function getTodaySchedule() {
  const now = new Date();
  const events = [];

  // Add sunrise/sunset if available
  if (weatherData && weatherData.almanac) {
    const sunrise = weatherData.almanac.sunrise;
    const sunset = weatherData.almanac.sunset;

    if (sunrise) {
      events.push({
        time: sunrise,
        title: 'Sunrise',
        description: 'Start of daylight hours'
      });
    }

    if (sunset) {
      events.push({
        time: sunset,
        title: 'Sunset',
        description: 'End of daylight hours'
      });
    }
  }

  // Add sports games as schedule events
  if (sportsRawData && sportsRawData.length > 0) {
    let gameCount = 0;
    for (let league of sportsRawData) {
      if (!league.events || gameCount >= 3) break;

      for (let event of league.events) {
        if (gameCount >= 3) break;

        const status = event.status?.type?.state || '';
        if (status !== 'in' && status !== 'pre') continue;

        const competitors = event.competitions?.[0]?.competitors || [];
        const homeTeam = competitors.find(c => c.homeAway === 'home');
        const awayTeam = competitors.find(c => c.homeAway === 'away');

        if (!homeTeam || !awayTeam) continue;

        const eventTime = event.date ? new Date(event.date) : null;
        const timeStr = eventTime ? eventTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : 'TBA';

        events.push({
          time: timeStr,
          title: `${league.league}: ${awayTeam.team?.displayName || 'TBA'} @ ${homeTeam.team?.displayName || 'TBA'}`,
          description: event.status?.type?.shortDetail || 'Game scheduled'
        });

        gameCount++;
      }
    }
  }

  // Generate HTML for events
  if (events.length === 0) {
    return `
      <div class="calendar-event">
        <div class="calendar-event-time">All Day</div>
        <div class="calendar-event-title">No scheduled events</div>
        <div class="calendar-event-description">Check back later for updates</div>
      </div>
    `;
  }

  return events.map(event => `
    <div class="calendar-event">
      <div class="calendar-event-time">${event.time}</div>
      <div class="calendar-event-title">${event.title}</div>
      <div class="calendar-event-description">${event.description}</div>
    </div>
  `).join('');
}

// Start dashboard when page loads
$(document).ready(function() {
  // Wait for data to load, then initialize
  setTimeout(initDashboard, 3000);
});
