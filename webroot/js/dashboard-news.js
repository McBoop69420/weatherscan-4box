// Dashboard News Panel - Cycling through local and national news slides

var newsCycler = null;
var newsData = null; // Cached fetch from /news

// Source logos via Google's favicon service
const NEWS_SOURCE_LOGOS = {
  national: 'https://www.google.com/s2/favicons?domain=npr.org&sz=64',
  us: 'https://www.google.com/s2/favicons?domain=npr.org&sz=64',
  world: 'https://www.google.com/s2/favicons?domain=npr.org&sz=64',
  politics: 'https://www.google.com/s2/favicons?domain=npr.org&sz=64',
  business: 'https://www.google.com/s2/favicons?domain=npr.org&sz=64',
  science: 'https://www.google.com/s2/favicons?domain=npr.org&sz=64',
  technology: 'https://www.google.com/s2/favicons?domain=npr.org&sz=64',
  local: 'https://www.google.com/s2/favicons?domain=news.google.com&sz=64',
  alerts: 'https://www.google.com/s2/favicons?domain=weather.gov&sz=64',
  sports: 'https://www.google.com/s2/favicons?domain=espn.com&sz=64',
};

async function initNewsCycler() {
  await fetchNewsData();

  const slideDefinitions = [
    {
      name: 'National Headlines',
      renderFn: () => renderNewsCategorySlide('national'),
      hasDataFn: () => hasNewsItems('national')
    },
    {
      name: 'U.S. News',
      renderFn: () => renderNewsCategorySlide('us'),
      hasDataFn: () => hasNewsItems('us')
    },
    {
      name: 'World News',
      renderFn: () => renderNewsCategorySlide('world'),
      hasDataFn: () => hasNewsItems('world')
    },
    {
      name: 'Politics',
      renderFn: () => renderNewsCategorySlide('politics'),
      hasDataFn: () => hasNewsItems('politics')
    },
    {
      name: 'Business',
      renderFn: () => renderNewsCategorySlide('business'),
      hasDataFn: () => hasNewsItems('business')
    },
    {
      name: 'Science & Technology',
      renderFn: renderSciTechSlide,
      hasDataFn: () => hasNewsItems('science') || hasNewsItems('technology')
    },
    {
      name: 'Local News',
      renderFn: () => renderNewsCategorySlide('local'),
      hasDataFn: () => hasNewsItems('local')
    },
    {
      name: 'Weather Alerts',
      renderFn: renderWeatherAlertsSlide,
      hasDataFn: () => weatherData?.alerts?.warnings?.length > 0
    },
  ];

  const activeSlides = filterSlidesByData(slideDefinitions);

  if (activeSlides.length === 0) {
    activeSlides.push(createPlaceholderSlide('Loading news...', '.news-feed'));
  }

  const cycleTime = dashboardSettings?.newsCycleTime || 12000;

  newsCycler = new PanelCycler('.panel-news', activeSlides, cycleTime, {
    transitionSpeed: dashboardSettings?.transitionSpeed || 500,
    debug: false
  });

  newsCycler.start();
}

async function fetchNewsData() {
  try {
    const city = locationConfig?.mainCity?.displayname || '';
    const url = '/news' + (city ? `?city=${encodeURIComponent(city)}` : '');
    newsData = await new Promise((resolve, reject) => {
      $.getJSON(url).done(resolve).fail(reject);
    });
  } catch (e) {
    console.warn('[News] Fetch failed:', e);
    newsData = {};
  }
}

function hasNewsItems(categoryId) {
  return !!(newsData && newsData[categoryId] && newsData[categoryId].items && newsData[categoryId].items.length > 0);
}

function renderNewsCategorySlide(categoryId) {
  const category = newsData?.[categoryId];
  if (!category || !category.items || category.items.length === 0) {
    renderNewsPlaceholder('No headlines available');
    return;
  }

  updateNewsHeader(category.name.toUpperCase());
  renderHeadlineList(category.items, 'NPR News', false, NEWS_SOURCE_LOGOS[categoryId]);
}

function renderSciTechSlide() {
  const sciItems = newsData?.science?.items || [];
  const techItems = newsData?.technology?.items || [];

  const combined = [];
  const max = 4;
  let s = 0;
  let t = 0;

  while (combined.length < max && (s < sciItems.length || t < techItems.length)) {
    if (s < sciItems.length) combined.push({ ...sciItems[s++], _cat: 'SCIENCE' });
    if (combined.length < max && t < techItems.length) combined.push({ ...techItems[t++], _cat: 'TECH' });
  }

  updateNewsHeader('SCIENCE & TECHNOLOGY');
  renderHeadlineList(combined, null, true, NEWS_SOURCE_LOGOS.science);
}

function renderWeatherAlertsSlide() {
  const alerts = weatherData?.alerts?.warnings;
  if (!alerts || alerts.length === 0) {
    renderNewsPlaceholder('No active weather alerts');
    return;
  }

  updateNewsHeader('WEATHER ALERTS');

  const items = alerts.slice(0, 5).map((alert) => ({
    title: alert.warningtitle || alert.headline || 'Weather Alert',
    description: alert.warningdesc || '',
    pubDate: '',
    _severity: alert.severity,
  }));

  const logoHtml = `<img class="news-source-logo" src="${NEWS_SOURCE_LOGOS.alerts}" alt="" onerror="this.style.display='none'">`;

  const html = items.map((item) => {
    const color = getSeverityColor(item._severity);
    return `
      <div class="news-headline" style="border-left-color: ${color};">
        <div class="news-headline-content">
          <div class="news-headline-meta" style="color: ${color};">${escapeHtml(item._severity || 'ALERT')} | National Weather Service</div>
          <div class="news-headline-title">${escapeHtml(item.title)}</div>
        </div>
        ${logoHtml}
      </div>
    `;
  }).join('');

  $('.news-feed').html(`<div class="news-headlines-list">${html}</div>`);
}

function renderSportsScoresSlide() {
  if (!sportsRawData || sportsRawData.length === 0) {
    renderNewsPlaceholder('No sports data available');
    return;
  }

  updateNewsHeader('SPORTS SCORES');

  const items = [];
  for (const league of sportsRawData) {
    if (!league.events) continue;
    for (const event of league.events) {
      if (items.length >= 6) break;
      const state = event.status?.type?.state || '';
      if (state !== 'in' && state !== 'post') continue;

      const comp = event.competitions?.[0];
      const home = comp?.competitors?.find((competitor) => competitor.homeAway === 'home');
      const away = comp?.competitors?.find((competitor) => competitor.homeAway === 'away');
      if (!home || !away) continue;

      const isLive = state === 'in';
      const detail = event.status?.type?.shortDetail || (isLive ? 'In Progress' : 'Final');
      items.push({
        title: `${away.team?.shortDisplayName || ''} ${away.score} - ${home.score} ${home.team?.shortDisplayName || ''}`,
        _meta: `${league.league} | ${detail}`,
        _live: isLive,
      });
    }
    if (items.length >= 6) break;
  }

  if (items.length === 0) {
    renderNewsPlaceholder('No completed or live games');
    return;
  }

  const logoHtml = `<img class="news-source-logo" src="${NEWS_SOURCE_LOGOS.sports}" alt="" onerror="this.style.display='none'">`;

  const html = items.map((item) => `
    <div class="news-headline ${item._live ? 'news-headline--live' : ''}">
      <div class="news-headline-content">
        <div class="news-headline-meta">
          ${item._live ? '<span class="sports-live-dot"></span>' : ''}${escapeHtml(item._meta)}
        </div>
        <div class="news-headline-title">${escapeHtml(item.title)}</div>
      </div>
      ${logoHtml}
    </div>
  `).join('');

  $('.news-feed').html(`<div class="news-headlines-list">${html}</div>`);
}

function renderHeadlineList(items, defaultSource, showCat = false, fallbackLogoUrl = '') {
  const shown = items.slice(0, 4);

  const html = shown.map((item) => {
    const kicker = [showCat ? item._cat : null, item.source || defaultSource]
      .filter(Boolean)
      .join(' | ');
    const timeText = item.pubDate ? formatNewsTime(item.pubDate) : 'LATEST';
    const storyLogoUrl = getStoryLogoUrl(item, fallbackLogoUrl);
    const photoUrl = getStoryPhotoUrl(item);

    return `
      <article class="news-story-card${photoUrl ? '' : ' news-story-card--no-photo'}">
        <div class="news-story-photo-wrap">
          ${photoUrl
            ? `<img class="news-story-photo" src="${photoUrl}" alt="" loading="lazy" onerror="this.closest('.news-story-card').classList.add('news-story-card--no-photo'); this.remove();">`
            : '<div class="news-story-photo news-story-photo--fallback"></div>'}
        </div>
        <div class="news-story-body">
          <div class="news-story-kicker">${escapeHtml(kicker || 'TOP STORY')}</div>
          <div class="news-story-title">${escapeHtml(item.title || 'Untitled story')}</div>
          <div class="news-story-footer">
            <div class="news-story-logo-wrap">
              ${storyLogoUrl ? `<img class="news-source-logo" src="${storyLogoUrl}" alt="" onerror="this.style.display='none'">` : ''}
            </div>
            <div class="news-story-time">${escapeHtml(timeText)}</div>
          </div>
        </div>
      </article>
    `;
  }).join('');

  $('.news-feed').html(`<div class="news-story-grid">${html}</div>`);
}

function updateNewsHeader(label) {
  $('.panel-news .panel-header').text(label);
}

function renderNewsPlaceholder(msg) {
  $('.news-feed').html(`<div class="news-placeholder">${escapeHtml(msg)}</div>`);
}

function formatNewsTime(pubDateStr) {
  try {
    const d = new Date(pubDateStr);
    if (isNaN(d)) return '';
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  } catch (_) {
    return '';
  }
}

function getSeverityColor(severity) {
  const map = { Extreme: '#8b0000', Severe: '#ff3333', Moderate: '#ff8c00', Minor: '#e6cc00' };
  return map[severity] || '#e74c3c';
}

function getStoryPhotoUrl(item) {
  return item?.imageUrl || '';
}

function getStoryLogoUrl(item, fallbackLogoUrl = '') {
  const domain = getStoryDomain(item);
  if (!domain) return fallbackLogoUrl;
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=64`;
}

function getStoryDomain(item) {
  const candidates = [item?.sourceUrl, item?.link];
  for (const candidate of candidates) {
    if (!candidate) continue;
    try {
      return new URL(candidate).hostname.replace(/^www\./i, '');
    } catch (_) {
      // Ignore malformed feed URLs and try the next candidate.
    }
  }
  return '';
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

async function refreshNewsPanel() {
  await fetchNewsData();
  if (newsCycler && newsCycler.isRunning) {
    newsCycler.refreshCurrentSlide();
  }
}
