// Dashboard Weather Panel - Cycling through weather displays

var weatherCycler = null;
var dashboardLocradar = null;
var dashboardRadarTimestamps = [];
var dashboardRadarAnimation = null;
var dashboardClockInterval = null;
var lexingtonRadarCenter = { lat: 38.0406, lon: -84.5037 };
var dashboardRadarCropWidth = 540;
var dashboardRadarCropHeight = 360;
var dashboardXlMapWidth = 4952;
var dashboardXlMapHeight = 2896;
var dashboardXlMapLeft = -128.225218;
var dashboardXlMapRight = -64.0593194;
var dashboardXlMapBottom = 21.1857919148503;

function convertDashboardGeoToPixel(latitude, longitude) {
  var mapLonDelta = dashboardXlMapRight - dashboardXlMapLeft;
  var mapLatBottomDegree = (dashboardXlMapBottom * Math.PI) / 180;
  var x = (longitude - dashboardXlMapLeft) * (dashboardXlMapWidth / mapLonDelta);

  latitude = (latitude * Math.PI) / 180;
  var worldMapWidth = ((dashboardXlMapWidth / mapLonDelta) * 360) / (2 * Math.PI);
  var mapOffsetY = (worldMapWidth / 2) * Math.log((1 + Math.sin(mapLatBottomDegree)) / (1 - Math.sin(mapLatBottomDegree)));
  var mainLat = parseFloat(locationConfig?.mainCity?.lat);
  var safeMainLat = Number.isFinite(mainLat) ? mainLat : lexingtonRadarCenter.lat;
  var y = (
    dashboardXlMapHeight -
    ((worldMapWidth / 2) * Math.log((1 + Math.sin(latitude)) / (1 - Math.sin(latitude))) - mapOffsetY) -
    ((safeMainLat - 40.6557) * 5)
  );

  return [x, y];
}

function getDashboardRadarCenter() {
  const mainLat = parseFloat(locationConfig?.mainCity?.lat);
  const mainLon = parseFloat(locationConfig?.mainCity?.lon);
  const safeMainLat = Number.isFinite(mainLat) && mainLat !== 0 ? mainLat : lexingtonRadarCenter.lat;
  const safeMainLon = Number.isFinite(mainLon) && mainLon !== 0 ? mainLon : lexingtonRadarCenter.lon;

  getMapAdjustedCenters(safeMainLat, safeMainLon);

  const rawLocalLat = parseFloat(locationConfig?.radar?.localCoords?.lat);
  const rawLocalLon = parseFloat(locationConfig?.radar?.localCoords?.lon);

  return {
    lat: Number.isFinite(rawLocalLat) && rawLocalLat !== 0 ? rawLocalLat : safeMainLat,
    lon: Number.isFinite(rawLocalLon) && rawLocalLon !== 0 ? rawLocalLon : safeMainLon
  };
}

function applyDashboardRadarBasemapPosition() {
  const center = getDashboardRadarCenter();
  const xy = convertDashboardGeoToPixel(center.lat, center.lon);
  const style = "left: " + -(xy[0] - dashboardRadarCropWidth / 2) + "px; top: " + -(xy[1] - dashboardRadarCropHeight / 2) + "px;";

  $('.dashboard-radar-map-base, .dashboard-radar-map-cities, .dashboard-radar-map-cities-top').attr('style', style);
}

function applyDashboardRadarCenter() {
  applyDashboardRadarBasemapPosition();

  if (!dashboardLocradar) return;
  const center = getDashboardRadarCenter();
  dashboardLocradar.jumpTo({
    center: [center.lon, center.lat],
    zoom: 7,
    bearing: 0,
    pitch: 0
  });
}

function setWeatherPanelHeader(title) {
  $('.panel-weather .panel-header').text(title);
}

function applyLegacyIcon(selector, iconCode, windSpeed) {
  const $icon = $(selector);
  if ($icon.length === 0) return;
  getIcon($icon, iconCode, windSpeed || 0);
}

function syncDashboardClock() {
  const now = new Date();
  const weekday = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const timeText = now.toLocaleTimeString('en-US', {
    hour: 'numeric',
    hour12: true,
    minute: 'numeric',
    second: 'numeric'
  }).toUpperCase();
  const dateText = `${weekday[now.getDay()]} ${now.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  }).toUpperCase()}`;

  $('.dashboard-weather-time').text(timeText);
  $('.dashboard-weather-date').text(dateText);
}

function formatDashboardRadarTimestamp(timestamp) {
  if (!timestamp) {
    return '';
  }

  const millis = String(timestamp).length > 10 ? Number(timestamp) : Number(timestamp) * 1000;
  const date = new Date(millis);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  }).toUpperCase();
}

function updateDashboardRadarTimestamp(timestamp) {
  const formatted = formatDashboardRadarTimestamp(timestamp);
  $('.dashboard-radar-timestamp-value').text(formatted || '--');
}

function ensureDashboardClock() {
  if (!$('.panel-sports .dashboard-weather-clock').length) {
    $('.panel-sports').append(`
      <div class="dashboard-weather-clock">
        <div class="dashboard-weather-time"></div>
        <div class="dashboard-weather-date"></div>
      </div>
    `);
  }

  syncDashboardClock();

  if (!dashboardClockInterval) {
    dashboardClockInterval = setInterval(syncDashboardClock, 1000);
  }
}

function getWeatherSlideDefinitions() {
  return [
    {
      name: 'Current Conditions',
      renderFn: renderCurrentConditionsSlide,
      hasDataFn: () => weatherData && weatherData.currentConditions && weatherData.currentConditions.temp !== ''
    },
    {
      name: '5-Day Forecast',
      renderFn: renderFiveDayForecastSlide,
      hasDataFn: () => weatherData && weatherData.extendedForecast && weatherData.extendedForecast.days && weatherData.extendedForecast.days.some(d => d.dayname !== '')
    },
    {
      name: 'Nearby Cities',
      renderFn: renderNearbyCitiesSlide,
      hasDataFn: () => weatherData && weatherData.nearbyCities && weatherData.nearbyCities.cities && weatherData.nearbyCities.cities.some(c => c.cityname !== '')
    },
    {
      name: 'Local Doppler',
      renderFn: renderRadarSlide,
      hasDataFn: () => true
    }
  ];
}

function initWeatherCycler() {
  const activeSlides = filterSlidesByData(getWeatherSlideDefinitions());

  if (activeSlides.length === 0) {
    activeSlides.push(createPlaceholderSlide('Loading weather data...', '.weather-content'));
  }

  const cycleTime = dashboardSettings?.weatherCycleTime || 15000;

  weatherCycler = new PanelCycler('.panel-weather', activeSlides, cycleTime, {
    transitionSpeed: dashboardSettings?.transitionSpeed || 500,
    debug: false
  });

  weatherCycler.start();
}

function activateSkeletonMode(skeletonPath) {
  $('.panel-weather').removeClass('dashboard-radar-fullbleed');
  $('.panel-weather .panel-header').removeClass('wcc-header');
  $('.panel-weather')
    .addClass('wsk-mode')
    .css('background-image', skeletonPath ? `url(${skeletonPath})` : 'none');
}

function deactivateSkeletonMode() {
  $('.panel-weather')
    .removeClass('wsk-mode')
    .css('background-image', '');
}

function stopDashboardRadar() {
  if (dashboardRadarAnimation) {
    clearInterval(dashboardRadarAnimation);
    dashboardRadarAnimation = null;
  }
}

function renderCurrentConditionsSlide() {
  ensureDashboardClock();
  setWeatherPanelHeader('CURRENT CONDITIONS');
  activateSkeletonMode('images/skeletons/forecast/current-conditions-skeleton.png');
  stopDashboardRadar();

  if (!weatherData || !weatherData.currentConditions) {
    $('.weather-content').html('<div class="wsk-overlay"><div style="position:absolute;top:40%;left:20%;font-size:24px;">Loading weather...</div></div>');
    return;
  }

  const c = weatherData.currentConditions;
  const hasReport = !c.noReport;

  $('.weather-content').html(`
    <div class="wsk-overlay">
      <div class="wsk-cc-cityname">${c.cityname || locationConfig?.mainCity?.displayname || ''}</div>
      <div class="wsk-cc-stat wsk-cc-humidity">${hasReport ? (c.humidity || '') : ''}</div>
      <div class="wsk-cc-stat wsk-cc-pressure">${hasReport ? (c.pressure || '') : ''}</div>
      <div class="wsk-cc-stat wsk-cc-wind">${hasReport ? (c.wind || '') : ''}</div>
      <div class="wsk-cc-stat wsk-cc-gusts">${hasReport ? (c.gusts || '') : ''}</div>
      <div class="wsk-cc-icon"></div>
      <div class="wsk-cc-condition">${hasReport ? (c.cond || '') : ''}</div>
      <div class="wsk-cc-temp">${hasReport && c.temp !== '' ? c.temp : ''}</div>
    </div>
  `);

  applyLegacyIcon('.wsk-cc-icon', hasReport ? c.icon : 44, c.windspeed);
}

function renderFiveDayForecastSlide() {
  ensureDashboardClock();
  setWeatherPanelHeader('EXTENDED FORECAST');
  activateSkeletonMode('images/skeletons/forecast/extended-forecast-skeleton.png');
  stopDashboardRadar();

  if (!weatherData || !weatherData.extendedForecast || !weatherData.extendedForecast.days) {
    $('.weather-content').html('<div class="wsk-overlay"><div style="position:absolute;top:40%;left:20%;font-size:24px;">Forecast unavailable</div></div>');
    return;
  }

  const cityname = weatherData.extendedForecast.cityname || locationConfig?.mainCity?.displayname || '';
  const days = weatherData.extendedForecast.days.slice(0, 5);
  const noReport = weatherData.extendedForecast.noReport;

  const dayDivs = days.map((day, i) => {
    const divider = noReport ? '' : '/';
    return `
      <div class="wsk-ef-day wsk-ef-day-${i + 1}">
        <div class="wsk-ef-dayname">${day.dayname || ''}</div>
        <div class="wsk-ef-icon wsk-ef-icon-${i + 1}"></div>
        <div class="wsk-ef-cond">${day.cond || ''}</div>
        <div class="wsk-ef-temps">
          <span class="wsk-ef-high">${day.high || ''}</span>
          <span class="wsk-ef-div">${divider}</span>
          <span class="wsk-ef-low">${day.low || ''}</span>
        </div>
      </div>
    `;
  }).join('');

  $('.weather-content').html(`
    <div class="wsk-overlay">
      <div class="wsk-ef-cityname">${cityname}</div>
      ${dayDivs}
    </div>
  `);

  days.forEach((day, i) => {
    applyLegacyIcon(`.wsk-ef-icon-${i + 1}`, noReport ? 44 : day.icon, day.windspeed);
  });
}

function renderNearbyCitiesSlide() {
  ensureDashboardClock();
  setWeatherPanelHeader('NEARBY CITIES');
  activateSkeletonMode('images/skeletons/forecast/nearby-cities-skeleton.png');
  stopDashboardRadar();

  if (!weatherData || !weatherData.nearbyCities || !weatherData.nearbyCities.cities) {
    $('.weather-content').html('<div class="wsk-overlay"><div style="position:absolute;top:40%;left:20%;font-size:24px;">Nearby cities unavailable</div></div>');
    return;
  }

  const cities = weatherData.nearbyCities.cities.slice(0, 4);

  const rowDivs = cities.map((city, i) => {
    const temp = (!city.noReport && city.temp !== '') ? city.temp : '';
    const wind = (!city.noReport && city.wind) ? city.wind : '';
    return `
      <div class="wsk-nc-row wsk-nc-row-${i + 1}">
        <div class="wsk-nc-cityname">${city.cityname || ''}</div>
        <div class="wsk-nc-temp"><span class="wsk-nc-temp-value">${temp}</span></div>
        <div class="wsk-nc-icon wsk-nc-icon-${i + 1}"></div>
        <div class="wsk-nc-wind">${wind}</div>
      </div>
    `;
  }).join('');

  $('.weather-content').html(`
    <div class="wsk-overlay">
      ${rowDivs}
    </div>
  `);

  cities.forEach((city, i) => {
    applyLegacyIcon(`.wsk-nc-icon-${i + 1}`, city.noReport ? 44 : city.icon, city.windspeed);
  });
}

function renderRadarSlide() {
  ensureDashboardClock();
  setWeatherPanelHeader('LOCAL DOPPLER');
  deactivateSkeletonMode();
  $('.panel-weather').addClass('dashboard-radar-fullbleed');
  stopDashboardRadar();

  $('.weather-content').html(`
    <div class="dashboard-radar-shell">
      <div class="dashboard-tempunavailable" style="display:none;"></div>
      <img class="dashboard-radar-overlay" src="images/skeletons/forecast/radar-doppler.png" alt="">
      <div class="dashboard-radar-container">
        <div class="dashboard-radar-basemap-cities">
          <img class="dashboard-radar-map-cities-top" src="images/maps/XLcities.png" alt="">
        </div>
        <div class="dashboard-locradar-cont">
          <div id="dashboard-locradar"></div>
        </div>
        <div class="dashboard-radar-basemap">
          <img class="dashboard-radar-map-cities" src="images/maps/XLcities.png" alt="">
          <img class="dashboard-radar-map-base" src="images/maps/XLregional.png" alt="">
        </div>
      </div>
      <div class="dashboard-radar-timestamp">
        <span class="dashboard-radar-timestamp-label">RADAR:</span>
        <span class="dashboard-radar-timestamp-value">--</span>
      </div>
    </div>
  `);

  if (!map_key) {
    $('.dashboard-tempunavailable').show();
    applyDashboardRadarBasemapPosition();
    return;
  }

  initDashboardRadar();
}

function animateDashboardRadar(map, timestamps) {
  const interval = 90;
  const layerPrefix = 'radarlayer_';
  const validTimestamps = timestamps.filter((ts) => map.getLayer(`${layerPrefix}${ts}`));
  const validLayers = validTimestamps.map((ts) => `${layerPrefix}${ts}`);
  let currentIndex = validLayers.length - 1;

  if (validLayers.length === 0) {
    $('.dashboard-tempunavailable').show();
    return;
  }

  const setLayerVisibility = (layerId, visibility) => {
    if (map.getLayer(layerId)) {
      map.setLayoutProperty(layerId, 'visibility', visibility);
    }
  };

  validLayers.forEach((layerId) => setLayerVisibility(layerId, 'none'));
  setLayerVisibility(validLayers[currentIndex], 'visible');
  updateDashboardRadarTimestamp(validTimestamps[currentIndex]);

  dashboardRadarAnimation = setInterval(() => {
    setLayerVisibility(validLayers[currentIndex], 'none');
    currentIndex = (currentIndex + 1) % validLayers.length;
    setLayerVisibility(validLayers[currentIndex], 'visible');
    updateDashboardRadarTimestamp(validTimestamps[currentIndex]);
  }, interval);
}

async function initDashboardRadar() {
  if (!document.getElementById('dashboard-locradar')) return;

  if (!dashboardLocradar) {
    mapboxgl.accessToken = map_key;
    dashboardLocradar = new mapboxgl.Map({
      container: 'dashboard-locradar',
      style: {
        version: 8,
        sources: {
          'raster-tiles': {
            type: 'raster',
            tiles: [
              `https://api.mapbox.com/styles/v1/goldbblazez/ckgc8lzdz4lzh19qt7q9wbbr9/tiles/{z}/{x}/{y}?access_token=${map_key}`
            ],
            tileSize: 512
          }
        },
        layers: [
          {
            id: 'basemap',
            type: 'raster',
            source: 'raster-tiles',
            layout: { visibility: 'visible' },
            minzoom: 0,
            maxzoom: 22,
            paint: { 'raster-opacity': 0 }
          }
        ]
      },
      zoom: 7,
      center: [lexingtonRadarCenter.lon, lexingtonRadarCenter.lat],
      interactive: false
    });

    dashboardLocradar.on('style.load', () => {
      dashboardLocradar.setFog({});
      applyDashboardRadarCenter();
    });
  }

  dashboardLocradar.resize();
  applyDashboardRadarCenter();

  dashboardRadarTimestamps = await fetchRadarTimestamps(dashboardLocradar);
  await addRadarLayers(dashboardLocradar, dashboardRadarTimestamps);
  cleanupOldRadarLayers(dashboardLocradar, dashboardRadarTimestamps);

  if (!dashboardRadarTimestamps || dashboardRadarTimestamps.length === 0) {
    $('.dashboard-tempunavailable').show();
    updateDashboardRadarTimestamp(null);
    return;
  }

  $('.dashboard-tempunavailable').hide();
  animateDashboardRadar(dashboardLocradar, dashboardRadarTimestamps);
  applyDashboardRadarCenter();
  setTimeout(applyDashboardRadarCenter, 100);
  setTimeout(applyDashboardRadarCenter, 500);
}

function refreshWeatherPanel() {
  if (!weatherCycler) return;

  const activeSlides = filterSlidesByData(getWeatherSlideDefinitions());
  if (activeSlides.length > 0 && activeSlides.length !== weatherCycler.slides.length) {
    weatherCycler.updateSlides(activeSlides);
  } else if (weatherCycler.isRunning) {
    weatherCycler.refreshCurrentSlide();
  }
}

function isArrowAdvanceEvent(event) {
  return (
    ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Left", "Right", "Up", "Down"].includes(event.key) ||
    ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.code) ||
    [37, 38, 39, 40].includes(event.keyCode)
  );
}

function getArrowAdvanceDirection(event) {
  const key = event.key || event.code || '';
  if (["ArrowLeft", "Left", "ArrowUp", "Up"].includes(key) || [37, 38].includes(event.keyCode)) {
    return -1;
  }

  return 1;
}

window.addEventListener('keydown', function(event) {
  const targetTag = event.target && event.target.tagName ? event.target.tagName.toUpperCase() : "";
  const isFormField = ["INPUT", "TEXTAREA", "SELECT"].includes(targetTag) || event.target?.isContentEditable;

  if (!isArrowAdvanceEvent(event) || isFormField || event.repeat) {
    return;
  }

  if (!window.advanceSlidesNow) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();
  window.advanceSlidesNow(getArrowAdvanceDirection(event));
}, true);
