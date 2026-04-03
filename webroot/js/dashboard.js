window.dashboardSettings = Object.assign({
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
}, window.dashboardSettings || {});

if (typeof window.sportsRawData === 'undefined') {
  window.sportsRawData = null;
}

// 4-Box Dashboard Controller - Cycling Edition
const DASHBOARD_START_DELAY_MS = 3000;
var dashboardUpdateInterval = null;
var sportsUpdateInterval = null;

function getDashboardCyclers() {
  return [sportsCycler, calendarCycler, newsCycler, weatherCycler].filter(Boolean);
}

function getDashboardPanelInitializers() {
  return [initSportsCycler, initCalendarCycler, initNewsCycler, initWeatherCycler];
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

function runDashboardInitializer(initializer) {
  try {
    initializer();
  } catch (error) {
    console.error("Error initializing cycler:", error);
  }
}

function restartDashboardIntervals() {
  if (sportsUpdateInterval) {
    clearInterval(sportsUpdateInterval);
  }

  if (dashboardUpdateInterval) {
    clearInterval(dashboardUpdateInterval);
  }

  const sportsRefreshInterval = dashboardSettings?.sportsDataRefreshInterval || 10000;
  sportsUpdateInterval = setInterval(refreshSportsPanel, sportsRefreshInterval);

  const refreshInterval = dashboardSettings?.dataRefreshInterval || 30000;
  dashboardUpdateInterval = setInterval(refreshAllPanels, refreshInterval);
}

window.advanceWeatherscanDashboardSlide = function(direction = 1) {
  return getDashboardCyclers().some((cycler) => advanceCyclerByDirection(cycler, direction));
};

window.advanceSlidesNow = function(direction = 1) {
  if (window.advanceWeatherscanDashboardSlide && window.advanceWeatherscanDashboardSlide(direction)) {
    return true;
  }

  if (window.advanceClassicSlides) {
    return window.advanceClassicSlides(direction) !== false;
  }

  return false;
};

function initDashboard() {
  console.log("Initializing 4-Box Cycling Dashboard...");
  setTimeout(initAllCyclers, DASHBOARD_START_DELAY_MS);
}

function initAllCyclers() {
  console.log("Starting panel cyclers...");

  const initializers = getDashboardPanelInitializers();
  const staggerDelay = dashboardSettings?.staggerDelay || 500;

  if (dashboardSettings?.staggeredStart) {
    initializers.forEach((initializer, index) => {
      setTimeout(() => {
        runDashboardInitializer(initializer);
      }, index * staggerDelay);
    });
  } else {
    initializers.forEach(runDashboardInitializer);
  }

  restartDashboardIntervals();
}

function refreshAllPanels() {
  console.log("Refreshing panel data...");
  refreshWeatherPanel();
  refreshNewsPanel();
  refreshCalendarPanel();
}

$(document).ready(function() {
  setTimeout(initDashboard, DASHBOARD_START_DELAY_MS);
});
