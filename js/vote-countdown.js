function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function clamp(n, min, max) {
  return Math.min(Math.max(n, min), max);
}

function pad2(n) {
  return String(n).padStart(2, '0');
}

function splitMs(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds };
}

function animateText(el, nextText) {
  if (!el) return;
  if (prefersReducedMotion()) {
    el.textContent = nextText;
    return;
  }

  if (el.textContent === nextText) return;
  el.classList.remove('is-flip');
  el.textContent = nextText;
  requestAnimationFrame(() => {
    el.classList.add('is-flip');
    window.setTimeout(() => el.classList.remove('is-flip'), 260);
  });
}

function makeConfettiPiece() {
  const piece = document.createElement('span');
  piece.className = 'vote-countdown__confetti-piece';

  const left = Math.random() * 100;
  const delay = Math.random() * 0.6;
  const dur = 1.2 + Math.random() * 1.4;
  const rot = (Math.random() * 180 - 90).toFixed(2);
  const dx = (Math.random() * 60 - 30).toFixed(2);

  piece.style.left = `${left}%`;
  piece.style.animationDelay = `${delay}s`;
  piece.style.animationDuration = `${dur}s`;
  piece.style.setProperty('--rot', `${rot}deg`);
  piece.style.setProperty('--dx', `${dx}px`);
  piece.style.setProperty('--h', `${Math.floor(Math.random() * 360)}deg`);

  return piece;
}

function burstConfetti(container) {
  if (!container || prefersReducedMotion()) return;
  container.innerHTML = '';
  const count = 26;
  for (let i = 0; i < count; i++) container.appendChild(makeConfettiPiece());
}

function makeFireworkBurst() {
  const burst = document.createElement('span');
  burst.className = 'vote-countdown__firework-burst';
  const x = 8 + Math.random() * 84;
  const y = 8 + Math.random() * 56;
  const delay = Math.random() * 0.7;
  const size = 48 + Math.random() * 72;
  const rot = Math.floor(Math.random() * 36);
  burst.style.left = `${x}%`;
  burst.style.top = `${y}%`;
  burst.style.width = `${size}px`;
  burst.style.height = `${size}px`;
  burst.style.animationDelay = `${delay}s`;
  burst.style.setProperty('--h', `${Math.floor(Math.random() * 360)}deg`);
  burst.style.setProperty('--rot', `${rot}deg`);
  return burst;
}

function launchFireworks(container) {
  if (!container || prefersReducedMotion()) return;

  let waveCount = 0;
  const MAX_WAVES = 12; // ~18 s of fireworks
  const BURST_PER_WAVE = 10;

  function wave() {
    if (waveCount >= MAX_WAVES) {
      container.innerHTML = '';
      return;
    }
    waveCount++;
    container.innerHTML = '';
    for (let i = 0; i < BURST_PER_WAVE; i++) container.appendChild(makeFireworkBurst());
    window.setTimeout(wave, 1500);
  }

  wave();
}

function initVoteCountdown() {
  const root = document.getElementById('vote-countdown');
  if (!root) return;

  const targetIso = root.getAttribute('data-target');
  const target = new Date(targetIso);
  if (Number.isNaN(target.getTime())) return;

  const els = {
    days: root.querySelector('[data-part="days"]'),
    hours: root.querySelector('[data-part="hours"]'),
    minutes: root.querySelector('[data-part="minutes"]'),
    seconds: root.querySelector('[data-part="seconds"]'),
  };

  const statusEl = root.querySelector('[data-status]');
  const thanksEl = root.querySelector('[data-thanks]');
  const fireworksEl = root.querySelector('.vote-countdown__fireworks');
  const confettiEl = root.querySelector('.vote-countdown__confetti');

  let done = false;
  let timer = null;

  function triggerCelebration() {
    if (thanksEl) thanksEl.classList.add('is-show');
    launchFireworks(fireworksEl);
    // Confetti in 3 staggered waves
    [140, 1600, 3200].forEach(delay => {
      window.setTimeout(() => burstConfetti(confettiEl), delay);
    });
  }

  function render() {
    const now = new Date();
    const diff = target.getTime() - now.getTime();
    const parts = splitMs(diff);

    animateText(els.days, String(parts.days));
    animateText(els.hours, pad2(parts.hours));
    animateText(els.minutes, pad2(parts.minutes));
    animateText(els.seconds, pad2(parts.seconds));

    if (diff <= 0 && !done) {
      done = true;
      root.classList.add('is-complete');
      if (statusEl) statusEl.textContent = 'Voting is open. Go vote!';
      triggerCelebration();
    }

    if (!done) {
      const msToNextSecond = 1000 - (Date.now() % 1000) + 16;
      timer = window.setTimeout(render, msToNextSecond);
    }
  }

  function startWhenVisible() {
    if (prefersReducedMotion()) {
      tick();
      return;
    }

    const io = new IntersectionObserver(
      entries => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          root.classList.add('is-visible');
          io.disconnect();
          render();
          break;
        }
      },
      { threshold: clamp(0.2, 0.1, 0.4), rootMargin: '0px 0px -40px 0px' }
    );

    io.observe(root);
  }

  startWhenVisible();

  window.addEventListener('beforeunload', () => {
    if (timer) window.clearTimeout(timer);
  });
}

document.addEventListener('DOMContentLoaded', initVoteCountdown);