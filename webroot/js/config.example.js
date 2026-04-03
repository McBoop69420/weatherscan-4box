// Copy this file to config.js and replace the placeholder values below.
// Keep config.js local. It is ignored by Git so real keys do not get committed.

var api_key = "YOUR_WEATHER_COM_API_KEY";
var map_key = "YOUR_MAPBOX_API_KEY";

var apperanceSettings = {
  providerName: "Mist Digital Cable",
  skipSettings: true,
  startupTime: 5000,
  enableCrawl: true,
  adMessage: ["network"],
  aspectRatio: 16 / 9,
  crawlInterval: 48000,
  version: "1.26",
};

var slideSettings = {
  order: [
    {
      slideLineup: [
        {
          group: "intro",
          slides: [
            { function: "introSlide" },
            { function: "providerSlide" },
          ],
        },
      ],
    },
  ],
};

var audioSettings = {
  enableMusic: true,
  shuffle: false,
  randomStart: true,
  narrations: true,
  order: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
};

var introPackage = {
  group: "intro",
  slides: [
    { function: "introSlide" },
    { function: "providerSlide" },
  ],
};

var forecastPackage = {
  group: "forecast",
  slides: [
    { function: "upNext" },
    { function: "bulletin" },
    { function: "dopplerRadar" },
    { function: "currentConditions" },
    { function: "nearbyCities" },
    { function: "dopplerRadar" },
    { function: "dayDesc" },
    { function: "extendedForecast" },
    { function: "almanac" },
    { function: "regionalSat" },
    { function: "regionalRadar" },
    { function: "dopplerRadar" },
  ],
};

var extraLocalPackage = {
  group: "extralocal",
  slides: [
    { function: "upNext" },
    { function: "extraCurrentConditions" },
    { function: "extraDayDesc" },
    { function: "extraExtendedForecast" },
  ],
};

var miniCorePackage = {
  group: "minicore",
  slides: [
    { function: "upNext" },
    { function: "dopplerRadar" },
    { function: "currentConditions" },
    { function: "dayDesc" },
    { function: "extendedForecast" },
    { function: "dopplerRadar" },
  ],
};

var spanishForecastPackage = {
  group: "spanish",
  slides: [
    { function: "upNext" },
    { function: "EScurrentConditions" },
    { function: "ESnearbyCities" },
    { function: "ESextendedForecast" },
    { function: "ESalmanac" },
  ],
};

var golfPackage = {
  group: "golf",
  slides: [
    { function: "upNext" },
    { function: "courseForecast" },
  ],
};

var healthPackage = {
  group: "health",
  slides: [
    { function: "upNext" },
    { function: "healthTip" },
    { function: "uvIndex" },
  ],
};

var airportPackage = {
  group: "airport",
  slides: [
    { function: "upNext" },
    { function: "airportConditions" },
    { function: "nationalAirports" },
  ],
};
