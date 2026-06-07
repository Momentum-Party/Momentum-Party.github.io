/**
 * Homepage impact stats — edit values here (no API).
 */
const IMPACT_STATS = [
  {
    label: 'สมาชิกพรรค',
    value: 33,
    unit: 'คน',
    icon: 'image/icons and logos/group-users.png',
    href: 'members.html',
  },
  {
    label: 'นโยบาย',
    value: 12,
    unit: 'นโยบาย',
    icon: 'policy',
    href: 'policy.html',
  },
  {
    label: 'ผู้ติดตาม Tiktok',
    value: 160,
    unit: 'คน',
    icon: 'image/icons and logos/tik-tok.png',
    href: 'https://www.tiktok.com/@momentum03.skw',
    external: true,
  },
  {
    label: 'ผู้ติดตาม IG',
    value: 321,
    unit: 'คน',
    icon: 'image/icons and logos/instagram.png',
    href: 'https://www.instagram.com/mmt.skw',
    external: true,
  },
];

const COUNT_UP_MS = 1400;
const STAT_STAGGER_MS = 110;

const POLICY_ICON_SVG = `
  <svg class="impact-stat__svg" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M10 8h22l6 6v28a2 2 0 0 1-2 2H12a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2z" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M32 8v8h8M16 22h16M16 30h12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
  </svg>
`;

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function buildStatIcon(stat) {
  if (stat.icon === 'policy') return POLICY_ICON_SVG;
  return `<img class="impact-stat__img" src="${escapeHtml(stat.icon)}" alt="" width="40" height="40" loading="lazy">`;
}

function buildStatItem(stat, index) {
  const inner = `
    <p class="impact-stat__label">${escapeHtml(stat.label)}</p>
    <div class="impact-stat__icon">${buildStatIcon(stat)}</div>
    <p class="impact-stat__value" data-value="${escapeHtml(stat.value)}"><span class="impact-stat__count">0</span></p>
    <p class="impact-stat__unit">${escapeHtml(stat.unit)}</p>
  `;

  const body = stat.href
    ? `<a class="impact-stat impact-stat--link" href="${escapeHtml(stat.href)}"${stat.external ? ' target="_blank" rel="noopener noreferrer"' : ''}>${inner}</a>`
    : `<div class="impact-stat">${inner}</div>`;

  return `<li class="impact-stats__item" style="--stat-i: ${index}">${body}</li>`;
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function animateCount(el, target, duration = COUNT_UP_MS) {
  const start = performance.now();

  function frame(now) {
    const progress = Math.min((now - start) / duration, 1);
    const value = Math.round(target * easeOutCubic(progress));
    el.textContent = String(value);
    if (progress < 1) {
      requestAnimationFrame(frame);
    } else {
      el.textContent = String(target);
    }
  }

  requestAnimationFrame(frame);
}

function runCountUps(section) {
  section.querySelectorAll('.impact-stat__value').forEach((valueEl, i) => {
    const countEl = valueEl.querySelector('.impact-stat__count');
    const target = Number(valueEl.dataset.value);
    if (!countEl || Number.isNaN(target)) return;

    if (prefersReducedMotion()) {
      countEl.textContent = String(target);
      return;
    }

    window.setTimeout(() => animateCount(countEl, target), 280 + i * STAT_STAGGER_MS);
  });
}

function revealStats(section) {
  if (section.classList.contains('is-visible')) return;
  section.classList.add('is-visible');
  runCountUps(section);
}

function setupStatsAnimation(section) {
  if (prefersReducedMotion()) {
    revealStats(section);
    return;
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        revealStats(section);
        observer.disconnect();
      });
    },
    { threshold: 0.2, rootMargin: '0px 0px -40px 0px' }
  );

  observer.observe(section);
}

function initImpactStats() {
  const grid = document.getElementById('impact-stats-grid');
  const section = document.querySelector('.impact-stats');
  if (!grid || !section) return;

  grid.innerHTML = IMPACT_STATS.map(buildStatItem).join('');
  setupStatsAnimation(section);
}

document.addEventListener('DOMContentLoaded', initImpactStats);
