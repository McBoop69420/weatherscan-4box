// Dashboard Sports Panel - Cycling through leagues with proper layouts

var sportsCycler = null;
var standingsCache = {};
var bracketCache = {};
var followedTeamNewsCache = {};
var teamFormCache = {};
var followedTeamPreviousDaySportsData = [];
var followedTeamPreviousDaySportsDataKey = '';
const SPORTS_DASHBOARD_TIME_ZONE = 'America/New_York';
const DEFAULT_FOLLOWED_TEAMS = [
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
  { name: 'Seattle Mariners', abbreviation: 'SEA', league: 'MLB', label: "TODAY'S MARINERS GAME", theme: 'seattle' }
];

const LEAGUE_DEFS = [
  { name: 'NFL',        logo: 'https://a.espncdn.com/i/teamlogos/leagues/500-dark/nfl.png' },
  { name: 'NBA',        logo: 'https://a.espncdn.com/i/teamlogos/leagues/500-dark/nba.png' },
  { name: 'MLB',        logo: 'https://a.espncdn.com/i/teamlogos/leagues/500-dark/mlb.png' },
  { name: 'NHL',        logo: 'https://a.espncdn.com/i/teamlogos/leagues/500-dark/nhl.png' },
  { name: 'NCAAB',      logo: 'https://a.espncdn.com/i/teamlogos/leagues/500-dark/mens-college-basketball.png' },
  { name: 'NCAAW',      logo: 'https://a.espncdn.com/i/teamlogos/leagues/500-dark/womens-college-basketball.png' },
  { name: 'EPL',        logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500-dark/23.png' },
  { name: 'La Liga',    logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500-dark/15.png' },
  { name: 'Bundesliga', logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500-dark/10.png' },
  { name: 'Serie A',    logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500-dark/12.png' },
  { name: 'Ligue 1',    logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500-dark/9.png' },
  { name: 'UEFA CL',    logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500-dark/2.png' },
  { name: 'World Cup',  logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500-dark/268.png' },
  { name: 'UEFA EL',    logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500-dark/2310.png' },
  { name: 'UEFA Conference League', logo: '' },
  { name: 'Concacaf Champions Cup', logo: '', generic: false },
  { name: 'FA Cup',     logo: '' },
  { name: 'MLS',        logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500-dark/19.png' },
  { name: 'NWSL',       logo: '' },
  { name: 'USL',        logo: '' },
  { name: 'USL Super League', logo: '' },
  { name: 'WNBA',       logo: 'https://a.espncdn.com/i/teamlogos/leagues/500-dark/wnba.png' },
  { name: 'PWHL',       logo: 'https://a.espncdn.com/i/teamlogos/leagues/500-dark/pwhl.png' },
  { name: 'WBC',        logo: 'https://a.espncdn.com/i/teamlogos/leagues/500-dark/wbc.png' },
];

const SOCCER_LEAGUES = new Set([
  'EPL',
  'La Liga',
  'Bundesliga',
  'Serie A',
  'Ligue 1',
  'UEFA CL',
  'World Cup',
  'UEFA EL',
  'UEFA Conference League',
  'FA Cup',
  'MLS',
  'NWSL',
  'USL',
  'USL Super League'
]);

const SOCCER_ROUNDUP_LEAGUES = ['EPL', 'La Liga', 'Bundesliga', 'Serie A', 'Ligue 1'];
const MARCH_MADNESS_LEAGUES = new Set(['NCAAB', 'NCAAW']);

const LEXINGTON_REFERENCE_POINT = { lat: 38.0406, lon: -84.5037 };
const TEAM_LOCALITY_COORDINATES = {
  Lexington: { lat: 38.0406, lon: -84.5037 },
  Kentucky: { lat: 38.0406, lon: -84.5037 },
  Louisville: { lat: 38.2527, lon: -85.7585 },
  Cincinnati: { lat: 39.1031, lon: -84.5120 },
  Columbus: { lat: 39.9612, lon: -82.9988 },
  Nashville: { lat: 36.1627, lon: -86.7816 },
  Chicago: { lat: 41.8781, lon: -87.6298 },
  Atlanta: { lat: 33.7490, lon: -84.3880 },
  Miami: { lat: 25.7617, lon: -80.1918 },
  Charlotte: { lat: 35.2271, lon: -80.8431 },
  Toronto: { lat: 43.6532, lon: -79.3832 },
  Seattle: { lat: 47.6062, lon: -122.3321 },
  Portland: { lat: 45.5152, lon: -122.6784 },
  Florida: { lat: 26.1224, lon: -80.1373 },
  Liverpool: { lat: 53.4084, lon: -2.9916 },
};

function getTeamLogoUrl(team) {
  return team?.logo || team?.logos?.[0]?.href || '';
}

/**
 * Initialize the sports panel cycler
 */
async function initSportsCycler() {
  // Fetch sports data now if crawl hasn't loaded it yet
  if (!sportsRawData) {
    try {
      sportsRawData = await fetchSportsData();
    } catch(e) {
      console.warn('[Sports] Could not fetch sports data:', e);
    }
  }

  await ensureFollowedTeamPreviousDaySportsData(getFollowedTeams());

  const activeFollowedTeams = getActiveFollowedTeams();
  await refreshFollowedTeamContext(activeFollowedTeams);

  const slides = buildSportsSlides(activeFollowedTeams);

  if (slides.length === 0) {
    slides.push(createPlaceholderSlide('No games scheduled today', '.sports-games-list'));
  }

  const cycleTime = dashboardSettings?.sportsCycleTime || 10000;

  sportsCycler = new PanelCycler('.panel-sports', slides, cycleTime, {
    transitionSpeed: dashboardSettings?.transitionSpeed || 500,
    debug: false
  });

  sportsCycler.start();
}

/**
 * Build the slide list by packing leagues:
 *
 * Triple slide: all 3 leagues have <6 games AND at least one has <3 games
 * Pair slide:   both leagues have ≤9 games
 * Solo slide:   >9 games, or no suitable partner found
 */
function buildSportsSlides(activeFollowedTeams = getActiveFollowedTeams()) {
  const slides = [];
  const displayableFollowedTeams = activeFollowedTeams.filter(({ followedTeam }) => (
    !shouldSuppressDedicatedLeagueSlides(followedTeam?.league)
  ));
  const followedTeamSlides = getFollowedTeamSlides(displayableFollowedTeams);
  const favoriteLeagueNames = [...new Set(displayableFollowedTeams.map(({ followedTeam }) => followedTeam.league).filter(Boolean))];

  followedTeamSlides.forEach((slide) => slides.push(slide));

  const soccerRoundupData = getSoccerRoundupSlideData(displayableFollowedTeams);
  if (soccerRoundupData.length > 0) {
    slides.push(() => renderSoccerRoundupStandingsSlide(soccerRoundupData));
  }

  // Collect active leagues with their games
  const activeLeagues = [];
  for (const def of LEAGUE_DEFS) {
    if (def.generic === false) {
      continue;
    }

    if (shouldSuppressDedicatedLeagueSlides(def.name)) {
      continue;
    }

    if (favoriteLeagueNames.includes(def.name)) {
      continue;
    }

    const games = getGamesForLeague(def.name, 16);
    if (games.length > 0) {
      // Prefer the logo ESPN returned for this league; fall back to our hardcoded URL
      const rawLeague = sportsRawData ? sportsRawData.find(l => l.league === def.name) : null;
      const logo = rawLeague?.logo || def.logo;
      activeLeagues.push({ name: def.name, logo, games });
    }
  }

  const packableLeagues = [];

  activeLeagues.forEach((league) => {
    if (MARCH_MADNESS_LEAGUES.has(league.name)
      && shouldRenderKnockoutBracketSlide(league.name)) {
      getMarchMadnessBracketSlides(league.name).forEach((slide) => slides.push(slide));
      return;
    }

    if (shouldRenderKnockoutBracketSlide(league.name)) {
      getGenericKnockoutBracketSlides(league.name).forEach((slide) => slides.push(slide));
      return;
    }

    packableLeagues.push(league);
  });

  if (packableLeagues.length === 0) return slides;

  const packed = new Array(packableLeagues.length).fill(false);

  for (let i = 0; i < packableLeagues.length; i++) {
    if (packed[i]) continue;

    const leagueA = packableLeagues[i];
    const countA = leagueA.games.length;

    if (countA <= 6) {
      // Try triple first
      const triple = findTriple(packableLeagues, packed, i);
      if (triple) {
        const [j, k] = triple;
        packed[i] = packed[j] = packed[k] = true;
        slides.push(((a, b, c) => () => renderTripleSlide(a, b, c))(leagueA, packableLeagues[j], packableLeagues[k]));
        continue;
      }

      // Fall back to pair (≤9 partner)
      const pairIdx = findPair(packableLeagues, packed, i);
      if (pairIdx >= 0) {
        packed[i] = packed[pairIdx] = true;
        slides.push(((a, b) => () => renderCombinedSlide(a, b))(leagueA, packableLeagues[pairIdx]));
        continue;
      }

      // Solo
      packed[i] = true;
      slides.push(((a) => () => renderSingleLeagueSlide(a))(leagueA));

    } else if (countA <= 9) {
      const pairIdx = findPair(packableLeagues, packed, i);
      if (pairIdx >= 0) {
        packed[i] = packed[pairIdx] = true;
        slides.push(((a, b) => () => renderCombinedSlide(a, b))(leagueA, packableLeagues[pairIdx]));
        continue;
      }

      packed[i] = true;
      slides.push(((a) => () => renderSingleLeagueSlide(a))(leagueA));

    } else {
      // >9 games: always solo
      packed[i] = true;
      slides.push(((a) => () => renderSingleLeagueSlide(a))(leagueA));
    }
  }

  return slides;
}

function getFollowedTeams() {
  if (Array.isArray(dashboardSettings?.followedTeams) && dashboardSettings.followedTeams.length > 0) {
    return dashboardSettings.followedTeams;
  }

  return DEFAULT_FOLLOWED_TEAMS;
}

function getEasternDashboardTimeParts(date = new Date()) {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: SPORTS_DASHBOARD_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    hour12: false
  });

  return formatter.formatToParts(date).reduce((parts, part) => {
    if (part.type !== 'literal') {
      parts[part.type] = part.value;
    }
    return parts;
  }, {});
}

function formatUtcDateKey(date) {
  return `${date.getUTCFullYear()}${String(date.getUTCMonth() + 1).padStart(2, '0')}${String(date.getUTCDate()).padStart(2, '0')}`;
}

function getFollowedTeamDisplayWindow(date = new Date()) {
  const parts = getEasternDashboardTimeParts(date);
  const easternTodayAtNoonUtc = new Date(Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    12,
    0,
    0
  ));
  const previousDayUtc = new Date(easternTodayAtNoonUtc);
  previousDayUtc.setUTCDate(previousDayUtc.getUTCDate() - 1);

  return {
    usePreviousDayResults: (Number(parts.hour) % 24) < 12,
    todayKey: `${parts.year}${parts.month}${parts.day}`,
    previousDayKey: formatUtcDateKey(previousDayUtc)
  };
}

function isMatchingTeam(team, followedTeam) {
  if (!team || !followedTeam) {
    return false;
  }

  const followedNames = [
    followedTeam.name,
    followedTeam.abbreviation,
    ...(Array.isArray(followedTeam.aliases) ? followedTeam.aliases : [])
  ].filter(Boolean).map((value) => String(value).toLowerCase());
  const teamNames = [
    team.displayName,
    team.shortDisplayName,
    team.location,
    team.name,
    team.abbreviation
  ].filter(Boolean).map((value) => String(value).toLowerCase());

  return followedNames.some((followedName) => teamNames.includes(followedName));
}

function getMatchingFollowedTeamGames(followedTeam, games = []) {
  return games.filter((gameData) => {
    const competitors = gameData?.event?.competitions?.[0]?.competitors || [];
    return competitors.some((competitor) => isMatchingTeam(competitor.team, followedTeam));
  });
}

function getGameState(gameData) {
  return String(gameData?.event?.status?.type?.state || '').toLowerCase();
}

function sortGamesByDate(games = [], direction = 'asc') {
  const multiplier = direction === 'desc' ? -1 : 1;
  return [...games].sort((gameA, gameB) => {
    const valueA = new Date(gameA?.event?.date || 0).getTime();
    const valueB = new Date(gameB?.event?.date || 0).getTime();
    return (valueA - valueB) * multiplier;
  });
}

function getPreferredCurrentDayFollowedTeamGame(games = []) {
  const liveGame = sortGamesByDate(games.filter((gameData) => getGameState(gameData) === 'in'))[0];
  if (liveGame) {
    return liveGame;
  }

  const upcomingGame = sortGamesByDate(games.filter((gameData) => getGameState(gameData) === 'pre'))[0];
  if (upcomingGame) {
    return upcomingGame;
  }

  return sortGamesByDate(games.filter((gameData) => getGameState(gameData) === 'post'), 'desc')[0] || null;
}

function getMostRecentCompletedFollowedTeamGame(games = []) {
  return sortGamesByDate(
    games.filter((gameData) => getGameState(gameData) === 'post' || Boolean(gameData?.event?.status?.type?.completed)),
    'desc'
  )[0] || null;
}

async function ensureFollowedTeamPreviousDaySportsData(followedTeams = getFollowedTeams()) {
  const displayWindow = getFollowedTeamDisplayWindow();
  if (!displayWindow.usePreviousDayResults) {
    return followedTeamPreviousDaySportsData;
  }

  const leagueNames = [...new Set(
    (Array.isArray(followedTeams) ? followedTeams : [])
      .map((followedTeam) => followedTeam?.league)
      .filter(Boolean)
  )];
  const cacheKey = `${displayWindow.previousDayKey}:${leagueNames.slice().sort().join('|')}`;

  if (followedTeamPreviousDaySportsDataKey === cacheKey) {
    return followedTeamPreviousDaySportsData;
  }

  if (leagueNames.length === 0) {
    followedTeamPreviousDaySportsData = [];
    followedTeamPreviousDaySportsDataKey = cacheKey;
    return followedTeamPreviousDaySportsData;
  }

  try {
    followedTeamPreviousDaySportsData = await fetchSportsData({
      dateOffset: -1,
      leagues: leagueNames,
      raw: true
    });
    followedTeamPreviousDaySportsDataKey = cacheKey;
  } catch (error) {
    console.warn('[Sports] Previous-day favorite feed fetch failed:', error);
    followedTeamPreviousDaySportsData = [];
    followedTeamPreviousDaySportsDataKey = '';
  }

  return followedTeamPreviousDaySportsData;
}

function getFollowedTeamPreviousDayGames(followedTeam, maxGames = 24) {
  const leagueName = followedTeam?.league || 'MLB';
  return getGamesForLeagueFromData(followedTeamPreviousDaySportsData, leagueName, maxGames, (event) => {
    const state = String(event?.status?.type?.state || '').toLowerCase();
    return state === 'post' || Boolean(event?.status?.type?.completed);
  });
}

function getFollowedTeamGameSelection(followedTeam) {
  const leagueName = followedTeam?.league || 'MLB';
  const currentGames = getMatchingFollowedTeamGames(followedTeam, getGamesForLeague(leagueName, 24));
  const displayWindow = getFollowedTeamDisplayWindow();
  if (displayWindow.usePreviousDayResults) {
    const previousDayGame = getMostRecentCompletedFollowedTeamGame(getMatchingFollowedTeamGames(
      followedTeam,
      getFollowedTeamPreviousDayGames(followedTeam, 24)
    ));
    if (previousDayGame) {
      return {
        gameData: previousDayGame,
        window: 'previous',
        source: 'previous-result'
      };
    }
  }

  const currentDayGame = getPreferredCurrentDayFollowedTeamGame(currentGames);
  if (!currentDayGame) {
    return null;
  }

  return {
    gameData: currentDayGame,
    window: 'today',
    source: `today-${getGameState(currentDayGame) || 'scheduled'}`
  };
}

function getFollowedTeamGame(followedTeam) {
  return getFollowedTeamGameSelection(followedTeam)?.gameData || null;
}

function getActiveFollowedTeams() {
  const followedTeams = getFollowedTeams();
  const leagueOrder = LEAGUE_DEFS.reduce((map, def, index) => {
    map[def.name] = index;
    return map;
  }, {});

  const activeItems = followedTeams
    .map((followedTeam) => {
      const selection = getFollowedTeamGameSelection(followedTeam);
      return selection?.gameData ? {
        followedTeam,
        gameData: selection.gameData,
        selectionContext: selection,
        originalIndex: followedTeams.findIndex((team) => team === followedTeam)
      } : null;
    })
    .filter(Boolean)
    .reduce((deduped, item) => {
      const gameId = String(item?.gameData?.event?.id || '');
      if (!gameId) {
        deduped.push(item);
        return deduped;
      }

      const existingIndex = deduped.findIndex((candidate) => String(candidate?.gameData?.event?.id || '') === gameId);
      if (existingIndex === -1) {
        deduped.push(item);
        return deduped;
      }

      if (compareFollowedTeamPriority(item, deduped[existingIndex]) < 0) {
        deduped[existingIndex] = item;
      }

      return deduped;
    }, [])
    .sort((a, b) => {
      const leagueRankA = leagueOrder[a.followedTeam.league] ?? Number.MAX_SAFE_INTEGER;
      const leagueRankB = leagueOrder[b.followedTeam.league] ?? Number.MAX_SAFE_INTEGER;

      if (leagueRankA !== leagueRankB) {
        return leagueRankA - leagueRankB;
      }

      return a.originalIndex - b.originalIndex;
    });

  return activeItems;
}

function compareFollowedTeamPriority(itemA, itemB) {
  const distanceA = getFollowedTeamDistanceFromLexington(itemA?.followedTeam);
  const distanceB = getFollowedTeamDistanceFromLexington(itemB?.followedTeam);

  if (distanceA !== distanceB) {
    return distanceA - distanceB;
  }

  return (itemA?.originalIndex ?? Number.MAX_SAFE_INTEGER) - (itemB?.originalIndex ?? Number.MAX_SAFE_INTEGER);
}

function getFollowedTeamDistanceFromLexington(followedTeam) {
  const locality = getFollowedTeamLocality(followedTeam);
  const coords = TEAM_LOCALITY_COORDINATES[locality];
  if (!coords) {
    return Number.MAX_SAFE_INTEGER;
  }

  return getDistanceBetweenPoints(LEXINGTON_REFERENCE_POINT, coords);
}

function getDistanceBetweenPoints(pointA, pointB) {
  const latDelta = pointA.lat - pointB.lat;
  const lonDelta = pointA.lon - pointB.lon;
  return Math.sqrt((latDelta * latDelta) + (lonDelta * lonDelta));
}

function getFollowedTeamSlides(activeFollowedTeams) {
  const slides = [];
  const groupedByLeague = activeFollowedTeams.reduce((map, item) => {
    const leagueName = item.followedTeam.league || 'Other';
    if (!map[leagueName]) {
      map[leagueName] = [];
    }
    map[leagueName].push(item);
    return map;
  }, {});

  Object.keys(groupedByLeague).forEach((leagueName) => {
    const leagueItems = groupedByLeague[leagueName];

    leagueItems.forEach((item) => {
      slides.push(() => renderFollowedTeamCombinedSlide(item));
    });

    const leagueData = getLeagueSlideData(leagueName);
    if (leagueData) {
      slides.push(() => renderFavoriteLeagueScoreboardSlide(leagueData));
    }

    getFavoriteLeagueContextSlides(leagueItems).forEach((slide) => slides.push(slide));
  });

  return slides;
}

function getFavoriteLeagueContextSlides(leagueItems) {
  if (!Array.isArray(leagueItems) || leagueItems.length === 0) {
    return [];
  }

  const leagueName = leagueItems[0].followedTeam.league;

  if (MARCH_MADNESS_LEAGUES.has(leagueName) && shouldRenderKnockoutBracketSlide(leagueName)) {
    return getMarchMadnessBracketSlides(leagueName);
  }

  if (shouldRenderKnockoutBracketSlide(leagueName)) {
    return getGenericKnockoutBracketSlides(leagueName);
  }

  if (hasStandingsForLeagueItems(leagueItems)) {
    return getFavoriteLeagueStandingsSlides(leagueItems);
  }

  return [];
}

function getLeagueSlideData(leagueName) {
  const def = LEAGUE_DEFS.find((leagueDef) => leagueDef.name === leagueName);
  const games = getGamesForLeague(leagueName, 16);
  if (!def || games.length === 0) {
    return null;
  }

  const rawLeague = sportsRawData ? sportsRawData.find((league) => league.league === leagueName) : null;
  return {
    name: leagueName,
    logo: rawLeague?.logo || def.logo,
    seasonType: rawLeague?.seasonType || null,
    games
  };
}

function getLeagueSeasonType(leagueName) {
  const rawLeague = sportsRawData ? sportsRawData.find((league) => league.league === leagueName) : null;
  return rawLeague?.seasonType || null;
}

function isSpringTrainingSeasonType(seasonType) {
  const label = String(seasonType?.name || seasonType?.abbreviation || '').toLowerCase();
  const typeId = Number(seasonType?.id ?? seasonType?.type ?? seasonType);
  return label.includes('preseason') || label.includes('spring') || typeId === 1;
}

function shouldSuppressDedicatedLeagueSlides(leagueName) {
  return leagueName === 'MLB' && isSpringTrainingSeasonType(getLeagueSeasonType(leagueName));
}

function isKnockoutSeasonType(seasonType) {
  const label = String(seasonType?.name || seasonType?.abbreviation || '').toLowerCase();
  if (!label || label.includes('league phase')) {
    return false;
  }

  return ['round', 'quarter', 'semi', 'final', 'knockout', 'playoff', 'leg'].some((token) => label.includes(token));
}

function isMarchMadnessEvent(event, leagueName) {
  if (!MARCH_MADNESS_LEAGUES.has(leagueName)) {
    return false;
  }

  const competition = event?.competitions?.[0];
  const notes = Array.isArray(competition?.notes) ? competition.notes : [];
  const text = [
    event?.name,
    ...notes.map((note) => note?.headline || note?.text || '')
  ].filter(Boolean).join(' ');

  return /ncaa (men'?s|women'?s)? basketball championship|march madness|first four|final four|elite(?:\s|-)8|sweet(?:\s|-)16|round of 64|round of 32|national semifinal|national championship|regional semifinal|regional final|\b(?:1st|2nd) round\b/i.test(text);
}

function shouldRenderKnockoutBracketSlide(leagueName) {
  const roundBasedKnockoutLeagues = ['UEFA CL', 'UEFA EL', 'UEFA Conference League'];
  const alwaysKnockoutLeagues = ['Concacaf Champions Cup', 'FA Cup', 'World Cup', 'WBC'];
  const games = getGamesForLeague(leagueName, 16);
  const hasMarchMadnessGames = MARCH_MADNESS_LEAGUES.has(leagueName)
    && games.some((gameData) => isMarchMadnessEvent(gameData?.event, leagueName));

  if (hasMarchMadnessGames) {
    return true;
  }

  if (!(roundBasedKnockoutLeagues.includes(leagueName) || alwaysKnockoutLeagues.includes(leagueName)) || games.length === 0) {
    return false;
  }

  if (isKnockoutSeasonType(getLeagueSeasonType(leagueName))) {
    return true;
  }

  return games.some((gameData) => {
    const event = gameData?.event || {};
    const competition = event?.competitions?.[0] || {};
    const roundLabel = normalizeKnockoutRoundLabel(getKnockoutRoundLabel(event, competition, ''), '');

    return Boolean(roundLabel) && getKnockoutRoundSortValue(roundLabel) < 400;
  });
}

function hasStandingsForLeagueItems(leagueItems) {
  return getLeagueStandingsGroupsForSlides(leagueItems).length > 0;
}

function hasUsableMarchMadnessBracket(leagueName) {
  const bracketData = bracketCache[leagueName];
  return hasMarchMadnessBracketGames(bracketData);
}

function getRelevantStandingsGroupsForLeagueItems(leagueItems) {
  if (!Array.isArray(leagueItems) || leagueItems.length === 0) {
    return [];
  }

  const seenGroupNames = new Set();
  const groups = [];

  leagueItems.forEach((item) => {
    const standingsData = standingsCache[item.followedTeam.league];
    const groupData = findStandingsGroupForTeam(standingsData, item.followedTeam);
    if (!groupData || seenGroupNames.has(groupData.name)) {
      return;
    }

    seenGroupNames.add(groupData.name);
    groups.push({
      leagueName: item.followedTeam.league,
      groupName: groupData.name,
      rows: getFullStandingsRows(groupData, item.followedTeam.league)
    });
  });

  return groups.slice(0, 2);
}

function getConferenceStandingsGroups(standingsData, leagueName) {
  if (!standingsData || !Array.isArray(standingsData.children)) {
    return [];
  }

  if (!['NHL', 'NBA', 'NFL'].includes(leagueName)) {
    return [];
  }

  const sortConferenceEntries = (entries) => {
    const safeEntries = Array.isArray(entries) ? [...entries] : [];

    if (leagueName === 'NHL') {
      return safeEntries.sort((a, b) => {
        const pointsA = Number(getEntryStat(a, ['points', 'PTS', 'P'])?.value ?? getEntryStat(a, ['points', 'PTS', 'P'])?.displayValue ?? -1);
        const pointsB = Number(getEntryStat(b, ['points', 'PTS', 'P'])?.value ?? getEntryStat(b, ['points', 'PTS', 'P'])?.displayValue ?? -1);
        if (pointsA !== pointsB) {
          return pointsB - pointsA;
        }

        const winPctA = Number(getEntryStat(a, ['winPercent', 'winpercent', 'PCT'])?.value ?? getEntryStat(a, ['winPercent', 'winpercent', 'PCT'])?.displayValue ?? -1);
        const winPctB = Number(getEntryStat(b, ['winPercent', 'winpercent', 'PCT'])?.value ?? getEntryStat(b, ['winPercent', 'winpercent', 'PCT'])?.displayValue ?? -1);
        if (winPctA !== winPctB) {
          return winPctB - winPctA;
        }

        const winsA = Number(getEntryStat(a, ['wins', 'W'])?.value ?? getEntryStat(a, ['wins', 'W'])?.displayValue ?? -1);
        const winsB = Number(getEntryStat(b, ['wins', 'W'])?.value ?? getEntryStat(b, ['wins', 'W'])?.displayValue ?? -1);
        if (winsA !== winsB) {
          return winsB - winsA;
        }

        return String(a?.team?.displayName || a?.team?.shortDisplayName || '').localeCompare(
          String(b?.team?.displayName || b?.team?.shortDisplayName || '')
        );
      });
    }

    return safeEntries.sort((a, b) => {
      const rankA = Number(getEntryStat(a, ['rank', 'playoffSeed', 'POS', 'SEED'])?.value ?? Number.MAX_SAFE_INTEGER);
      const rankB = Number(getEntryStat(b, ['rank', 'playoffSeed', 'POS', 'SEED'])?.value ?? Number.MAX_SAFE_INTEGER);
      return rankA - rankB;
    });
  };

  const conferenceOrder = (conferenceName) => {
    const normalizedName = String(conferenceName || '').toLowerCase();

    if (leagueName === 'NHL') {
      if (normalizedName.includes('western')) return 0;
      if (normalizedName.includes('eastern')) return 1;
    }

    if (leagueName === 'NBA') {
      if (normalizedName.includes('eastern')) return 0;
      if (normalizedName.includes('western')) return 1;
    }

    if (leagueName === 'NFL') {
      if (normalizedName.includes('afc')) return 0;
      if (normalizedName.includes('nfc')) return 1;
    }

    return Number.MAX_SAFE_INTEGER;
  };

  return standingsData.children
    .map((conference) => {
      const nestedGroups = Array.isArray(conference.children) ? conference.children : [];
      if (nestedGroups.length === 0) {
        return null;
      }

      const entries = nestedGroups.flatMap((group) => group?.standings?.entries || []);
      if (entries.length === 0) {
        return null;
      }

      const dedupedEntries = Array.from(new Map(
        entries.map((entry) => [entry?.team?.id || `${conference.name}-${entry?.team?.displayName || ''}`, entry])
      ).values());

      return {
        name: conference.name || conference.displayName || 'Conference',
        entries: sortConferenceEntries(dedupedEntries)
      };
    })
    .filter(Boolean)
    .sort((a, b) => {
      const orderA = conferenceOrder(a.name);
      const orderB = conferenceOrder(b.name);
      if (orderA !== orderB) {
        return orderA - orderB;
      }

      return String(a.name || '').localeCompare(String(b.name || ''));
    });
}

function getMaxStandingsGroupsForLeague(leagueName) {
  if (leagueName === 'MLB') {
    return 6;
  }

  return 4;
}

function getLeagueStandingsGroupsForSlides(leagueItems) {
  if (!Array.isArray(leagueItems) || leagueItems.length === 0) {
    return [];
  }

  const leagueName = leagueItems[0].followedTeam.league;
  const standingsData = standingsCache[leagueName];
  const sourceGroups = getConferenceStandingsGroups(standingsData, leagueName);
  const allGroups = (sourceGroups.length > 0 ? sourceGroups : getStandingsGroups(standingsData)).map((groupData) => ({
    leagueName,
    groupName: groupData.name,
    rows: getFullStandingsRows({
      name: groupData.name,
      entries: groupData.entries,
      teamIndex: -1
    }, leagueName)
  }));

  if (allGroups.length > 0 && allGroups.length <= getMaxStandingsGroupsForLeague(leagueName)) {
    return allGroups;
  }

  return getRelevantStandingsGroupsForLeagueItems(leagueItems);
}

function getLeagueStandingsSourceGroups(leagueItems) {
  if (!Array.isArray(leagueItems) || leagueItems.length === 0) {
    return [];
  }

  const leagueName = leagueItems[0].followedTeam.league;
  const standingsData = standingsCache[leagueName];
  const sourceGroups = getConferenceStandingsGroups(standingsData, leagueName);
  const allGroups = sourceGroups.length > 0 ? sourceGroups : getStandingsGroups(standingsData);

  if (allGroups.length > 0 && allGroups.length <= getMaxStandingsGroupsForLeague(leagueName)) {
    return allGroups;
  }

  return leagueItems
    .map((item) => findStandingsGroupForTeam(standingsData, item.followedTeam))
    .filter(Boolean)
    .filter((group, index, groups) => groups.findIndex((candidate) => candidate.name === group.name) === index);
}

function getFavoriteLeagueStandingsSlides(leagueItems) {
  const groups = getLeagueStandingsGroupsForSlides(leagueItems);
  const leagueName = leagueItems?.[0]?.followedTeam?.league;
  const slides = [];

  if (leagueName === 'MLB' && groups.length >= 6) {
    return [() => renderFavoriteLeagueStandingsSlide(leagueItems, groups)];
  }

  for (let i = 0; i < groups.length; i += 2) {
    const groupChunk = groups.slice(i, i + 2);
    slides.push(() => renderFavoriteLeagueStandingsSlide(leagueItems, groupChunk));
  }

  return slides;
}

async function refreshFollowedTeamContext(activeFollowedTeams) {
  const leagueNames = [...new Set([
    ...activeFollowedTeams.map(({ followedTeam }) => followedTeam.league).filter(Boolean),
    ...getSoccerRoundupLeagueNames(activeFollowedTeams)
  ])];
  const bracketLeagueNames = [...MARCH_MADNESS_LEAGUES]
    .filter((leagueName) => shouldRenderKnockoutBracketSlide(leagueName));
  const teamRequests = activeFollowedTeams.map(({ followedTeam }) => fetchTeamNews(followedTeam));

  await Promise.allSettled([
    ...leagueNames.map((leagueName) => fetchLeagueStandings(leagueName)),
    ...bracketLeagueNames.map((leagueName) => fetchBracketData(leagueName)),
    ...teamRequests
  ]);

  const soccerFormRequests = getSoccerFormRequests(activeFollowedTeams);
  await Promise.allSettled(soccerFormRequests);
}

function getSoccerRoundupLeagueNames(activeFollowedTeams) {
  const favoriteLeagueNames = new Set(activeFollowedTeams.map(({ followedTeam }) => followedTeam.league).filter(Boolean));

  return SOCCER_ROUNDUP_LEAGUES.filter((leagueName) => {
    if (favoriteLeagueNames.has(leagueName)) {
      return false;
    }

    return getGamesForLeague(leagueName, 16).length > 0;
  });
}

function getSoccerRoundupSlideData(activeFollowedTeams) {
  return getSoccerRoundupLeagueNames(activeFollowedTeams)
    .map((leagueName) => {
      const leagueData = getLeagueSlideData(leagueName);
      const group = getStandingsGroups(standingsCache[leagueName])[0];
      if (!leagueData || !group?.entries?.length) {
        return null;
      }

      const rows = getFullStandingsRows({
        name: group.name,
        entries: group.entries,
        teamIndex: -1
      }, leagueName).slice(0, 5);

      if (rows.length === 0) {
        return null;
      }

      return {
        leagueName,
        logo: leagueData.logo,
        rows
      };
    })
    .filter(Boolean);
}

async function fetchSportsData(options = {}) {
  const params = new URLSearchParams();
  const parsedOffset = Number(options?.dateOffset);
  if (Number.isFinite(parsedOffset) && parsedOffset !== 0) {
    params.set('dateOffset', String(parsedOffset));
  }

  if (Array.isArray(options?.leagues) && options.leagues.length > 0) {
    params.set('leagues', options.leagues.join(','));
  }

  if (options?.raw) {
    params.set('raw', '1');
  }

  const url = params.toString() ? `/sports?${params.toString()}` : '/sports';

  return new Promise((resolve, reject) => {
    $.ajax({
      url,
      dataType: 'json',
      cache: false
    }).done(resolve).fail(reject);
  });
}

async function fetchLeagueStandings(leagueName) {
  if (!leagueName) return;

  try {
    const data = await new Promise((resolve, reject) => {
      $.getJSON(`/standings?league=${encodeURIComponent(leagueName)}`).done(resolve).fail(reject);
    });
    standingsCache[leagueName] = data || null;
  } catch (error) {
    console.warn(`[Sports] Standings fetch failed for ${leagueName}:`, error);
    standingsCache[leagueName] = null;
  }
}

async function fetchBracketData(leagueName) {
  if (!MARCH_MADNESS_LEAGUES.has(leagueName)) return;

  try {
    const data = await new Promise((resolve, reject) => {
      $.getJSON(`/bracket?league=${encodeURIComponent(leagueName)}`).done(resolve).fail(reject);
    });
    bracketCache[leagueName] = data || null;
  } catch (error) {
    console.warn(`[Sports] Bracket fetch failed for ${leagueName}:`, error);
    bracketCache[leagueName] = null;
  }
}

async function fetchTeamNews(followedTeam) {
  const cacheKey = getFollowedTeamCacheKey(followedTeam);
  const locality = getFollowedTeamLocality(followedTeam);

  try {
    const data = await new Promise((resolve, reject) => {
      $.getJSON(`/team-news?team=${encodeURIComponent(followedTeam.name)}&locality=${encodeURIComponent(locality)}`).done(resolve).fail(reject);
    });
    followedTeamNewsCache[cacheKey] = data || {};
  } catch (error) {
    console.warn(`[Sports] Team news fetch failed for ${followedTeam.name}:`, error);
    followedTeamNewsCache[cacheKey] = {};
  }
}

function getTeamFormCacheKey(teamId, leagueName) {
  return `${leagueName || 'league'}::${teamId || 'team'}`;
}

function getSoccerFormRequests(activeFollowedTeams) {
  const requests = [];
  const seen = new Set();
  const soccerLeagueNames = [...new Set(
    activeFollowedTeams
      .map(({ followedTeam }) => followedTeam.league)
      .filter((leagueName) => SOCCER_LEAGUES.has(leagueName))
  )];

  soccerLeagueNames.forEach((leagueName) => {
    const leagueItems = activeFollowedTeams.filter((item) => item.followedTeam.league === leagueName);
    const groups = getLeagueStandingsSourceGroups(leagueItems);

    groups.forEach((group) => {
      const entries = Array.isArray(group?.entries) ? group.entries : [];
      entries.forEach((entry) => {
        const teamId = String(entry?.team?.id || '').trim();
        if (!teamId) {
          return;
        }

        const cacheKey = getTeamFormCacheKey(teamId, leagueName);
        const cached = teamFormCache[cacheKey];
        const isFresh = cached?.fetchedAt && (Date.now() - cached.fetchedAt) < (30 * 60 * 1000);
        if (seen.has(cacheKey) || isFresh) {
          return;
        }

        seen.add(cacheKey);
        requests.push(fetchTeamForm(teamId, leagueName));
      });
    });
  });

  return requests;
}

async function fetchTeamForm(teamId, leagueName) {
  if (!teamId || !SOCCER_LEAGUES.has(leagueName)) {
    return;
  }

  const cacheKey = getTeamFormCacheKey(teamId, leagueName);

  try {
    const schedulePayloads = await fetchSoccerSchedulesForForm(teamId, leagueName);
    const formTokens = getRecentFormTokensFromSchedules(schedulePayloads, teamId);
    teamFormCache[cacheKey] = {
      formTokens,
      fetchedAt: Date.now()
    };
  } catch (error) {
    console.warn(`[Sports] Team form fetch failed for ${leagueName} team ${teamId}:`, error);
    teamFormCache[cacheKey] = {
      formTokens: [],
      fetchedAt: Date.now()
    };
  }
}

function getSoccerFormLeagueNames(leagueName) {
  return [leagueName];
}

async function fetchSoccerSchedulesForForm(teamId, leagueName) {
  const leagueNames = getSoccerFormLeagueNames(leagueName);
  const results = await Promise.allSettled(
    leagueNames.map((name) => new Promise((resolve, reject) => {
      $.getJSON(`/team-schedule?league=${encodeURIComponent(name)}&teamId=${encodeURIComponent(teamId)}`).done((data) => {
        resolve({ leagueName: name, data });
      }).fail(reject);
    }))
  );

  return results
    .filter((result) => result.status === 'fulfilled')
    .map((result) => result.value);
}

function getRecentFormTokensFromSchedules(schedulePayloads, teamId) {
  const events = Array.isArray(schedulePayloads)
    ? schedulePayloads.flatMap((payload) => Array.isArray(payload?.data?.events)
      ? payload.data.events.map((event) => ({ ...event, _formLeagueName: payload.leagueName }))
      : [])
    : [];

  return events
    .filter((event) => Boolean(event?.competitions?.[0]?.status?.type?.completed || event?.status?.type?.completed))
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
    .slice(0, 5)
    .map((event) => getFormTokenFromEvent(event, teamId))
    .filter(Boolean);
}

function getFormTokenFromEvent(event, teamId) {
  const competition = event?.competitions?.[0];
  const competitors = Array.isArray(competition?.competitors) ? competition.competitors : [];
  const target = competitors.find((competitor) => String(competitor?.team?.id || '') === String(teamId));
  const opponent = competitors.find((competitor) => String(competitor?.team?.id || '') !== String(teamId));

  if (!target) {
    return '';
  }

  if (typeof target.winner === 'boolean') {
    return target.winner ? 'W' : (opponent?.winner ? 'L' : 'D');
  }

  const targetScore = Number(target?.score?.value ?? target?.score ?? NaN);
  const opponentScore = Number(opponent?.score?.value ?? opponent?.score ?? NaN);
  if (Number.isNaN(targetScore) || Number.isNaN(opponentScore)) {
    return '';
  }

  if (targetScore > opponentScore) return 'W';
  if (targetScore < opponentScore) return 'L';
  return 'D';
}

function getFollowedTeamCacheKey(followedTeam) {
  return `${followedTeam.league || 'league'}::${followedTeam.name || 'team'}`;
}

function getFollowedTeamLocality(followedTeam) {
  if (followedTeam?.newsLocality) {
    return followedTeam.newsLocality;
  }

  const name = String(followedTeam?.name || '');
  const knownLocalities = ['Cincinnati', 'Kentucky', 'Louisville', 'Lexington', 'Seattle', 'Portland', 'Florida'];
  const matched = knownLocalities.find((locality) => name.includes(locality));
  return matched || '';
}

function hasStandingsForFollowedTeam(followedTeam) {
  const standingsData = standingsCache[followedTeam?.league];
  return Boolean(findStandingsGroupForTeam(standingsData, followedTeam));
}

function getStandingsGroups(standingsData) {
  if (!standingsData) return [];

  const groups = [];
  const topChildren = Array.isArray(standingsData.children) ? standingsData.children : [];

  if (topChildren.length === 0 && standingsData.standings?.entries?.length) {
    groups.push({
      name: standingsData.displayName || standingsData.name || 'Standings',
      entries: standingsData.standings.entries
    });
    return groups;
  }

  topChildren.forEach((child) => {
    if (Array.isArray(child.children) && child.children.length > 0) {
      child.children.forEach((nestedChild) => {
        if (nestedChild?.standings?.entries?.length) {
          groups.push({
            name: nestedChild.name || child.name || 'Standings',
            entries: nestedChild.standings.entries
          });
        }
      });
      return;
    }

    if (child?.standings?.entries?.length) {
      groups.push({
        name: child.name || child.displayName || 'Standings',
        entries: child.standings.entries
      });
    }
  });

  return groups;
}

function findStandingsGroupForTeam(standingsData, followedTeam) {
  const groups = getStandingsGroups(standingsData);

  for (const group of groups) {
    const teamIndex = group.entries.findIndex((entry) => isMatchingTeam(entry?.team, followedTeam));
    if (teamIndex >= 0) {
      return {
        name: group.name,
        entries: group.entries,
        teamIndex,
        teamEntry: group.entries[teamIndex]
      };
    }
  }

  return null;
}

function getEntryStat(entry, names) {
  const stats = Array.isArray(entry?.stats) ? entry.stats : [];
  const targets = Array.isArray(names) ? names : [names];

  return stats.find((stat) => targets.includes(stat.name) || targets.includes(stat.type) || targets.includes(stat.abbreviation)) || null;
}

function formatStandingsRecord(entry, leagueName) {
  const wins = getEntryStat(entry, ['wins', 'W'])?.displayValue || '0';
  const losses = getEntryStat(entry, ['losses', 'L'])?.displayValue || '0';
  const ties = getEntryStat(entry, ['ties', 'T'])?.displayValue;

  if (SOCCER_LEAGUES.has(leagueName)) {
    const draws = getEntryStat(entry, ['draws', 'ties', 'D'])?.displayValue || '0';
    return `${wins}-${draws}-${losses}`;
  }

  if (leagueName === 'NHL' || leagueName === 'PWHL') {
    const seasonRecord = getEntryStat(entry, ['total'])?.summary;
    if (seasonRecord) {
      return seasonRecord;
    }

    const overtimeLosses = getEntryStat(entry, ['OTLosses', 'otlosses', 'OTL', 'overtimeLosses'])?.displayValue || '0';
    return `${wins}-${losses}-${overtimeLosses}`;
  }

  if (ties && ties !== '0') {
    return `${wins}-${ties}-${losses}`;
  }

  return `${wins}-${losses}`;
}

function formatStandingsMetric(entry, leagueName) {
  if (SOCCER_LEAGUES.has(leagueName) || ['NHL', 'PWHL'].includes(leagueName)) {
    const points = getEntryStat(entry, ['points', 'PTS', 'P'])?.displayValue;
    if (points) return `${points} pts`;
  }

  const gamesBehind = getEntryStat(entry, ['gamesBehind', 'GB'])?.displayValue;
  if (gamesBehind && gamesBehind !== '-') {
    return `${gamesBehind} GB`;
  }

  const seed = getEntryStat(entry, ['playoffSeed', 'rank', 'SEED', 'POS'])?.displayValue;
  if (seed) return `#${seed}`;

  const winPct = getEntryStat(entry, ['winPercent', 'winpercent', 'PCT'])?.displayValue;
  if (winPct) return winPct;

  return '';
}

function getStandingsGamesPlayed(entry, leagueName) {
  if (!SOCCER_LEAGUES.has(leagueName)) {
    return '';
  }

  return getEntryStat(entry, ['gamesPlayed', 'GP'])?.displayValue || '';
}

function getStandingsFormTokens(entry, leagueName) {
  if (!SOCCER_LEAGUES.has(leagueName)) {
    return [];
  }

  const teamId = String(entry?.team?.id || '').trim();
  if (!teamId) {
    return [];
  }

  const cacheKey = getTeamFormCacheKey(teamId, leagueName);
  return Array.isArray(teamFormCache[cacheKey]?.formTokens) ? teamFormCache[cacheKey].formTokens : [];
}

function getStandingsRows(groupData, leagueName) {
  if (!groupData?.entries?.length) return [];

  const start = groupData.teamIndex <= 2
    ? 0
    : Math.max(0, Math.min(groupData.teamIndex - 2, groupData.entries.length - 5));

  return groupData.entries.slice(start, start + 5).map((entry, index) => {
    const rank = getEntryStat(entry, ['rank', 'playoffSeed', 'POS', 'SEED'])?.displayValue || '';
    return {
      teamName: entry.team?.shortDisplayName || entry.team?.displayName || entry.team?.abbreviation || 'Team',
      logo: entry.team?.logos?.[0]?.href || '',
      rank,
      isSoccer: SOCCER_LEAGUES.has(leagueName),
      gamesPlayed: getStandingsGamesPlayed(entry, leagueName),
      record: formatStandingsRecord(entry, leagueName),
      formTokens: getStandingsFormTokens(entry, leagueName),
      metric: formatStandingsMetric(entry, leagueName),
      isFollowed: start + index === groupData.teamIndex
    };
  });
}

function getStandingsRowLimit(groupName, leagueName) {
  if (leagueName === 'NHL' && /division/i.test(String(groupName || ''))) {
    return 5;
  }

  return null;
}

function getFullStandingsRows(groupData, leagueName) {
  if (!groupData?.entries?.length) return [];

  const rowLimit = getStandingsRowLimit(groupData?.name, leagueName);
  const entries = rowLimit ? groupData.entries.slice(0, rowLimit) : groupData.entries;

  return entries.map((entry, index) => {
    const rank = getEntryStat(entry, ['rank', 'playoffSeed', 'POS', 'SEED'])?.displayValue || String(index + 1);
    return {
      teamName: entry.team?.shortDisplayName || entry.team?.displayName || entry.team?.abbreviation || 'Team',
      logo: entry.team?.logos?.[0]?.href || '',
      rank,
      isSoccer: SOCCER_LEAGUES.has(leagueName),
      gamesPlayed: getStandingsGamesPlayed(entry, leagueName),
      record: formatStandingsRecord(entry, leagueName),
      formTokens: getStandingsFormTokens(entry, leagueName),
      metric: formatStandingsMetric(entry, leagueName),
      isFollowed: Boolean(getFollowedTeams().some((followedTeam) => followedTeam.league === leagueName && isMatchingTeam(entry.team, followedTeam)))
    };
  });
}

function getStandingsStatText(entry, names, fallback = '-') {
  const stat = getEntryStat(entry, names);
  if (!stat) {
    return fallback;
  }

  const value = [stat.summary, stat.displayValue, stat.value].find((candidate) => (
    candidate !== null
    && candidate !== undefined
    && String(candidate).trim() !== ''
  ));

  return value !== undefined ? String(value).trim() : fallback;
}

function isNhlDivisionStandingsGroup(groupData, leagueName) {
  return leagueName === 'NHL' && /division/i.test(String(groupData?.name || ''));
}

function getDetailedNhlStandingsRows(groupData, leagueName) {
  if (!isNhlDivisionStandingsGroup(groupData, leagueName) || !groupData?.entries?.length) {
    return [];
  }

  const rowLimit = getStandingsRowLimit(groupData?.name, leagueName);
  const entries = rowLimit ? groupData.entries.slice(0, rowLimit) : groupData.entries;

  return entries.map((entry) => {
    const lastTenRaw = getStandingsStatText(entry, ['lasttengames', 'L10'], '-');

    return {
      teamName: entry.team?.shortDisplayName || entry.team?.displayName || entry.team?.abbreviation || 'Team',
      logo: entry.team?.logos?.[0]?.href || '',
      gamesPlayed: getStandingsStatText(entry, ['gamesPlayed', 'GP']),
      wins: getStandingsStatText(entry, ['wins', 'W']),
      losses: getStandingsStatText(entry, ['losses', 'L']),
      overtimeLosses: getStandingsStatText(entry, ['OTLosses', 'otlosses', 'OTL', 'overtimeLosses']),
      points: getStandingsStatText(entry, ['points', 'PTS', 'P']),
      goalsFor: getStandingsStatText(entry, ['pointsFor', 'GF']),
      goalsAgainst: getStandingsStatText(entry, ['pointsAgainst', 'GA']),
      goalDiff: getStandingsStatText(entry, ['pointDifferential', 'pointsDiff', 'DIFF']).replace(/^\+/, ''),
      lastTen: String(lastTenRaw).split(',')[0].trim() || '-',
      streak: getStandingsStatText(entry, ['streak', 'STRK']),
      isFollowed: Boolean(getFollowedTeams().some((followedTeam) => followedTeam.league === leagueName && isMatchingTeam(entry.team, followedTeam)))
    };
  });
}

function renderDetailedNhlStandingsTableMarkup(groupData, leagueName) {
  const rows = getDetailedNhlStandingsRows(groupData, leagueName);
  if (rows.length === 0) {
    return '';
  }

  return `
    <div class="sports-nhl-standings-table">
      <div class="sports-nhl-standings-grid sports-nhl-standings-header-row">
        <div class="sports-nhl-standings-header-cell sports-nhl-standings-header-cell--team">Team</div>
        <div class="sports-nhl-standings-header-cell">GP</div>
        <div class="sports-nhl-standings-header-cell">W</div>
        <div class="sports-nhl-standings-header-cell">L</div>
        <div class="sports-nhl-standings-header-cell">OTL</div>
        <div class="sports-nhl-standings-header-cell sports-nhl-standings-header-cell--points">Pts</div>
        <div class="sports-nhl-standings-header-cell">GF</div>
        <div class="sports-nhl-standings-header-cell">GA</div>
        <div class="sports-nhl-standings-header-cell">Diff</div>
        <div class="sports-nhl-standings-header-cell">L10</div>
        <div class="sports-nhl-standings-header-cell">Strk</div>
      </div>
      <div class="sports-nhl-standings-body">
        ${rows.map((row) => `
          <div class="sports-nhl-standings-grid sports-nhl-standings-row${row.isFollowed ? ' sports-nhl-standings-row--followed' : ''}">
            <div class="sports-nhl-standings-cell sports-nhl-standings-cell--team">
              <img class="sports-nhl-standings-logo" src="${row.logo}" alt="${row.teamName}" onerror="this.style.display='none'">
              <div class="sports-nhl-standings-team-name">${row.teamName}</div>
            </div>
            <div class="sports-nhl-standings-cell">${row.gamesPlayed}</div>
            <div class="sports-nhl-standings-cell">${row.wins}</div>
            <div class="sports-nhl-standings-cell">${row.losses}</div>
            <div class="sports-nhl-standings-cell">${row.overtimeLosses}</div>
            <div class="sports-nhl-standings-cell sports-nhl-standings-cell--points">${row.points}</div>
            <div class="sports-nhl-standings-cell">${row.goalsFor}</div>
            <div class="sports-nhl-standings-cell">${row.goalsAgainst}</div>
            <div class="sports-nhl-standings-cell">${row.goalDiff}</div>
            <div class="sports-nhl-standings-cell">${row.lastTen}</div>
            <div class="sports-nhl-standings-cell">${row.streak}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderStandingsFormMarkup(formTokens) {
  if (!Array.isArray(formTokens) || formTokens.length === 0) {
    return '<div class="sports-standings-form sports-standings-form--empty">-</div>';
  }

  return `
    <div class="sports-standings-form">
      ${[...formTokens].reverse().map((token) => `<span class="sports-standings-form-chip sports-standings-form-chip--${String(token || '').toLowerCase()}">${token}</span>`).join('')}
    </div>
  `;
}

function renderStandingsRowMarkup(row) {
  const rowClass = [
    'sports-standings-row',
    row.isFollowed ? 'sports-standings-row--followed' : '',
    row.isSoccer ? 'sports-standings-row--soccer' : ''
  ].filter(Boolean).join(' ');

  return `
    <div class="${rowClass}">
      <img class="sports-standings-logo" src="${row.logo}" alt="${row.teamName}" onerror="this.style.display='none'">
      <div class="sports-standings-team">${row.teamName}</div>
      ${row.isSoccer ? `<div class="sports-standings-gp">${row.gamesPlayed || '-'}</div>` : ''}
      <div class="sports-standings-record">${row.record}</div>
      ${row.isSoccer ? renderStandingsFormMarkup(row.formTokens) : ''}
      <div class="sports-standings-metric">${row.metric}</div>
    </div>
  `;
}

function getFollowedTeamHeadlineItems(followedTeam) {
  const cacheKey = getFollowedTeamCacheKey(followedTeam);
  const teamNews = followedTeamNewsCache[cacheKey] || {};
  const localItems = (teamNews.local?.items || []).slice(0, 1).map((item) => ({ ...item, _bucket: 'LOCAL' }));
  const nationalItems = (teamNews.national?.items || []).slice(0, 1).map((item) => ({ ...item, _bucket: 'NATIONAL' }));
  return [...localItems, ...nationalItems];
}

function getCompetitorSummaryStatValue(competitor, statKeys = [], fallbackValue = '0') {
  if (!competitor || !Array.isArray(statKeys) || statKeys.length === 0) {
    return fallbackValue;
  }

  const normalizedKeys = statKeys
    .map((key) => String(key || '').trim().toLowerCase())
    .filter(Boolean);

  const directKey = normalizedKeys.find((key) => (
    Object.prototype.hasOwnProperty.call(competitor, key)
    && competitor[key] !== null
    && competitor[key] !== undefined
    && String(competitor[key]).trim() !== ''
  ));
  if (directKey) {
    return String(competitor[directKey]);
  }

  const stats = Array.isArray(competitor.statistics) ? competitor.statistics : [];
  const matchingStat = stats.find((stat) => {
    const statName = String(stat?.name || '').trim().toLowerCase();
    const statAbbreviation = String(stat?.abbreviation || '').trim().toLowerCase();
    return normalizedKeys.includes(statName) || normalizedKeys.includes(statAbbreviation);
  });

  if (matchingStat) {
    return String(matchingStat.displayValue ?? matchingStat.value ?? fallbackValue);
  }

  return fallbackValue;
}

function getLineScoreData(gameData) {
  const competition = gameData?.event?.competitions?.[0];
  const competitors = competition?.competitors || [];
  const homeTeam = competitors.find((competitor) => competitor.homeAway === 'home');
  const awayTeam = competitors.find((competitor) => competitor.homeAway === 'away');
  const status = gameData?.event?.status?.type?.state || '';
  const isBaseball = isBaseballLeague(gameData?.league);

  if (status !== 'in' || !homeTeam || !awayTeam) {
    return null;
  }

  const awayLines = Array.isArray(awayTeam.linescores) ? awayTeam.linescores : [];
  const homeLines = Array.isArray(homeTeam.linescores) ? homeTeam.linescores : [];
  const periodCount = Math.max(awayLines.length, homeLines.length);

  if (periodCount === 0) {
    return null;
  }

  const periods = Array.from({ length: periodCount }, (_, index) => ({
    label: String(index + 1),
    away: awayLines[index]?.displayValue || awayLines[index]?.value || '',
    home: homeLines[index]?.displayValue || homeLines[index]?.value || ''
  }));

  const summaryColumns = isBaseball
    ? [
        { label: 'R', emphasis: true },
        { label: 'H', emphasis: false },
        { label: 'E', emphasis: false }
      ]
    : [
        { label: 'T', emphasis: true }
      ];

  return {
    periods,
    summaryColumns,
    awayTeam: {
      name: awayTeam.team?.shortDisplayName || awayTeam.team?.abbreviation || awayTeam.team?.displayName || 'Away',
      logo: getTeamLogoUrl(awayTeam.team),
      total: awayTeam.score || '0',
      summaryValues: isBaseball
        ? [
            getCompetitorSummaryStatValue(awayTeam, ['score', 'runs', 'r']),
            getCompetitorSummaryStatValue(awayTeam, ['hits', 'h']),
            getCompetitorSummaryStatValue(awayTeam, ['errors', 'e'])
          ]
        : [awayTeam.score || '0']
    },
    homeTeam: {
      name: homeTeam.team?.shortDisplayName || homeTeam.team?.abbreviation || homeTeam.team?.displayName || 'Home',
      logo: getTeamLogoUrl(homeTeam.team),
      total: homeTeam.score || '0',
      summaryValues: isBaseball
        ? [
            getCompetitorSummaryStatValue(homeTeam, ['score', 'runs', 'r']),
            getCompetitorSummaryStatValue(homeTeam, ['hits', 'h']),
            getCompetitorSummaryStatValue(homeTeam, ['errors', 'e'])
          ]
        : [homeTeam.score || '0']
    }
  };
}

function formatBaseOccupancyText(details) {
  const occupiedBases = [
    details?.onFirst ? '1st' : null,
    details?.onSecond ? '2nd' : null,
    details?.onThird ? '3rd' : null
  ].filter(Boolean);

  if (occupiedBases.length === 0) {
    return 'Bases Empty';
  }

  if (occupiedBases.length === 3) {
    return 'Bases Loaded';
  }

  if (occupiedBases.length === 2) {
    return `${occupiedBases[0]} & ${occupiedBases[1]}`;
  }

  return occupiedBases[0];
}

function renderLineScoreGridMarkup(lineScore, options = {}) {
  if (!lineScore) {
    return '';
  }

  const compact = Boolean(options.compact);
  const summaryColumns = Array.isArray(lineScore.summaryColumns) && lineScore.summaryColumns.length > 0
    ? lineScore.summaryColumns
    : [{ label: 'T', emphasis: true }];
  const hasExpandedSummary = summaryColumns.length > 1;
  const teamColumnWidth = compact
    ? (hasExpandedSummary ? 'minmax(0, 1fr)' : 'minmax(0, 1.2fr)')
    : (hasExpandedSummary ? 'minmax(0, 1.2fr)' : 'minmax(0, 1.4fr)');
  const periodColumnWidth = compact
    ? (hasExpandedSummary ? 'minmax(24px, 0.9fr)' : 'minmax(28px, 1fr)')
    : (hasExpandedSummary ? 'minmax(30px, 0.9fr)' : 'minmax(34px, 1fr)');
  const summaryColumnWidth = compact
    ? (hasExpandedSummary ? 'minmax(28px, 0.75fr)' : 'minmax(38px, 0.7fr)')
    : (hasExpandedSummary ? 'minmax(34px, 0.8fr)' : 'minmax(42px, 0.8fr)');
  const summaryColumnTemplate = summaryColumns.map(() => summaryColumnWidth).join(' ');

  return `
    <div class="sports-linescore-grid${compact ? ' sports-linescore-grid--compact' : ''}" style="grid-template-columns: ${teamColumnWidth} repeat(${lineScore.periods.length}, ${periodColumnWidth}) ${summaryColumnTemplate};">
      <div class="sports-linescore-cell sports-linescore-cell--head sports-linescore-cell--team">TEAM</div>
      ${lineScore.periods.map((period) => `<div class="sports-linescore-cell sports-linescore-cell--head">${period.label}</div>`).join('')}
      ${summaryColumns.map((column) => `<div class="sports-linescore-cell sports-linescore-cell--head">${column.label}</div>`).join('')}

      <div class="sports-linescore-cell sports-linescore-cell--teamrow">
        <img class="sports-linescore-logo" src="${lineScore.awayTeam.logo}" alt="${lineScore.awayTeam.name}" onerror="this.style.display='none'">
        <span class="sports-linescore-team">${lineScore.awayTeam.name}</span>
      </div>
      ${lineScore.periods.map((period) => `<div class="sports-linescore-cell">${period.away}</div>`).join('')}
      ${summaryColumns.map((column, index) => `
        <div class="sports-linescore-cell${hasExpandedSummary ? ' sports-linescore-cell--summary' : ''}${column.emphasis ? ' sports-linescore-cell--total' : ''}">${lineScore.awayTeam.summaryValues?.[index] ?? '-'}</div>
      `).join('')}

      <div class="sports-linescore-cell sports-linescore-cell--teamrow">
        <img class="sports-linescore-logo" src="${lineScore.homeTeam.logo}" alt="${lineScore.homeTeam.name}" onerror="this.style.display='none'">
        <span class="sports-linescore-team">${lineScore.homeTeam.name}</span>
      </div>
      ${lineScore.periods.map((period) => `<div class="sports-linescore-cell">${period.home}</div>`).join('')}
      ${summaryColumns.map((column, index) => `
        <div class="sports-linescore-cell${hasExpandedSummary ? ' sports-linescore-cell--summary' : ''}${column.emphasis ? ' sports-linescore-cell--total' : ''}">${lineScore.homeTeam.summaryValues?.[index] ?? '-'}</div>
      `).join('')}
    </div>
  `;
}

function renderFeaturedLiveBaseballStateMarkup(gameData, lineScore = null) {
  const details = getBaseballLiveDetails(gameData);
  if (!details) {
    return '';
  }

  const competition = gameData?.event?.competitions?.[0];
  const competitors = Array.isArray(competition?.competitors) ? competition.competitors : [];
  const homeTeam = competitors.find((competitor) => String(competitor?.homeAway || '').toLowerCase() === 'home');
  const awayTeam = competitors.find((competitor) => String(competitor?.homeAway || '').toLowerCase() === 'away');
  const awayBatting = /^top/i.test(details.inningState);
  const homeBatting = /^bot/i.test(details.inningState) || /^bottom/i.test(details.inningState);
  const battingTeam = awayBatting ? awayTeam : (homeBatting ? homeTeam : null);
  const battingTeamName = battingTeam?.team?.shortDisplayName
    || battingTeam?.team?.abbreviation
    || battingTeam?.team?.displayName
    || 'At Bat';
  const stateMetrics = [
    { label: 'Balls', value: details.balls },
    { label: 'Strikes', value: details.strikes },
    { label: 'Outs', value: details.outs }
  ];

  return `
    <div class="sports-team-linescore sports-team-linescore--live-state">
      <div class="sports-team-news-title">CURRENT GAME STATE</div>
      <div class="sports-feature-live-state">
        <div class="sports-feature-live-state-diamond-wrap">
          ${renderBaseballDiamondMarkup(details)}
          <div class="sports-feature-live-state-bases-label">Runners</div>
          <div class="sports-feature-live-state-bases-value">${formatBaseOccupancyText(details)}</div>
        </div>
        <div class="sports-feature-live-state-main">
          <div class="sports-feature-live-state-label">Batting Now</div>
          <div class="sports-feature-live-state-team">${battingTeamName}</div>
          <div class="sports-feature-live-state-phase">${details.inningState}</div>
        </div>
        <div class="sports-feature-live-state-side">
          <div class="sports-feature-live-state-counts">
            ${stateMetrics.map((metric) => `
              <div class="sports-feature-live-state-metric">
                <span class="sports-feature-live-state-metric-label">${metric.label}</span>
                <span class="sports-feature-live-state-metric-value">${metric.value === null || metric.value === undefined ? '-' : metric.value}</span>
              </div>
            `).join('')}
          </div>
          <div class="sports-feature-live-state-players">
            <div class="sports-feature-live-state-player">
              <span class="sports-feature-live-state-player-label">Batter</span>
              <span class="sports-feature-live-state-player-value">${details.batterName}</span>
            </div>
            <div class="sports-feature-live-state-player">
              <span class="sports-feature-live-state-player-label">Pitcher</span>
              <span class="sports-feature-live-state-player-value">${details.pitcherName}</span>
            </div>
          </div>
        </div>
      </div>
      ${lineScore ? `
        <div class="sports-feature-live-state-linescore-label">RUNS BY INNING</div>
        ${renderLineScoreGridMarkup(lineScore, { compact: true })}
      ` : ''}
    </div>
  `;
}

function getBaseballFinalHomeRunCountMap(gameData) {
  if (!isBaseballLeague(gameData?.league)) {
    return null;
  }

  const homeRuns = getTrustedBaseballFinalHomeRuns(gameData);

  if (homeRuns.length === 0) {
    return null;
  }

  return homeRuns.reduce((map, entry) => {
    const teamKey = String(entry?.teamAbbreviation || '').trim().toUpperCase();
    if (!teamKey) {
      return map;
    }

    const countValue = Number(entry?.count);
    map[teamKey] = (map[teamKey] || 0) + (Number.isFinite(countValue) && countValue > 0 ? countValue : 1);
    return map;
  }, {});
}

const POSTGAME_STAT_METADATA = {
  R: { detailLabel: 'Runs' },
  H: { detailLabel: 'Hits' },
  E: { detailLabel: 'Errors', lowerIsBetter: true },
  AVG: { detailLabel: 'Batting Avg.' },
  ERA: { detailLabel: 'Pitching ERA', lowerIsBetter: true },
  HR: { detailLabel: 'Home Runs' },
  LOB: { detailLabel: 'Left On Base', compare: false },
  SV: { detailLabel: 'Saves', compare: false },
  YDS: { detailLabel: 'Total Yards' },
  PASS: { detailLabel: 'Pass Yards' },
  RUSH: { detailLabel: 'Rush Yards' },
  TO: { detailLabel: 'Turnovers', lowerIsBetter: true },
  '1STD': { detailLabel: '1st Downs' },
  'FG%': { detailLabel: 'Field Goal %' },
  '3PT%': { detailLabel: '3-Point %' },
  REB: { detailLabel: 'Rebounds' },
  AST: { detailLabel: 'Assists' },
  SOG: { detailLabel: 'Shots on Goal' },
  PP: { detailLabel: 'Power Play' },
  PIM: { detailLabel: 'Penalty Minutes', lowerIsBetter: true },
  'FO%': { detailLabel: 'Faceoff %' },
  HITS: { detailLabel: 'Hits' },
  POS: { detailLabel: 'Possession' },
  S: { detailLabel: 'Shots' },
  FC: { detailLabel: 'Fouls', lowerIsBetter: true },
  YC: { detailLabel: 'Yellow Cards', lowerIsBetter: true }
};

function getPostGameStatMetadata(label) {
  const key = String(label || '').trim().toUpperCase();
  return POSTGAME_STAT_METADATA[key] || {};
}

function parsePostGameComparableValue(value) {
  const text = String(value ?? '').trim();
  if (!text) {
    return null;
  }

  const ratioMatch = text.match(/^(-?(?:\d+\.?\d*|\.\d+))\s*\/\s*(-?(?:\d+\.?\d*|\.\d+))$/);
  if (ratioMatch) {
    const numerator = Number(ratioMatch[1]);
    const denominator = Number(ratioMatch[2]);
    if (Number.isFinite(numerator) && Number.isFinite(denominator) && denominator !== 0) {
      return numerator / denominator;
    }
  }

  const cleaned = text.replace(/,/g, '').replace(/%$/, '').trim();
  if (/^-?(?:\d+\.?\d*|\.\d+)$/.test(cleaned)) {
    return Number(cleaned);
  }

  return null;
}

function getPostGameStatWinner(label, featuredValue, opponentValue) {
  const { lowerIsBetter = false, compare = true } = getPostGameStatMetadata(label);
  if (compare === false) {
    return null;
  }

  const featuredNumber = parsePostGameComparableValue(featuredValue);
  const opponentNumber = parsePostGameComparableValue(opponentValue);

  if (!Number.isFinite(featuredNumber) || !Number.isFinite(opponentNumber)) {
    return null;
  }

  if (Math.abs(featuredNumber - opponentNumber) < 0.0001) {
    return 'tie';
  }

  if (lowerIsBetter) {
    return featuredNumber < opponentNumber ? 'featured' : 'opponent';
  }

  return featuredNumber > opponentNumber ? 'featured' : 'opponent';
}

function getPostGameStatsData(gameData, followedTeam = null) {
  const competition = gameData?.event?.competitions?.[0];
  const competitors = Array.isArray(competition?.competitors) ? competition.competitors : [];
  const homeTeam = competitors.find((competitor) => competitor.homeAway === 'home');
  const awayTeam = competitors.find((competitor) => competitor.homeAway === 'away');
  const status = gameData?.event?.status?.type?.state || '';
  const expandedStatsLimit = 8;

  if (status !== 'post' || !homeTeam || !awayTeam) {
    return null;
  }

  const homeStats = Array.isArray(homeTeam.statistics) ? homeTeam.statistics : [];
  const awayStats = Array.isArray(awayTeam.statistics) ? awayTeam.statistics : [];
  if (homeStats.length === 0 || awayStats.length === 0) {
    return null;
  }

  const homeStatsByAbbr = homeStats.reduce((map, stat) => {
    const key = String(stat?.abbreviation || stat?.name || '').toUpperCase();
    if (key) {
      map[key] = stat;
    }
    return map;
  }, {});
  const awayStatsByAbbr = awayStats.reduce((map, stat) => {
    const key = String(stat?.abbreviation || stat?.name || '').toUpperCase();
    if (key) {
      map[key] = stat;
    }
    return map;
  }, {});
  const homeTeamAbbreviation = String(homeTeam?.team?.abbreviation || homeTeam?.team?.shortDisplayName || '').toUpperCase();
  const awayTeamAbbreviation = String(awayTeam?.team?.abbreviation || awayTeam?.team?.shortDisplayName || '').toUpperCase();
  const baseballHomeRunCounts = getBaseballFinalHomeRunCountMap(gameData);
  const homeDerivedStatsByAbbr = baseballHomeRunCounts && homeTeamAbbreviation
    ? {
        HR: {
          abbreviation: 'HR',
          displayValue: String(baseballHomeRunCounts[homeTeamAbbreviation] || 0)
        }
      }
    : {};
  const awayDerivedStatsByAbbr = baseballHomeRunCounts && awayTeamAbbreviation
    ? {
        HR: {
          abbreviation: 'HR',
          displayValue: String(baseballHomeRunCounts[awayTeamAbbreviation] || 0)
        }
      }
    : {};

  const preferredOrders = {
    MLB: ['R', 'H', 'E', 'AVG', 'ERA', 'HR', 'LOB', 'SV'],
    'College Baseball': ['R', 'H', 'E', 'AVG', 'ERA', 'HR', 'LOB', 'SV'],
    NFL: ['YDS', 'PASS', 'RUSH', 'TO', '1STD'],
    NCAAB: ['FG%', '3PT%', 'REB', 'AST', 'TO'],
    NCAAW: ['FG%', '3PT%', 'REB', 'AST', 'TO'],
    NBA: ['FG%', '3PT%', 'REB', 'AST', 'TO'],
    NHL: ['SOG', 'PP', 'PIM', 'FO%', 'HITS'],
    MLS: ['POS', 'S', 'SOG', 'FC', 'YC'],
    EPL: ['POS', 'S', 'SOG', 'FC', 'YC'],
    'UEFA CL': ['POS', 'S', 'SOG', 'FC', 'YC'],
    'UEFA EL': ['POS', 'S', 'SOG', 'FC', 'YC'],
    'UEFA Conference League': ['POS', 'S', 'SOG', 'FC', 'YC'],
    'World Cup': ['POS', 'S', 'SOG', 'FC', 'YC'],
    'FA Cup': ['POS', 'S', 'SOG', 'FC', 'YC'],
    'Concacaf Champions Cup': ['POS', 'S', 'SOG', 'FC', 'YC'],
  };

  const leagueName = gameData?.league || '';
  const preferredOrder = preferredOrders[leagueName] || [];
  const selected = [];

  preferredOrder.forEach((abbr) => {
    const homeStat = homeStatsByAbbr[abbr] || homeDerivedStatsByAbbr[abbr];
    const awayStat = awayStatsByAbbr[abbr] || awayDerivedStatsByAbbr[abbr];
    const label = homeStat?.abbreviation || awayStat?.abbreviation || homeStat?.name || awayStat?.name || abbr;
    if (homeStat && awayStat) {
      selected.push({
        label,
        detailLabel: getPostGameStatMetadata(label).detailLabel || '',
        homeValue: homeStat.displayValue || '',
        awayValue: awayStat.displayValue || ''
      });
    }
  });

  if (selected.length === 0) {
    homeStats.forEach((homeStat) => {
      const abbr = String(homeStat?.abbreviation || homeStat?.name || '').toUpperCase();
      const awayStat = awayStatsByAbbr[abbr];
      if (!awayStat || selected.length >= expandedStatsLimit) {
        return;
      }

      const label = homeStat?.abbreviation || awayStat?.abbreviation || homeStat?.name || awayStat?.name || abbr;
      selected.push({
        label,
        detailLabel: getPostGameStatMetadata(label).detailLabel || '',
        homeValue: homeStat.displayValue || '',
        awayValue: awayStat.displayValue || ''
      });
    });
  }

  if (selected.length === 0) {
    return null;
  }

  const featuredTeam = followedTeam
    ? competitors.find((competitor) => isMatchingTeam(competitor.team, followedTeam))
    : awayTeam;
  const opponentTeam = competitors.find((competitor) => competitor !== featuredTeam) || homeTeam;

  if (!featuredTeam || !opponentTeam) {
    return null;
  }

  const featuredStats = Array.isArray(featuredTeam.statistics) ? featuredTeam.statistics : [];
  const opponentStats = Array.isArray(opponentTeam.statistics) ? opponentTeam.statistics : [];
  const featuredIsHome = String(featuredTeam.homeAway || '').toLowerCase() === 'home';
  const featuredDerivedStatsByAbbr = featuredIsHome ? homeDerivedStatsByAbbr : awayDerivedStatsByAbbr;
  const opponentDerivedStatsByAbbr = featuredIsHome ? awayDerivedStatsByAbbr : homeDerivedStatsByAbbr;
  const featuredStatsByAbbr = featuredStats.reduce((map, stat) => {
    const key = String(stat?.abbreviation || stat?.name || '').toUpperCase();
    if (key) {
      map[key] = stat;
    }
    return map;
  }, {});
  const opponentStatsByAbbr = opponentStats.reduce((map, stat) => {
    const key = String(stat?.abbreviation || stat?.name || '').toUpperCase();
    if (key) {
      map[key] = stat;
    }
    return map;
  }, {});

  const orientedStats = selected.map((stat) => {
    const key = String(stat.label || '').toUpperCase();
    const featuredValue = featuredStatsByAbbr[key]?.displayValue
      || featuredDerivedStatsByAbbr[key]?.displayValue
      || (featuredIsHome ? stat.homeValue : stat.awayValue);
    const opponentValue = opponentStatsByAbbr[key]?.displayValue
      || opponentDerivedStatsByAbbr[key]?.displayValue
      || (featuredIsHome ? stat.awayValue : stat.homeValue);
    return {
      label: stat.label,
      detailLabel: stat.detailLabel,
      featuredValue,
      opponentValue,
      winner: getPostGameStatWinner(stat.label, featuredValue, opponentValue)
    };
  });

  return {
    featuredTeam: {
      name: featuredTeam.team?.shortDisplayName || featuredTeam.team?.abbreviation || featuredTeam.team?.displayName || 'Featured',
      logo: getTeamLogoUrl(featuredTeam.team)
    },
    opponentTeam: {
      name: opponentTeam.team?.shortDisplayName || opponentTeam.team?.abbreviation || opponentTeam.team?.displayName || 'Opponent',
      logo: getTeamLogoUrl(opponentTeam.team)
    },
    stats: orientedStats.slice(0, expandedStatsLimit)
  };
}

function getPostGameStatsSupplementalItems(gameData) {
  if (!isBaseballLeague(gameData?.league)) {
    return [];
  }

  const details = getBaseballFinalDetails(gameData);
  if (!details) {
    return [];
  }

  const supplementalItems = [];
  if (details.decisions.length > 0) {
    supplementalItems.push({
      label: 'DECISIONS',
      value: details.decisions.map((decision) => `${decision.label} ${decision.name}`).join(' | ')
    });
  }

  if (details.scoringSummaryText && details.scoringSummaryLabel) {
    supplementalItems.push({
      label: details.scoringSummaryLabel,
      value: details.scoringSummaryText
    });
  }

  return supplementalItems;
}

function getCompetitionNoteText(competition) {
  const notes = Array.isArray(competition?.notes) ? competition.notes : [];
  const preferredNote = notes.find((note) => /aggregate|advance|advances|leg/i.test(String(note?.headline || note?.text || '')))
    || notes[0];
  return preferredNote?.headline || preferredNote?.text || '';
}

function getAggregateTextFromSources(...sources) {
  const texts = sources
    .flat()
    .filter(Boolean)
    .map((value) => String(value).trim())
    .filter(Boolean);

  const preferred = texts.find((text) => /aggregate|on agg|on aggregate|\bagg\b/i.test(text));
  if (preferred) {
    return preferred;
  }

  return texts.find((text) => /advance|advances/i.test(text)) || '';
}

function getKnockoutRoundLabel(event, competition, fallbackLabel) {
  const cupTieMeta = getCupTieMeta(event, competition);
  if (cupTieMeta?.primary) {
    return cupTieMeta.primary;
  }

  const noteText = getCompetitionNoteText(competition);
  const noteSegments = noteText.split(' - ').map((segment) => segment.trim()).filter(Boolean);
  const noteRound = [...noteSegments].reverse().find((segment) => /round|final four|elite 8|sweet 16|regional semifinal|regional final|championship/i.test(segment));
  return noteRound || fallbackLabel || 'Knockout Round';
}

function normalizeKnockoutRoundLabel(label = '', fallbackLabel = 'Knockout Round') {
  const text = String(label || '').trim();
  if (!text) {
    return fallbackLabel;
  }

  const lower = text.toLowerCase();

  if (/\bchampionship\b/.test(lower)) return 'Championship';
  if (/\bfinal four\b/.test(lower)) return 'Final Four';
  if (/\bnational semifinal\b/.test(lower)) return 'National Semifinal';
  if (/\bsemi\b/.test(lower)) return 'Semifinals';
  if (/\bquarter\b/.test(lower)) return 'Quarterfinals';
  if (/\bsweet\s*16\b/.test(lower)) return 'Sweet 16';
  if (/\belite\s*8\b/.test(lower)) return 'Elite 8';

  const roundOfMatch = lower.match(/\bround of (\d+)\b/);
  if (roundOfMatch) {
    return `Round Of ${roundOfMatch[1]}`;
  }

  const numberedRoundMatch = lower.match(/\b(\d+)(?:st|nd|rd|th)\s+round\b/);
  if (numberedRoundMatch) {
    return `${numberedRoundMatch[1]}${getOrdinalSuffix(numberedRoundMatch[1])} Round`;
  }

  const cleanLabel = text
    .replace(/\s*-\s*leg\s*\d+\b/ig, '')
    .replace(/\s*-\s*first leg\b/ig, '')
    .replace(/\s*-\s*second leg\b/ig, '')
    .trim();

  return cleanLabel || fallbackLabel;
}

function getOrdinalSuffix(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) {
    return 'th';
  }

  const mod100 = number % 100;
  if (mod100 >= 11 && mod100 <= 13) {
    return 'th';
  }

  const mod10 = number % 10;
  if (mod10 === 1) return 'st';
  if (mod10 === 2) return 'nd';
  if (mod10 === 3) return 'rd';
  return 'th';
}

function getKnockoutRoundSortValue(label = '') {
  const normalized = String(label || '').trim().toLowerCase();
  if (!normalized) return 999;

  if (/\bchampionship\b/.test(normalized)) return 90;
  if (/\bfinal four\b/.test(normalized)) return 80;
  if (/\bnational semifinal\b/.test(normalized)) return 78;
  if (/\bsemi\b/.test(normalized)) return 70;
  if (/\bquarter\b/.test(normalized)) return 60;
  if (/\belite\s*8\b/.test(normalized)) return 55;
  if (/\bsweet\s*16\b/.test(normalized)) return 50;

  const roundOfMatch = normalized.match(/\bround of (\d+)\b/);
  if (roundOfMatch) {
    return Number(roundOfMatch[1]);
  }

  const numberedRoundMatch = normalized.match(/\b(\d+)(?:st|nd|rd|th)\s+round\b/);
  if (numberedRoundMatch) {
    return 200 + Number(numberedRoundMatch[1]);
  }

  return 400;
}

function getMarchMadnessBranding(leagueName, seasonType) {
  const roundLabel = seasonType?.abbreviation || seasonType?.name || 'Tournament';
  if (!MARCH_MADNESS_LEAGUES.has(leagueName)) {
    return {
      kicker: `${leagueName} BRACKET`,
      subtitle: 'Current Matchday In The Knockout Round',
      roundLabel
    };
  }

  return {
    kicker: `${leagueName} TOURNAMENT`,
    subtitle: leagueName === 'NCAAW' ? 'Women\'s March Madness' : 'Men\'s March Madness',
    roundLabel
  };
}

function getBracketRegionSortValue(regionName = '') {
  const normalizedRegionName = String(regionName || '').toUpperCase();
  const order = {
    SOUTH: 1,
    EAST: 2,
    WEST: 3,
    MIDWEST: 4,
    'ALBANY 1': 1,
    'ALBANY 2': 2,
    'BIRMINGHAM 1': 3,
    'BIRMINGHAM 2': 4,
    'PORTLAND 1': 1,
    'PORTLAND 2': 2,
    'SPOKANE 1': 3,
    'SPOKANE 2': 4
  };

  const numberedRegionalMatch = normalizedRegionName.match(/^REGIONAL\s+(\d+)$/);
  if (numberedRegionalMatch) {
    return Number(numberedRegionalMatch[1]);
  }

  return order[normalizedRegionName] || 99;
}

function getMarchMadnessRegionRoundCounts(region = {}) {
  return {
    firstRound: Array.isArray(region?.firstRound) ? region.firstRound.length : 0,
    secondRound: Array.isArray(region?.secondRound) ? region.secondRound.length : 0,
    sweet16: Array.isArray(region?.sweet16) ? region.sweet16.length : 0,
    elite8: Array.isArray(region?.elite8) ? region.elite8.length : 0
  };
}

function hasMarchMadnessBracketGames(bracketData) {
  if (!bracketData) {
    return false;
  }

  const regionalGameCount = Array.isArray(bracketData.regions)
    ? bracketData.regions.reduce((total, region) => {
      const roundCounts = getMarchMadnessRegionRoundCounts(region);
      return total + roundCounts.firstRound + roundCounts.secondRound + roundCounts.sweet16 + roundCounts.elite8;
    }, 0)
    : 0;

  const lateGameCount = ['firstFour', 'finalFour', 'championship']
    .reduce((total, roundKey) => total + (Array.isArray(bracketData?.[roundKey]) ? bracketData[roundKey].length : 0), 0);

  return regionalGameCount + lateGameCount > 0;
}

function getMarchMadnessRegionStage(region) {
  const roundCounts = getMarchMadnessRegionRoundCounts(region);
  const hasEarlyRounds = roundCounts.firstRound > 0 || roundCounts.secondRound > 0;

  if (!hasEarlyRounds && roundCounts.elite8 > 0 && roundCounts.sweet16 === 0) {
    return 'elite8';
  }

  if (!hasEarlyRounds && (roundCounts.sweet16 > 0 || roundCounts.elite8 > 0)) {
    return 'late';
  }

  return 'early';
}

function getMarchMadnessBracketData(leagueName) {
  const bracketData = bracketCache[leagueName];
  if (!hasUsableMarchMadnessBracket(leagueName)) {
    return null;
  }

  return {
    ...bracketData,
    regions: [...(bracketData.regions || [])].sort((a, b) => (
      getBracketRegionSortValue(a.name) - getBracketRegionSortValue(b.name)
    ))
  };
}

function hasMarchMadnessTeamScore(team) {
  return /^\d+$/.test(String(team?.score || '').trim());
}

function getMarchMadnessGameCompletenessScore(game) {
  if (!game) {
    return -1;
  }

  let score = 0;
  if (game?.event) score += 2;
  if (game?.competition) score += 2;
  if (hasMarchMadnessTeamScore(game?.away) && hasMarchMadnessTeamScore(game?.home)) score += 4;
  if (game?.isFinal) score += 2;
  if (String(game?.statusText || '').trim()) score += 1;
  return score;
}

function normalizeMarchMadnessTeamName(name = '') {
  return String(name || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function areMarchMadnessTeamsLikelySame(teamA, teamB) {
  const nameA = normalizeMarchMadnessTeamName(teamA?.team);
  const nameB = normalizeMarchMadnessTeamName(teamB?.team);
  if (!nameA || !nameB) {
    return false;
  }

  if (nameA === nameB) {
    return true;
  }

  const seedA = String(teamA?.seed || '').trim();
  const seedB = String(teamB?.seed || '').trim();
  return Boolean(seedA && seedB && seedA === seedB && (nameA.includes(nameB) || nameB.includes(nameA)));
}

function alignMarchMadnessGameOrientation(referenceGame, candidateGame) {
  if (!referenceGame || !candidateGame) {
    return candidateGame;
  }

  if (
    areMarchMadnessTeamsLikelySame(referenceGame.away, candidateGame.home)
    && areMarchMadnessTeamsLikelySame(referenceGame.home, candidateGame.away)
  ) {
    return {
      ...candidateGame,
      away: candidateGame.home,
      home: candidateGame.away
    };
  }

  return candidateGame;
}

function mergeMarchMadnessTeamData(primaryTeam, supplementalTeam) {
  const primaryHasScore = hasMarchMadnessTeamScore(primaryTeam);
  const supplementalHasScore = hasMarchMadnessTeamScore(supplementalTeam);

  return {
    seed: primaryTeam?.seed || supplementalTeam?.seed || '',
    team: primaryTeam?.team || supplementalTeam?.team || 'TBD',
    score: primaryHasScore
      ? primaryTeam.score
      : (supplementalHasScore ? supplementalTeam.score : (primaryTeam?.score || supplementalTeam?.score || ''))
  };
}

function mergeMarchMadnessGameData(primaryGame, supplementalGame) {
  if (!primaryGame) {
    return supplementalGame;
  }

  if (!supplementalGame) {
    return primaryGame;
  }

  const alignedSupplementalGame = alignMarchMadnessGameOrientation(primaryGame, supplementalGame);
  const preferredGame = getMarchMadnessGameCompletenessScore(primaryGame) >= getMarchMadnessGameCompletenessScore(alignedSupplementalGame)
    ? primaryGame
    : alignedSupplementalGame;
  const fallbackGame = preferredGame === primaryGame ? alignedSupplementalGame : primaryGame;

  return {
    ...fallbackGame,
    ...preferredGame,
    event: preferredGame?.event || fallbackGame?.event,
    competition: preferredGame?.competition || fallbackGame?.competition,
    statusText: preferredGame?.statusText || fallbackGame?.statusText || '',
    isFinal: Boolean(preferredGame?.isFinal || fallbackGame?.isFinal),
    away: mergeMarchMadnessTeamData(preferredGame?.away, fallbackGame?.away),
    home: mergeMarchMadnessTeamData(preferredGame?.home, fallbackGame?.home)
  };
}

function mergeMarchMadnessRoundGames(primaryGames = [], supplementalGames = [], orderingFn = null) {
  const orderedPrimaryGames = orderingFn ? orderingFn(primaryGames) : [...(Array.isArray(primaryGames) ? primaryGames : [])];
  const orderedSupplementalGames = orderingFn ? orderingFn(supplementalGames) : [...(Array.isArray(supplementalGames) ? supplementalGames : [])];
  const mergedGames = [];
  const maxLength = Math.max(orderedPrimaryGames.length, orderedSupplementalGames.length);

  for (let index = 0; index < maxLength; index += 1) {
    const mergedGame = mergeMarchMadnessGameData(orderedPrimaryGames[index], orderedSupplementalGames[index]);
    if (mergedGame) {
      mergedGames.push(mergedGame);
    }
  }

  return mergedGames;
}

function mergeMarchMadnessBracketData(primaryData, supplementalData) {
  if (!primaryData) {
    return supplementalData;
  }

  if (!supplementalData) {
    return primaryData;
  }

  const primaryRegions = Array.isArray(primaryData.regions) ? primaryData.regions : [];
  const supplementalRegions = Array.isArray(supplementalData.regions) ? supplementalData.regions : [];
  const supplementalRegionMap = new Map(
    supplementalRegions.map((region) => [normalizeMarchMadnessRegionName(region?.name), region])
  );
  const mergedRegions = primaryRegions.map((region) => {
    const supplementalRegion = supplementalRegionMap.get(normalizeMarchMadnessRegionName(region?.name));
    if (!supplementalRegion) {
      return region;
    }

    return {
      ...region,
      firstRound: mergeMarchMadnessRoundGames(region?.firstRound || [], supplementalRegion.firstRound || [], orderMarchMadnessFirstRoundGames),
      secondRound: mergeMarchMadnessRoundGames(region?.secondRound || [], supplementalRegion.secondRound || [], orderMarchMadnessSecondRoundGames),
      sweet16: mergeMarchMadnessRoundGames(region?.sweet16 || [], supplementalRegion.sweet16 || [], orderMarchMadnessSecondRoundGames),
      elite8: mergeMarchMadnessRoundGames(region?.elite8 || [], supplementalRegion.elite8 || [], orderMarchMadnessSecondRoundGames)
    };
  });
  const supplementalOnlyRegions = supplementalRegions.filter((region) => (
    !primaryRegions.some((candidate) => normalizeMarchMadnessRegionName(candidate?.name) === normalizeMarchMadnessRegionName(region?.name))
  ));

  return {
    ...primaryData,
    regions: [...mergedRegions, ...supplementalOnlyRegions].sort((a, b) => (
      getBracketRegionSortValue(a.name) - getBracketRegionSortValue(b.name)
    )),
    finalFour: mergeMarchMadnessRoundGames(primaryData?.finalFour || [], supplementalData?.finalFour || []),
    championship: mergeMarchMadnessRoundGames(primaryData?.championship || [], supplementalData?.championship || [])
  };
}

function getMarchMadnessCompositeBracketData(leagueName) {
  const primaryData = getMarchMadnessBracketData(leagueName);
  const supplementalData = getMarchMadnessScoreboardBracketData(leagueName);
  const mergedData = mergeMarchMadnessBracketData(primaryData, supplementalData);
  return hasMarchMadnessBracketGames(mergedData) ? mergedData : null;
}

function getMarchMadnessStage(leagueName) {
  const bracketData = getMarchMadnessCompositeBracketData(leagueName);
  if (!bracketData) {
    return 'regional';
  }

  const earlyRounds = bracketData.regions.flatMap((region) => [
    ...(region.firstRound || []),
    ...(region.secondRound || [])
  ]);
  const lateRounds = [
    ...bracketData.regions.flatMap((region) => [
      ...(region.sweet16 || []),
      ...(region.elite8 || [])
    ]),
    ...(bracketData.finalFour || []),
    ...(bracketData.championship || [])
  ];

  if (earlyRounds.some((game) => !game?.isFinal)) {
    return 'regional';
  }

  if (lateRounds.length > 0) {
    return 'final';
  }

  return 'regional';
}

function getMarchMadnessRegionalSlideRenderers(leagueName, regions = []) {
  const slides = [];
  let pendingLateRegion = null;

  const flushPendingLateRegion = () => {
    if (!pendingLateRegion) {
      return;
    }

    const region = pendingLateRegion;
    pendingLateRegion = null;
    slides.push(() => renderMarchMadnessRegionSlide(leagueName, region));
  };

  (Array.isArray(regions) ? regions : []).forEach((region) => {
    if (getMarchMadnessRegionStage(region) === 'early') {
      flushPendingLateRegion();
      slides.push(() => renderMarchMadnessRegionSlide(leagueName, region));
      return;
    }

    if (pendingLateRegion) {
      const pairedRegions = [pendingLateRegion, region];
      pendingLateRegion = null;
      slides.push(() => renderMarchMadnessLateRegionSlidePair(leagueName, pairedRegions));
      return;
    }

    pendingLateRegion = region;
  });

  flushPendingLateRegion();
  return slides;
}

function getMarchMadnessBracketSlides(leagueName) {
  const bracketData = getMarchMadnessBracketData(leagueName);
  if (!bracketData) {
    return getMarchMadnessScoreboardBracketSlides(leagueName);
  }

  const compositeBracketData = getMarchMadnessCompositeBracketData(leagueName);
  if (!compositeBracketData) {
    return getMarchMadnessScoreboardBracketSlides(leagueName);
  }

  if (getMarchMadnessStage(leagueName) === 'regional') {
    return getMarchMadnessRegionalSlideRenderers(leagueName, compositeBracketData.regions);
  }

  return [() => renderMarchMadnessFinalBracketSlideFromData(leagueName, compositeBracketData)];
}

function formatBracketGameStatus(game) {
  const status = String(game?.statusText || '').trim();
  return status || (game?.isFinal ? 'FINAL' : 'TBD');
}

function renderBracketTeamLine(team, score) {
  return `
    <div class="sports-mm-team-row">
      <div class="sports-mm-team-seed">${team?.seed || ''}</div>
      <div class="sports-mm-team-name">${team?.team || 'TBD'}</div>
      <div class="sports-mm-team-score">${score || '&nbsp;'}</div>
    </div>
  `;
}

function renderMarchMadnessGameCard(game, compact = false) {
  if (!game) {
    return '';
  }

  return `
    <div class="sports-mm-game${compact ? ' sports-mm-game--compact' : ''}">
      ${renderBracketTeamLine(game.away, game.away?.score)}
      ${renderBracketTeamLine(game.home, game.home?.score)}
      <div class="sports-mm-status">${formatBracketGameStatus(game)}</div>
    </div>
  `;
}

function renderMarchMadnessRoundColumn(title, games, columnClass = '') {
  return `
    <div class="sports-mm-round${columnClass ? ` ${columnClass}` : ''}">
      <div class="sports-mm-round-title">${title}</div>
      <div class="sports-mm-round-games">
        ${(games || []).map((game) => renderMarchMadnessGameCard(game)).join('')}
      </div>
    </div>
  `;
}

function splitMarchMadnessGames(games = [], leftCount) {
  const safeGames = Array.isArray(games) ? games : [];
  return {
    left: safeGames.slice(0, leftCount),
    right: safeGames.slice(leftCount)
  };
}

function getMarchMadnessGameSeedRank(game) {
  const awaySeed = Number(game?.away?.seed);
  const homeSeed = Number(game?.home?.seed);
  const numericSeeds = [awaySeed, homeSeed].filter((seed) => Number.isFinite(seed) && seed > 0);
  return numericSeeds.length ? Math.min(...numericSeeds) : 99;
}

function orderMarchMadnessFirstRoundGames(games = []) {
  const canonicalSeedOrder = [1, 8, 5, 4, 6, 3, 7, 2];
  return [...(Array.isArray(games) ? games : [])].sort((a, b) => {
    const seedA = getMarchMadnessGameSeedRank(a);
    const seedB = getMarchMadnessGameSeedRank(b);
    const orderA = canonicalSeedOrder.indexOf(seedA);
    const orderB = canonicalSeedOrder.indexOf(seedB);
    const safeOrderA = orderA === -1 ? 99 : orderA;
    const safeOrderB = orderB === -1 ? 99 : orderB;

    if (safeOrderA !== safeOrderB) {
      return safeOrderA - safeOrderB;
    }

    return seedA - seedB;
  });
}

function orderMarchMadnessSecondRoundGames(games = []) {
  return [...(Array.isArray(games) ? games : [])].sort((a, b) => {
    const seedA = getMarchMadnessGameSeedRank(a);
    const seedB = getMarchMadnessGameSeedRank(b);
    return seedA - seedB;
  });
}

function buildMarchMadnessRegionColumns(region) {
  const orderedFirstRound = orderMarchMadnessFirstRoundGames(region?.firstRound || []);
  const orderedSecondRound = orderMarchMadnessSecondRoundGames(region?.secondRound || []);
  const orderedSweet16 = orderMarchMadnessSecondRoundGames(region?.sweet16 || []);
  const orderedElite8 = orderMarchMadnessSecondRoundGames(region?.elite8 || []);
  const firstRoundSplit = Math.ceil(orderedFirstRound.length / 2);
  const secondRoundSplit = Math.ceil(orderedSecondRound.length / 2);
  const sweet16Split = Math.ceil(orderedSweet16.length / 2);

  return {
    leftFirstRound: orderedFirstRound.slice(0, firstRoundSplit),
    rightFirstRound: orderedFirstRound.slice(firstRoundSplit),
    leftSecondRound: orderedSecondRound.slice(0, secondRoundSplit),
    rightSecondRound: orderedSecondRound.slice(secondRoundSplit),
    leftSweet16: orderedSweet16.slice(0, sweet16Split),
    rightSweet16: orderedSweet16.slice(sweet16Split),
    elite8: orderedElite8.slice(0, 1)
  };
}

function getMarchMadnessSiteLabel(game) {
  const directLocation = String(game?.location || game?.event?.location || '').trim();
  if (directLocation) {
    const cityLabel = directLocation.split(',')[0].trim();
    if (cityLabel) {
      return cityLabel;
    }
  }

  const sourceText = [
    getCompetitionNoteText(game?.competition),
    game?.competition?.format?.summary,
    game?.event?.name,
    game?.event?.shortName
  ].filter(Boolean).join(' - ');

  const numberedRegionalMatch = sourceText.match(/\bregional\s+\d+\s+in\s+([A-Za-z .'\-]+?)(?:\s*-\s*|$)/i);
  if (numberedRegionalMatch) {
    return numberedRegionalMatch[1].trim();
  }

  const womenSiteMatch = sourceText.match(/\b(albany|birmingham|portland|spokane)\s+([12])\b/i);
  if (womenSiteMatch) {
    return `${toTitleCase(womenSiteMatch[1])} ${womenSiteMatch[2]}`;
  }

  const classicRegionMatch = sourceText.match(/\b(east|west|south|midwest|mid\-west)\s+region\b/i);
  if (classicRegionMatch) {
    return `${toTitleCase(classicRegionMatch[1].replace(/mid\-west/i, 'Midwest'))} Region`;
  }

  return '';
}

function renderMarchMadnessPathCard(game, { roundLabel, siteLabel = '', emptyText = '' } = {}) {
  const safeRoundLabel = roundLabel || 'Next Round';

  return `
    <div class="sports-mm-path-card${game ? '' : ' sports-mm-path-card--placeholder'}">
      <div class="sports-mm-path-card-header">
        <div class="sports-mm-path-round">${safeRoundLabel}</div>
        ${siteLabel ? `<div class="sports-mm-path-site">${siteLabel}</div>` : ''}
      </div>
      ${game
        ? renderMarchMadnessGameCard(game)
        : `
          <div class="sports-mm-path-placeholder">
            <div class="sports-mm-path-placeholder-text">${emptyText || 'Bracket slot to be determined'}</div>
          </div>
        `}
    </div>
  `;
}

function renderMarchMadnessNextRoundTarget(roundLabel, detailText) {
  return `
    <div class="sports-mm-next-round">
      <div class="sports-mm-next-round-label">Advances To</div>
      <div class="sports-mm-next-round-title">${roundLabel}</div>
      <div class="sports-mm-next-round-copy">${detailText}</div>
    </div>
  `;
}

function renderMarchMadnessWinnerSlot(team) {
  const hasTeam = Boolean(team?.team);

  return `
    <div class="sports-mm-winner-slot${hasTeam ? '' : ' sports-mm-winner-slot--empty'}">
      <div class="sports-mm-winner-slot-seed">${team?.seed || ''}</div>
      <div class="sports-mm-winner-slot-name">${team?.team || 'TBD'}</div>
    </div>
  `;
}

function getMarchMadnessGameWinner(game) {
  const awayScore = Number(game?.away?.score);
  const homeScore = Number(game?.home?.score);

  if (!game?.isFinal || !Number.isFinite(awayScore) || !Number.isFinite(homeScore) || awayScore === homeScore) {
    return null;
  }

  return awayScore > homeScore ? { ...game.away } : { ...game.home };
}

function getMarchMadnessRegionRepresentative(region, fallbackLabel = 'Bracket Winner') {
  const elite8Game = orderMarchMadnessSecondRoundGames(region?.elite8 || [])[0] || null;
  const winner = getMarchMadnessGameWinner(elite8Game);
  if (winner?.team) {
    return winner;
  }

  const regionName = String(region?.name || '').trim();
  return {
    seed: '',
    team: regionName ? `${regionName} Winner` : fallbackLabel,
    score: ''
  };
}

function buildProjectedMarchMadnessFinalFourGame(region, pairedRegion) {
  return {
    isFinal: false,
    statusText: 'National Semifinal',
    away: getMarchMadnessRegionRepresentative(region, 'This Region Winner'),
    home: getMarchMadnessRegionRepresentative(pairedRegion, 'Opposite Region Winner')
  };
}

function getMarchMadnessRegionFinalFourContext(leagueName, region) {
  const bracketData = getMarchMadnessCompositeBracketData(leagueName) || getMarchMadnessScoreboardBracketData(leagueName);
  const regions = Array.isArray(bracketData?.regions) ? bracketData.regions : [];
  const regionIndex = regions.findIndex((candidate) => (
    normalizeMarchMadnessRegionName(candidate?.name) === normalizeMarchMadnessRegionName(region?.name)
  ));
  const pairedRegionIndex = regionIndex >= 0
    ? (regionIndex % 2 === 0 ? regionIndex + 1 : regionIndex - 1)
    : -1;
  const pairedRegion = pairedRegionIndex >= 0 && pairedRegionIndex < regions.length
    ? regions[pairedRegionIndex]
    : null;
  const semifinalIndex = regionIndex >= 0 ? Math.floor(regionIndex / 2) : -1;
  const semifinalGame = semifinalIndex >= 0
    ? (Array.isArray(bracketData?.finalFour) ? bracketData.finalFour[semifinalIndex] || null : null)
    : null;

  return {
    game: semifinalGame,
    pairedRegion,
    displayGame: semifinalGame || buildProjectedMarchMadnessFinalFourGame(region, pairedRegion)
  };
}

function buildMarchMadnessLateRegionBoardMarkup(leagueName, region, columns, regionStage, { compact = false } = {}) {
  const leagueData = getLeagueSlideData(leagueName);
  const branding = getMarchMadnessBranding(leagueName, { name: regionStage === 'elite8' ? 'Elite 8' : 'Sweet 16' });
  const elite8Game = columns.elite8[0] || null;
  const elite8Card = renderMarchMadnessPathCard(elite8Game, {
    roundLabel: 'Elite 8',
    siteLabel: getMarchMadnessSiteLabel(elite8Game),
    emptyText: 'Sweet 16 winners meet here'
  });
  const sweet16Feeders = [columns.leftSweet16[0] || null, columns.rightSweet16[0] || null];
  const hasSweet16Results = sweet16Feeders.some(Boolean);
  const feederCards = hasSweet16Results
    ? sweet16Feeders.map((game, index) => (
      game
        ? renderMarchMadnessPathCard(game, {
          roundLabel: 'Sweet 16',
          siteLabel: getMarchMadnessSiteLabel(game),
          emptyText: 'Regional semifinal to be determined'
        })
        : renderMarchMadnessWinnerSlot(elite8Game ? (index === 0 ? elite8Game.away : elite8Game.home) : null)
    ))
    : elite8Game
      ? [
        renderMarchMadnessWinnerSlot(elite8Game.away),
        renderMarchMadnessWinnerSlot(elite8Game.home)
      ]
      : [
        renderMarchMadnessWinnerSlot(null),
        renderMarchMadnessWinnerSlot(null)
      ];
  const semifinalContext = getMarchMadnessRegionFinalFourContext(leagueName, region);
  const finalFourCard = renderMarchMadnessPathCard(semifinalContext.displayGame, {
    roundLabel: 'Final Four',
    siteLabel: getMarchMadnessSiteLabel(semifinalContext.game),
    emptyText: 'Regional winners meet here'
  });
  const feederHeading = hasSweet16Results ? 'Sweet 16 Results' : 'Sweet 16 Winners';
  const boardClass = compact ? 'sports-mm-region-board sports-mm-region-board--compact' : 'sports-mm-region-board';

  return `
    <div class="${boardClass}">
      <div class="sports-mm-board-header">
        <div class="sports-knockout-header-main">
          <img class="sports-league-standings-logo" src="${leagueData?.logo || ''}" alt="${leagueName}" onerror="this.style.display='none'">
          <div>
            <div class="sports-feature-kicker">${branding.kicker}</div>
            <div class="sports-knockout-subtitle">${branding.subtitle}</div>
          </div>
        </div>
        <div class="sports-mm-region-pill">${String(region?.name || '').toUpperCase()}</div>
      </div>
      <div class="sports-mm-elite8-bracket">
        <div class="sports-mm-elite8-heading">${feederHeading}</div>
        <div class="sports-mm-elite8-feeders">
          ${feederCards.join('')}
        </div>
        <div class="sports-mm-bracket-link sports-mm-bracket-link--inbound" aria-hidden="true">
          <div class="sports-mm-bracket-link-join"></div>
        </div>
        <div class="sports-mm-path-center sports-mm-path-center--elite8-bracket">
          ${elite8Card}
        </div>
        <div class="sports-mm-bracket-link sports-mm-bracket-link--outbound" aria-hidden="true">
          <div class="sports-mm-bracket-link-join"></div>
        </div>
        <div class="sports-mm-path-center sports-mm-path-center--final-four">
          ${finalFourCard}
        </div>
      </div>
    </div>
  `;
}

function renderMarchMadnessLateRegionSlide(leagueName, region, columns, regionStage) {
  $('.sports-games-list').html(buildMarchMadnessLateRegionBoardMarkup(leagueName, region, columns, regionStage));
}

function renderMarchMadnessLateRegionSlidePair(leagueName, regions) {
  const safeRegions = (Array.isArray(regions) ? regions : []).filter(Boolean);
  if (!safeRegions.length) {
    renderFavoriteLeagueKnockoutSlide(leagueName);
    return;
  }

  $('.sports-games-list').html(`
    <div class="sports-mm-region-stack">
      ${safeRegions.map((region) => buildMarchMadnessLateRegionBoardMarkup(
        leagueName,
        region,
        buildMarchMadnessRegionColumns(region),
        getMarchMadnessRegionStage(region),
        { compact: true }
      )).join('')}
    </div>
  `);
}

function renderMarchMadnessRegionSlide(leagueName, region) {
  const leagueData = getLeagueSlideData(leagueName);
  const branding = getMarchMadnessBranding(leagueName, { name: '1st & 2nd Rounds' });
  const columns = buildMarchMadnessRegionColumns(region);
  const roundCounts = getMarchMadnessRegionRoundCounts(region);
  const totalGames = roundCounts.firstRound + roundCounts.secondRound + roundCounts.sweet16 + roundCounts.elite8;
  const regionStage = getMarchMadnessRegionStage(region);
  const showSweet16 = columns.leftSweet16.length || columns.rightSweet16.length || columns.elite8.length;

  if (!leagueData || totalGames === 0) {
    renderFavoriteLeagueKnockoutSlide(leagueName);
    return;
  }

  if (regionStage !== 'early') {
    renderMarchMadnessLateRegionSlide(leagueName, region, columns, regionStage);
    return;
  }

  $('.sports-games-list').html(`
    <div class="sports-mm-region-board">
      <div class="sports-mm-board-header">
        <div class="sports-knockout-header-main">
          <img class="sports-league-standings-logo" src="${leagueData?.logo || ''}" alt="${leagueName}" onerror="this.style.display='none'">
          <div>
            <div class="sports-feature-kicker">${branding.kicker}</div>
            <div class="sports-knockout-subtitle">${branding.subtitle}</div>
          </div>
        </div>
        <div class="sports-mm-region-pill">${String(region?.name || '').toUpperCase()}</div>
      </div>
      <div class="sports-mm-region-grid sports-mm-region-grid--${showSweet16 ? '6' : '4'}">
        <div class="sports-mm-round sports-mm-round--edge">
          <div class="sports-mm-round-title">1st Round</div>
          <div class="sports-mm-round-games sports-mm-round-games--spaced">
            ${columns.leftFirstRound.map((game) => renderMarchMadnessGameCard(game)).join('')}
          </div>
        </div>
        <div class="sports-mm-round sports-mm-round--connector">
          <div class="sports-mm-round-title">2nd Round</div>
          <div class="sports-mm-round-games sports-mm-round-games--paired">
            ${columns.leftSecondRound.map((game) => renderMarchMadnessGameCard(game)).join('')}
          </div>
        </div>
        ${showSweet16 ? `
          <div class="sports-mm-round sports-mm-round--connector">
            <div class="sports-mm-round-title">Sweet 16</div>
            <div class="sports-mm-round-games sports-mm-round-games--paired">
              ${columns.leftSweet16.map((game) => renderMarchMadnessGameCard(game)).join('')}
            </div>
          </div>
          <div class="sports-mm-round sports-mm-round--connector sports-mm-round--connector-right">
            <div class="sports-mm-round-title">Sweet 16</div>
            <div class="sports-mm-round-games sports-mm-round-games--paired">
              ${columns.rightSweet16.map((game) => renderMarchMadnessGameCard(game)).join('')}
            </div>
          </div>
        ` : ''}
        <div class="sports-mm-round sports-mm-round--connector sports-mm-round--connector-right">
          <div class="sports-mm-round-title">2nd Round</div>
          <div class="sports-mm-round-games sports-mm-round-games--paired">
            ${columns.rightSecondRound.map((game) => renderMarchMadnessGameCard(game)).join('')}
          </div>
        </div>
        <div class="sports-mm-round sports-mm-round--edge sports-mm-round--edge-right">
          <div class="sports-mm-round-title">1st Round</div>
          <div class="sports-mm-round-games sports-mm-round-games--spaced">
            ${columns.rightFirstRound.map((game) => renderMarchMadnessGameCard(game)).join('')}
          </div>
        </div>
      </div>
    </div>
  `);
}

function renderMarchMadnessFinalBracketSlideFromData(leagueName, bracketData) {
  const leagueData = getLeagueSlideData(leagueName);
  const branding = getMarchMadnessBranding(leagueName, { name: 'Sweet 16 And Beyond' });

  if (!bracketData) {
    renderFavoriteLeagueKnockoutSlide(leagueName);
    return;
  }

  const leftRegions = bracketData.regions.slice(0, 2);
  const rightRegions = bracketData.regions.slice(2);

  $('.sports-games-list').html(`
    <div class="sports-mm-final-board">
      <div class="sports-mm-board-header">
        <div class="sports-knockout-header-main">
          <img class="sports-league-standings-logo" src="${leagueData?.logo || ''}" alt="${leagueName}" onerror="this.style.display='none'">
          <div>
            <div class="sports-feature-kicker">${branding.kicker}</div>
            <div class="sports-knockout-subtitle">${branding.subtitle}</div>
          </div>
        </div>
        <div class="sports-mm-region-pill">SWEET 16+</div>
      </div>
      <div class="sports-mm-full-bracket">
        <div class="sports-mm-full-side sports-mm-full-side--left">
          ${leftRegions.map((region) => `
            <div class="sports-mm-final-region">
              <div class="sports-mm-final-region-title">${String(region?.name || '').toUpperCase()}</div>
              ${renderMarchMadnessRoundColumn('Sweet 16', region?.sweet16 || [], 'sports-mm-round--compact')}
              ${renderMarchMadnessRoundColumn('Elite 8', region?.elite8 || [], 'sports-mm-round--compact')}
            </div>
          `).join('')}
        </div>
        <div class="sports-mm-full-center">
          <div class="sports-mm-finals-block">
            <div class="sports-mm-round-title">Final Four</div>
            <div class="sports-mm-round-games sports-mm-round-games--compact">
              ${(bracketData.finalFour || []).map((game) => renderMarchMadnessGameCard(game, true)).join('')}
            </div>
          </div>
          <div class="sports-mm-finals-block sports-mm-finals-block--championship">
            <div class="sports-mm-round-title">Championship</div>
            <div class="sports-mm-round-games sports-mm-round-games--compact">
              ${(bracketData.championship || []).map((game) => renderMarchMadnessGameCard(game, true)).join('')}
            </div>
          </div>
        </div>
        <div class="sports-mm-full-side sports-mm-full-side--right">
          ${rightRegions.map((region) => `
            <div class="sports-mm-final-region">
              <div class="sports-mm-final-region-title">${String(region?.name || '').toUpperCase()}</div>
              ${renderMarchMadnessRoundColumn('Sweet 16', region?.sweet16 || [], 'sports-mm-round--compact')}
              ${renderMarchMadnessRoundColumn('Elite 8', region?.elite8 || [], 'sports-mm-round--compact')}
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `);
}

function renderMarchMadnessFinalBracketSlide(leagueName) {
  renderMarchMadnessFinalBracketSlideFromData(leagueName, getMarchMadnessCompositeBracketData(leagueName));
}

function getMarchMadnessRoundLabelFromGames(games, fallbackLabel) {
  const labels = (Array.isArray(games) ? games : [])
    .map((gameData) => {
      const event = gameData?.event || {};
      const competition = event?.competitions?.[0] || {};
      return getKnockoutRoundLabel(event, competition, fallbackLabel);
    })
    .filter(Boolean);

  return labels[0] || fallbackLabel || 'Tournament';
}

function getGenericKnockoutRoundGroups(leagueName, maxGames = 12) {
  const leagueData = getLeagueSlideData(leagueName);
  const fallbackLabel = leagueData?.seasonType?.abbreviation || leagueData?.seasonType?.name || 'Knockout Round';
  const groupsByRound = new Map();

  getGamesForLeague(leagueName, maxGames).forEach((gameData) => {
    const event = gameData?.event || {};
    const competition = event?.competitions?.[0] || {};
    const rawRoundLabel = getKnockoutRoundLabel(event, competition, fallbackLabel);
    const roundLabel = normalizeKnockoutRoundLabel(rawRoundLabel, fallbackLabel);
    const existing = groupsByRound.get(roundLabel) || {
      label: roundLabel,
      sortValue: getKnockoutRoundSortValue(roundLabel),
      games: []
    };

    existing.games.push(gameData);
    groupsByRound.set(roundLabel, existing);
  });

  return [...groupsByRound.values()]
    .filter((group) => group.games.length > 0)
    .sort((a, b) => {
      if (a.sortValue !== b.sortValue) {
        return a.sortValue - b.sortValue;
      }
      return a.label.localeCompare(b.label);
    });
}

function chunkKnockoutRoundGroups(roundGroups) {
  if (!Array.isArray(roundGroups) || roundGroups.length === 0) {
    return [];
  }

  const chunks = [];
  for (let i = 0; i < roundGroups.length; i += 3) {
    chunks.push(roundGroups.slice(i, i + 3));
  }
  return chunks;
}

function getGenericKnockoutBracketSlides(leagueName) {
  const roundGroups = getGenericKnockoutRoundGroups(leagueName);
  if (roundGroups.length === 0) {
    return [() => renderFavoriteLeagueKnockoutSlide(leagueName)];
  }

  return chunkKnockoutRoundGroups(roundGroups).map((roundChunk, idx, allChunks) => (
    () => renderGenericKnockoutBracketSlide(leagueName, roundChunk, idx, allChunks.length)
  ));
}

function getMarchMadnessRegionLabel(event, competition) {
  const noteText = getCompetitionNoteText(competition);
  const sourceText = [
    noteText,
    competition?.format?.summary,
    event?.name,
    event?.shortName
  ].filter(Boolean).join(' - ');

  const regionMatch = sourceText.match(/\b(east|west|south|midwest|mid\-west)\s+region\b/i);
  if (regionMatch) {
    return `${toTitleCase(regionMatch[1].replace(/mid\-west/i, 'Midwest'))} Region`;
  }

  const womenRegionMatch = sourceText.match(/\b(albany|birmingham|portland|spokane)\s+([12])\b/i);
  if (womenRegionMatch) {
    return `${toTitleCase(womenRegionMatch[1])} ${womenRegionMatch[2]}`;
  }

  const numberedRegionalMatch = sourceText.match(/\bregional\s+(\d+)\b/i);
  if (numberedRegionalMatch) {
    return `Regional ${numberedRegionalMatch[1]}`;
  }

  const regionOnlyMatch = sourceText.match(/\b(east|west|south|midwest|mid\-west)\b/i);
  if (regionOnlyMatch && /region/i.test(sourceText)) {
    return `${toTitleCase(regionOnlyMatch[1].replace(/mid\-west/i, 'Midwest'))} Region`;
  }

  return '';
}

function toTitleCase(value = '') {
  return String(value || '').replace(/\w\S*/g, (token) => token.charAt(0).toUpperCase() + token.slice(1).toLowerCase());
}

function normalizeMarchMadnessRegionName(regionLabel = '') {
  return String(regionLabel || '')
    .replace(/\s+Region$/i, '')
    .trim()
    .toUpperCase();
}

function getMarchMadnessRoundBucket(roundLabel = '') {
  const normalized = normalizeKnockoutRoundLabel(roundLabel, '');
  const lower = normalized.toLowerCase();

  if (lower.includes('1st round')) return 'firstRound';
  if (lower.includes('2nd round') || lower.includes('round of 32')) return 'secondRound';
  if (lower.includes('sweet 16') || lower.includes('regional semifinal')) return 'sweet16';
  if (lower.includes('elite 8') || lower.includes('regional final')) return 'elite8';
  if (lower.includes('final four') || lower.includes('national semifinal')) return 'finalFour';
  if (lower.includes('championship')) return 'championship';
  return 'firstRound';
}

function createMarchMadnessGameFromScoreboard(gameData, leagueName) {
  const event = gameData?.event || {};
  const competition = event?.competitions?.[0] || {};
  const homeTeam = competition?.competitors?.find((competitor) => competitor.homeAway === 'home');
  const awayTeam = competition?.competitors?.find((competitor) => competitor.homeAway === 'away');

  if (!homeTeam || !awayTeam) {
    return null;
  }

  return {
    event,
    competition,
    statusText: event?.status?.type?.shortDetail || event?.status?.type?.detail || '',
    isFinal: event?.status?.type?.state === 'post',
    away: {
      seed: getCompetitorSeed(awayTeam),
      team: awayTeam.team?.shortDisplayName || awayTeam.team?.abbreviation || awayTeam.team?.displayName || 'TBD',
      score: awayTeam.score || ''
    },
    home: {
      seed: getCompetitorSeed(homeTeam),
      team: homeTeam.team?.shortDisplayName || homeTeam.team?.abbreviation || homeTeam.team?.displayName || 'TBD',
      score: homeTeam.score || ''
    }
  };
}

function getMarchMadnessScoreboardBracketData(leagueName) {
  const regionMap = new Map();
  const finalData = {
    finalFour: [],
    championship: []
  };

  getGamesForLeague(leagueName, 16).forEach((gameData) => {
    const game = createMarchMadnessGameFromScoreboard(gameData, leagueName);
    if (!game) {
      return;
    }

    const roundLabel = getKnockoutRoundLabel(game.event, game.competition, '1st Round');
    const roundBucket = getMarchMadnessRoundBucket(roundLabel);
    const rawRegionLabel = getMarchMadnessRegionLabel(game.event, game.competition);
    const regionName = normalizeMarchMadnessRegionName(rawRegionLabel);

    if (roundBucket === 'finalFour' || roundBucket === 'championship') {
      finalData[roundBucket].push(game);
      return;
    }

    if (!regionName) {
      return;
    }

    if (!regionMap.has(regionName)) {
      regionMap.set(regionName, {
        name: regionName,
        firstRound: [],
        secondRound: [],
        sweet16: [],
        elite8: []
      });
    }

    regionMap.get(regionName)[roundBucket].push(game);
  });

  return {
    league: leagueName,
    regions: [...regionMap.values()].sort((a, b) => getBracketRegionSortValue(a.name) - getBracketRegionSortValue(b.name)),
    finalFour: finalData.finalFour,
    championship: finalData.championship
  };
}

function getMarchMadnessScoreboardBracketSlides(leagueName) {
  const bracketData = getMarchMadnessScoreboardBracketData(leagueName);
  if (!bracketData.regions.length && !bracketData.finalFour.length && !bracketData.championship.length) {
    return [() => renderFavoriteLeagueKnockoutSlide(leagueName)];
  }

  const hasRegionalRounds = bracketData.regions.some((region) => (
    region.firstRound.length || region.secondRound.length || region.sweet16.length || region.elite8.length
  ));

  if (hasRegionalRounds) {
    return getMarchMadnessRegionalSlideRenderers(leagueName, bracketData.regions);
  }

  return [() => renderMarchMadnessFinalBracketSlideFromData(leagueName, bracketData)];
}

function getKnockoutSecondaryText(leagueName, event, competition) {
  if (MARCH_MADNESS_LEAGUES.has(leagueName)) {
    return getMarchMadnessRegionLabel(event, competition);
  }

  const noteText = getCompetitionNoteText(competition);
  const aggregateText = getAggregateTextFromSources(
    noteText,
    competition?.format?.summary,
    competition?.status?.type?.detail,
    competition?.status?.type?.shortDetail,
    competition?.status?.displayClock,
    competition?.leg?.note,
    event?.name,
    event?.shortName
  );

  if (aggregateText) {
    return aggregateText;
  }

  const cupTieMeta = getCupTieMeta(event, competition);
  if (cupTieMeta?.secondary) {
    return cupTieMeta.secondary;
  }

  if (MARCH_MADNESS_LEAGUES.has(leagueName) && noteText) {
    const noteSegments = noteText.split(' - ').map((segment) => segment.trim()).filter(Boolean);
    if (noteSegments.length > 1) {
      return noteSegments.slice(0, -1).join(' - ');
    }
  }

  return '';
}

function getCompetitorSeed(competitor) {
  const rawSeed = competitor?.seed ?? competitor?.tournamentSeed;
  const numericSeed = Number(rawSeed);
  if (Number.isFinite(numericSeed) && numericSeed > 0) {
    return String(numericSeed);
  }

  const seedStat = Array.isArray(competitor?.statistics)
    ? competitor.statistics.find((stat) => /seed/i.test(String(stat?.name || stat?.displayName || stat?.abbreviation || '')))
    : null;
  const statSeed = Number(seedStat?.value ?? seedStat?.displayValue);
  if (Number.isFinite(statSeed) && statSeed > 0) {
    return String(statSeed);
  }

  const recordSummary = competitor?.records?.[0]?.summary || '';
  const rankMatch = recordSummary.match(/^#?(\d+)\s*seed$/i);
  if (rankMatch) {
    return rankMatch[1];
  }

  return '';
}

function getKnockoutDisplayName(leagueName, competitor) {
  const team = competitor?.team || {};
  const baseName = team.shortDisplayName || team.abbreviation || team.displayName || 'Team';
  const seed = MARCH_MADNESS_LEAGUES.has(leagueName) ? getCompetitorSeed(competitor) : '';
  return seed ? `(${seed}) ${baseName}` : baseName;
}

function getCupTieMeta(event, competition) {
  const roundLabel = event?.seasonType?.abbreviation || event?.seasonType?.name || '';
  const legLabel = competition?.leg?.displayValue || '';
  const noteText = getCompetitionNoteText(competition);
  const isCupTie = Boolean(legLabel || /aggregate|advance|advances|leg/i.test(noteText) || /round|quarter|semi|final/i.test(roundLabel));

  if (!isCupTie) {
    return null;
  }

  const primary = [roundLabel, legLabel].filter(Boolean).join(' - ');
  return {
    primary: primary || roundLabel || legLabel || '',
    secondary: noteText && noteText !== legLabel ? noteText : ''
  };
}

/**
 * Find two additional unpacked leagues (after startIdx) that together with
 * leagues[startIdx] form a valid triple:
 *   - all three have < 6 games
 *   - at least one of the three has < 3 games
 * Returns [j, k] indices or null.
 */
function findTriple(leagues, packed, startIdx) {
  const leagueA = leagues[startIdx];

  for (let j = startIdx + 1; j < leagues.length; j++) {
    if (packed[j] || leagues[j].games.length > 6) continue;

    for (let k = j + 1; k < leagues.length; k++) {
      if (packed[k] || leagues[k].games.length > 6) continue;

      const hasSmall = leagueA.games.length <= 3
        || leagues[j].games.length <= 3
        || leagues[k].games.length <= 3;

      if (hasSmall) return [j, k];
    }
  }

  return null;
}

/**
 * Find the next unpacked league (after startIdx) with ≤9 games.
 * Returns index or -1.
 */
function findPair(leagues, packed, startIdx) {
  for (let j = startIdx + 1; j < leagues.length; j++) {
    if (!packed[j] && leagues[j].games.length <= 9) return j;
  }
  return -1;
}

/**
 * Get games for a specific league (live + upcoming only)
 */
function getGamesForLeagueFromData(sourceData, leagueName, maxGames = 16, eventPredicate = null) {
  if (!Array.isArray(sourceData) || sourceData.length === 0) return [];

  const league = sourceData.find((leagueData) => leagueData.league === leagueName);
  if (!league || !Array.isArray(league.events)) return [];

  const games = [];
  for (const event of league.events) {
    if (games.length >= maxGames) break;

    if (typeof eventPredicate === 'function') {
      if (!eventPredicate(event)) continue;
    } else {
      const status = event.status?.type?.state || '';
      if (status !== 'in' && status !== 'pre' && status !== 'post') continue;
    }

    games.push({ league: league.league, logo: league.logo, event });
  }
  return games;
}

function getGamesForLeague(leagueName, maxGames = 16) {
  return getGamesForLeagueFromData(sportsRawData, leagueName, maxGames);
}

/**
 * Check if a league has any live or upcoming games
 */
function hasGamesForLeague(leagueName) {
  return getGamesForLeague(leagueName, 1).length > 0;
}

/**
 * Render a single league taking the full slide (up to 15 games)
 */
function renderSingleLeagueSlide(league) {
  let html = buildLeagueHeaderHTML(league);
  league.games.slice(0, 16).forEach(game => { html += renderGameCard(game); });
  $('.sports-games-list').html(html);
}

function getFollowedTeamKickerText(followedTeam, featuredShortName, selectionContext = null) {
  const baseLabel = followedTeam.label || `TODAY'S ${featuredShortName.toUpperCase()} GAME`;

  if (selectionContext?.window === 'previous') {
    if (/^TODAY'S\b/i.test(baseLabel)) {
      return baseLabel.replace(/^TODAY'S\b/i, "YESTERDAY'S");
    }

    return `YESTERDAY: ${baseLabel}`;
  }

  return baseLabel;
}

function getFeaturedTeamCardData(followedTeam, gameData, selectionContext = null) {
  const event = gameData.event;
  const competition = event?.competitions?.[0];
  const competitors = competition?.competitors || [];
  const featuredTeam = competitors.find((competitor) => isMatchingTeam(competitor.team, followedTeam));
  const opponent = competitors.find((competitor) => competitor !== featuredTeam);

  if (!featuredTeam || !opponent) {
    return null;
  }

  const featured = featuredTeam.team || {};
  const opponentTeam = opponent.team || {};
  const status = event.status?.type?.state || '';
  const shortDetail = event.status?.type?.shortDetail || '';
  const venue = competition?.venue?.fullName || competition?.venue?.address?.city || '';
  const broadcast = competition?.broadcasts?.[0]?.names?.[0] || '';
  const cupTieMeta = getCupTieMeta(event, competition);
  const featuredIsHome = featuredTeam.homeAway === 'home';
  const featuredShortName = featured.shortDisplayName || featured.displayName || followedTeam.name || 'Featured Team';
  const opponentShortName = opponentTeam.shortDisplayName || opponentTeam.displayName || opponentTeam.abbreviation || 'Opponent';
  const matchupLabel = featuredIsHome ? `${opponentShortName} at ${featuredShortName}` : `${featuredShortName} at ${opponentShortName}`;
  const featuredRecord = featuredTeam.records?.[0]?.summary || '';
  const opponentRecord = opponent.records?.[0]?.summary || '';
  const statusText = status === 'in'
    ? (shortDetail || 'LIVE')
    : status === 'post'
      ? (shortDetail || 'FINAL')
      : (shortDetail || 'Upcoming');
  const kickerText = getFollowedTeamKickerText(followedTeam, featuredShortName, selectionContext);
  const leftCompetitor = followedTeam.league === 'MLB'
    ? competitors.find((competitor) => competitor?.homeAway === 'away') || featuredTeam
    : featuredTeam;
  const rightCompetitor = followedTeam.league === 'MLB'
    ? competitors.find((competitor) => competitor?.homeAway === 'home') || opponent
    : opponent;
  const leftTeam = leftCompetitor?.team || {};
  const rightTeam = rightCompetitor?.team || {};

  return {
    kickerText,
    theme: followedTeam.theme || '',
    matchupLabel,
    featuredDisplayName: featured.displayName || followedTeam.name || featuredShortName,
    featuredShortName,
    featuredLogo: featured.logo || '',
    featuredRecord,
    featuredScore: status === 'in' || status === 'post' ? (featuredTeam.score || '0') : '',
    opponentDisplayName: opponentTeam.displayName || opponentTeam.shortDisplayName || opponentTeam.abbreviation || 'Opponent',
    opponentLogo: opponentTeam.logo || '',
    opponentRecord,
    opponentScore: status === 'in' || status === 'post' ? (opponent.score || '0') : '',
    versusText: status === 'in' ? 'LIVE' : 'VS',
    statusText,
    venue,
    broadcast,
    detailLine1: cupTieMeta?.primary || venue,
    detailLine2: cupTieMeta?.secondary || broadcast,
    leftDisplayName: leftTeam.displayName || leftTeam.shortDisplayName || leftTeam.abbreviation || 'Team',
    leftLogo: leftTeam.logo || '',
    leftRecord: leftCompetitor?.records?.[0]?.summary || '',
    leftScore: status === 'in' || status === 'post' ? (leftCompetitor?.score || '0') : '',
    rightDisplayName: rightTeam.displayName || rightTeam.shortDisplayName || rightTeam.abbreviation || 'Team',
    rightLogo: rightTeam.logo || '',
    rightRecord: rightCompetitor?.records?.[0]?.summary || '',
    rightScore: status === 'in' || status === 'post' ? (rightCompetitor?.score || '0') : ''
  };
}

function renderFeaturedTeamsSlide(featuredItems) {
  const cards = featuredItems
    .map(({ followedTeam, gameData, selectionContext }) => {
      const card = getFeaturedTeamCardData(followedTeam, gameData, selectionContext);
      if (!card) {
        return null;
      }

      return {
        ...card,
        postGameStats: getPostGameStatsData(gameData, followedTeam)
      };
    })
    .filter(Boolean);

  if (cards.length === 0) {
    $('.sports-games-list').html('');
    return;
  }

  $('.sports-games-list').html(`
    <div class="sports-feature-grid ${cards.length === 1 ? 'sports-feature-grid--single' : 'sports-feature-grid--double'}">
      ${cards.map((card) => `
        <div class="sports-feature-slide${card.theme ? ` sports-feature-slide--${card.theme}` : ''}">
          <div class="sports-feature-kicker">${card.kickerText}</div>
          <div class="sports-feature-matchup">${card.matchupLabel}</div>
          <div class="sports-feature-teams">
            <div class="sports-feature-team">
              <img class="sports-feature-logo" src="${card.leftLogo || card.featuredLogo}" alt="${card.leftDisplayName || card.featuredDisplayName}" onerror="this.style.display='none'">
              <div class="sports-feature-team-name">${card.leftDisplayName || card.featuredDisplayName}</div>
              <div class="sports-feature-team-meta">${card.leftRecord || card.featuredRecord}</div>
              <div class="sports-feature-score">${card.leftScore || card.featuredScore}</div>
            </div>
            <div class="sports-feature-versus">${card.versusText}</div>
            <div class="sports-feature-team">
              <img class="sports-feature-logo" src="${card.rightLogo || card.opponentLogo}" alt="${card.rightDisplayName || card.opponentDisplayName}" onerror="this.style.display='none'">
              <div class="sports-feature-team-name">${card.rightDisplayName || card.opponentDisplayName}</div>
              <div class="sports-feature-team-meta">${card.rightRecord || card.opponentRecord}</div>
              <div class="sports-feature-score">${card.rightScore || card.opponentScore}</div>
            </div>
          </div>
          <div class="sports-feature-status">${card.statusText}</div>
          ${card.postGameStats ? `
            <div class="sports-postgame-stats sports-postgame-stats--feature">
              ${card.postGameStats.stats.slice(0, 5).map((stat) => `
                <div class="sports-postgame-stat-row sports-postgame-stat-row--feature">
                  <div class="sports-postgame-stat-value sports-postgame-stat-value--feature">${stat.featuredValue}</div>
                  <div class="sports-postgame-stat-name sports-postgame-stat-name--feature">${stat.label}</div>
                  <div class="sports-postgame-stat-value sports-postgame-stat-value--feature">${stat.opponentValue}</div>
                </div>
              `).join('')}
            </div>
          ` : `
            <div class="sports-feature-detail">${card.detailLine1 || '&nbsp;'}</div>
            <div class="sports-feature-detail">${card.detailLine2 || '&nbsp;'}</div>
          `}
        </div>
      `).join('')}
    </div>
  `);
}

function renderFollowedTeamStandingsSlide(item) {
  const standingsData = standingsCache[item.followedTeam.league];
  const groupData = findStandingsGroupForTeam(standingsData, item.followedTeam);

  if (!groupData) {
    renderFollowedTeamSpotlightSlide(item);
    return;
  }

  const card = getFeaturedTeamCardData(item.followedTeam, item.gameData, item.selectionContext);
  const useDetailedNhlStandings = isNhlDivisionStandingsGroup(groupData, item.followedTeam.league);
  const rows = getStandingsRows(groupData, item.followedTeam.league);
  const slideTitle = useDetailedNhlStandings
    ? groupData.name
    : `${groupData.name.toUpperCase()} STANDINGS`;
  const standingsMarkup = useDetailedNhlStandings
    ? renderDetailedNhlStandingsTableMarkup(groupData, item.followedTeam.league)
    : `
      <div class="sports-team-focus-summary">
        <img class="sports-team-focus-logo" src="${card?.featuredLogo || ''}" alt="${card?.featuredDisplayName || item.followedTeam.name}" onerror="this.style.display='none'">
        <div>
          <div class="sports-team-focus-name">${card?.featuredDisplayName || item.followedTeam.name}</div>
          <div class="sports-team-focus-meta">${card?.matchupLabel || ''}</div>
        </div>
      </div>
      <div class="sports-standings-table">
        ${rows.map((row) => `
          ${renderStandingsRowMarkup(row)}
        `).join('')}
      </div>
    `;

  $('.sports-games-list').html(`
    <div class="sports-team-focus sports-team-focus--standings${useDetailedNhlStandings ? ' sports-team-focus--nhl-division-standings' : ''}${card?.theme ? ` sports-feature-slide--${card.theme}` : ''}">
      <div class="sports-team-focus-header">
        ${useDetailedNhlStandings ? '' : `<div class="sports-feature-kicker">${card?.kickerText || 'TODAY\'S GAME'}</div>`}
        <div class="sports-team-focus-subtitle">${slideTitle}</div>
      </div>
      ${standingsMarkup}
    </div>
  `);
}

function renderFollowedTeamSpotlightSlide(item) {
  const card = getFeaturedTeamCardData(item.followedTeam, item.gameData, item.selectionContext);
  const headlines = getFollowedTeamHeadlineItems(item.followedTeam);

  if (!card) {
    $('.sports-games-list').html('');
    return;
  }

  $('.sports-games-list').html(`
    <div class="sports-team-focus${card.theme ? ` sports-feature-slide--${card.theme}` : ''}">
      <div class="sports-team-focus-header">
        <div class="sports-feature-kicker">${card.kickerText}</div>
        <div class="sports-team-focus-subtitle">${card.matchupLabel}</div>
      </div>
      <div class="sports-team-focus-scoreboard">
        <div class="sports-team-focus-club">
          <img class="sports-team-focus-logo" src="${card.leftLogo || card.featuredLogo}" alt="${card.leftDisplayName || card.featuredDisplayName}" onerror="this.style.display='none'">
          <div class="sports-team-focus-name">${card.leftDisplayName || card.featuredDisplayName}</div>
          <div class="sports-team-focus-meta">${card.leftRecord || card.featuredRecord}</div>
          <div class="sports-team-focus-score">${card.leftScore || card.featuredScore || '&nbsp;'}</div>
        </div>
        <div class="sports-team-focus-center">
          <div class="sports-team-focus-status">${card.statusText}</div>
          <div class="sports-team-focus-versus">${card.versusText}</div>
          <div class="sports-team-focus-detail">${card.detailLine1 || '&nbsp;'}</div>
          <div class="sports-team-focus-detail">${card.detailLine2 || '&nbsp;'}</div>
        </div>
        <div class="sports-team-focus-club">
          <img class="sports-team-focus-logo" src="${card.rightLogo || card.opponentLogo}" alt="${card.rightDisplayName || card.opponentDisplayName}" onerror="this.style.display='none'">
          <div class="sports-team-focus-name">${card.rightDisplayName || card.opponentDisplayName}</div>
          <div class="sports-team-focus-meta">${card.rightRecord || card.opponentRecord}</div>
          <div class="sports-team-focus-score">${card.rightScore || card.opponentScore || '&nbsp;'}</div>
        </div>
      </div>
      <div class="sports-team-news">
        <div class="sports-team-news-title">TEAM HEADLINES</div>
        ${headlines.length > 0 ? headlines.map((headline) => `
          <div class="sports-team-news-item">
            <div class="sports-team-news-meta">${headline._bucket}${headline.source ? ` · ${headline.source}` : ''}</div>
            <div class="sports-team-news-headline">${headline.title}</div>
          </div>
        `).join('') : '<div class="sports-team-news-empty">No recent headlines found.</div>'}
      </div>
    </div>
  `);
}

function renderFollowedTeamCombinedSlide(item) {
  const card = getFeaturedTeamCardData(item.followedTeam, item.gameData, item.selectionContext);
  const headlines = getFollowedTeamHeadlineItems(item.followedTeam);
  const standingsData = standingsCache[item.followedTeam.league];
  const groupData = findStandingsGroupForTeam(standingsData, item.followedTeam);
  const rows = groupData ? getFullStandingsRows(groupData, item.followedTeam.league) : [];
  const lineScore = getLineScoreData(item.gameData);
  const liveBaseballStateMarkup = renderFeaturedLiveBaseballStateMarkup(item.gameData, lineScore);
  const postGameStats = getPostGameStatsData(item.gameData, item.followedTeam);
  const postGameStatRows = postGameStats?.stats || [];
  const postGameSupplementalItems = getPostGameStatsSupplementalItems(item.gameData);
  const isMlbFullDivisionStandings = item.followedTeam.league === 'MLB' && groupData && rows.length >= 5;

  if (!card) {
    $('.sports-games-list').html('');
    return;
  }

  $('.sports-games-list').html(`
    <div class="sports-team-focus sports-team-focus--no-kicker${card.theme ? ` sports-feature-slide--${card.theme}` : ''}${isMlbFullDivisionStandings ? ' sports-team-focus--mlb-full-division' : ''}">
      <div class="sports-team-focus-header">
        <div class="sports-team-focus-subtitle">${card.matchupLabel}</div>
      </div>
      <div class="sports-team-focus-scoreboard sports-team-focus-scoreboard--compact">
        <div class="sports-team-focus-club">
          <img class="sports-team-focus-logo" src="${card.leftLogo || card.featuredLogo}" alt="${card.leftDisplayName || card.featuredDisplayName}" onerror="this.style.display='none'">
          <div class="sports-team-focus-name">${card.leftDisplayName || card.featuredDisplayName}</div>
          <div class="sports-team-focus-meta">${card.leftRecord || card.featuredRecord}</div>
          <div class="sports-team-focus-score">${card.leftScore || card.featuredScore || '&nbsp;'}</div>
        </div>
        <div class="sports-team-focus-center">
          <div class="sports-team-focus-status">${card.statusText}</div>
          <div class="sports-team-focus-versus">${card.versusText}</div>
          <div class="sports-team-focus-detail">${card.detailLine1 || '&nbsp;'}</div>
          <div class="sports-team-focus-detail">${card.detailLine2 || '&nbsp;'}</div>
        </div>
        <div class="sports-team-focus-club">
          <img class="sports-team-focus-logo" src="${card.rightLogo || card.opponentLogo}" alt="${card.rightDisplayName || card.opponentDisplayName}" onerror="this.style.display='none'">
          <div class="sports-team-focus-name">${card.rightDisplayName || card.opponentDisplayName}</div>
          <div class="sports-team-focus-meta">${card.rightRecord || card.opponentRecord}</div>
          <div class="sports-team-focus-score">${card.rightScore || card.opponentScore || '&nbsp;'}</div>
        </div>
      </div>
      ${liveBaseballStateMarkup ? `
        ${liveBaseballStateMarkup}
      ` : lineScore ? `
        <div class="sports-team-linescore">
          <div class="sports-team-news-title">LIVE LINE SCORE</div>
          ${renderLineScoreGridMarkup(lineScore)}
        </div>
      ` : postGameStats ? `
        <div class="sports-team-focus-lower">
          <div class="sports-team-stats-block">
            <div class="sports-team-news-title">FINAL TEAM STATS</div>
            <div class="sports-postgame-stats sports-postgame-stats--compare-grid">
              <div class="sports-postgame-stats-header">
                <div class="sports-postgame-team">
                  <img class="sports-postgame-team-logo" src="${postGameStats.featuredTeam.logo}" alt="${postGameStats.featuredTeam.name}" onerror="this.style.display='none'">
                  <span>${postGameStats.featuredTeam.name}</span>
                </div>
                <div class="sports-postgame-stat-label">CATEGORY</div>
                <div class="sports-postgame-team sports-postgame-team--home">
                  <span>${postGameStats.opponentTeam.name}</span>
                  <img class="sports-postgame-team-logo" src="${postGameStats.opponentTeam.logo}" alt="${postGameStats.opponentTeam.name}" onerror="this.style.display='none'">
                </div>
              </div>
              <div class="sports-postgame-stat-grid">
                ${postGameStatRows.map((stat) => `
                  <div class="sports-postgame-stat-card">
                    <div class="sports-postgame-stat-card-side sports-postgame-stat-card-side--featured${stat.winner === 'featured' ? ' sports-postgame-stat-card-side--leader' : ''}">
                      <div class="sports-postgame-stat-card-value">${stat.featuredValue}</div>
                    </div>
                    <div class="sports-postgame-stat-card-center">
                      <div class="sports-postgame-stat-card-name">${stat.label}</div>
                      ${stat.detailLabel ? `<div class="sports-postgame-stat-card-detail">${stat.detailLabel}</div>` : ''}
                    </div>
                    <div class="sports-postgame-stat-card-side sports-postgame-stat-card-side--opponent${stat.winner === 'opponent' ? ' sports-postgame-stat-card-side--leader' : ''}">
                      <div class="sports-postgame-stat-card-value">${stat.opponentValue}</div>
                    </div>
                  </div>
                `).join('')}
              </div>
              ${postGameSupplementalItems.length > 0 ? `
                <div class="sports-postgame-extra-list">
                  ${postGameSupplementalItems.map((item) => `
                    <div class="sports-postgame-extra-item">
                      <span class="sports-postgame-extra-label">${item.label}</span>
                      <span class="sports-postgame-extra-value">${item.value}</span>
                    </div>
                  `).join('')}
                </div>
              ` : ''}
            </div>
          </div>
          <div class="sports-team-news">
            <div class="sports-team-news-title">TEAM HEADLINES</div>
            ${headlines.length > 0 ? headlines.map((headline) => `
              <div class="sports-team-news-item">
                <div class="sports-team-news-meta">${headline._bucket}${headline.source ? ` · ${headline.source}` : ''}</div>
                <div class="sports-team-news-headline">${headline.title}</div>
              </div>
            `).join('') : '<div class="sports-team-news-empty">No recent headlines found.</div>'}
          </div>
        </div>
      ` : `
        <div class="sports-team-focus-lower${groupData ? '' : ' sports-team-focus-lower--news-only'}${isMlbFullDivisionStandings ? ' sports-team-focus-lower--mlb-full-division' : ''}">
          ${groupData ? `
            <div class="sports-team-standings-block">
              <div class="sports-team-news-title">${groupData.name.toUpperCase()} STANDINGS</div>
              <div class="sports-standings-table sports-standings-table--compact">
                ${rows.map((row) => `
                  ${renderStandingsRowMarkup(row)}
                `).join('')}
              </div>
            </div>
          ` : ''}
          <div class="sports-team-news">
            <div class="sports-team-news-title">TEAM HEADLINES</div>
            ${headlines.length > 0 ? headlines.map((headline) => `
              <div class="sports-team-news-item">
                <div class="sports-team-news-meta">${headline._bucket}${headline.source ? ` · ${headline.source}` : ''}</div>
                <div class="sports-team-news-headline">${headline.title}</div>
              </div>
            `).join('') : '<div class="sports-team-news-empty">No recent headlines found.</div>'}
          </div>
        </div>
      `}
    </div>
  `);
}

function renderFavoriteLeagueScoreboardSlide(league) {
  let html = buildLeagueHeaderHTML(league);
  league.games.slice(0, 16).forEach((game) => {
    html += renderGameCard(game);
  });
  $('.sports-games-list').html(html);
}

function getMlbDivisionColumns(groups) {
  const columns = ['WEST', 'CENTRAL', 'EAST'].map((division) => ({
    division,
    groups: []
  }));

  groups.forEach((group) => {
    const divisionLabel = getMlbDivisionSlotLabel(group?.groupName || '');
    if (divisionLabel === 'DIVISION') {
      return;
    }

    const column = columns.find((item) => item.division === divisionLabel);
    if (!column) {
      return;
    }

    column.groups.push(group);
    column.groups.sort((a, b) => {
      const aLeague = String(a?.groupName || '').match(/\b(AL|NL)\b/i)?.[1] || 'ZZ';
      const bLeague = String(b?.groupName || '').match(/\b(AL|NL)\b/i)?.[1] || 'ZZ';
      return aLeague.localeCompare(bLeague);
    });
  });

  return columns.filter((column) => column.groups.length > 0);
}

function getNumericEntryStat(entry, names) {
  const stat = getEntryStat(entry, names);
  const numericValue = Number(stat?.value ?? stat?.displayValue);
  return Number.isFinite(numericValue) ? numericValue : null;
}

function getMlbLeagueLabel(leagueName) {
  if (leagueName === 'AL') {
    return 'AMERICAN LEAGUE';
  }

  if (leagueName === 'NL') {
    return 'NATIONAL LEAGUE';
  }

  return String(leagueName || 'LEAGUE').toUpperCase();
}

function getMlbLeagueSortValue(leagueName) {
  if (leagueName === 'NATIONAL LEAGUE') {
    return 0;
  }

  if (leagueName === 'AMERICAN LEAGUE') {
    return 1;
  }

  return Number.MAX_SAFE_INTEGER;
}

function getMlbDivisionSlotLabel(divisionLike) {
  const rawLabel = typeof divisionLike === 'string'
    ? divisionLike
    : [
        divisionLike?.name,
        divisionLike?.shortName,
        divisionLike?.abbreviation,
        divisionLike?.displayName
      ].filter(Boolean).join(' ');
  const normalizedLabel = String(rawLabel || '').trim();

  if (/\b(?:West|ALW|NLW)\b/i.test(normalizedLabel)) {
    return 'WEST';
  }

  if (/\b(?:Central|ALC|NLC)\b/i.test(normalizedLabel)) {
    return 'CENTRAL';
  }

  if (/\b(?:East|ALE|NLE)\b/i.test(normalizedLabel)) {
    return 'EAST';
  }

  return 'DIVISION';
}

function getMlbDivisionSortValue(label) {
  const orderedDivisions = ['WEST', 'CENTRAL', 'EAST'];
  const index = orderedDivisions.indexOf(label);
  return index === -1 ? Number.MAX_SAFE_INTEGER : index;
}

function getMlbStandingsRowBase(entry) {
  return {
    teamName: entry.team?.shortDisplayName || entry.team?.displayName || entry.team?.abbreviation || 'Team',
    logo: entry.team?.logos?.[0]?.href || '',
    record: formatStandingsRecord(entry, 'MLB'),
    isFollowed: Boolean(getFollowedTeams().some((followedTeam) => followedTeam.league === 'MLB' && isMatchingTeam(entry.team, followedTeam)))
  };
}

function formatMlbGamesBackMetric(value) {
  const displayValue = String(value ?? '').trim();
  if (!displayValue || displayValue === '-' || displayValue === '0' || displayValue === '0.0') {
    return '-';
  }

  return `${displayValue} GB`;
}

function formatMlbWildCardGapMetric(entry, cutoffEntry) {
  if (!entry || !cutoffEntry) {
    return '';
  }

  const wins = getNumericEntryStat(entry, ['wins', 'W']);
  const losses = getNumericEntryStat(entry, ['losses', 'L']);
  const cutoffWins = getNumericEntryStat(cutoffEntry, ['wins', 'W']);
  const cutoffLosses = getNumericEntryStat(cutoffEntry, ['losses', 'L']);

  if (![wins, losses, cutoffWins, cutoffLosses].every(Number.isFinite)) {
    return '';
  }

  const gamesBack = ((cutoffWins - wins) + (losses - cutoffLosses)) / 2;
  if (Math.abs(gamesBack) < 0.05) {
    return '-';
  }

  const absoluteGamesBack = Math.abs(gamesBack);
  const formattedGap = Number.isInteger(absoluteGamesBack)
    ? String(absoluteGamesBack)
    : absoluteGamesBack.toFixed(1).replace(/\.0$/, '');

  return gamesBack < 0 ? `+${formattedGap}` : `${formattedGap} GB`;
}

function getMlbDivisionStandingsRows(entries) {
  return entries.map((entry, index) => ({
    ...getMlbStandingsRowBase(entry),
    rank: String(index + 1),
    metric: formatMlbGamesBackMetric(getEntryStat(entry, ['divisionGamesBehind', 'gamesBehind', 'DGB', 'GB'])?.displayValue)
  }));
}

function getMlbWildCardStandingsRows(entries, divisionLeaderIds) {
  const candidates = entries
    .filter((entry) => !divisionLeaderIds.has(String(entry?.team?.id || '')))
    .map((entry, index) => ({
      entry,
      index,
      seed: getNumericEntryStat(entry, ['playoffSeed', 'SEED', 'POS']),
      winPct: getNumericEntryStat(entry, ['winPercent', 'winpercent', 'PCT']) ?? -1,
      wins: getNumericEntryStat(entry, ['wins', 'W']) ?? -1,
      losses: getNumericEntryStat(entry, ['losses', 'L']) ?? Number.MAX_SAFE_INTEGER
    }))
    .sort((a, b) => {
      const seedA = Number.isFinite(a.seed) ? a.seed : Number.MAX_SAFE_INTEGER;
      const seedB = Number.isFinite(b.seed) ? b.seed : Number.MAX_SAFE_INTEGER;
      if (seedA !== seedB) {
        return seedA - seedB;
      }

      if (a.winPct !== b.winPct) {
        return b.winPct - a.winPct;
      }

      if (a.wins !== b.wins) {
        return b.wins - a.wins;
      }

      if (a.losses !== b.losses) {
        return a.losses - b.losses;
      }

      return a.index - b.index;
    })
    .slice(0, 6);

  const cutoffEntry = candidates[Math.min(2, Math.max(candidates.length - 1, 0))]?.entry || null;

  return candidates.map(({ entry }, index) => ({
    ...getMlbStandingsRowBase(entry),
    rank: String(index + 1),
    metric: formatMlbWildCardGapMetric(entry, cutoffEntry)
  }));
}

function getMlbPlayoffPicture() {
  const standingsData = standingsCache.MLB;
  const leagues = Array.isArray(standingsData?.children) ? standingsData.children : [];

  return leagues.map((league) => {
    const divisions = Array.isArray(league?.children) ? league.children : [];
    const divisionLeaderIds = new Set();
    const divisionStandings = divisions.map((division) => {
      const entries = Array.isArray(division?.standings?.entries) ? division.standings.entries : [];
      if (entries.length === 0) {
        return null;
      }

      const leaderTeamId = String(entries[0]?.team?.id || `${league?.id || 'league'}-${division?.id || 'division'}-leader`);
      divisionLeaderIds.add(leaderTeamId);

      return {
        title: getMlbDivisionSlotLabel(division),
        rows: getMlbDivisionStandingsRows(entries),
        entries
      };
    }).filter(Boolean);

    divisionStandings.sort((a, b) => getMlbDivisionSortValue(a.title) - getMlbDivisionSortValue(b.title));

    const leagueEntries = divisionStandings.flatMap((division) => division.entries || []);
    const wildCardRows = getMlbWildCardStandingsRows(leagueEntries, divisionLeaderIds);

    if (divisionStandings.length < 3 || wildCardRows.length < 3) {
      return null;
    }

    return {
      leagueName: getMlbLeagueLabel(league?.shortName || league?.abbreviation || league?.name),
      divisionSections: divisionStandings.map(({ title, rows }) => ({ title, rows })),
      wildCardSection: {
        title: 'WILD CARD',
        rows: wildCardRows
      }
    };
  }).filter(Boolean);
}

function buildMlbPlayoffSectionMarkup(section, extraClass = '') {
  const blockClass = ['sports-team-standings-block', extraClass].filter(Boolean).join(' ');

  return `
    <div class="${blockClass}">
      <div class="sports-team-news-title sports-team-news-title--subtle">${section.title}</div>
      ${buildStandingsTableMarkup(section.rows)}
    </div>
  `;
}

function buildMlbPlayoffDivisionLeaguePanelMarkup(league) {
  return `
    <div class="sports-mlb-playoff-league-panel">
      <div class="sports-team-news-title">${league.leagueName}</div>
      <div class="sports-mlb-playoff-division-grid">
        ${league.divisionSections.map((section) => buildMlbPlayoffSectionMarkup(section, 'sports-mlb-playoff-division-section')).join('')}
      </div>
    </div>
  `;
}

function buildMlbPlayoffWildCardPanelMarkup(league) {
  return `
    <div class="sports-team-standings-block sports-mlb-playoff-wildcard-panel">
      <div class="sports-team-news-title">${league.leagueName} WILD CARD</div>
      ${buildStandingsTableMarkup(league.wildCardSection.rows)}
    </div>
  `;
}

function renderFavoriteLeagueStandingsSlide(leagueItems, groupsOverride) {
  if (!Array.isArray(leagueItems) || leagueItems.length === 0) {
    $('.sports-games-list').html('');
    return;
  }

  const leagueName = leagueItems[0].followedTeam.league;
  const leagueData = getLeagueSlideData(leagueName);
  const groups = Array.isArray(groupsOverride) && groupsOverride.length > 0
    ? groupsOverride
    : getLeagueStandingsGroupsForSlides(leagueItems);

  if (!leagueData || groups.length === 0) {
    renderFavoriteLeagueScoreboardSlide(leagueData || { name: leagueName, logo: '', games: [] });
    return;
  }

  if (leagueName === 'MLB' && groups.length >= 6) {
    const playoffPicture = getMlbPlayoffPicture();
    if (playoffPicture.length >= 2) {
      const orderedPlayoffPicture = [...playoffPicture].sort((a, b) => getMlbLeagueSortValue(a.leagueName) - getMlbLeagueSortValue(b.leagueName));

      $('.sports-games-list').html(`
        <div class="sports-league-standings sports-league-standings--mlb sports-league-standings--mlb-playoff">
          <div class="sports-league-standings-header">
            <img class="sports-league-standings-logo" src="${leagueData.logo || ''}" alt="${leagueName}" onerror="this.style.display='none'">
            <div>
              <div class="sports-feature-kicker">${leagueName} STANDINGS</div>
              <div class="sports-league-standings-subtitle">DIVISION RACES &amp; WILD CARD</div>
            </div>
          </div>
          <div class="sports-mlb-playoff-layout">
            ${orderedPlayoffPicture.map((league) => buildMlbPlayoffDivisionLeaguePanelMarkup(league)).join('')}
            <div class="sports-mlb-playoff-wildcard-panels">
              ${orderedPlayoffPicture.map((league) => buildMlbPlayoffWildCardPanelMarkup(league)).join('')}
            </div>
          </div>
        </div>
      `);
      return;
    }

    const columns = getMlbDivisionColumns(groups);

    $('.sports-games-list').html(`
      <div class="sports-league-standings sports-league-standings--mlb">
        <div class="sports-league-standings-header">
          <img class="sports-league-standings-logo" src="${leagueData.logo || ''}" alt="${leagueName}" onerror="this.style.display='none'">
          <div>
            <div class="sports-feature-kicker">${leagueName} STANDINGS</div>
          </div>
        </div>
        <div class="sports-league-standings-mlb-columns">
          ${columns.map((column) => `
            <div class="sports-league-standings-mlb-column">
              <div class="sports-team-news-title">${column.division.toUpperCase()}</div>
              <div class="sports-league-standings-mlb-division-stack">
                ${column.groups.map((group) => `
                  <div class="sports-team-standings-block">
                    <div class="sports-team-news-title sports-team-news-title--subtle">${group.groupName.toUpperCase()}</div>
                    ${buildStandingsTableMarkup(group.rows)}
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `);
    return;
  }

  $('.sports-games-list').html(`
      <div class="sports-league-standings${leagueName === 'NHL' ? ' sports-league-standings--nhl' : ''}">
        <div class="sports-league-standings-header">
          <img class="sports-league-standings-logo" src="${leagueData.logo || ''}" alt="${leagueName}" onerror="this.style.display='none'">
          <div>
            <div class="sports-feature-kicker">${leagueName} STANDINGS</div>
          </div>
        </div>
        <div class="sports-league-standings-groups sports-league-standings-groups--${groups.length > 1 ? 'double' : 'single'}">
          ${groups.map((group) => `
            <div class="sports-team-standings-block${groups.length === 1 ? ' sports-team-standings-block--split' : ''}">
              <div class="sports-team-news-title">${group.groupName.toUpperCase()}</div>
              <div class="sports-standings-split${groups.length === 1 ? ' sports-standings-split--double' : ''}">
                ${buildStandingsTableMarkup(groups.length === 1 ? group.rows.slice(0, Math.ceil(group.rows.length / 2)) : group.rows)}
                ${groups.length === 1 ? buildStandingsTableMarkup(group.rows.slice(Math.ceil(group.rows.length / 2))) : ''}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `);
}

function renderFavoriteLeagueKnockoutSlide(leagueName) {
  const leagueData = getLeagueSlideData(leagueName);
  const seasonType = getLeagueSeasonType(leagueName);
  const games = getGamesForLeague(leagueName, 8);
  const branding = getMarchMadnessBranding(
    leagueName,
    MARCH_MADNESS_LEAGUES.has(leagueName)
      ? { name: getMarchMadnessRoundLabelFromGames(games, seasonType?.abbreviation || seasonType?.name || 'Tournament') }
      : seasonType
  );

  if (!leagueData || games.length === 0) {
    $('.sports-games-list').html('');
    return;
  }

  $('.sports-games-list').html(`
    <div class="sports-knockout-board">
      <div class="sports-knockout-header${MARCH_MADNESS_LEAGUES.has(leagueName) ? ' sports-knockout-header--march-madness' : ''}">
        <div class="sports-knockout-header-main">
          <img class="sports-league-standings-logo" src="${leagueData.logo || ''}" alt="${leagueName}" onerror="this.style.display='none'">
          <div>
            <div class="sports-feature-kicker">${branding.kicker}</div>
            <div class="sports-knockout-subtitle">${branding.subtitle}</div>
          </div>
        </div>
        <div class="sports-knockout-round">${branding.roundLabel.toUpperCase()}</div>
      </div>
      <div class="sports-knockout-grid sports-knockout-grid--${games.length > 4 ? 'dense' : 'standard'}">
        ${games.map((gameData) => {
          const event = gameData?.event || {};
          const competition = event?.competitions?.[0] || {};
          const homeTeam = competition?.competitors?.find((competitor) => competitor.homeAway === 'home');
          const awayTeam = competition?.competitors?.find((competitor) => competitor.homeAway === 'away');

          if (!homeTeam || !awayTeam) {
            return '';
          }

          const status = event?.status?.type?.state || '';
          const statusText = event?.status?.type?.shortDetail || event?.status?.type?.detail || 'Scheduled';
          const aggregateText = getKnockoutSecondaryText(leagueName, event, competition);
          const roundText = getKnockoutRoundLabel(event, competition, branding.roundLabel).toUpperCase();
          const showScore = status === 'in' || status === 'post';
          const legText = MARCH_MADNESS_LEAGUES.has(leagueName)
            ? ''
            : (competition?.leg?.displayValue || (roundText !== branding.roundLabel.toUpperCase() ? roundText : ''));
          const awayName = getKnockoutDisplayName(leagueName, awayTeam);
          const homeName = getKnockoutDisplayName(leagueName, homeTeam);

          return `
            <div class="sports-knockout-card">
              ${legText ? `<div class="sports-knockout-card-meta">${legText}</div>` : ''}
              <div class="sports-knockout-team-row">
                <div class="sports-knockout-team">
                  <img class="sports-knockout-logo" src="${getTeamLogoUrl(awayTeam.team)}" alt="${awayTeam.team?.displayName || 'Away'}" onerror="this.style.display='none'">
                  <span class="sports-knockout-name">${awayName}</span>
                </div>
                <div class="sports-knockout-score">${showScore ? (awayTeam.score || '0') : '&nbsp;'}</div>
              </div>
              <div class="sports-knockout-team-row">
                <div class="sports-knockout-team">
                  <img class="sports-knockout-logo" src="${getTeamLogoUrl(homeTeam.team)}" alt="${homeTeam.team?.displayName || 'Home'}" onerror="this.style.display='none'">
                  <span class="sports-knockout-name">${homeName}</span>
                </div>
                <div class="sports-knockout-score">${showScore ? (homeTeam.score || '0') : '&nbsp;'}</div>
              </div>
              ${aggregateText ? `<div class="sports-knockout-card-meta sports-knockout-card-meta--region">${aggregateText}</div>` : ''}
              <div class="sports-knockout-status">${status === 'in' ? '<span class="sports-live-dot"></span>' : ''}${statusText}</div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `);
}

function renderGenericKnockoutBracketSlide(leagueName, roundGroups, chunkIndex, totalChunks) {
  const leagueData = getLeagueSlideData(leagueName);
  const seasonType = getLeagueSeasonType(leagueName);
  const branding = getMarchMadnessBranding(leagueName, seasonType);
  const safeGroups = Array.isArray(roundGroups) ? roundGroups.filter((group) => Array.isArray(group?.games) && group.games.length > 0) : [];

  if (!leagueData || safeGroups.length === 0) {
    renderFavoriteLeagueKnockoutSlide(leagueName);
    return;
  }

  $('.sports-games-list').html(`
    <div class="sports-generic-bracket-board">
      <div class="sports-mm-board-header">
        <div class="sports-knockout-header-main">
          <img class="sports-league-standings-logo" src="${leagueData.logo || ''}" alt="${leagueName}" onerror="this.style.display='none'">
          <div>
            <div class="sports-feature-kicker">${branding.kicker}</div>
            <div class="sports-knockout-subtitle">${branding.subtitle}</div>
          </div>
        </div>
        <div class="sports-mm-region-pill">${totalChunks > 1 ? `${chunkIndex + 1} OF ${totalChunks}` : 'BRACKET'}</div>
      </div>
      <div class="sports-generic-bracket-grid sports-generic-bracket-grid--${safeGroups.length}">
        ${safeGroups.map((group) => `
          <div class="sports-generic-round">
            <div class="sports-mm-round-title">${group.label}</div>
            <div class="sports-generic-round-games">
              ${group.games.map((gameData) => {
                const event = gameData?.event || {};
                const competition = event?.competitions?.[0] || {};
                const homeTeam = competition?.competitors?.find((competitor) => competitor.homeAway === 'home');
                const awayTeam = competition?.competitors?.find((competitor) => competitor.homeAway === 'away');

                if (!homeTeam || !awayTeam) {
                  return '';
                }

                const status = event?.status?.type?.state || '';
                const statusText = event?.status?.type?.shortDetail || event?.status?.type?.detail || 'Scheduled';
                const aggregateText = getKnockoutSecondaryText(leagueName, event, competition);
                const showScore = status === 'in' || status === 'post';
                const legText = competition?.leg?.displayValue || '';
                const awayName = getKnockoutDisplayName(leagueName, awayTeam);
                const homeName = getKnockoutDisplayName(leagueName, homeTeam);

                return `
                  <div class="sports-knockout-card sports-knockout-card--round">
                    ${legText ? `<div class="sports-knockout-card-meta">${legText}</div>` : ''}
                    <div class="sports-knockout-team-row">
                      <div class="sports-knockout-team">
                        <img class="sports-knockout-logo" src="${getTeamLogoUrl(awayTeam.team)}" alt="${awayTeam.team?.displayName || 'Away'}" onerror="this.style.display='none'">
                        <span class="sports-knockout-name">${awayName}</span>
                      </div>
                      <div class="sports-knockout-score">${showScore ? (awayTeam.score || '0') : '&nbsp;'}</div>
                    </div>
                    <div class="sports-knockout-team-row">
                      <div class="sports-knockout-team">
                        <img class="sports-knockout-logo" src="${getTeamLogoUrl(homeTeam.team)}" alt="${homeTeam.team?.displayName || 'Home'}" onerror="this.style.display='none'">
                        <span class="sports-knockout-name">${homeName}</span>
                      </div>
                      <div class="sports-knockout-score">${showScore ? (homeTeam.score || '0') : '&nbsp;'}</div>
                    </div>
                    ${aggregateText ? `<div class="sports-knockout-card-meta sports-knockout-card-meta--region">${aggregateText}</div>` : ''}
                    <div class="sports-knockout-status">${status === 'in' ? '<span class="sports-live-dot"></span>' : ''}${statusText}</div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `);
}

function renderSoccerRoundupStandingsSlide(leagues) {
  if (!Array.isArray(leagues) || leagues.length === 0) {
    $('.sports-games-list').html('');
    return;
  }

  $('.sports-games-list').html(`
    <div class="sports-soccer-roundup">
      <div class="sports-league-standings-header">
        <div>
          <div class="sports-feature-kicker">SOCCER TABLES</div>
        </div>
      </div>
      <div class="sports-soccer-roundup-grid sports-soccer-roundup-grid--${leagues.length > 2 ? 'quad' : 'double'}">
        ${leagues.map((league) => `
          <div class="sports-soccer-roundup-card">
            <div class="sports-soccer-roundup-header">
              <img class="sports-soccer-roundup-logo" src="${league.logo || ''}" alt="${league.leagueName}" onerror="this.style.display='none'">
              <div class="sports-soccer-roundup-title">${league.leagueName}</div>
            </div>
            <div class="sports-soccer-roundup-table">
              ${league.rows.map((row) => `
                <div class="sports-soccer-roundup-row ${row.isFollowed ? 'sports-soccer-roundup-row--followed' : ''}">
                  <div class="sports-soccer-roundup-rank">${row.rank}</div>
                  <div class="sports-soccer-roundup-team">${row.teamName}</div>
                  <div class="sports-soccer-roundup-record">${row.record}</div>
                  <div class="sports-soccer-roundup-points">${row.metric}</div>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `);
}

function buildStandingsTableMarkup(rows) {
  if (!Array.isArray(rows) || rows.length === 0) {
    return '';
  }

  return `
    <div class="sports-standings-table sports-standings-table--compact">
      ${rows.map((row) => `
        ${renderStandingsRowMarkup(row)}
      `).join('')}
    </div>
  `;
}

/**
 * Render two leagues sharing one slide (up to 9 games each)
 */
function renderCombinedSlide(leagueA, leagueB) {
  let html = buildLeagueHeaderHTML(leagueA);
  leagueA.games.slice(0, 9).forEach(game => { html += renderGameCard(game); });

  html += buildLeagueHeaderHTML(leagueB, true);
  leagueB.games.slice(0, 9).forEach(game => { html += renderGameCard(game); });

  $('.sports-games-list').html(html);
}

/**
 * Render three leagues sharing one slide (up to 5 games each, all have <6)
 */
function renderTripleSlide(leagueA, leagueB, leagueC) {
  let html = buildLeagueHeaderHTML(leagueA);
  leagueA.games.slice(0, 5).forEach(game => { html += renderGameCard(game); });

  html += buildLeagueHeaderHTML(leagueB, true);
  leagueB.games.slice(0, 5).forEach(game => { html += renderGameCard(game); });

  html += buildLeagueHeaderHTML(leagueC, true);
  leagueC.games.slice(0, 5).forEach(game => { html += renderGameCard(game); });

  $('.sports-games-list').html(html);
}

/**
 * Build the HTML for a league section header
 */
function buildLeagueHeaderHTML(league, isSecond = false) {
  return `
    <div class="sports-league-header${isSecond ? ' sports-league-header--second' : ''}">
      <img src="${league.logo}" alt="${league.name}" onerror="this.style.display='none'">
      <h2>${league.name}</h2>
    </div>
  `;
}

function getTeamRecordText(team) {
  return team?.records?.[0]?.summary || '';
}

function isBaseballLeague(leagueName) {
  return ['MLB', 'College Baseball', 'WBC'].includes(leagueName);
}

function getCompetitionBroadcastText(competition) {
  const broadcasts = Array.isArray(competition?.broadcasts) ? competition.broadcasts : [];
  const names = [];

  broadcasts.forEach((broadcast) => {
    const broadcastNames = Array.isArray(broadcast?.names)
      ? broadcast.names
      : (broadcast?.name ? [broadcast.name] : []);

    broadcastNames.forEach((name) => {
      const trimmed = String(name || '').trim();
      if (trimmed && !names.includes(trimmed)) {
        names.push(trimmed);
      }
    });
  });

  return names.slice(0, 2).join(' / ');
}

function getMlbTvUrl(gameData) {
  if (gameData?.league !== 'MLB') {
    return '';
  }

  const event = gameData?.event;
  const gamePk = event?.mlbGamePk || event?.baseballFinalDetails?.gamePk;
  if (event?.mlbTvUrl) {
    return event.mlbTvUrl;
  }

  return gamePk ? `https://www.mlb.com/tv/g${gamePk}` : '';
}

function wrapGameCardMarkup(gameData, cardMarkup) {
  if (!cardMarkup) {
    return '';
  }

  const mlbTvUrl = getMlbTvUrl(gameData);
  if (!mlbTvUrl) {
    return cardMarkup;
  }

  const matchupLabel = gameData?.event?.shortName || gameData?.event?.name || 'MLB game';
  return `
    <a
      class="sports-game-link"
      href="${mlbTvUrl}"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Open MLB.TV feed for ${matchupLabel}"
      title="Open MLB.TV"
    >
      ${cardMarkup}
    </a>
  `;
}

function formatCompactAthleteName(name, fallback = '--') {
  const trimmed = String(name || '').trim();
  if (!trimmed) {
    return fallback;
  }

  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) {
    return parts[0];
  }

  return `${parts[0].charAt(0)}. ${parts[parts.length - 1]}`;
}

function getTrustedBaseballFinalHomeRuns(gameData) {
  const homeRuns = gameData?.event?.baseballFinalDetails?.homeRuns;
  // ESPN competitor leaders can reflect season leaders, not the homers from this final.
  return Array.isArray(homeRuns) ? homeRuns : [];
}

function getTrustedBaseballFinalRbis(gameData) {
  const rbis = gameData?.event?.baseballFinalDetails?.rbis;
  return Array.isArray(rbis) ? rbis : [];
}

function getBaseballFinalTeamOrder(gameData) {
  const competitors = Array.isArray(gameData?.event?.competitions?.[0]?.competitors)
    ? gameData.event.competitions[0].competitors
    : [];

  return competitors
    .slice()
    .sort((a, b) => {
      const order = { away: 0, home: 1 };
      return (order[String(a?.homeAway || '').toLowerCase()] ?? 2) - (order[String(b?.homeAway || '').toLowerCase()] ?? 2);
    })
    .map((competitor) => String(competitor?.team?.abbreviation || competitor?.team?.shortDisplayName || '').trim())
    .filter(Boolean);
}

function groupBaseballFinalHittersByTeam(entries = []) {
  return (Array.isArray(entries) ? entries : [])
    .filter((entry) => entry?.name)
    .reduce((map, entry) => {
      const teamKey = String(entry?.teamAbbreviation || '').trim();
      if (!map[teamKey]) {
        map[teamKey] = [];
      }

      map[teamKey].push(entry);
      return map;
    }, {});
}

function formatBaseballFinalHitterLabel(entry, statType) {
  const hitterName = formatCompactAthleteName(entry?.name, '');
  if (!hitterName) {
    return '';
  }

  const count = Number(entry?.count);
  if (Number.isFinite(count) && count > 1) {
    return statType === 'RBI'
      ? `${hitterName} ${count} RBI`
      : `${hitterName} ${count}x`;
  }

  return hitterName;
}

function getBaseballFinalScoringSummary(gameData) {
  const homeRunsByTeam = groupBaseballFinalHittersByTeam(getTrustedBaseballFinalHomeRuns(gameData));
  const rbisByTeam = groupBaseballFinalHittersByTeam(getTrustedBaseballFinalRbis(gameData));
  const orderedTeamKeys = getBaseballFinalTeamOrder(gameData);
  const teamKeys = [
    ...orderedTeamKeys,
    ...Object.keys(homeRunsByTeam),
    ...Object.keys(rbisByTeam)
  ].filter((teamKey, index, list) => list.indexOf(teamKey) === index);

  const sections = teamKeys.reduce((items, teamKey) => {
    if (Array.isArray(homeRunsByTeam[teamKey]) && homeRunsByTeam[teamKey].length > 0) {
      items.push({ teamKey, statType: 'HR', entries: homeRunsByTeam[teamKey] });
      return items;
    }

    if (Array.isArray(rbisByTeam[teamKey]) && rbisByTeam[teamKey].length > 0) {
      items.push({ teamKey, statType: 'RBI', entries: rbisByTeam[teamKey] });
    }

    return items;
  }, []);

  if (sections.length === 0) {
    return {
      label: '',
      text: ''
    };
  }

  const hasHomeRunSection = sections.some((section) => section.statType === 'HR');
  const hasRbiSection = sections.some((section) => section.statType === 'RBI');
  const label = hasHomeRunSection && hasRbiSection
    ? 'HR/RBI'
    : (hasHomeRunSection ? 'HR' : 'RBI');
  const showStatTypeInText = hasHomeRunSection && hasRbiSection;

  const text = sections
    .map((section) => {
      const hitterText = section.entries
        .map((entry) => formatBaseballFinalHitterLabel(entry, section.statType))
        .filter(Boolean)
        .join(', ');

      if (!hitterText) {
        return '';
      }

      const parts = [];
      if (section.teamKey) {
        parts.push(section.teamKey);
      }
      if (showStatTypeInText) {
        parts.push(section.statType);
      }
      parts.push(hitterText);

      return parts.join(' ');
    })
    .filter(Boolean)
    .join('; ');

  return { label, text };
}

function getBaseballFinalDetails(gameData) {
  if (!isBaseballLeague(gameData?.league)) {
    return null;
  }

  const event = gameData?.event;
  const competition = event?.competitions?.[0];
  const status = event?.status?.type?.state || '';
  if (status !== 'post' || !competition) {
    return null;
  }

  const serverDetails = event?.baseballFinalDetails || {};
  const decisions = [
    serverDetails?.decisions?.winner?.name ? { label: 'W', name: formatCompactAthleteName(serverDetails.decisions.winner.name) } : null,
    serverDetails?.decisions?.loser?.name ? { label: 'L', name: formatCompactAthleteName(serverDetails.decisions.loser.name) } : null,
    serverDetails?.decisions?.save?.name ? { label: 'S', name: formatCompactAthleteName(serverDetails.decisions.save.name) } : null
  ].filter(Boolean);

  const scoringSummary = getBaseballFinalScoringSummary(gameData);

  return {
    decisions,
    scoringSummaryLabel: scoringSummary.label,
    scoringSummaryText: scoringSummary.text
  };
}

function getBaseOccupancyFlag(baseValue) {
  if (baseValue === null || baseValue === undefined || baseValue === false) {
    return false;
  }

  if (typeof baseValue === 'object') {
    return true;
  }

  return String(baseValue).trim() !== '' && String(baseValue) !== '0';
}

function getBaseballLiveDetails(gameData) {
  if (!isBaseballLeague(gameData?.league)) {
    return null;
  }

  const event = gameData?.event;
  const competition = event?.competitions?.[0];
  const situation = competition?.situation;
  const status = event?.status?.type?.state || '';
  if (status !== 'in' || !situation) {
    return null;
  }

  const batterName = formatCompactAthleteName(
    situation?.batter?.athlete?.displayName
      || situation?.batter?.athlete?.shortName
      || situation?.batter?.displayName
      || situation?.batter?.shortName
  );
  const pitcherName = formatCompactAthleteName(
    situation?.pitcher?.athlete?.displayName
      || situation?.pitcher?.athlete?.shortName
      || situation?.pitcher?.displayName
      || situation?.pitcher?.shortName
  );

  return {
    inningState: event?.status?.type?.shortDetail || 'LIVE',
    balls: Number.isFinite(Number(situation?.balls)) ? Number(situation.balls) : null,
    strikes: Number.isFinite(Number(situation?.strikes)) ? Number(situation.strikes) : null,
    outs: Number.isFinite(Number(situation?.outs)) ? Number(situation.outs) : null,
    onFirst: getBaseOccupancyFlag(situation?.onFirst),
    onSecond: getBaseOccupancyFlag(situation?.onSecond),
    onThird: getBaseOccupancyFlag(situation?.onThird),
    batterName,
    pitcherName
  };
}

function renderBaseballDiamondMarkup(details) {
  return `
    <div class="sports-baseball-diamond" aria-label="Base occupancy">
      <span class="sports-baseball-base sports-baseball-base--second${details.onSecond ? ' is-occupied' : ''}"></span>
      <span class="sports-baseball-base sports-baseball-base--third${details.onThird ? ' is-occupied' : ''}"></span>
      <span class="sports-baseball-base sports-baseball-base--first${details.onFirst ? ' is-occupied' : ''}"></span>
      <span class="sports-baseball-base sports-baseball-base--home"></span>
    </div>
  `;
}

function renderBaseballTeamMarkup({ side, logo, name, displayName, record }) {
  return `
    <div class="sports-team ${side}">
      <img class="sports-team-logo" src="${logo}" alt="${name}" onerror="this.style.display='none'">
      <div class="sports-team-body">
        <span class="sports-team-name">${displayName}</span>
        ${record ? `<span class="sports-team-record">${record}</span>` : ''}
      </div>
    </div>
  `;
}

function renderBaseballLiveCard(gameData, teams) {
  const details = getBaseballLiveDetails(gameData);
  if (!details) {
    return '';
  }

  const { awayTeam, homeTeam, awayName, homeName, awayNameDisplay, homeNameDisplay, awayLogo, homeLogo, awayScore, homeScore } = teams;
  const awayRecord = getTeamRecordText(awayTeam);
  const homeRecord = getTeamRecordText(homeTeam);
  const countText = [
    details.balls !== null ? `B${details.balls}` : null,
    details.strikes !== null ? `S${details.strikes}` : null,
    details.outs !== null ? `O${details.outs}` : null
  ].filter(Boolean).join(' ');

  const awayBatting = String(awayTeam?.homeAway || '').toLowerCase() !== 'home' && /^top/i.test(details.inningState);
  const battingLabel = awayBatting ? awayName : homeName;
  const battingText = battingLabel ? `At Bat: ${battingLabel}` : '';

  return `
    <div class="sports-game sports-game--baseball sports-game--live-baseball">
      <div class="sports-game-matchup sports-game-matchup--baseball sports-game-matchup--live-baseball">
        ${renderBaseballTeamMarkup({
          side: 'away',
          logo: awayLogo,
          name: awayName,
          displayName: awayNameDisplay,
          record: awayRecord
        })}
        <div class="sports-score-block sports-score-block--baseball-live">
          <span class="sports-score-num">${awayScore}</span>
          <span class="sports-score-num">${homeScore}</span>
        </div>
        ${renderBaseballTeamMarkup({
          side: 'home',
          logo: homeLogo,
          name: homeName,
          displayName: homeNameDisplay,
          record: homeRecord
        })}
      </div>
      <div class="sports-baseball-live-row">
        ${renderBaseballDiamondMarkup(details)}
        <div class="sports-baseball-live-meta">
          <div class="sports-baseball-live-topline">
            <div class="sports-status live">
              <span class="sports-live-dot"></span>${details.inningState}
            </div>
            ${battingText ? `<div class="sports-baseball-batting">${battingText}</div>` : ''}
          </div>
          ${countText ? `<div class="sports-baseball-count">${countText}</div>` : ''}
          <div class="sports-baseball-player-line">
            <span class="sports-baseball-player-label">Batter</span>
            <span class="sports-baseball-player-value">${details.batterName}</span>
          </div>
          <div class="sports-baseball-player-line">
            <span class="sports-baseball-player-label">Pitcher</span>
            <span class="sports-baseball-player-value">${details.pitcherName}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderBaseballFinalCard(gameData, teams, statusText) {
  const details = getBaseballFinalDetails(gameData);
  if (!details) {
    return '';
  }

  const {
    awayTeam,
    homeTeam,
    awayName,
    homeName,
    awayNameDisplay,
    homeNameDisplay,
    awayLogo,
    homeLogo,
    awayScore,
    homeScore
  } = teams;
  const awayRecord = getTeamRecordText(awayTeam);
  const homeRecord = getTeamRecordText(homeTeam);

  return `
    <div class="sports-game sports-game--baseball sports-game--final-baseball">
      <div class="sports-game-matchup sports-game-matchup--baseball">
        ${renderBaseballTeamMarkup({
          side: 'away',
          logo: awayLogo,
          name: awayName,
          displayName: awayNameDisplay,
          record: awayRecord
        })}
        <div class="sports-score-block">
          <span class="sports-score-num">${awayScore}</span>
          <span class="sports-score-num">${homeScore}</span>
        </div>
        ${renderBaseballTeamMarkup({
          side: 'home',
          logo: homeLogo,
          name: homeName,
          displayName: homeNameDisplay,
          record: homeRecord
        })}
      </div>
      <div class="sports-status final">${statusText}</div>
      <div class="sports-baseball-final-meta">
        ${details.decisions.length > 0 ? `
          <div class="sports-baseball-final-decisions sports-baseball-final-decisions--${Math.min(details.decisions.length, 3)}">
            ${details.decisions.map((decision) => `
              <span class="sports-baseball-final-decision">
                <span class="sports-baseball-final-label">${decision.label}</span>
                <span class="sports-baseball-final-value">${decision.name}</span>
              </span>
            `).join('')}
          </div>
        ` : ''}
        ${details.scoringSummaryText && details.scoringSummaryLabel ? `
          <div class="sports-baseball-meta-line sports-baseball-final-homers">
            <span class="sports-baseball-meta-label">${details.scoringSummaryLabel}</span>
            <span class="sports-baseball-meta-value">${details.scoringSummaryText}</span>
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

function renderBaseballPregameCard(gameData, teams, statusText) {
  const competition = gameData?.event?.competitions?.[0];
  if (!competition) {
    return '';
  }

  const {
    awayTeam,
    homeTeam,
    awayName,
    homeName,
    awayNameDisplay,
    homeNameDisplay,
    awayLogo,
    homeLogo
  } = teams;

  const awayRecord = getTeamRecordText(awayTeam);
  const homeRecord = getTeamRecordText(homeTeam);
  const venue = competition?.venue?.fullName || competition?.venue?.address?.city || '';
  const broadcast = getCompetitionBroadcastText(competition);
  const detailLines = [
    venue ? { label: 'Venue', value: venue } : null,
    broadcast ? { label: 'TV', value: broadcast } : null
  ].filter(Boolean);

  return `
    <div class="sports-game sports-game--baseball sports-game--pregame-baseball">
      <div class="sports-game-matchup sports-game-matchup--baseball">
        ${renderBaseballTeamMarkup({
          side: 'away',
          logo: awayLogo,
          name: awayName,
          displayName: awayNameDisplay,
          record: awayRecord
        })}
        <div class="sports-score-block sports-score-block--baseball-pregame">
          <span class="sports-score-vs">vs</span>
        </div>
        ${renderBaseballTeamMarkup({
          side: 'home',
          logo: homeLogo,
          name: homeName,
          displayName: homeNameDisplay,
          record: homeRecord
        })}
      </div>
      <div class="sports-status sports-status--baseball-pregame">${statusText}</div>
      <div class="sports-baseball-pregame-meta">
        ${detailLines.map((line) => `
          <div class="sports-baseball-meta-line">
            <span class="sports-baseball-meta-label">${line.label}</span>
            <span class="sports-baseball-meta-value">${line.value}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

/**
 * Render a single game card
 */
function renderGameCard(gameData) {
  const event = gameData.event;
  const status = event.status?.type?.state || '';
  const isLive = status === 'in';
  const isFinal = status === 'post';
  const shortDetail = event.status?.type?.shortDetail || '';
  const statusText = isLive
    ? (shortDetail || 'LIVE')
    : (shortDetail || (isFinal ? 'FINAL' : 'Upcoming'));

  const homeTeam = event.competitions?.[0]?.competitors?.find(c => c.homeAway === 'home');
  const awayTeam = event.competitions?.[0]?.competitors?.find(c => c.homeAway === 'away');

  if (!homeTeam || !awayTeam) return '';

  const homeScore = homeTeam.score || '0';
  const awayScore = awayTeam.score || '0';
  const homeLogo = getTeamLogoUrl(homeTeam.team);
  const awayLogo = getTeamLogoUrl(awayTeam.team);
  const homeName = homeTeam.team?.abbreviation || homeTeam.team?.shortDisplayName || homeTeam.team?.displayName || '';
  const awayName = awayTeam.team?.abbreviation || awayTeam.team?.shortDisplayName || awayTeam.team?.displayName || '';

  const homeRank = homeTeam.curatedRank?.current;
  const awayRank = awayTeam.curatedRank?.current;
  const homeNameDisplay = (homeRank && homeRank <= 25) ? `#${homeRank} ${homeName}` : homeName;
  const awayNameDisplay = (awayRank && awayRank <= 25) ? `#${awayRank} ${awayName}` : awayName;

  if (isLive && isBaseballLeague(gameData?.league)) {
    const baseballCard = renderBaseballLiveCard(gameData, {
      awayTeam,
      homeTeam,
      awayName,
      homeName,
      awayNameDisplay,
      homeNameDisplay,
      awayLogo,
      homeLogo,
      awayScore,
      homeScore
    });
    if (baseballCard) {
      return wrapGameCardMarkup(gameData, baseballCard);
    }
  }

  if (isFinal && isBaseballLeague(gameData?.league)) {
    const baseballFinalCard = renderBaseballFinalCard(gameData, {
      awayTeam,
      homeTeam,
      awayName,
      homeName,
      awayNameDisplay,
      homeNameDisplay,
      awayLogo,
      homeLogo,
      awayScore,
      homeScore
    }, statusText);
    if (baseballFinalCard) {
      return wrapGameCardMarkup(gameData, baseballFinalCard);
    }
  }

  if (isBaseballLeague(gameData?.league)) {
    const baseballPregameCard = renderBaseballPregameCard(gameData, {
      awayTeam,
      homeTeam,
      awayName,
      homeName,
      awayNameDisplay,
      homeNameDisplay,
      awayLogo,
      homeLogo,
      awayScore,
      homeScore
    }, statusText);
    if (baseballPregameCard) {
      return wrapGameCardMarkup(gameData, baseballPregameCard);
    }
  }

  return wrapGameCardMarkup(gameData, `
    <div class="sports-game">
      <div class="sports-game-matchup">
        <div class="sports-team away">
          <img class="sports-team-logo" src="${awayLogo}" alt="${awayName}" onerror="this.style.display='none'">
          <span class="sports-team-name">${awayNameDisplay}</span>
        </div>
        <div class="sports-score-block">
          ${(isLive || isFinal)
            ? `<span class="sports-score-num">${awayScore}</span><span class="sports-score-num">${homeScore}</span>`
            : `<span class="sports-score-vs">vs</span>`}
        </div>
        <div class="sports-team home">
          <img class="sports-team-logo" src="${homeLogo}" alt="${homeName}" onerror="this.style.display='none'">
          <span class="sports-team-name">${homeNameDisplay}</span>
        </div>
      </div>
      <div class="sports-status ${isLive ? 'live' : isFinal ? 'final' : ''}">
        ${isLive ? '<span class="sports-live-dot"></span>' : ''}${statusText}
      </div>
    </div>
  `);
}

/**
 * Refresh sports data and rebuild cycler slides
 */
async function refreshSportsPanel() {
  try {
    sportsRawData = await fetchSportsData();
  } catch(e) {
    console.warn('[Sports] Refresh fetch failed:', e);
  }

  if (!sportsCycler) return;

  await ensureFollowedTeamPreviousDaySportsData(getFollowedTeams());

  const activeFollowedTeams = getActiveFollowedTeams();
  await refreshFollowedTeamContext(activeFollowedTeams);

  const slides = buildSportsSlides(activeFollowedTeams);
  if (slides.length === 0) {
    slides.push(createPlaceholderSlide('No games scheduled today', '.sports-games-list'));
  }

  sportsCycler.updateSlides(slides);
}
