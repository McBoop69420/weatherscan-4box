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
  'Concacaf Champions Cup': 'concacaf.champions',
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

function getCurrentBracketSeason() {
  const now = new Date();
  return now.getFullYear();
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
  return BRACKET_REGIONS.has(String(line || '').trim().toUpperCase());
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

function parseBracketPage(html = '', league = 'NCAAB', season = getCurrentBracketSeason()) {
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
  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' }).replace(/-/g, '');
  const leagues = [
    { name: 'NFL',   url: `https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?dates=${today}` },
    { name: 'NBA',   url: `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard?dates=${today}` },
    { name: 'MLB',   url: `https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard?dates=${today}` },
    { name: 'College Baseball', url: `https://site.api.espn.com/apis/site/v2/sports/baseball/college-baseball/scoreboard?dates=${today}` },
    { name: 'NHL',   url: `https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/scoreboard?dates=${today}` },
    { name: 'EPL',       url: `https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard?dates=${today}` },
    { name: 'La Liga',   url: `https://site.api.espn.com/apis/site/v2/sports/soccer/esp.1/scoreboard?dates=${today}` },
    { name: 'Bundesliga',url: `https://site.api.espn.com/apis/site/v2/sports/soccer/ger.1/scoreboard?dates=${today}` },
    { name: 'Serie A',   url: `https://site.api.espn.com/apis/site/v2/sports/soccer/ita.1/scoreboard?dates=${today}` },
    { name: 'Ligue 1',   url: `https://site.api.espn.com/apis/site/v2/sports/soccer/fra.1/scoreboard?dates=${today}` },
    { name: 'UEFA CL',   url: `https://site.api.espn.com/apis/site/v2/sports/soccer/UEFA.CHAMPIONS/scoreboard?dates=${today}` },
    { name: 'World Cup', url: `https://site.api.espn.com/apis/site/v2/sports/soccer/FIFA.WORLD/scoreboard?dates=${today}` },
    { name: 'UEFA EL',   url: `https://site.api.espn.com/apis/site/v2/sports/soccer/UEFA.EUROPA/scoreboard?dates=${today}` },
    { name: 'Concacaf Champions Cup', url: `https://site.api.espn.com/apis/site/v2/sports/soccer/concacaf.champions/scoreboard?dates=${today}` },
    { name: 'MLS',       url: `https://site.api.espn.com/apis/site/v2/sports/soccer/usa.1/scoreboard?dates=${today}` },
    { name: 'NWSL',      url: `https://site.api.espn.com/apis/site/v2/sports/soccer/usa.nwsl/scoreboard?dates=${today}` },
    { name: 'USL',       url: `https://site.api.espn.com/apis/site/v2/sports/soccer/USA.USL.1/scoreboard?dates=${today}` },
    { name: 'USL Super League', url: `https://site.api.espn.com/apis/site/v2/sports/soccer/usa.w.usl.1/scoreboard?dates=${today}` },
    { name: 'NCAAB', url: `https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard?dates=${today}`, top25Only: true, rankingsUrl: 'https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/rankings' },
    { name: 'NCAAW', url: `https://site.api.espn.com/apis/site/v2/sports/basketball/womens-college-basketball/scoreboard?dates=${today}`, top25Only: true, rankingsUrl: 'https://site.api.espn.com/apis/site/v2/sports/basketball/womens-college-basketball/rankings' },
    { name: 'College Softball', url: `https://site.api.espn.com/apis/site/v2/sports/softball/college-softball/scoreboard?dates=${today}` },
    { name: 'WNBA',  url: `https://site.api.espn.com/apis/site/v2/sports/basketball/wnba/scoreboard?dates=${today}` },
    { name: 'PWHL',  url: `https://site.api.espn.com/apis/site/v2/sports/hockey/pwhl/scoreboard?dates=${today}` },
    { name: 'WBC',   url: `https://site.api.espn.com/apis/site/v2/sports/baseball/wbc/scoreboard?dates=${today}` },
  ];
  const results = [];
  for (const league of leagues) {
    try {
      const response = await fetch(league.url);
      const data = await response.json();
      const logo = data.leagues && data.leagues[0] && data.leagues[0].logos && data.leagues[0].logos[0] ? data.leagues[0].logos[0].href : null;
      let events = data.events || [];
      const total = events.length;
      if (league.top25Only && league.rankingsUrl) {
        const hasMarchMadnessSlate = events.some((event) => isMarchMadnessEvent(league.name, event));
        let top25Ids = new Set();
        try {
          const rankRes = await fetch(league.rankingsUrl);
          const rankData = await rankRes.json();
          const poll = rankData.rankings && rankData.rankings[0];
          if (poll && poll.ranks) {
            poll.ranks.slice(0, 25).forEach(r => {
              if (r.team && r.team.id) top25Ids.add(String(r.team.id));
            });
          }
        } catch (e) {
          console.log(`${league.name}: rankings fetch failed, including all games`);
        }
        if (hasMarchMadnessSlate) {
          console.log(`${league.name}: ${total} total, full tournament slate included`);
        } else if (top25Ids.size > 0) {
          events = events.filter(event => {
            const comp = event.competitions && event.competitions[0];
            if (!comp) return false;
            return comp.competitors.some(c => c.team && top25Ids.has(String(c.team.id)))
              || isMarchMadnessEvent(league.name, event);
          });
          }
        if (!hasMarchMadnessSlate) {
          console.log(`${league.name}: ${total} total, ${events.length} with top-25 team or March Madness berth`);
        }
      } else {
        console.log(`${league.name}: ${total} event(s)`);
      }
      results.push({
        league: league.name,
        logo,
        seasonType: data.leagues && data.leagues[0] && data.leagues[0].season ? data.leagues[0].season.type || null : null,
        events
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
    .replace(/&#39;/g, "'")
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
    const source = extractRSSTag(raw, 'source') || extractRSSTag(raw, 'dc:creator') || '';
    items.push({
      title: extractRSSTag(raw, 'title'),
      description: stripHtml(descriptionHtml).slice(0, 200),
      pubDate: extractRSSTag(raw, 'pubDate'),
      source,
      sourceUrl: extractTagAttribute(raw, 'source', 'url'),
      link: extractRSSTag(raw, 'link'),
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
