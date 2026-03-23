// Dashboard Calendar Panel - Cycling through schedule views

var calendarCycler = null;

function getCalendarForecastDays() {
  return Array.isArray(weatherData?.extendedForecast?.days) ? weatherData.extendedForecast.days : [];
}

function getCalendarAlmanacTimes() {
  const almanac = weatherData?.almanac || {};
  const nextMoonPhase = Array.isArray(almanac.moonphases)
    ? almanac.moonphases.find((phase) => phase?.moon && phase.moon !== 'blank')
    : null;

  return {
    sunriseToday: almanac.sunrisetoday || almanac.sunrise || '--:--',
    sunsetToday: almanac.sunsettoday || almanac.sunset || '--:--',
    sunriseTomorrow: almanac.sunrisetomorow || almanac.sunriseTomorrow || '--:--',
    sunsetTomorrow: almanac.sunsettomorrow || almanac.sunsetTomorrow || '--:--',
    moonPhase: nextMoonPhase?.moon || almanac.moon?.[0]?.moon || '--'
  };
}

/**
 * Initialize the calendar panel cycler
 */
function initCalendarCycler() {
  const slideDefinitions = [
    {
      name: 'Today Overview',
      renderFn: renderTodayOverviewSlide,
      hasDataFn: () => true // Always show
    },
    {
      name: 'Upcoming Sports',
      renderFn: renderUpcomingSportsSlide,
      hasDataFn: () => sportsRawData && sportsRawData.length > 0
    },
    {
      name: 'Tomorrow Preview',
      renderFn: renderTomorrowPreviewSlide,
      hasDataFn: () => getCalendarForecastDays().length >= 2
    }
  ];

  // Filter slides based on available data
  const activeSlides = filterSlidesByData(slideDefinitions);

  // Always show at least today's overview
  if (activeSlides.length === 0) {
    activeSlides.push(renderTodayOverviewSlide);
  }

  const cycleTime = dashboardSettings?.calendarCycleTime || 12000;

  calendarCycler = new PanelCycler('.panel-calendar', activeSlides, cycleTime, {
    transitionSpeed: dashboardSettings?.transitionSpeed || 500,
    debug: false
  });

  calendarCycler.start();
}

/**
 * Slide 1: Today's Overview
 */
function renderTodayOverviewSlide() {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const almanacTimes = getCalendarAlmanacTimes();
  const sunrise = almanacTimes.sunriseToday;
  const sunset = almanacTimes.sunsetToday;

  // Calculate day length if both times available
  let dayLength = '';
  if (sunrise !== '--:--' && sunset !== '--:--') {
    try {
      const sunriseTime = new Date(`2000-01-01 ${sunrise}`);
      const sunsetTime = new Date(`2000-01-01 ${sunset}`);
      const diff = sunsetTime - sunriseTime;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      dayLength = `${hours}h ${minutes}m`;
    } catch (e) {
      dayLength = '--';
    }
  }

  const moonPhase = almanacTimes.moonPhase;

  const html = `
    <div class="calendar-date">${dateStr}</div>
    <div class="calendar-events calendar-events--overview">
      <div class="calendar-event">
        <div class="calendar-event-time">&#9728;&#65039; ${sunrise}</div>
        <div class="calendar-event-title">Sunrise</div>
        <div class="calendar-event-description">Start of daylight hours</div>
      </div>
      <div class="calendar-event">
        <div class="calendar-event-time">&#127769; ${sunset}</div>
        <div class="calendar-event-title">Sunset</div>
        <div class="calendar-event-description">End of daylight hours</div>
      </div>
      <div class="calendar-event">
        <div class="calendar-event-time">&#9201;&#65039; ${dayLength}</div>
        <div class="calendar-event-title">Daylight</div>
        <div class="calendar-event-description">Total daylight hours today</div>
      </div>
      <div class="calendar-event">
        <div class="calendar-event-time">&#127765;</div>
        <div class="calendar-event-title">Moon Phase</div>
        <div class="calendar-event-description">${moonPhase}</div>
      </div>
    </div>
  `;

  $('.calendar-content').html(html);
}

/**
 * Slide 2: Upcoming Sports Events
 */
function renderUpcomingSportsSlide() {
  if (!sportsRawData || sportsRawData.length === 0) {
    $('.calendar-content').html('<div style="text-align: center; padding: 60px;">No sports events scheduled</div>');
    return;
  }

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  const events = [];

  // Collect upcoming games
  for (let league of sportsRawData) {
    if (!league.events || events.length >= 5) break;

    for (let event of league.events) {
      if (events.length >= 5) break;

      const status = event.status?.type?.state || '';
      if (status !== 'in' && status !== 'pre') continue;

      const competitors = event.competitions?.[0]?.competitors || [];
      const homeTeam = competitors.find(c => c.homeAway === 'home');
      const awayTeam = competitors.find(c => c.homeAway === 'away');

      if (!homeTeam || !awayTeam) continue;

      const eventTime = event.date ? new Date(event.date) : null;
      const timeStr = eventTime ? eventTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : 'TBA';
      const statusText = status === 'in' ? 'LIVE NOW' : timeStr;

      events.push({
        time: statusText,
        title: `${league.league}: ${awayTeam.team?.abbreviation || 'TBA'} @ ${homeTeam.team?.abbreviation || 'TBA'}`,
        description: event.status?.type?.shortDetail || 'Game scheduled',
        isLive: status === 'in'
      });
    }
  }

  let eventsHTML = '';
  events.forEach(event => {
    eventsHTML += `
      <div class="calendar-event ${event.isLive ? 'live-event' : ''}">
        <div class="calendar-event-time ${event.isLive ? 'live' : ''}">${event.time}</div>
        <div class="calendar-event-title">${event.title}</div>
        <div class="calendar-event-description">${event.description}</div>
      </div>
    `;
  });

  if (events.length === 0) {
    eventsHTML = '<div style="text-align: center; padding: 40px; font-size: 18px;">No upcoming games today</div>';
  }

  const html = `
    <div class="calendar-date">${dateStr}</div>
    <div class="calendar-section-title">UPCOMING GAMES</div>
    <div class="calendar-events">
      ${eventsHTML}
    </div>
  `;

  $('.calendar-content').html(html);
}

/**
 * Slide 3: Tomorrow's Preview
 */
function renderTomorrowPreviewSlide() {
  const forecastDays = getCalendarForecastDays();
  if (forecastDays.length < 2) {
    $('.calendar-content').html('<div style="text-align: center; padding: 60px;">Tomorrow forecast unavailable</div>');
    return;
  }

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dateStr = tomorrow.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  const forecast = forecastDays[1];
  const almanacTimes = getCalendarAlmanacTimes();

  // Tomorrow's sunrise/sunset (if available)
  const tomorrowSunrise = almanacTimes.sunriseTomorrow;
  const tomorrowSunset = almanacTimes.sunsetTomorrow;

  const iconUrl = forecast.icon ? `images/icons/${forecast.icon}.png` : '';

  const html = `
    <div class="calendar-date">${dateStr}</div>
    <div class="tomorrow-weather" style="text-align: center; margin-bottom: 30px;">
      <img src="${iconUrl}" alt="${forecast.cond || 'Forecast'}" style="width: 100px; height: 100px; display: block; margin: 0 auto 15px;" onerror="this.style.display='none'">
      <div style="font-size: 24px; font-weight: bold; margin-bottom: 10px;">${forecast.cond || 'Unknown'}</div>
      <div style="font-size: 36px; font-weight: bold;">
        <span style="color: #ff6b6b;">${forecast.high}&deg;</span>
        <span style="color: rgba(255,255,255,0.5); margin: 0 10px;">/</span>
        <span style="color: #4dabf7;">${forecast.low}&deg;</span>
      </div>
    </div>
    <div class="calendar-events">
      <div class="calendar-event">
        <div class="calendar-event-time">&#9728;&#65039; ${tomorrowSunrise}</div>
        <div class="calendar-event-title">Sunrise Tomorrow</div>
      </div>
      <div class="calendar-event">
        <div class="calendar-event-time">&#127769; ${tomorrowSunset}</div>
        <div class="calendar-event-title">Sunset Tomorrow</div>
      </div>
    </div>
  `;

  $('.calendar-content').html(html);
}

/**
 * Refresh calendar data without restarting cycler
 */
function refreshCalendarPanel() {
  if (calendarCycler && calendarCycler.isRunning) {
    calendarCycler.refreshCurrentSlide();
  }
}
