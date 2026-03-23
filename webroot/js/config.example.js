// IMPORTANT: Copy this file to config.js and replace with your actual API keys
// Get weather.com API key from: https://www.weather.com/
// Get mapbox.com API key from: https://www.mapbox.com/
var api_key = "YOUR_WEATHER_COM_API_KEY";
var map_key = "YOUR_MAPBOX_API_KEY";

var apperanceSettings = {
  providerName: "Mist Digital Cable",
  skipSettings: true, //set to true for no settings panel on startup
  startupTime: 5000, //How long you want to wait for everything to load
  //we recommend not setting startupTime to anything less than like 3000 (4 seconds) as it takes time to download info off the internet.
  enableCrawl: true, //set to fale if you don't want any ad crawl
  adMessage: ["If you are interested in TWC, EAS, or anything weather/tech related, join Mist Weather Media! Visit mistwx.com/discord right now!", "Want to watch Weatherscan and more from around the US? Visit live.weatherscan.net and search through the guide today!", "If a tornado warning is issued will you get the call? Sign up now to recieve a phone call warning when severe weather is headed your way. Visit weather.com/notify to learn more.", "Now Available! Get picture perfect weather with The Weather Channel HD.",],
  aspectRatio: 16/9, //16/9, 3/2 or 4/3
  crawlInterval: 48000,
  version: "1.22",
};
var slideSettings = {//Don't change this
  order: [
    {slideLineup: [
        {group: "intro", slides: [
          { function: "introSlide" },
        ]},
        {group: "sports", slides: [
          { function: "upNext" },
          { function: "sportsScoreboard" },
        ]},
      ]},
  ],
};

var audioSettings = {
  enableMusic: true,
  shuffle: false,
  randomStart: true,
  narrations: true,
  order: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], //1 to 35
};

var dashboardSettings = {
  enableCycling: true,           // Enable cycling panels (true) or static (false)
  sportsCycleTime: 10000,        // 10 seconds per sports slide
  calendarCycleTime: 12000,      // 12 seconds per calendar view
  newsCycleTime: 10000,          // 10 seconds per news category
  weatherCycleTime: 15000,       // 15 seconds per weather display
  transitionSpeed: 500,          // Fade transition speed (ms)
  sportsDataRefreshInterval: 10000, // Refresh sports scores every 10 seconds
  dataRefreshInterval: 30000,    // Refresh data every 30 seconds
  staggeredStart: true,          // Start panels with delay
  staggerDelay: 500,             // 500ms between panel starts
  followedTeams: [
    { name: 'Cincinnati Reds', abbreviation: 'CIN', league: 'MLB', label: "TODAY'S REDS GAME", theme: 'reds' },
    { name: 'FC Cincinnati', abbreviation: 'CIN', aliases: ['FCC', 'FC CINCINNATI'], league: 'MLS', label: "TODAY'S FC CINCINNATI MATCH", theme: 'fcc' },
    { name: 'FC Cincinnati', abbreviation: 'CIN', aliases: ['FCC', 'FC CINCINNATI'], league: 'Concacaf Champions Cup', label: "TODAY'S FC CINCINNATI CHAMPIONS CUP MATCH", theme: 'fcc' },
    { name: 'Cincinnati Bengals', abbreviation: 'CIN', league: 'NFL', label: "TODAY'S BENGALS GAME", theme: 'bengals' },
    { name: 'Kentucky Wildcats', abbreviation: 'UK', aliases: ['Kentucky', 'University of Kentucky'], league: 'NCAAB', label: "TODAY'S KENTUCKY BASKETBALL GAME", theme: 'kentucky' },
    { name: 'Kentucky Wildcats', abbreviation: 'UK', aliases: ['Kentucky', 'University of Kentucky'], league: 'NCAAW', label: "TODAY'S KENTUCKY WOMEN'S GAME", theme: 'kentucky' },
    { name: 'Kentucky Wildcats', abbreviation: 'UK', aliases: ['Kentucky', 'University of Kentucky'], league: 'College Baseball', label: "TODAY'S KENTUCKY BASEBALL GAME", theme: 'kentucky' },
    { name: 'Kentucky Wildcats', abbreviation: 'UK', aliases: ['Kentucky', 'University of Kentucky'], league: 'College Softball', label: "TODAY'S KENTUCKY SOFTBALL GAME", theme: 'kentucky' },
    { name: 'Louisville Cardinals', abbreviation: 'LOU', aliases: ['Louisville', 'UofL', 'UL'], league: 'NCAAB', label: "TODAY'S LOUISVILLE BASKETBALL GAME", theme: 'louisville' },
    { name: 'Louisville Cardinals', abbreviation: 'LOU', aliases: ['Louisville', 'UofL', 'UL'], league: 'NCAAW', label: "TODAY'S LOUISVILLE WOMEN'S GAME", theme: 'louisville' },
    { name: 'Racing Louisville FC', abbreviation: 'LOU', aliases: ['Racing Louisville', 'Racing Louisville FC'], league: 'NWSL', label: "TODAY'S RACING LOUISVILLE MATCH", theme: 'louisville' },
    { name: 'Lexington Sporting Club', abbreviation: 'LEX', aliases: ['Lexington Sporting', 'Lexington SC'], league: 'USL', label: "TODAY'S LEXINGTON SPORTING MATCH", theme: 'kentucky' },
    { name: 'Lexington Sporting Club', abbreviation: 'LEX', aliases: ['Lexington Sporting', 'Lexington SC'], league: 'USL Super League', label: "TODAY'S LEXINGTON SPORTING WOMEN'S MATCH", theme: 'kentucky' },
    { name: 'Seattle Seahawks', abbreviation: 'SEA', league: 'NFL', label: "TODAY'S SEAHAWKS GAME", theme: 'seattle' },
    { name: 'Portland Timbers', abbreviation: 'POR', league: 'MLS', label: "TODAY'S TIMBERS MATCH", theme: 'portland' },
    { name: 'Liverpool', abbreviation: 'LIV', aliases: ['Liverpool FC', 'LFC'], league: 'EPL', label: "TODAY'S LIVERPOOL MATCH", theme: 'liverpool' },
    { name: 'Liverpool', abbreviation: 'LIV', aliases: ['Liverpool FC', 'LFC'], league: 'UEFA CL', label: "TODAY'S LIVERPOOL CHAMPIONS LEAGUE MATCH", theme: 'liverpool' },
    { name: 'Portland Thorns FC', abbreviation: 'POR', aliases: ['Portland Thorns', 'Portland Thorns FC'], league: 'NWSL', label: "TODAY'S THORNS MATCH", theme: 'portland' },
    { name: 'Florida Panthers', abbreviation: 'FLA', league: 'NHL', label: "TODAY'S PANTHERS GAME", theme: 'panthers' },
    { name: 'Seattle Kraken', abbreviation: 'SEA', league: 'NHL', label: "TODAY'S KRAKEN GAME", theme: 'seattle' },
    { name: 'Seattle Mariners', abbreviation: 'SEA', league: 'MLB', label: "TODAY'S MARINERS GAME", theme: 'seattle' },
  ],
};
var introPackage = {group: "intro", slides: [
  { function: "introSlide" },
  { function: "providerSlide" },
]}
var forecastPackage = {group: "forecast", slides: [
  { function: "upNext" },
  { function: "bulletin"},
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
]}
var extraLocalPackage = {group: "extralocal", slides: [
  { function: "upNext" },
  { function: "extraCurrentConditions"},
  { function: "extraDayDesc"},
  { function: "extraExtendedForecast"},
]}
var miniCorePackage = {group: "minicore", slides: [
  { function: "upNext" },
  { function: "dopplerRadar" },
  { function: "currentConditions" },
  { function: "dayDesc" },
  { function: "extendedForecast" },
  { function: "dopplerRadar" },
]}
var spanishForecastPackage = {group: "spanish", slides: [
  { function: "upNext" },
  { function: "EScurrentConditions" },
  { function: "ESnearbyCities" },
  { function: "ESextendedForecast" },
  { function: "ESalmanac" },
]}
var golfPackage = {group: "golf", slides: [
  { function: "upNext" },
  { function: "courseForecast" }
]}
var healthPackage = {group: "health", slides: [
  { function: "upNext" },
  { function: "healthTip" },
  { function: "uvIndex" },
]}
var airportPackage = {group: "airport", slides: [
  { function: "upNext" },
  { function: "airportConditions" },
  { function: "nationalAirports" },
]}

// Custom packages for interleaved display
var mainPackage = {group: "main", slides: [
  { function: "upNext" },
  { function: "bulletin"},
  { function: "dopplerRadar" },
  { function: "currentConditions" },
  { function: "dayDesc" },
  { function: "extendedForecast" },
  { function: "almanac" },
  { function: "regionalSat" },
  { function: "regionalRadar" },
]}

var airportOnlyPackage = {group: "airportonly", slides: [
  { function: "upNext" },
  { function: "airportConditions" },
]}

var nearbyCitiesPackage = {group: "nearby", slides: [
  { function: "upNext" },
  { function: "nearbyCities" },
]}

var sportsPackage = {group: "sports", slides: [
  { function: "upNext" },
  { function: "sportsScoreboard" },
]}
