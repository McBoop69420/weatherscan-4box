const fetch = require('node-fetch');
const express = require('express');
const path = require('path')
const app = express();
const port = 8080;

app.use(express.static(path.join(__dirname, 'webroot')));

app.listen(port, '0.0.0.0', () => {
    console.log("Weatherscan XL by Mist Weather Media")
    console.log(`Webroot serving on 127.0.0.1:${port}`);
  });

const STANDINGS_URLS = {
  NFL: 'http://site.web.api.espn.com/apis/v2/sports/football/nfl/standings?level=3&sort=winpercent:desc,playoffseed:asc',
  NBA: 'http://site.web.api.espn.com/apis/v2/sports/basketball/nba/standings?level=3&sort=gamesbehind:asc,winpercent:desc',
  MLB: 'http://site.web.api.espn.com/apis/v2/sports/baseball/mlb/standings?level=3&sort=gamesbehind:asc,winpercent:desc',
  WBC: 'http://site.web.api.espn.com/apis/v2/sports/baseball/wbc/standings',
  NHL: 'http://site.web.api.espn.com/apis/v2/sports/hockey/nhl/standings?level=3&sort=points:desc,winpercent:desc,playoffseed:asc',
  EPL: 'http://site.web.api.espn.com/apis/v2/sports/soccer/eng.1/standings?sort=rank:asc',
  'La Liga': 'http://site.web.api.espn.com/apis/v2/sports/soccer/esp.1/standings?sort=rank:asc',
  Bundesliga: 'http://site.web.api.espn.com/apis/v2/sports/soccer/ger.1/standings?sort=rank:asc',
  'Serie A': 'http://site.web.api.espn.com/apis/v2/sports/soccer/ita.1/standings?sort=rank:asc',
  'Ligue 1': 'http://site.web.api.espn.com/apis/v2/sports/soccer/fra.1/standings?sort=rank:asc',
  'UEFA CL': 'http://site.web.api.espn.com/apis/v2/sports/soccer/UEFA.CHAMPIONS/standings?sort=rank:asc',
  'UEFA EL': 'http://site.web.api.espn.com/apis/v2/sports/soccer/UEFA.EUROPA/standings?sort=rank:asc',
  'UEFA Conference League': 'http://site.web.api.espn.com/apis/v2/sports/soccer/UEFA.EUROPA.CONF/standings?sort=rank:asc',
  'World Cup': 'http://site.web.api.espn.com/apis/v2/sports/soccer/FIFA.WORLD/standings?sort=rank:asc',
  MLS: 'http://site.web.api.espn.com/apis/v2/sports/soccer/usa.1/standings?sort=rank:asc',
  NWSL: 'http://site.web.api.espn.com/apis/v2/sports/soccer/usa.nwsl/standings?sort=rank:asc',
  USL: 'http://site.web.api.espn.com/apis/v2/sports/soccer/USA.USL.1/standings?sort=rank:asc',
  'USL Super League': 'http://site.web.api.espn.com/apis/v2/sports/soccer/usa.w.usl.1/standings?sort=rank:asc',
  NCAAB: 'http://site.web.api.espn.com/apis/v2/sports/basketball/mens-college-basketball/standings?group=50&sort=playoffseed:asc,vsconf_winpercent:desc,vsconf_wins:desc,vsconf_losses:asc,vsconf_gamesbehind:asc&includestats=playoffseed,vsconf,vsconf_gamesbehind,vsconf_winpercent,total,winpercent,home,road,streak,vsaprankedteams,vsusarankedteams',
  NCAAW: 'http://site.web.api.espn.com/apis/v2/sports/basketball/womens-college-basketball/standings?group=50&sort=playoffseed:asc,vsconf_winpercent:desc,vsconf_wins:desc,vsconf_losses:asc,vsconf_gamesbehind:asc&includestats=playoffseed,vsconf,vsconf_gamesbehind,vsconf_winpercent,total,winpercent,home,road,streak,vsaprankedteams,vsusarankedteams',
};

const TEAM_SCHEDULE_LEAGUE_SLUGS = {
  EPL: 'eng.1',
  'La Liga': 'esp.1',
  Bundesliga: 'ger.1',
  'Serie A': 'ita.1',
  'Ligue 1': 'fra.1',
  'UEFA CL': 'UEFA.CHAMPIONS',
  'World Cup': 'FIFA.WORLD',
  'UEFA EL': 'UEFA.EUROPA',
  'UEFA Conference League': 'UEFA.EUROPA.CONF',
  'Concacaf Champions Cup': 'concacaf.champions',
  'FA Cup': 'eng.fa',
  MLS: 'usa.1',
  NWSL: 'usa.nwsl',
  USL: 'USA.USL.1',
  'USL Super League': 'usa.w.usl.1',
};

const BRACKET_PAGE_CONFIG = {
  NCAAB: {
    url: (season) => `https://www.espn.com/mens-college-basketball/bracket/_/season/${season}/${season}-ncaa-tournament`,
    label: 'NCAAB'
  },
  NCAAW: {
    url: (season) => `https://www.espn.com/womens-college-basketball/bracket/_/season/${season}/${season}-ncaa-tournament`,
    label: 'NCAAW'
  }
};

const BRACKET_REGIONS = new Set(['SOUTH', 'EAST', 'WEST', 'MIDWEST', 'ALBANY 1', 'ALBANY 2', 'BIRMINGHAM 1', 'BIRMINGHAM 2', 'PORTLAND 1', 'PORTLAND 2', 'SPOKANE 1', 'SPOKANE 2']);
const BRACKET_ROUND_LABELS = ['FIRST FOUR', '1ST ROUND', '2ND ROUND', 'SWEET 16', 'ELITE 8', 'FINAL FOUR', 'CHAMPIONSHIP'];
const MLB_FINAL_DETAILS_CACHE_TTL_MS = 6 * 60 * 60 * 1000;
const mlbFinalDetailsCache = new Map();

function getCurrentBracketSeason() {
  const now = new Date();
  return now.getFullYear();
}

function getEasternReferenceDate(offsetDays = 0) {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  const easternParts = formatter.formatToParts(new Date()).reduce((parts, part) => {
    if (part.type !== 'literal') {
      parts[part.type] = part.value;
    }
    return parts;
  }, {});
  const easternDate = new Date(Date.UTC(
    Number(easternParts.year),
    Number(easternParts.month) - 1,
    Number(easternParts.day),
    12,
    0,
    0
  ));

  easternDate.setUTCDate(easternDate.getUTCDate() + offsetDays);

  return easternDate;
}

function formatScoreboardDate(date = new Date()) {
  return `${date.getUTCFullYear()}${String(date.getUTCMonth() + 1).padStart(2, '0')}${String(date.getUTCDate()).padStart(2, '0')}`;
}

function getEasternScoreboardDate(offsetDays = 0) {
  return formatScoreboardDate(getEasternReferenceDate(offsetDays));
}

function buildScoreboardUrl(baseUrl, scoreboardDate) {
  return String(baseUrl || '').replace(/dates=\d{8}(?:-\d{8})?/i, `dates=${scoreboardDate}`);
}

async function fetchLeagueScoreboardData(league, scoreboardDate, options = {}) {
  const applyDisplayFilters = options.applyDisplayFilters !== false;
  const referenceDate = options.referenceDate || new Date();
  const response = await fetch(buildScoreboardUrl(league.url, scoreboardDate));
  const data = await response.json();
  const logo = data.leagues && data.leagues[0] && data.leagues[0].logos && data.leagues[0].logos[0] ? data.leagues[0].logos[0].href : null;
  let events = Array.isArray(data?.events) ? data.events : [];
  const total = events.length;
  const logPrefix = applyDisplayFilters ? league.name : `${league.name} (${scoreboardDate})`;

  const hasMarchMadnessSlateBeforeFilter = ['NCAAB', 'NCAAW'].includes(league.name)
    && events.some((event) => isMarchMadnessEvent(league.name, event));

  if (league.top25Only && league.rankingsUrl && applyDisplayFilters) {
    let top25Ids = new Set();
    try {
      const rankRes = await fetch(league.rankingsUrl);
      const rankData = await rankRes.json();
      const poll = rankData.rankings && rankData.rankings[0];
      if (poll && poll.ranks) {
        poll.ranks.slice(0, 25).forEach((rank) => {
          if (rank.team && rank.team.id) {
            top25Ids.add(String(rank.team.id));
          }
        });
      }
    } catch (error) {
      console.log(`${logPrefix}: rankings fetch failed, including all games`);
    }

    if (hasMarchMadnessSlateBeforeFilter) {
      console.log(`${logPrefix}: ${total} total, full tournament slate included`);
    } else if (top25Ids.size > 0) {
      events = events.filter((event) => {
        const competition = event.competitions && event.competitions[0];
        if (!competition) return false;
        return competition.competitors.some((competitor) => competitor.team && top25Ids.has(String(competitor.team.id)))
          || isMarchMadnessEvent(league.name, event);
      });
    }

    if (!hasMarchMadnessSlateBeforeFilter) {
      console.log(`${logPrefix}: ${total} total, ${events.length} with top-25 team or March Madness berth`);
    }
  } else {
    console.log(`${logPrefix}: ${total} event(s)`);
  }

  const hasMarchMadnessSlate = ['NCAAB', 'NCAAW'].includes(league.name)
    && events.some((event) => isMarchMadnessEvent(league.name, event));
  if (applyDisplayFilters && hasMarchMadnessSlate) {
    const supplementalEvents = await fetchSupplementalMarchMadnessEvents(league, scoreboardDate, events);
    if (supplementalEvents.length > 0) {
      events = [...events, ...supplementalEvents];
      console.log(`${logPrefix}: added ${supplementalEvents.length} supplemental March Madness event(s)`);
    }
  }

  if (league.name === 'MLB') {
    await enrichMlbEvents(events, referenceDate);
  }

  return {
    logo,
    seasonType: data.leagues && data.leagues[0] && data.leagues[0].season ? data.leagues[0].season.type || null : null,
    events
  };
}

async function fetchSupplementalMarchMadnessEvents(league, today, existingEvents = []) {
  const start = getEasternScoreboardDate(-7);
  const end = getEasternScoreboardDate(7);
  const seenEventIds = new Set(
    (Array.isArray(existingEvents) ? existingEvents : [])
      .map((event) => String(event?.id || ''))
      .filter(Boolean)
  );

  try {
    const rangeUrl = league.url.replace(`dates=${today}`, `dates=${start}-${end}`);
    const response = await fetch(rangeUrl);
    const data = await response.json();
    return (Array.isArray(data?.events) ? data.events : []).filter((event) => {
      const eventId = String(event?.id || '');
      if (eventId && seenEventIds.has(eventId)) {
        return false;
      }

      return isMarchMadnessEvent(league.name, event);
    });
  } catch (error) {
    console.log(`${league.name}: supplemental March Madness fetch failed - ${error.message}`);
    return [];
  }
}

function htmlToVisibleLines(html = '') {
  return decodeBasicEntities(String(html)
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<(?:br|\/p|\/div|\/li|\/h1|\/h2|\/h3|\/h4|\/h5|\/h6|\/tr|\/td|\/th)>/gi, '\n')
    .replace(/<\/a>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\r/g, ''))
    .split('\n')
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
}

function isBracketRegionLine(line = '') {
  const normalized = String(line || '').trim().toUpperCase();
  return BRACKET_REGIONS.has(normalized) || /^REGIONAL\s+\d+$/.test(normalized);
}

function isBracketRoundLine(line = '') {
  return BRACKET_ROUND_LABELS.includes(String(line || '').trim().toUpperCase());
}

function isBracketGameLine(line = '') {
  const normalized = String(line || '').trim();
  if (!normalized || isBracketRegionLine(normalized) || isBracketRoundLine(normalized)) {
    return false;
  }

  if (/^(print bracket|championship banner|ncaa champions|\d{4}-\d{2}|copyright:|terms of use|privacy policy)/i.test(normalized)) {
    return false;
  }

  return /\b\d{1,2}\b/.test(normalized)
    && /[A-Za-z]/.test(normalized)
    && (/final|championship|et|pm|am|tbd|postponed|cancelled|live|ot/i.test(normalized) || /\b\d{1,2}\s+[A-Za-z]/.test(normalized));
}

function splitBracketGameTokens(line = '') {
  return String(line || '')
    .replace(/[(),]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean);
}

function isBracketSeedToken(token = '') {
  const value = Number(token);
  return /^\d{1,2}$/.test(String(token || '')) && value >= 1 && value <= 16;
}

function isBracketScoreToken(token = '') {
  const value = Number(token);
  return /^\d{1,3}$/.test(String(token || '')) && value >= 0 && value <= 200;
}

function isBracketTailToken(token = '') {
  return /^(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec|am|pm|final(?:\/ot)?|halftime|tbd|postponed|cancelled|live|ot|cbs|tbs|tnt|trutv|espn2?|abc|-|\d{1,2}:\d{2})$/i.test(String(token || ''));
}

function splitBracketTeamAndTail(tokens = []) {
  const tailIndex = tokens.findIndex((token) => isBracketTailToken(token));
  const teamTokens = tailIndex === -1 ? tokens.slice() : tokens.slice(0, tailIndex);
  const tailTokens = tailIndex === -1 ? [] : tokens.slice(tailIndex);
  const trailingScore = teamTokens.length > 0 && isBracketScoreToken(teamTokens[teamTokens.length - 1])
    ? teamTokens[teamTokens.length - 1]
    : '';

  return {
    teamTokens: trailingScore ? teamTokens.slice(0, -1) : teamTokens,
    score: trailingScore,
    tailTokens
  };
}

function getBracketPrefixStatus(prefix = '') {
  const normalized = String(prefix || '').trim();
  if (!normalized) {
    return '';
  }

  const statusMatch = normalized.match(/(final(?:\/ot)?|halftime|tbd|postponed|cancelled|live|ot)\b/i);
  return statusMatch ? statusMatch[1] : '';
}

function parseBracketGameLine(line = '') {
  const normalized = String(line || '').replace(/\s+/g, ' ').trim();
  if (!normalized) {
    return null;
  }

  const firstSeedMatch = normalized.match(/\b\d{1,2}\b/);
  if (!firstSeedMatch) {
    return null;
  }

  const prefixText = normalized.slice(0, firstSeedMatch.index).trim();
  const tokenSlice = normalized.slice(firstSeedMatch.index).trim();
  const tokens = splitBracketGameTokens(tokenSlice);
  const seedIndexes = tokens
    .map((token, index) => isBracketSeedToken(token) ? index : -1)
    .filter((index) => index >= 0);

  if (seedIndexes.length < 2) {
    return null;
  }

  const [firstSeedIndex, secondSeedIndex] = seedIndexes;
  const firstSeed = tokens[firstSeedIndex];
  const secondSeed = tokens[secondSeedIndex];
  const firstTeamTokens = tokens.slice(firstSeedIndex + 1, secondSeedIndex);
  const firstScore = firstTeamTokens.length > 0 && isBracketScoreToken(firstTeamTokens[firstTeamTokens.length - 1])
    ? firstTeamTokens[firstTeamTokens.length - 1]
    : '';
  const firstTeamNameTokens = firstScore ? firstTeamTokens.slice(0, -1) : firstTeamTokens;
  const secondSplit = splitBracketTeamAndTail(tokens.slice(secondSeedIndex + 1));
  const statusText = secondSplit.tailTokens.join(' ').trim() || getBracketPrefixStatus(prefixText);

  if (!firstSeed || !secondSeed || firstTeamNameTokens.length === 0 || secondSplit.teamTokens.length === 0) {
    return null;
  }

  return {
    rawText: normalized,
    statusText,
    isFinal: /(^|\s)final\b|championship/i.test(statusText) || /(^|\s)final\b/i.test(prefixText),
    away: {
      seed: firstSeed,
      team: firstTeamNameTokens.join(' ').trim(),
      score: firstScore || ''
    },
    home: {
      seed: secondSeed,
      team: secondSplit.teamTokens.join(' ').trim(),
      score: secondSplit.score || ''
    }
  };
}

function normalizeRegionRoundGames(chunks = []) {
  const games = chunks.flat();
  if (games.length === 0) {
    return {
      firstRound: [],
      secondRound: [],
      sweet16: [],
      elite8: []
    };
  }

  const reverseOrder = chunks.length > 0 && chunks[0].length <= 2;
  if (reverseOrder) {
    return {
      elite8: games.slice(0, 1),
      sweet16: games.slice(1, 3),
      secondRound: games.slice(3, 7),
      firstRound: games.slice(7, 15)
    };
  }

  return {
    firstRound: games.slice(0, 8),
    secondRound: games.slice(8, 12),
    sweet16: games.slice(12, 14),
    elite8: games.slice(14, 15)
  };
}

function normalizeEspnBracketRegionLabel(label = '') {
  const normalized = decodeBasicEntities(String(label || '').replace(/\s+/g, ' ').trim());
  if (!normalized) {
    return '';
  }

  const numberedRegionalMatch = normalized.match(/\bRegional\s+(\d+)\b/i);
  if (numberedRegionalMatch) {
    return `REGIONAL ${numberedRegionalMatch[1]}`;
  }

  const womenSiteMatch = normalized.match(/\b(Albany|Birmingham|Portland|Spokane)\s+([12])\b/i);
  if (womenSiteMatch) {
    return `${womenSiteMatch[1].toUpperCase()} ${womenSiteMatch[2]}`;
  }

  const classicRegionMatch = normalized.match(/\b(South|East|West|Midwest)\b/i);
  if (classicRegionMatch) {
    return classicRegionMatch[1].toUpperCase();
  }

  return normalized.toUpperCase();
}

function createBracketGameFromEspnMatchup(matchup = {}) {
  const competitors = [matchup?.competitorOne, matchup?.competitorTwo].filter(Boolean);
  if (competitors.length < 2) {
    return null;
  }

  const homeCompetitor = competitors.find((competitor) => String(competitor?.homeAway || '').toLowerCase() === 'home')
    || competitors.find((competitor) => Number(competitor?.order) === 1)
    || competitors[0];
  const awayCompetitor = competitors.find((competitor) => String(competitor?.homeAway || '').toLowerCase() === 'away')
    || competitors.find((competitor) => competitor !== homeCompetitor)
    || competitors[1];
  const awayName = awayCompetitor?.name || awayCompetitor?.location || awayCompetitor?.abbreviation || 'TBD';
  const homeName = homeCompetitor?.name || homeCompetitor?.location || homeCompetitor?.abbreviation || 'TBD';
  const hasRealTeams = [awayCompetitor, homeCompetitor].some((competitor) => {
    const id = String(competitor?.id || '').trim();
    const name = String(competitor?.name || '').trim();
    return id !== '0' && name && name.toUpperCase() !== 'TBD';
  });

  if (!hasRealTeams) {
    return null;
  }

  const formatScore = (competitor) => {
    const score = String(competitor?.score ?? '').trim();
    return /^\d+$/.test(score) ? score : '';
  };

  return {
    statusText: matchup?.statusDetail || matchup?.statusDesc || '',
    isFinal: String(matchup?.statusState || '').toLowerCase() === 'post',
    location: matchup?.location || '',
    away: {
      seed: String(awayCompetitor?.seed || '').trim(),
      team: awayName,
      score: formatScore(awayCompetitor)
    },
    home: {
      seed: String(homeCompetitor?.seed || '').trim(),
      team: homeName,
      score: formatScore(homeCompetitor)
    }
  };
}

function extractJsonArrayFromProperty(source = '', propertyName = '', startIndex = 0, searchFromEnd = false) {
  const text = String(source || '');
  const token = `"${propertyName}":`;
  const propertyIndex = searchFromEnd
    ? text.lastIndexOf(token, startIndex)
    : text.indexOf(token, startIndex);

  if (propertyIndex < 0) {
    return '';
  }

  const arrayStart = text.indexOf('[', propertyIndex + token.length);
  if (arrayStart < 0) {
    return '';
  }

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = arrayStart; index < text.length; index += 1) {
    const char = text[index];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === '\\') {
        escaped = true;
      } else if (char === '"') {
        inString = false;
      }
      continue;
    }

    if (char === '"') {
      inString = true;
      continue;
    }

    if (char === '[') {
      depth += 1;
      continue;
    }

    if (char === ']') {
      depth -= 1;
      if (depth === 0) {
        return text.slice(arrayStart, index + 1);
      }
    }
  }

  return '';
}

function parseBracketPageFromEmbeddedJson(html = '', league = 'NCAAB', season = getCurrentBracketSeason()) {
  const source = String(html || '');
  const pageHeadingIndex = source.indexOf('"pageHeading"');
  if (pageHeadingIndex < 0) {
    return null;
  }

  const matchupsJson = extractJsonArrayFromProperty(source, 'matchups', pageHeadingIndex, true);
  const regionsJson = extractJsonArrayFromProperty(source, 'regions', pageHeadingIndex);
  const roundsJson = extractJsonArrayFromProperty(source, 'rounds', pageHeadingIndex);

  if (!matchupsJson || !regionsJson || !roundsJson) {
    return null;
  }

  let matchups;
  let regions;
  let rounds;
  try {
    matchups = JSON.parse(matchupsJson);
    regions = JSON.parse(regionsJson);
    rounds = JSON.parse(roundsJson);
  } catch (error) {
    return null;
  }

  const regionNameById = new Map(
    (Array.isArray(regions) ? regions : [])
      .map((region) => [Number(region?.id), normalizeEspnBracketRegionLabel(region?.labelPrimary)])
      .filter((entry) => entry[0] > 0 && entry[1])
  );
  const orderedRegionNames = (Array.isArray(regions) ? regions : [])
    .map((region) => normalizeEspnBracketRegionLabel(region?.labelPrimary))
    .filter(Boolean);
  const roundLabelById = new Map(
    (Array.isArray(rounds) ? rounds : [])
      .map((round) => [Number(round?.id), String(round?.labelPrimary || '').trim().toUpperCase()])
      .filter((entry) => entry[0] >= 0 && entry[1])
  );
  const roundDetailsById = new Map(
    (Array.isArray(rounds) ? rounds : [])
      .map((round) => [Number(round?.id), round])
      .filter((entry) => entry[0] >= 0)
  );
  const regionMap = new Map();
  const finalRounds = {
    firstFour: [],
    finalFour: [],
    championship: []
  };

  const ensureRegion = (name) => {
    if (!regionMap.has(name)) {
      regionMap.set(name, {
        name,
        firstRound: [],
        secondRound: [],
        sweet16: [],
        elite8: []
      });
    }

    return regionMap.get(name);
  };

  (Array.isArray(matchups) ? matchups : []).forEach((matchup) => {
    const game = createBracketGameFromEspnMatchup(matchup);
    if (!game) {
      return;
    }

    const roundId = Number(matchup?.roundId);
    const sortValue = Number(matchup?.bracketLocation) || 999;
    game.sortValue = sortValue;

    if (roundId === 0 || roundLabelById.get(roundId) === 'FIRST FOUR') {
      finalRounds.firstFour.push(game);
      return;
    }

    if (roundId === 5 || roundLabelById.get(roundId) === 'FINAL FOUR') {
      finalRounds.finalFour.push(game);
      return;
    }

    if (roundId === 6 || roundLabelById.get(roundId) === 'CHAMPIONSHIP') {
      finalRounds.championship.push(game);
      return;
    }

    const regionName = regionNameById.get(Number(matchup?.regionId));
    const derivedRegionName = (() => {
      if (regionName) {
        return regionName;
      }

      const bracketLocation = Number(matchup?.bracketLocation);
      const roundDetails = roundDetailsById.get(roundId);
      const totalRoundMatchups = Number(roundDetails?.numMatchups);
      const gamesPerRegion = orderedRegionNames.length > 0
        ? totalRoundMatchups / orderedRegionNames.length
        : 0;

      if (!Number.isFinite(bracketLocation) || bracketLocation <= 0 || !Number.isFinite(gamesPerRegion) || gamesPerRegion <= 0) {
        return '';
      }

      const regionIndex = Math.floor((bracketLocation - 1) / gamesPerRegion);
      return orderedRegionNames[regionIndex] || '';
    })();
    if (!derivedRegionName) {
      return;
    }

    const region = ensureRegion(derivedRegionName);
    if (roundId === 1) {
      region.firstRound.push(game);
      return;
    }

    if (roundId === 2) {
      region.secondRound.push(game);
      return;
    }

    if (roundId === 3) {
      region.sweet16.push(game);
      return;
    }

    if (roundId === 4) {
      region.elite8.push(game);
    }
  });

  const sortGames = (games = []) => games
    .slice()
    .sort((a, b) => (a?.sortValue || 999) - (b?.sortValue || 999))
    .map((game) => {
      const { sortValue, ...rest } = game || {};
      return rest;
    });

  const normalizedRegions = [...regionMap.values()]
    .map((region) => ({
      ...region,
      firstRound: sortGames(region.firstRound),
      secondRound: sortGames(region.secondRound),
      sweet16: sortGames(region.sweet16),
      elite8: sortGames(region.elite8)
    }))
    .filter((region) => (
      region.firstRound.length
      || region.secondRound.length
      || region.sweet16.length
      || region.elite8.length
    ));

  if (!normalizedRegions.length && !finalRounds.firstFour.length && !finalRounds.finalFour.length && !finalRounds.championship.length) {
    return null;
  }

  return {
    league,
    season,
    regions: normalizedRegions,
    firstFour: sortGames(finalRounds.firstFour),
    finalFour: sortGames(finalRounds.finalFour),
    championship: sortGames(finalRounds.championship)
  };
}

function parseBracketPage(html = '', league = 'NCAAB', season = getCurrentBracketSeason()) {
  const embeddedData = parseBracketPageFromEmbeddedJson(html, league, season);
  if (embeddedData) {
    return embeddedData;
  }

  const lines = htmlToVisibleLines(html);
  const regions = {};
  let currentRegion = '';
  let currentChunk = [];
  let currentRound = '';
  const finalRounds = {
    firstFour: [],
    finalFour: [],
    championship: []
  };

  const flushChunk = () => {
    if (!currentRegion || currentChunk.length === 0) {
      currentChunk = [];
      return;
    }

    if (!regions[currentRegion]) {
      regions[currentRegion] = [];
    }
    regions[currentRegion].push(currentChunk.slice());
    currentChunk = [];
  };

  lines.forEach((line) => {
    const upper = line.toUpperCase();

    if (isBracketRoundLine(upper)) {
      flushChunk();
      currentRound = upper;
      currentRegion = '';
      return;
    }

    if (isBracketRegionLine(upper)) {
      flushChunk();
      currentRegion = upper;
      return;
    }

    if (!isBracketGameLine(line)) {
      return;
    }

    const parsedGame = parseBracketGameLine(line);
    if (!parsedGame) {
      return;
    }

    if (currentRegion) {
      currentChunk.push(parsedGame);
      return;
    }

    if (currentRound === 'FIRST FOUR') {
      finalRounds.firstFour.push(parsedGame);
      return;
    }

    if (currentRound === 'FINAL FOUR') {
      finalRounds.finalFour.push(parsedGame);
      return;
    }

    if (currentRound === 'CHAMPIONSHIP') {
      finalRounds.championship.push(parsedGame);
    }
  });

  flushChunk();

  const normalizedRegions = Object.entries(regions).map(([name, chunks]) => ({
    name,
    ...normalizeRegionRoundGames(chunks)
  })).filter((region) => (
    region.firstRound.length
    || region.secondRound.length
    || region.sweet16.length
    || region.elite8.length
  ));

  return {
    league,
    season,
    regions: normalizedRegions,
    firstFour: finalRounds.firstFour,
    finalFour: finalRounds.finalFour,
    championship: finalRounds.championship
  };
}

function getCompetitionText(event) {
  const competition = event?.competitions?.[0];
  const notes = Array.isArray(competition?.notes) ? competition.notes : [];
  return [
    event?.name,
    ...notes.map((note) => note?.headline || note?.text || '')
  ].filter(Boolean).join(' ');
}

function isMarchMadnessEvent(leagueName, event) {
  if (!['NCAAB', 'NCAAW'].includes(leagueName)) {
    return false;
  }

  const competitionText = getCompetitionText(event);
  return /ncaa (men'?s|women'?s)? basketball championship|march madness|first four|final four|elite(?:\s|-)8|sweet(?:\s|-)16|round of 64|round of 32|national semifinal|national championship|regional semifinal|regional final|\b(?:1st|2nd) round\b/i.test(competitionText);
}

function getEasternDateParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(date);

  return parts.reduce((map, part) => {
    if (part.type !== 'literal') {
      map[part.type] = part.value;
    }
    return map;
  }, {});
}

function getMlbStatsScheduleDate(date = new Date()) {
  const { month, day, year } = getEasternDateParts(date);
  return `${month}/${day}/${year}`;
}

function getMlbStatsOfficialDate(date = new Date()) {
  const { year, month, day } = getEasternDateParts(date);
  return `${year}-${month}-${day}`;
}

function getMlbTvUrl(gamePk) {
  const normalizedGamePk = String(gamePk || '').trim();
  if (!/^\d+$/.test(normalizedGamePk)) {
    return '';
  }

  return `https://www.mlb.com/tv/g${normalizedGamePk}`;
}

function getEspnGameTeams(event) {
  const competitors = Array.isArray(event?.competitions?.[0]?.competitors)
    ? event.competitions[0].competitors
    : [];
  const home = competitors.find((competitor) => String(competitor?.homeAway || '').toLowerCase() === 'home');
  const away = competitors.find((competitor) => String(competitor?.homeAway || '').toLowerCase() === 'away');

  return {
    homeAbbreviation: home?.team?.abbreviation || '',
    awayAbbreviation: away?.team?.abbreviation || '',
    homeName: home?.team?.displayName || [home?.team?.location, home?.team?.name].filter(Boolean).join(' '),
    awayName: away?.team?.displayName || [away?.team?.location, away?.team?.name].filter(Boolean).join(' ')
  };
}

function normalizeMlbTeamName(name = '') {
  return String(name || '')
    .trim()
    .toLowerCase()
    .replace(/\./g, '')
    .replace(/\s+/g, ' ');
}

function findMatchingMlbScheduleGame(event, scheduleGames = []) {
  if (!event || !Array.isArray(scheduleGames) || scheduleGames.length === 0) {
    return null;
  }

  const { homeName, awayName } = getEspnGameTeams(event);
  const normalizedHomeName = normalizeMlbTeamName(homeName);
  const normalizedAwayName = normalizeMlbTeamName(awayName);
  if (!normalizedHomeName || !normalizedAwayName) {
    return null;
  }

  const candidates = scheduleGames.filter((game) => (
    normalizeMlbTeamName(game?.teams?.home?.team?.name) === normalizedHomeName
    && normalizeMlbTeamName(game?.teams?.away?.team?.name) === normalizedAwayName
  ));

  if (candidates.length === 0) {
    return null;
  }

  if (candidates.length === 1) {
    return candidates[0];
  }

  const eventTime = new Date(event?.date || event?.competitions?.[0]?.date || 0).getTime();
  if (!Number.isFinite(eventTime)) {
    return candidates[0];
  }

  return candidates
    .slice()
    .sort((gameA, gameB) => {
      const gameATime = new Date(gameA?.gameDate || 0).getTime();
      const gameBTime = new Date(gameB?.gameDate || 0).getTime();
      return Math.abs(gameATime - eventTime) - Math.abs(gameBTime - eventTime);
    })[0];
}

function extractMlbFinalDetailsFromLiveFeed(feed, teamContext = null, gamePk = null) {
  const decisions = feed?.liveData?.decisions || {};
  const homeAbbreviation = teamContext?.homeAbbreviation || '';
  const awayAbbreviation = teamContext?.awayAbbreviation || '';
  const allPlays = Array.isArray(feed?.liveData?.plays?.allPlays) ? feed.liveData.plays.allPlays : [];
  const homeRunsByHitter = new Map();
  const rbisByHitter = new Map();

  function accumulateBatterStat(statMap, play, count = 1) {
    const batter = play?.matchup?.batter;
    const batterName = batter?.fullName || batter?.name || '';
    if (!batterName) {
      return;
    }

    const parsedCount = Number(count);
    if (!Number.isFinite(parsedCount) || parsedCount <= 0) {
      return;
    }

    const teamAbbreviation = play?.about?.isTopInning ? awayAbbreviation : homeAbbreviation;
    const batterId = batter?.id ? String(batter.id) : batterName;
    const key = `${teamAbbreviation || 'TEAM'}::${batterId}`;
    const existing = statMap.get(key);

    if (existing) {
      existing.count += parsedCount;
      return;
    }

    statMap.set(key, {
      athleteId: batter?.id ? String(batter.id) : '',
      name: batterName,
      teamAbbreviation,
      count: parsedCount
    });
  }

  allPlays.forEach((play) => {
    if (String(play?.result?.eventType || '').toLowerCase() === 'home_run') {
      accumulateBatterStat(homeRunsByHitter, play, 1);
    }

    const rbiCount = Number(play?.result?.rbi);
    if (Number.isFinite(rbiCount) && rbiCount > 0) {
      accumulateBatterStat(rbisByHitter, play, rbiCount);
    }
  });

  const details = {
    gamePk: gamePk || null,
    decisions: {
      winner: decisions?.winner?.fullName ? { name: decisions.winner.fullName } : null,
      loser: decisions?.loser?.fullName ? { name: decisions.loser.fullName } : null,
      save: decisions?.save?.fullName ? { name: decisions.save.fullName } : null
    },
    homeRuns: Array.from(homeRunsByHitter.values()),
    rbis: Array.from(rbisByHitter.values())
  };

  const hasDecision = details.decisions.winner || details.decisions.loser || details.decisions.save;
  return (hasDecision || details.homeRuns.length > 0 || details.rbis.length > 0) ? details : null;
}

function extractMlbFinalDetailsFromEspnSummary(summary) {
  const playerGroups = Array.isArray(summary?.boxscore?.players) ? summary.boxscore.players : [];
  const decisions = {
    winner: null,
    loser: null,
    save: null
  };

  playerGroups.forEach((group) => {
    const pitchingStats = (Array.isArray(group?.statistics) ? group.statistics : []).find((statGroup) => (
      String(statGroup?.type || statGroup?.name || '').toLowerCase() === 'pitching'
    ));
    const athletes = Array.isArray(pitchingStats?.athletes) ? pitchingStats.athletes : [];

    athletes.forEach((entry) => {
      const name = entry?.athlete?.displayName || entry?.athlete?.fullName || entry?.athlete?.shortName || '';
      if (!name) {
        return;
      }

      const decisionText = (Array.isArray(entry?.notes) ? entry.notes : [])
        .map((note) => String(note?.text || '').trim())
        .find((text) => /^[WLS]\b/i.test(text));

      if (!decisionText) {
        return;
      }

      if (/^W\b/i.test(decisionText) && !decisions.winner) {
        decisions.winner = { name };
        return;
      }

      if (/^L\b/i.test(decisionText) && !decisions.loser) {
        decisions.loser = { name };
        return;
      }

      if (/^S\b/i.test(decisionText) && !decisions.save) {
        decisions.save = { name };
      }
    });
  });

  const hasDecision = decisions.winner || decisions.loser || decisions.save;
  return hasDecision ? {
    gamePk: null,
    decisions,
    homeRuns: [],
    rbis: []
  } : null;
}

function mergeMlbFinalDetails(primaryDetails = null, secondaryDetails = null) {
  if (!primaryDetails && !secondaryDetails) {
    return null;
  }

  const merged = {
    gamePk: primaryDetails?.gamePk || secondaryDetails?.gamePk || null,
    decisions: {
      winner: primaryDetails?.decisions?.winner || secondaryDetails?.decisions?.winner || null,
      loser: primaryDetails?.decisions?.loser || secondaryDetails?.decisions?.loser || null,
      save: primaryDetails?.decisions?.save || secondaryDetails?.decisions?.save || null
    },
    homeRuns: Array.isArray(primaryDetails?.homeRuns) && primaryDetails.homeRuns.length > 0
      ? primaryDetails.homeRuns
      : (Array.isArray(secondaryDetails?.homeRuns) ? secondaryDetails.homeRuns : []),
    rbis: Array.isArray(primaryDetails?.rbis) && primaryDetails.rbis.length > 0
      ? primaryDetails.rbis
      : (Array.isArray(secondaryDetails?.rbis) ? secondaryDetails.rbis : [])
  };

  const hasDecision = merged.decisions.winner || merged.decisions.loser || merged.decisions.save;
  return (hasDecision || merged.homeRuns.length > 0 || merged.rbis.length > 0) ? merged : null;
}

async function fetchEspnMlbSummaryDetails(eventId) {
  if (!eventId) {
    return null;
  }

  const cacheKey = `espn:${eventId}`;
  const cached = mlbFinalDetailsCache.get(cacheKey);
  if (cached && (Date.now() - cached.fetchedAt) < MLB_FINAL_DETAILS_CACHE_TTL_MS) {
    return cached.details;
  }

  const response = await fetch(`https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/summary?event=${encodeURIComponent(eventId)}`, {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  const summary = await response.json();
  const details = extractMlbFinalDetailsFromEspnSummary(summary);

  if (details) {
    mlbFinalDetailsCache.set(cacheKey, {
      details,
      fetchedAt: Date.now()
    });
  }

  return details;
}

async function fetchMlbFinalDetails(gamePk, officialDate, teamContext = null) {
  const cacheKey = `${officialDate || 'unknown'}:${gamePk}`;
  const cached = mlbFinalDetailsCache.get(cacheKey);
  if (cached && (Date.now() - cached.fetchedAt) < MLB_FINAL_DETAILS_CACHE_TTL_MS) {
    return cached.details;
  }

  const response = await fetch(`https://statsapi.mlb.com/api/v1.1/game/${gamePk}/feed/live`, {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  const feed = await response.json();
  const details = extractMlbFinalDetailsFromLiveFeed(feed, teamContext, gamePk);

  if (details) {
    mlbFinalDetailsCache.set(cacheKey, {
      details,
      fetchedAt: Date.now()
    });
  }

  return details;
}

async function enrichMlbEvents(events = [], referenceDate = new Date()) {
  if (!Array.isArray(events) || events.length === 0) {
    return events;
  }

  let scheduleGames = [];
  let officialDate = getMlbStatsOfficialDate(referenceDate);

  try {
    const statsDate = getMlbStatsScheduleDate(referenceDate);
    const scheduleResponse = await fetch(`https://statsapi.mlb.com/api/v1/schedule?sportId=1&date=${encodeURIComponent(statsDate)}`, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const scheduleData = await scheduleResponse.json();
    scheduleGames = Array.isArray(scheduleData?.dates)
      ? scheduleData.dates.flatMap((dateEntry) => Array.isArray(dateEntry?.games) ? dateEntry.games : [])
      : [];
  } catch (error) {
    console.log(`[MLB] schedule enrich failed - ${error.message}`);
  }

  const mappedEvents = events.map((event) => ({
    event,
    teamContext: getEspnGameTeams(event),
    scheduleGame: findMatchingMlbScheduleGame(event, scheduleGames)
  }));

  mappedEvents.forEach(({ event, scheduleGame }) => {
    if (scheduleGame?.gamePk) {
      event.mlbGamePk = String(scheduleGame.gamePk);
      event.mlbTvUrl = getMlbTvUrl(scheduleGame.gamePk);
    }
  });

  const finalEvents = mappedEvents.filter(({ event }) => String(event?.status?.type?.state || '') === 'post');

  await Promise.all(finalEvents.map(async ({ event, scheduleGame, teamContext }) => {
    try {
      const espnDetails = await fetchEspnMlbSummaryDetails(event?.id);
      const statsDetails = scheduleGame?.gamePk
        ? await fetchMlbFinalDetails(scheduleGame.gamePk, scheduleGame.officialDate || officialDate, teamContext)
        : null;
      const details = mergeMlbFinalDetails(espnDetails, statsDetails);

      if (details) {
        event.baseballFinalDetails = details;
      }
    } catch (error) {
      console.log(`[MLB] final game enrich failed for ${event?.shortName || event?.name || 'game'} - ${error.message}`);
    }
  }));

  return events;
}

app.get('/airports', async (req, res) => {
  try {
    const response = await fetch('https://nasstatus.faa.gov/api/airport-events');
    const airportData = await response.json();
    res.json(airportData);
    console.log("Client requested airport data.")
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch airport data' });
  }
})

app.get('/sports', async (req, res) => {
  const parsedOffset = Number.parseInt(String(req.query.dateOffset || '0'), 10);
  const dateOffset = Number.isFinite(parsedOffset) ? parsedOffset : 0;
  const scoreboardDate = getEasternScoreboardDate(dateOffset);
  const referenceDate = getEasternReferenceDate(dateOffset);
  const requestedLeagueNames = new Set(
    String(req.query.leagues || '')
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean)
  );
  const rawMode = ['1', 'true', 'yes'].includes(String(req.query.raw || '').trim().toLowerCase());
  const allLeagues = [
    { name: 'NFL',   url: `https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?dates=${scoreboardDate}` },
    { name: 'NBA',   url: `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard?dates=${scoreboardDate}` },
    { name: 'MLB',   url: `https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard?dates=${scoreboardDate}` },
    { name: 'College Baseball', url: `https://site.api.espn.com/apis/site/v2/sports/baseball/college-baseball/scoreboard?dates=${scoreboardDate}` },
    { name: 'NHL',   url: `https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/scoreboard?dates=${scoreboardDate}` },
    { name: 'EPL',       url: `https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard?dates=${scoreboardDate}` },
    { name: 'La Liga',   url: `https://site.api.espn.com/apis/site/v2/sports/soccer/esp.1/scoreboard?dates=${scoreboardDate}` },
    { name: 'Bundesliga',url: `https://site.api.espn.com/apis/site/v2/sports/soccer/ger.1/scoreboard?dates=${scoreboardDate}` },
    { name: 'Serie A',   url: `https://site.api.espn.com/apis/site/v2/sports/soccer/ita.1/scoreboard?dates=${scoreboardDate}` },
    { name: 'Ligue 1',   url: `https://site.api.espn.com/apis/site/v2/sports/soccer/fra.1/scoreboard?dates=${scoreboardDate}` },
    { name: 'UEFA CL',   url: `https://site.api.espn.com/apis/site/v2/sports/soccer/UEFA.CHAMPIONS/scoreboard?dates=${scoreboardDate}` },
    { name: 'World Cup', url: `https://site.api.espn.com/apis/site/v2/sports/soccer/FIFA.WORLD/scoreboard?dates=${scoreboardDate}` },
    { name: 'UEFA EL',   url: `https://site.api.espn.com/apis/site/v2/sports/soccer/UEFA.EUROPA/scoreboard?dates=${scoreboardDate}` },
    { name: 'UEFA Conference League', url: `https://site.api.espn.com/apis/site/v2/sports/soccer/UEFA.EUROPA.CONF/scoreboard?dates=${scoreboardDate}` },
    { name: 'Concacaf Champions Cup', url: `https://site.api.espn.com/apis/site/v2/sports/soccer/concacaf.champions/scoreboard?dates=${scoreboardDate}` },
    { name: 'FA Cup',    url: `https://site.api.espn.com/apis/site/v2/sports/soccer/eng.fa/scoreboard?dates=${scoreboardDate}` },
    { name: 'MLS',       url: `https://site.api.espn.com/apis/site/v2/sports/soccer/usa.1/scoreboard?dates=${scoreboardDate}` },
    { name: 'NWSL',      url: `https://site.api.espn.com/apis/site/v2/sports/soccer/usa.nwsl/scoreboard?dates=${scoreboardDate}` },
    { name: 'USL',       url: `https://site.api.espn.com/apis/site/v2/sports/soccer/USA.USL.1/scoreboard?dates=${scoreboardDate}` },
    { name: 'USL Super League', url: `https://site.api.espn.com/apis/site/v2/sports/soccer/usa.w.usl.1/scoreboard?dates=${scoreboardDate}` },
    { name: 'NCAAB', url: `https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard?dates=${scoreboardDate}`, top25Only: true, rankingsUrl: 'https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/rankings' },
    { name: 'NCAAW', url: `https://site.api.espn.com/apis/site/v2/sports/basketball/womens-college-basketball/scoreboard?dates=${scoreboardDate}`, top25Only: true, rankingsUrl: 'https://site.api.espn.com/apis/site/v2/sports/basketball/womens-college-basketball/rankings' },
    { name: 'College Softball', url: `https://site.api.espn.com/apis/site/v2/sports/softball/college-softball/scoreboard?dates=${scoreboardDate}` },
    { name: 'WNBA',  url: `https://site.api.espn.com/apis/site/v2/sports/basketball/wnba/scoreboard?dates=${scoreboardDate}` },
    { name: 'PWHL',  url: `https://site.api.espn.com/apis/site/v2/sports/hockey/pwhl/scoreboard?dates=${scoreboardDate}` },
    { name: 'WBC',   url: `https://site.api.espn.com/apis/site/v2/sports/baseball/wbc/scoreboard?dates=${scoreboardDate}` },
  ];
  const leagues = requestedLeagueNames.size > 0
    ? allLeagues.filter((league) => requestedLeagueNames.has(league.name))
    : allLeagues;
  const results = [];
  for (const league of leagues) {
    try {
      const payload = await fetchLeagueScoreboardData(league, scoreboardDate, {
        applyDisplayFilters: !rawMode,
        referenceDate
      });
      results.push({
        league: league.name,
        logo: payload.logo,
        seasonType: payload.seasonType,
        events: payload.events
      });
    } catch (err) {
      console.log(`${league.name}: fetch failed - ${err.message}`);
      results.push({ league: league.name, events: [] });
    }
  }
  res.json(results);
})

app.get('/standings', async (req, res) => {
  const league = String(req.query.league || '').trim();
  const url = STANDINGS_URLS[league];

  if (!url) {
    res.status(404).json({ error: `No standings feed configured for ${league || 'that league'}` });
    return;
  }

  try {
    const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch standings data' });
  }
});

app.get('/team-schedule', async (req, res) => {
  const league = String(req.query.league || '').trim();
  const teamId = String(req.query.teamId || '').trim();
  const leagueSlug = TEAM_SCHEDULE_LEAGUE_SLUGS[league];

  if (!leagueSlug || !teamId) {
    res.status(400).json({ error: 'Missing or unsupported league/teamId' });
    return;
  }

  try {
    const response = await fetch(`https://site.api.espn.com/apis/site/v2/sports/soccer/${leagueSlug}/teams/${encodeURIComponent(teamId)}/schedule`, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch team schedule' });
  }
});

app.get('/team-news', async (req, res) => {
  const team = String(req.query.team || '').trim();
  const locality = String(req.query.locality || '').trim();

  if (!team) {
    res.status(400).json({ error: 'Missing team query parameter' });
    return;
  }

  const feeds = [
    {
      id: 'national',
      name: `${team} Headlines`,
      url: buildGoogleNewsSearchUrl(`${team} sports`)
    }
  ];

  if (locality) {
    feeds.unshift({
      id: 'local',
      name: `${locality} ${team} Headlines`,
      url: buildGoogleNewsSearchUrl(`${locality} ${team} sports`)
    });
  }

  const results = {};
  for (const feed of feeds) {
    try {
      const response = await fetch(feed.url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      const xml = await response.text();
      results[feed.id] = { name: feed.name, items: parseRSSItems(xml, 6) };
    } catch (e) {
      results[feed.id] = { name: feed.name, items: [] };
    }
  }

  res.json(results);
});

app.get('/bracket', async (req, res) => {
  const league = String(req.query.league || '').trim();
  const season = Number(req.query.season || getCurrentBracketSeason());
  const config = BRACKET_PAGE_CONFIG[league];

  if (!config) {
    res.status(404).json({ error: `No bracket feed configured for ${league || 'that league'}` });
    return;
  }

  try {
    const response = await fetch(config.url(season), { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const html = await response.text();
    const parsed = parseBracketPage(html, league, season);

    if (!parsed.regions.length && !parsed.firstFour.length && !parsed.finalFour.length && !parsed.championship.length) {
      res.status(502).json({ error: 'Bracket data was unavailable from upstream source' });
      return;
    }

    res.json(parsed);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bracket data' });
  }
});

// ─── RSS helpers ────────────────────────────────────────────────────────────

function buildGoogleNewsSearchUrl(query) {
  return `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`;
}

function extractRSSTag(xml, tag) {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
  const m = xml.match(re);
  return m ? m[1].trim().replace(/^<!\[CDATA\[/, '').replace(/\]\]>$/, '').trim() : '';
}

function decodeBasicEntities(str = '') {
  return String(str)
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/gi, "'")
    .replace(/&#(\d+);/g, (match, code) => {
      const value = Number.parseInt(code, 10);
      if (!Number.isFinite(value) || value < 0 || value > 0x10FFFF) {
        return match;
      }

      try {
        return String.fromCodePoint(value);
      } catch (_) {
        return match;
      }
    })
    .replace(/&#x([0-9a-f]+);/gi, (match, code) => {
      const value = Number.parseInt(code, 16);
      if (!Number.isFinite(value) || value < 0 || value > 0x10FFFF) {
        return match;
      }

      try {
        return String.fromCodePoint(value);
      } catch (_) {
        return match;
      }
    })
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function extractTagAttribute(xml, tag, attr) {
  const re = new RegExp(`<${tag}[^>]*\\s${attr}=(["'])(.*?)\\1[^>]*>`, 'i');
  const m = xml.match(re);
  return m ? decodeBasicEntities(m[2].trim()) : '';
}

function stripHtml(html = '') {
  return decodeBasicEntities(String(html).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
}

function extractFirstImageUrl(rawItem, descriptionHtml = '') {
  const candidates = [
    extractTagAttribute(rawItem, 'media:content', 'url'),
    extractTagAttribute(rawItem, 'media:thumbnail', 'url'),
    extractTagAttribute(rawItem, 'enclosure', 'url'),
    extractTagAttribute(rawItem, 'img', 'src'),
    extractTagAttribute(descriptionHtml, 'img', 'src'),
  ].filter(Boolean);

  const match = candidates.find((candidate) => /^https?:\/\//i.test(candidate));
  return match || '';
}

function parseRSSItems(xml, max = 8) {
  const items = [];
  const re = /<item[^>]*>([\s\S]*?)<\/item>/g;
  let m;
  while ((m = re.exec(xml)) !== null && items.length < max) {
    const raw = m[1];
    const descriptionHtml = extractRSSTag(raw, 'description');
    const source = decodeBasicEntities(extractRSSTag(raw, 'source') || extractRSSTag(raw, 'dc:creator') || '');
    items.push({
      title: decodeBasicEntities(extractRSSTag(raw, 'title')),
      description: stripHtml(descriptionHtml).slice(0, 200),
      pubDate: decodeBasicEntities(extractRSSTag(raw, 'pubDate')),
      source,
      sourceUrl: extractTagAttribute(raw, 'source', 'url'),
      link: decodeBasicEntities(extractRSSTag(raw, 'link')),
      imageUrl: extractFirstImageUrl(raw, descriptionHtml),
    });
  }
  return items;
}

// ─── /news ──────────────────────────────────────────────────────────────────

app.get('/news', async (req, res) => {
  const city = (req.query.city || '').trim();

  const feeds = [
    { id: 'national',   name: 'National Headlines', url: 'https://feeds.npr.org/1001/rss.xml' },
    { id: 'us',         name: 'U.S. News',          url: 'https://feeds.npr.org/1003/rss.xml' },
    { id: 'science',    name: 'Science',             url: 'https://feeds.npr.org/1007/rss.xml' },
    { id: 'technology', name: 'Technology',          url: 'https://feeds.npr.org/1019/rss.xml' },
    { id: 'world',      name: 'World News',          url: 'https://feeds.npr.org/1004/rss.xml' },
    { id: 'politics',   name: 'Politics',            url: 'https://feeds.npr.org/1014/rss.xml' },
    { id: 'business',   name: 'Business',            url: 'https://feeds.npr.org/1006/rss.xml' },
  ];

  if (city) {
    feeds.push({
      id: 'local',
      name: `${city} Local News`,
      url: `https://news.google.com/rss/search?q=${encodeURIComponent(city + ' local news')}&hl=en-US&gl=US&ceid=US:en`,
    });
  }

  const results = {};
  for (const feed of feeds) {
    try {
      const response = await fetch(feed.url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      const xml = await response.text();
      results[feed.id] = { name: feed.name, items: parseRSSItems(xml, 8) };
    } catch (e) {
      results[feed.id] = { name: feed.name, items: [] };
    }
  }

  res.json(results);
})
