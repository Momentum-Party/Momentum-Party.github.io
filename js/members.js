const SHEETS_API_URL =
  'https://script.google.com/macros/s/AKfycbxZMiJoet8En7mcyltu9dneiItxolWd718a7wwOgDlEzUAAEmf3HYQZ910m9pII9urN/exec';

const REFRESH_INTERVAL_MS = 5 * 60 * 1000;

const DEPT_LABELS = {
  executive: 'เลขานุการ',
  academic: 'วิชาการ',
  finance: 'อำนวยการและงบประมาณ',
  media: 'กิจการนักเรียน',
  general: 'บริหารทั่วไป',
};

const DEPT_TABS = ['executive', 'academic', 'finance', 'media', 'general'];
const VP_DEPT_ORDER = ['academic', 'finance', 'media', 'general'];

let MEMBERS = [];
let activeDept = 'executive';
let lineDrawTimeout = null;
let refreshTimer = null;

/* ── Utilities ── */

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function fetchViaJsonp(url) {
  return new Promise((resolve, reject) => {
    const callbackName = `_momentumCb_${Date.now()}`;
    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error('API timed out. Redeploy Apps Script with "Anyone" access.'));
    }, 25000);

    function cleanup() {
      clearTimeout(timeout);
      delete window[callbackName];
      if (script.parentNode) script.remove();
    }

    window[callbackName] = data => {
      cleanup();
      resolve(data);
    };

    const script = document.createElement('script');
    const sep = url.includes('?') ? '&' : '?';
    script.src = `${url}${sep}callback=${callbackName}`;
    script.onerror = () => {
      cleanup();
      reject(new Error('JSONP load failed'));
    };
    document.head.appendChild(script);
  });
}

async function fetchViaHttp(url) {
  const response = await fetch(`${url}${url.includes('?') ? '&' : '?'}t=${Date.now()}`, {
    cache: 'no-store',
    redirect: 'follow',
    mode: 'cors',
  });

  if (!response.ok) {
    throw new Error(`API request failed (${response.status})`);
  }

  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    if (/<!doctype|signin|accounts\.google/i.test(text)) {
      throw new Error(
        'Apps Script is not public. Deploy → Web app → Who has access: Anyone, then use the new /exec URL.'
      );
    }
    throw new Error('API did not return valid JSON. Update Apps Script using google-apps-script.gs.');
  }
}

function explainFetchError(err, isFileProtocol) {
  const msg = err?.message || String(err);

  if (isFileProtocol) {
    return 'Opened as a local file (file://). Run the site on http://localhost — e.g. VS Code “Live Server” — then reload.';
  }
  if (msg.includes('Failed to fetch') || msg.includes('JSONP')) {
    return 'Cannot reach the API (CORS/network). Redeploy Apps Script with "Anyone" access and paste the code from google-apps-script.gs, then update SHEETS_API_URL.';
  }
  return msg;
}

async function fetchMembersFromAPI() {
  const isFileProtocol = window.location.protocol === 'file:';
  let data = null;
  let lastError = null;

  try {
    data = await fetchViaJsonp(SHEETS_API_URL);
  } catch (jsonpErr) {
    lastError = jsonpErr;
  }

  if (!data && !isFileProtocol) {
    try {
      data = await fetchViaHttp(SHEETS_API_URL);
    } catch (httpErr) {
      lastError = httpErr;
    }
  }

  if (!data) {
    throw new Error(explainFetchError(lastError, isFileProtocol));
  }

  const rows = Array.isArray(data) ? data : data.members || data.data || [];
  if (!Array.isArray(rows) || rows.length === 0) {
    throw new Error('No member rows in the sheet. Add headers in row 1 and members from row 2.');
  }
  return rows;
}

function normalizeKey(row, ...keys) {
  for (const key of keys) {
    if (row[key] != null && String(row[key]).trim() !== '') {
      return String(row[key]).trim();
    }
    const found = Object.keys(row).find(k => k.toLowerCase() === key.toLowerCase());
    if (found && String(row[found]).trim() !== '') {
      return String(row[found]).trim();
    }
  }
  return '';
}

function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^\w\u0E00-\u0E7F]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getInitials(name) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

/** Map spreadsheet department column → canonical department id */
function mapDepartmentField(deptField) {
  const text = (deptField || '').trim();
  if (!text) return null;

  if (/วิชาการ|academic/i.test(text)) return 'academic';
  if (/อำนวยการและงบประมาณ|อำนวยการ|งบประมาณ|การเงิน|finance/i.test(text)) return 'finance';
  if (/กิจการนักเรียน|กิจการนิสิต|student\s*affairs|ประชาสัมพันธ์|media|สื่อ/i.test(text)) {
    return 'media';
  }
  if (/บริหารทั่วไป|general/i.test(text)) return 'general';
  if (/เลขา|executive/i.test(text)) return 'executive';

  return null;
}

function inferDepartmentFromPosition(position) {
  const text = position || '';
  if (/วิชาการ|academic/i.test(text)) return 'academic';
  if (/อำนวยการและงบประมาณ|อำนวยการ|งบประมาณ|การเงิน|finance/i.test(text)) return 'finance';
  if (/กิจการนักเรียน|กิจการนิสิต|student\s*affairs|ประชาสัมพันธ์|media|สื่อ/i.test(text)) {
    return 'media';
  }
  if (/บริหารทั่วไป|general/i.test(text)) return 'general';
  return null;
}

function formatMotto(motto) {
  if (!motto) return '';
  const trimmed = motto.trim();
  if (!trimmed) return '';
  return trimmed.startsWith('"') ? trimmed : `"${trimmed}"`;
}

function formatInstagramUrl(igLink) {
  if (!igLink) return '';
  if (/^https?:\/\//i.test(igLink)) return igLink;
  const handle = igLink.replace(/^@/, '').replace(/^instagram\.com\//i, '');
  return `https://www.instagram.com/${handle}`;
}

/** Support direct URLs and common Google Drive share links in the photo column */
function normalizePhotoUrl(url) {
  if (!url) return '';
  const trimmed = url.trim();
  const fileMatch = trimmed.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (fileMatch) return `https://drive.google.com/uc?export=view&id=${fileMatch[1]}`;
  const openMatch = trimmed.match(/[?&]id=([^&]+)/);
  if (/drive\.google\.com/.test(trimmed) && openMatch) {
    return `https://drive.google.com/uc?export=view&id=${openMatch[1]}`;
  }
  return trimmed;
}

/**
 * Classify members from position keywords + department column.
 * ประธาน → President | รองประธาน → VP | เลขานุการ → Secretary | else → member by department
 */
function classifyMember(row, index) {
  const name = normalizeKey(row, 'name');
  const nickname = normalizeKey(row, 'nickname');
  const position = normalizeKey(row, 'position');
  const className = normalizeKey(row, 'class');
  const departmentField = normalizeKey(row, 'department');
  const experience = normalizeKey(row, 'experience');
  const igLink = normalizeKey(row, 'ig_link');
  const motto = normalizeKey(row, 'motto');
  const photo = normalizePhotoUrl(normalizeKey(row, 'photo'));

  if (!name) return null;

  const pos = position;
  let role = 'member';
  let department = mapDepartmentField(departmentField) || 'general';
  let leads = null;

  const isPresident = /ประธาน/.test(pos) && !/รองประธาน/.test(pos);
  const isVp = /รองประธาน/.test(pos);
  const isDeputySecretary = /รองเลขานุการ/.test(pos);
  const isSecretary = /เลขานุการ/.test(pos) && !isDeputySecretary;

  if (isPresident) {
    role = 'president';
    department = 'executive';
  } else if (isVp) {
    role = 'vp';
    department =
      mapDepartmentField(departmentField) ||
      inferDepartmentFromPosition(pos) ||
      'general';
    if (department === 'executive') department = 'general';
    leads = department;
  } else if (isDeputySecretary) {
    role = 'deputy-secretary';
    department = 'executive';
  } else if (isSecretary) {
    role = 'secretary';
    department = 'executive';
  } else {
    role = 'member';
    department =
      mapDepartmentField(departmentField) ||
      inferDepartmentFromPosition(pos) ||
      'general';
    if (department === 'executive') department = 'general';
  }

  const baseId = slugify(name) || `member-${index}`;
  const social = {};
  if (igLink) social.instagram = formatInstagramUrl(igLink);

  return {
    id: baseId,
    name,
    nickname,
    class: className,
    position: position || 'Member',
    department,
    role,
    leads,
    initials: getInitials(name),
    photo,
    experience,
    motto: formatMotto(motto),
    social,
  };
}

function processRows(rows) {
  const classified = rows.map((row, i) => classifyMember(row, i)).filter(Boolean);

  const usedIds = new Set();
  classified.forEach(m => {
    let id = m.id;
    let n = 1;
    while (usedIds.has(id)) {
      id = `${m.id}-${n++}`;
    }
    m.id = id;
    usedIds.add(id);
  });

  return classified;
}

/* ── Data accessors ── */

function getMember(id) {
  return MEMBERS.find(m => m.id === id);
}

function getPresident() {
  return MEMBERS.find(m => m.role === 'president');
}

function getVPsOrdered() {
  const slots = VP_DEPT_ORDER.map(dept => MEMBERS.find(m => m.role === 'vp' && m.leads === dept));
  const assigned = new Set(slots.filter(Boolean));
  const extra = MEMBERS.filter(m => m.role === 'vp' && !assigned.has(m));
  return [...slots.filter(Boolean), ...extra];
}

function getVP(dept) {
  return MEMBERS.find(m => m.role === 'vp' && m.leads === dept);
}

function getDeptMembers(dept) {
  return MEMBERS.filter(m => m.department === dept && m.role === 'member');
}

function getExecutivePanelMembers() {
  return MEMBERS.filter(m => m.role === 'secretary' || m.role === 'deputy-secretary');
}

function getSecretaries() {
  const secretary = MEMBERS.find(m => m.role === 'secretary');
  const deputy = MEMBERS.find(m => m.role === 'deputy-secretary');
  return [secretary, deputy].filter(Boolean);
}

/* ── UI builders ── */

function buildAvatar(member, className) {
  if (member.photo) {
    return `<img class="${className}" src="${escapeHtml(member.photo)}" alt="${escapeHtml(member.name)}" loading="lazy" data-fallback-initials="${escapeHtml(member.initials)}">`;
  }
  return `<div class="${className} ${className}--initials" aria-hidden="true">${escapeHtml(member.initials)}</div>`;
}

function handleAvatarError(event) {
  const img = event.target;
  if (!img?.dataset?.fallbackInitials) return;
  const div = document.createElement('div');
  div.className = `${img.className} ${img.className}--initials`;
  div.textContent = img.dataset.fallbackInitials;
  div.setAttribute('aria-hidden', 'true');
  img.replaceWith(div);
}

function buildCard(member, variant = '') {
  if (!member) return '';
  const variantClass = variant ? ` member-card--${variant}` : '';
  const nicknameHtml = member.nickname
    ? `<p class="member-card__nickname">${escapeHtml(member.nickname)}</p>`
    : '';
  const classHtml = member.class
    ? `<span class="member-card__class">${escapeHtml(member.class)}</span>`
    : '';
  const mottoHtml = member.motto
    ? `<p class="member-card__motto">${escapeHtml(member.motto)}</p>`
    : '';

  return `
    <article class="member-card${variantClass}" data-id="${escapeHtml(member.id)}">
      <div class="member-card__avatar-wrap">
        ${buildAvatar(member, 'member-card__avatar')}
        <span class="member-card__avatar-ring" aria-hidden="true"></span>
      </div>
      ${classHtml}
      <h3 class="member-card__name">${escapeHtml(member.name)}</h3>
      ${nicknameHtml}
      <p class="member-card__position">${escapeHtml(member.position)}</p>
      ${mottoHtml}
      <button type="button" class="member-card__btn" data-profile="${escapeHtml(member.id)}">View Profile</button>
    </article>
  `;
}

function renderLoadingState() {
  const chart = document.getElementById('executive-chart');
  const panel = document.getElementById('dept-panel');
  const loader = `
    <div class="members-status members-status--loading" role="status">
      <div class="members-status__spinner" aria-hidden="true"></div>
      <p>Loading members from Google Sheets…</p>
    </div>
  `;
  if (chart) chart.innerHTML = loader;
  if (panel) panel.innerHTML = loader;
}

function renderErrorState(message) {
  const chart = document.getElementById('executive-chart');
  const panel = document.getElementById('dept-panel');
  const showSetupHelp =
    /file:\/\/|Anyone|CORS|JSONP|google-apps-script/i.test(message) ||
    window.location.protocol === 'file:';
  const setupHtml = showSetupHelp
    ? `<ol class="members-status__steps">
        <li>Open your Google Sheet → <strong>Extensions → Apps Script</strong></li>
        <li>Paste the code from <strong>google-apps-script.gs</strong> in this project</li>
        <li><strong>Deploy → New deployment → Web app</strong> — Execute as: Me, Who has access: <strong>Anyone</strong></li>
        <li>Copy the new <strong>/exec</strong> URL into <strong>js/members.js</strong></li>
        <li>Open the site via <strong>Live Server</strong> (not by double-clicking the HTML file)</li>
      </ol>`
    : '';
  const html = `
    <div class="members-status members-status--error" role="alert">
      <p>Unable to load member data.</p>
      <p class="members-status__detail">${escapeHtml(message)}</p>
      ${setupHtml}
      <button type="button" class="members-status__retry" id="members-retry">Try again</button>
    </div>
  `;
  if (chart) chart.innerHTML = html;
  if (panel) panel.innerHTML = html;
  document.getElementById('members-retry')?.addEventListener('click', loadAndRender);
}

function renderExecutiveTree() {
  const president = getPresident();
  const vps = getVPsOrdered();
  const secretaries = getSecretaries();
  const chart = document.getElementById('executive-chart');

  if (!president) {
    chart.innerHTML = `
      <div class="members-status members-status--error" role="alert">
        <p>No Party President found in the spreadsheet.</p>
        <p class="members-status__detail">Add a row whose position contains “ประธาน”.</p>
      </div>
    `;
    return;
  }

  chart.innerHTML = `
    <svg class="org-lines" id="executive-lines" aria-hidden="true"></svg>
    <div class="org-level org-level--president" data-level="0">
      ${buildCard(president, 'president')}
    </div>
    <div class="org-level org-level--vp" data-level="1">
      <div class="org-branch-row org-branch-row--vp">
        ${vps.length ? vps.map(vp => buildCard(vp, 'vp')).join('') : '<p class="org-empty-note">Vice Presidents will appear here when added to the sheet.</p>'}
      </div>
    </div>
    <div class="org-level org-level--secretary" data-level="2">
      <div class="org-branch-row org-branch-row--secretary">
        ${secretaries.length ? secretaries.map(s => buildCard(s)).join('') : ''}
      </div>
    </div>
  `;

  animateCardsIn(chart);
  scheduleExecutiveLines();
}

function renderDeptPanel(dept) {
  const panel = document.getElementById('dept-panel');
  panel.classList.add('is-transitioning');

  setTimeout(() => {
    let html = '';

    if (dept === 'executive') {
      const members = getExecutivePanelMembers();
      html = `
        <div class="dept-panel__header">
          <p class="dept-panel__label">${DEPT_LABELS.executive}</p>
          <h2 class="dept-panel__title">Executive Office</h2>
          <p class="dept-panel__desc">Secretariat and administrative leadership supporting the presidency.</p>
        </div>
        <div class="dept-grid">${members.length ? members.map(m => buildCard(m)).join('') : '<p class="org-empty-note">No secretariat members in the sheet yet.</p>'}</div>
      `;
    } else {
      const vp = getVP(dept);
      const members = getDeptMembers(dept);
      const leaderLabel = vp
        ? `${vp.name}${vp.nickname ? ` (${vp.nickname})` : ''} — ${vp.position}`
        : 'Department leadership and team members.';
      html = `
        <div class="dept-panel__header">
          <p class="dept-panel__label">${DEPT_LABELS[dept]}</p>
          <h2 class="dept-panel__title">ฝ่าย${DEPT_LABELS[dept]}</h2>
          <p class="dept-panel__desc">Led by ${escapeHtml(leaderLabel)}</p>
        </div>
        ${vp ? `<div class="dept-lead">${buildCard(vp, 'lead')}</div>` : ''}
        <div class="dept-grid">${members.length ? members.map(m => buildCard(m)).join('') : '<p class="org-empty-note">No department members yet — add rows in Google Sheets.</p>'}</div>
      `;
    }

    panel.innerHTML = html;
    panel.classList.remove('is-transitioning');
    animateCardsIn(panel);
  }, 280);
}

function animateCardsIn(container) {
  const root = container || document;
  root.querySelectorAll('.member-card').forEach((card, i) => {
    card.classList.remove('is-visible', 'is-hiding');
    setTimeout(() => card.classList.add('is-visible'), 50 + i * 70);
  });
}

function scheduleExecutiveLines() {
  clearTimeout(lineDrawTimeout);
  lineDrawTimeout = setTimeout(drawExecutiveLines, 450);
}

function drawExecutiveLines() {
  const svg = document.getElementById('executive-lines');
  const chart = document.getElementById('executive-chart');
  if (!svg || !chart) return;

  const chartRect = chart.getBoundingClientRect();
  svg.setAttribute('width', chart.offsetWidth);
  svg.setAttribute('height', chart.offsetHeight);
  svg.innerHTML = '';

  const president = chart.querySelector('.member-card--president');
  if (!president) return;

  const presBottom = getAnchor(president, 'bottom', chartRect);
  const vpCards = chart.querySelectorAll('.member-card--vp');

  vpCards.forEach(vp => {
    const vpTop = getAnchor(vp, 'top', chartRect);
    addLine(svg, presBottom.x, presBottom.y, vpTop.x, vpTop.y);
  });

  if (vpCards.length) {
    const vpBottoms = Array.from(vpCards).map(vp => getAnchor(vp, 'bottom', chartRect));
    const midX = vpBottoms.reduce((s, p) => s + p.x, 0) / vpBottoms.length;
    const midY = Math.max(...vpBottoms.map(p => p.y));

    chart.querySelectorAll('.org-level--secretary .member-card').forEach(sec => {
      const secTop = getAnchor(sec, 'top', chartRect);
      addLine(svg, midX, midY, secTop.x, secTop.y);
    });
  }
}

function getAnchor(el, point, chartRect) {
  const rect = el.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2 - chartRect.left,
    y: point === 'top' ? rect.top - chartRect.top : rect.bottom - chartRect.top,
  };
}

function addLine(svg, x1, y1, x2, y2) {
  const midY = (y1 + y2) / 2;
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`);
  svg.appendChild(path);
  const len = path.getTotalLength();
  path.style.strokeDasharray = len;
  path.style.strokeDashoffset = len;
  requestAnimationFrame(() => {
    path.style.transition = 'stroke-dashoffset 1.1s cubic-bezier(0.22, 1, 0.36, 1)';
    path.style.strokeDashoffset = '0';
  });
}

function filterDepartment(dept) {
  if (dept === activeDept) return;
  activeDept = dept;

  document.querySelectorAll('.dept-tab').forEach(tab => {
    const isActive = tab.dataset.dept === dept;
    tab.classList.toggle('is-active', isActive);
    tab.setAttribute('aria-selected', String(isActive));
  });

  renderDeptPanel(dept);
}

function setModalField(id, text, hideIfEmpty = false) {
  const el = document.getElementById(id);
  const row = el?.closest('.modal__row');
  if (!el) return;

  el.textContent = text || '';
  if (row && hideIfEmpty) {
    row.hidden = !text;
  }
}

function openModal(memberId) {
  const member = getMember(memberId);
  if (!member) return;

  const overlay = document.getElementById('profile-modal');

  document.getElementById('modal-avatar-wrap').innerHTML = buildAvatar(member, 'modal__avatar');
  setModalField('modal-name', member.name);

  const nickEl = document.getElementById('modal-nickname');
  if (nickEl) {
    nickEl.textContent = member.nickname || '';
    nickEl.hidden = !member.nickname;
  }

  setModalField('modal-position', member.position);
  const classEl = document.getElementById('modal-class');
  if (classEl) {
    classEl.textContent = member.class || '';
    classEl.hidden = !member.class;
  }

  setModalField('modal-dept', DEPT_LABELS[member.department] || member.department);
  setModalField('modal-experience', member.experience, true);
  setModalField('modal-motto', member.motto, true);

  const socialsEl = document.getElementById('modal-socials');
  const connectRow = document.getElementById('modal-connect-row');
  socialsEl.innerHTML = '';

  if (member.social?.instagram) {
    socialsEl.innerHTML = `
      <a href="${escapeHtml(member.social.instagram)}" class="modal__social-link" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
        <img src="image/icons and logos/instagram-hover.png" alt="">
        <span>Instagram</span>
      </a>`;
    if (connectRow) connectRow.hidden = false;
  } else {
    socialsEl.innerHTML = '<span class="modal__no-social">No Instagram link</span>';
    if (connectRow) connectRow.hidden = false;
  }

  overlay.classList.remove('is-closing');
  overlay.classList.add('is-open');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  overlay.querySelector('.modal__close').focus();
}

function closeModal() {
  const overlay = document.getElementById('profile-modal');
  overlay.classList.add('is-closing');
  overlay.classList.remove('is-open');

  setTimeout(() => {
    overlay.classList.remove('is-closing');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }, 350);
}

function renderTabs() {
  const tabsContainer = document.getElementById('dept-tabs');
  tabsContainer.innerHTML = DEPT_TABS.map(
    dept =>
      `<button type="button" class="dept-tab${dept === activeDept ? ' is-active' : ''}" data-dept="${dept}" role="tab" aria-selected="${dept === activeDept}">${DEPT_LABELS[dept]}</button>`
  ).join('');
}

async function loadAndRender() {
  renderLoadingState();

  try {
    const rows = await fetchMembersFromAPI();
    MEMBERS = processRows(rows);
    renderExecutiveTree();
    renderDeptPanel(activeDept);
  } catch (err) {
    console.error('Failed to load members:', err);
    renderErrorState(err.message || 'Check that the Apps Script is deployed with “Anyone” access.');
  }
}

function scheduleAutoRefresh() {
  clearInterval(refreshTimer);
  refreshTimer = setInterval(() => {
    if (document.visibilityState === 'visible') loadAndRender();
  }, REFRESH_INTERVAL_MS);
}

function init() {
  const tabsContainer = document.getElementById('dept-tabs');
  renderTabs();

  tabsContainer.addEventListener('click', e => {
    const tab = e.target.closest('.dept-tab');
    if (tab) filterDepartment(tab.dataset.dept);
  });

  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-profile]');
    if (btn) openModal(btn.dataset.profile);
  });

  document.getElementById('profile-modal').addEventListener('click', e => {
    if (e.target.id === 'profile-modal' || e.target.closest('.modal__close')) closeModal();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });

  document.addEventListener(
    'error',
    e => {
      if (e.target?.matches?.('.member-card__avatar, .modal__avatar')) handleAvatarError(e);
    },
    true
  );

  window.addEventListener('resize', scheduleExecutiveLines);

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') loadAndRender();
  });

  loadAndRender();
  scheduleAutoRefresh();
}

document.addEventListener('DOMContentLoaded', init);
