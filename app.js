(() => {
  const C = window.CONFIG;
  if (!C) return;

  // Timing milestones from film_master.mp4 (trimmed cleanly at 39.96s @ 24fps):
  // turn end ~5.5s | close-up ~14.0s | sit ~18.5s | desk stops ~21.5-23.5s
  // walk start ~29.0s | walk stop ~32.5s | pull-down 36.3..37.5s | wave 39.1..39.96s
  // Every segment keeps positive motion (no dead stops) and feeds a C1 monotone cubic spline.
  const SEGMENTS = [
    { t: [0.00, 5.05],   h: 0.95 },
    { t: [5.05, 5.85],   h: 0.55, id: 'home' },
    { t: [5.85, 13.45],  h: 1.35 },
    { t: [13.45, 14.55], h: 0.70, id: 'about' },
    { t: [14.55, 22.65], h: 1.50 },
    { t: [22.65, 24.45], h: 0.95, id: 'work' },
    { t: [24.45, 28.80], h: 0.85 },
    { t: [28.80, 32.10], h: 1.00 },
    { t: [32.10, 33.10], h: 0.55, id: 'skills' },
    { t: [33.10, 36.45], h: 0.80 },
    { t: [36.45, 37.90], h: 0.85, id: 'resume' },
    { t: [37.90, 39.35], h: 0.78 },
    { t: [39.35, 39.92], h: 0.92, id: 'contact' },
    { t: [39.92, 39.96], h: 1.00, id: 'outro' }
  ];

  const DESKTOP_SHIFT = [
    [0.0, 22], [10.5, 22], [13.2, 20], [15.5, 20],
    [21.5, -15], [26.5, -15], [31.5, 0], [39.96, 0]
  ];

  const MOBILE_CENTER = [
    [0.0, 52], [10.5, 52], [13.5, 48.5], [16.0, 48.5],
    [18.5, 49], [26.5, 49], [31.5, 42], [38.5, 42],
    [39.8, 45.6], [39.96, 45.6]
  ];

  const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);
  const lerp = (a, b, t) => a + (b - a) * t;
  const smoothstep = (t) => t * t * (3 - 2 * t);
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  function sampleKeys(t, keys) {
    if (t <= keys[0][0]) return keys[0][1];
    for (let i = 1; i < keys.length; i++) {
      if (t <= keys[i][0]) {
        const span = keys[i][0] - keys[i - 1][0] || 1;
        const p = smoothstep(clamp((t - keys[i - 1][0]) / span, 0, 1));
        return lerp(keys[i - 1][1], keys[i][1], p);
      }
    }
    return keys[keys.length - 1][1];
  }

  function windowOpacity(t, in0, in1, out0, out1) {
    if (t < in0 || t > out1) return 0;
    if (t < in1) return smoothstep(clamp((t - in0) / (in1 - in0), 0, 1));
    if (t > out0) return 1 - smoothstep(clamp((t - out0) / (out1 - out0), 0, 1));
    return 1;
  }

  // Populate DOM from CONFIG
  document.documentElement.style.setProperty('--accent', C.accent || '#ff9a3c');
  const parts = C.name.trim().split(/\s+/);
  const firstLine = C.nameLine1 || parts[0] || C.name;
  const secondLine = C.nameLine2 || parts.slice(1).join(' ');

  const $ = (id) => document.getElementById(id);
  $('loader-name').textContent = C.name;
  $('brand-name').textContent = C.name;
  $('name-line1').textContent = firstLine;
  $('name-line2').textContent = secondLine;
  $('hero-role').textContent = C.role;
  $('hero-status').textContent = C.status;
  $('hero-location').textContent = C.location;
  $('hero-cv').href = C.contact.resume;
  $('about-title').textContent = C.about.title;
  $('about-desc').textContent = C.about.desc;

  $('about-stats').innerHTML = C.about.stats.map((s) => (
    `<div><div class="stat-val">${s.value}</div><div class="stat-lbl">${s.label}</div></div>`
  )).join('');

  $('work-list').innerHTML = C.projects.map((p, idx) => (
    `<a class="project-card" href="${p.link}" target="_blank" rel="noopener">
      <div class="project-head">
        <div class="project-title-wrap">
          <span class="project-idx">0${idx + 1}</span>
          <span class="project-title">${p.title}</span>
        </div>
        <span class="project-link-cue">
          <span>${p.link.includes('github.com') ? 'Source' : 'Visit Site'}</span>
          <span class="project-arrow" aria-hidden="true">↗</span>
        </span>
      </div>
      <div class="project-tech">${p.tech}</div>
      <p class="project-desc">${p.desc}</p>
    </a>`
  )).join('');

  $('skills-grid').innerHTML = C.skills.map((sk) => (
    `<span class="skill-chip">${sk}</span>`
  )).join('');

  $('resume-name').textContent = C.name;
  $('resume-role').textContent = `${C.role} · ${C.location}`;
  $('resume-download').href = C.contact.resume;

  $('resume-exp').innerHTML = C.experience.map((e) => (
    `<li><div><span class="paper-main">${e.role}</span> <span class="paper-sub">— ${e.company}</span></div><span class="paper-period">${e.period}</span></li>`
  )).join('');

  $('resume-edu').innerHTML = C.education.map((e) => (
    `<li><div><span class="paper-main">${e.degree}</span> <span class="paper-sub">— ${e.school}</span></div><span class="paper-period">${e.period}</span></li>`
  )).join('');

  $('contact-loc').textContent = `${C.location} · ${C.status}`;
  $('outro-sig').textContent = `${C.name} · ${C.location}`;
  $('outro-status').textContent = C.status;
  $('outro-email').href = `mailto:${C.contact.email}`;
  $('outro-dock').innerHTML = [
    { label: 'GitHub', href: C.contact.github, ext: true },
    { label: 'LinkedIn', href: C.contact.linkedin, ext: true },
    { label: 'Resume PDF', href: C.contact.resume, ext: true },
    { label: 'Email', href: `mailto:${C.contact.email}`, ext: false }
  ].map((d) => (
    `<a class="dock-pill" href="${d.href}"${d.ext ? ' target="_blank" rel="noopener"' : ''}>${d.label}</a>`
  )).join('');
  $('contact-links').innerHTML = [
    { k: 'Email', v: C.contact.email, href: `mailto:${C.contact.email}`, ext: false, copy: true },
    { k: 'GitHub', v: C.contact.github.replace(/^https?:\/\//, ''), href: C.contact.github, ext: true },
    { k: 'LinkedIn', v: C.contact.linkedin.replace(/^https?:\/\//, ''), href: C.contact.linkedin, ext: true }
  ].map((item) => (
    `<a class="contact-item" href="${item.href}"${item.ext ? ' target="_blank" rel="noopener"' : ''}>
      <span class="contact-k">${item.k}</span>
      <span class="contact-v">${item.v}</span>
      ${item.copy ? '<button class="contact-copy" type="button" data-copy-email>Copy</button>' : ''}
    </a>`
  )).join('');

  $('contact-links').addEventListener('click', (e) => {
    const copyBtn = e.target.closest('[data-copy-email]');
    if (!copyBtn) return;
    e.preventDefault();
    e.stopPropagation();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(C.contact.email).then(() => {
        copyBtn.textContent = 'Copied!';
        setTimeout(() => { copyBtn.textContent = 'Copy'; }, 1600);
      }).catch(() => {});
    }
  });

  $('work-list').addEventListener('mousemove', (e) => {
    if (isMobile) return;
    const card = e.target.closest('.project-card');
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const rx = (e.clientX - rect.left) / rect.width;
    const ry = (e.clientY - rect.top) / rect.height;
    card.style.setProperty('--mx', `${(e.clientX - rect.left).toFixed(1)}px`);
    card.style.setProperty('--my', `${(e.clientY - rect.top).toFixed(1)}px`);
    card.style.setProperty('--tilt-x', `${((0.5 - ry) * 6).toFixed(2)}deg`);
    card.style.setProperty('--tilt-y', `${((rx - 0.5) * 7).toFixed(2)}deg`);
  });

  $('work-list').addEventListener('mouseout', (e) => {
    const card = e.target.closest('.project-card');
    if (card && !card.contains(e.relatedTarget)) {
      card.style.setProperty('--tilt-x', '0deg');
      card.style.setProperty('--tilt-y', '0deg');
    }
  });

  const video = $('film');
  const filmBox = $('film-box');
  const loader = $('loader');
  const loaderBar = $('loader-bar');
  const loaderPct = $('loader-pct');
  const progressBar = $('progress-bar');
  const scrollHint = $('scroll-hint');
  const scrollSpacer = $('scroll-spacer');
  const outroBackdrop = $('outro-backdrop');
  const outroCard = $('outro-card');
  const hudChapter = $('hud-chapter');
  const hudTime = $('hud-time');

  const sections = {
    intro: $('sec-intro'),
    about: $('sec-about'),
    work: $('sec-work'),
    skills: $('sec-skills'),
    resume: $('sec-resume'),
    contact: $('sec-contact'),
    outro: $('sec-outro')
  };
  const projectCards = Array.from(document.querySelectorAll('.project-card'));
  const skillChips = Array.from(document.querySelectorAll('.skill-chip'));
  const resumeCard = $('resume-card');
  const navButtons = Array.from(document.querySelectorAll('.nav button'));
  const chapterButtons = Array.from(document.querySelectorAll('#chapter-rail button'));

  const FPS = 24;
  const mobileQuery = window.matchMedia('(max-width: 760px)');
  let isMobile = mobileQuery.matches;
  let ranges = [];
  let spline = { y: [0], t: [0], m: [0] };
  let maxScroll = 1;
  let activeBlobUrl = null;
  let videoReady = false;
  let videoDuration = 40.95;

  function buildSpline(yArr, tArr) {
    const n = yArr.length;
    const d = new Array(n - 1);
    const m = new Array(n).fill(0);
    for (let i = 0; i < n - 1; i++) {
      const dy = yArr[i + 1] - yArr[i];
      d[i] = dy > 0 ? (tArr[i + 1] - tArr[i]) / dy : 0;
    }
    m[0] = d[0] || 0;
    m[n - 1] = d[n - 2] || 0;
    for (let i = 1; i < n - 1; i++) {
      if (d[i - 1] * d[i] > 0) {
        m[i] = (2 * d[i - 1] * d[i]) / (d[i - 1] + d[i]);
      }
    }
    for (let i = 0; i < n - 1; i++) {
      if (d[i] === 0) {
        m[i] = 0;
        m[i + 1] = 0;
      } else {
        const a = m[i] / d[i];
        const b = m[i + 1] / d[i];
        const s = a * a + b * b;
        if (s > 9) {
          const tau = 3 / Math.sqrt(s);
          m[i] = tau * a * d[i];
          m[i + 1] = tau * b * d[i];
        }
      }
    }
    return { y: yArr, t: tArr, m };
  }

  function evalSpline(sy) {
    const { y, t, m } = spline;
    const n = y.length;
    if (sy <= y[0]) return t[0];
    if (sy >= y[n - 1]) return t[n - 1];
    for (let i = 0; i < n - 1; i++) {
      if (sy <= y[i + 1]) {
        const h = y[i + 1] - y[i];
        const u = h > 0 ? clamp((sy - y[i]) / h, 0, 1) : 0;
        const u2 = u * u;
        const u3 = u2 * u;
        const h00 = 2 * u3 - 3 * u2 + 1;
        const h10 = u3 - 2 * u2 + u;
        const h01 = -2 * u3 + 3 * u2;
        const h11 = u3 - u2;
        return clamp(h00 * t[i] + h10 * h * m[i] + h01 * t[i + 1] + h11 * h * m[i + 1], t[0], t[n - 1]);
      }
    }
    return t[n - 1];
  }

  let lastLayoutW = 0;
  let lastLayoutH = 0;

  function computeLayout(force = false) {
    const vw = window.innerWidth || 1280;
    const vh = window.innerHeight || 900;
    // Ignore minor mobile Safari URL-bar height jitters during active scroll
    if (!force && lastLayoutW === vw && Math.abs(vh - lastLayoutH) < 90) return;
    lastLayoutW = vw;
    lastLayoutH = vh;
    isMobile = mobileQuery.matches;
    let cursor = 0;
    const yArr = [0];
    const tArr = [SEGMENTS[0].t[0]];
    ranges = SEGMENTS.map((seg) => {
      const px = seg.h * vh;
      const item = { ...seg, start: cursor, end: cursor + px, px };
      cursor += px;
      yArr.push(cursor);
      tArr.push(seg.t[1]);
      return item;
    });
    spline = buildSpline(yArr, tArr);
    maxScroll = Math.max(1, cursor);
    scrollSpacer.style.height = `${Math.round(cursor + vh)}px`;
    projectCards.forEach((c) => {
      c.style.setProperty('--tilt-x', '0deg');
      c.style.setProperty('--tilt-y', '0deg');
    });
  }

  function mapScroll(y) {
    const sy = clamp(y, 0, maxScroll);
    let holdId = null;
    for (let i = 0; i < ranges.length; i++) {
      const r = ranges[i];
      if (sy <= r.end || i === ranges.length - 1) {
        holdId = r.id || null;
        break;
      }
    }
    return {
      time: evalSpline(sy),
      progress: sy / maxScroll,
      holdId
    };
  }

  // Nav smooth scroll to each reading zone
  const HOLD_TARGET_PROGRESS = {
    home: 0.45,
    about: 0.50,
    work: 0.85,
    skills: 0.55,
    resume: 0.78,
    contact: 0.82,
    outro: 0.92
  };

  function scrollToHold(id) {
    const r = ranges.find((seg) => seg.id === id);
    if (!r) return;
    const targetY = r.start + r.px * (HOLD_TARGET_PROGRESS[id] ?? 0.5);
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  }

  $('brand-btn').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  $('outro-top').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  $('hero-explore').addEventListener('click', () => scrollToHold('work'));
  $('topbar-cta').addEventListener('click', (e) => {
    e.preventDefault();
    scrollToHold('contact');
  });
  navButtons.forEach((btn) => {
    btn.addEventListener('click', () => scrollToHold(btn.dataset.target));
  });
  chapterButtons.forEach((btn) => {
    btn.addEventListener('click', () => scrollToHold(btn.dataset.target));
  });

  // iOS touch unlock so programmatic currentTime seeking works
  window.addEventListener('touchstart', () => {
    const p = video.play();
    if (p && typeof p.then === 'function') {
      p.then(() => video.pause()).catch(() => {});
    } else {
      video.pause();
    }
  }, { once: true, passive: true });

  // Fetch film with progress -> blob URL, fallback to plain src
  async function loadFilm(mobileMode) {
    videoReady = false;
    const srcUrl = mobileMode ? 'media/film_mobile.mp4' : 'media/film.mp4';
    const prevTime = filmTime;
    const setPct = (pct) => {
      const p = clamp(Math.round(pct), 0, 100);
      loaderBar.style.width = `${p}%`;
      loaderPct.textContent = `${p}%`;
    };

    const attachSrc = (url) => new Promise((resolve) => {
      let settled = false;
      let timer = null;
      const finish = () => {
        if (settled) return;
        settled = true;
        if (timer) clearTimeout(timer);
        video.removeEventListener('loadedmetadata', onMeta);
        video.removeEventListener('loadeddata', finish);
        videoDuration = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : 40.95;
        videoReady = true;
        soughtFrame = -1;
        pendingFrame = -1;
        seekStartedAt = 0;
        const startFrame = prevTime > 0 ? Math.round(prevTime * FPS) : 0;
        commitSeek(startFrame, true);
        resolve();
      };
      const onMeta = () => {
        // Ensure first frame is decoded on Safari/WebKit without stalling longer than 1.2s
        if (video.readyState >= 2) finish();
        else timer = setTimeout(finish, 1200);
      };
      video.addEventListener('loadedmetadata', onMeta);
      video.addEventListener('loadeddata', finish);
      video.src = url;
      video.load();
    });

    try {
      const res = await fetch(srcUrl);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const total = Number(res.headers.get('content-length')) || 0;
      if (res.body && res.body.getReader) {
        const reader = res.body.getReader();
        const chunks = [];
        let loaded = 0;
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(value);
          loaded += value.byteLength;
          if (total > 0) setPct((loaded / total) * 100);
        }
        const blob = new Blob(chunks, { type: 'video/mp4' });
        if (activeBlobUrl) URL.revokeObjectURL(activeBlobUrl);
        activeBlobUrl = URL.createObjectURL(blob);
        setPct(100);
        await attachSrc(activeBlobUrl);
      } else {
        await res.blob().then(async (blob) => {
          if (activeBlobUrl) URL.revokeObjectURL(activeBlobUrl);
          activeBlobUrl = URL.createObjectURL(blob);
          setPct(100);
          await attachSrc(activeBlobUrl);
        });
      }
    } catch {
      setPct(100);
      await attachSrc(srcUrl);
    }
    loader.classList.add('is-done');
  }

  const SCROLL_DAMP = 10.5;
  const FILM_DAMP = 14.5;

  let smoothY = window.scrollY;
  let targetTime = 0;
  let filmTime = 0;
  let lastFrameMs = 0;
  let soughtFrame = -1;
  let pendingFrame = -1;
  let seekStartedAt = 0;
  let lastShiftVal = '';
  let lastProgVal = '';
  let lastHudChapter = '';
  let lastHudTime = '';
  let lastFilmOp = '';

  function commitSeek(frame, force = false) {
    if (!videoReady) return;
    const totalFrames = Math.max(1, Math.round(videoDuration * FPS));
    const clampedFrame = clamp(frame, 0, totalFrames);
    if (!force && clampedFrame === soughtFrame) return;

    const now = performance.now();
    if (!force && video.seeking && now - seekStartedAt < 220) {
      pendingFrame = clampedFrame;
      return;
    }

    soughtFrame = clampedFrame;
    pendingFrame = -1;
    seekStartedAt = now;
    // +0.002s places target cleanly inside the decoded frame bucket
    video.currentTime = clamp(clampedFrame / FPS + 0.002, 0, videoDuration);
  }

  video.addEventListener('seeked', () => {
    if (pendingFrame !== -1 && pendingFrame !== soughtFrame) {
      const next = pendingFrame;
      pendingFrame = -1;
      commitSeek(next, true);
    }
  });

  function setSectionState(el, opacity) {
    const visible = opacity > 0.02;
    el.style.opacity = opacity.toFixed(3);
    el.style.visibility = visible ? 'visible' : 'hidden';
    el.style.pointerEvents = visible ? 'auto' : 'none';
  }

  outroCard.addEventListener('mousemove', (e) => {
    if (isMobile) return;
    const r = outroCard.getBoundingClientRect();
    const rx = (e.clientX - r.left) / r.width;
    const ry = (e.clientY - r.top) / r.height;
    outroCard.style.setProperty('--tilt-x', `${((0.5 - ry) * 5).toFixed(2)}deg`);
    outroCard.style.setProperty('--tilt-y', `${((rx - 0.5) * 6).toFixed(2)}deg`);
  });

  outroCard.addEventListener('mouseleave', () => {
    outroCard.style.setProperty('--tilt-x', '0deg');
    outroCard.style.setProperty('--tilt-y', '0deg');
  });

  const CHAPTER_LABELS = {
    home: '00 · INTRO',
    about: '01 · ABOUT',
    work: '02 · WORK',
    skills: '03 · SKILLS',
    resume: '04 · RESUME',
    contact: '05 · CONTACT',
    outro: '06 · FINALE'
  };

  function activeNavFromTime(t, holdId) {
    if (holdId === 'outro') return 'outro';
    if (holdId) return holdId;
    if (t < 11.2) return 'home';
    if (t < 19.2) return 'about';
    if (t < 27.0) return 'work';
    if (t < 35.0) return 'skills';
    if (t < 38.6) return 'resume';
    return 'contact';
  }

  function render(now) {
    const dt = lastFrameMs ? clamp((now - lastFrameMs) / 1000, 0.001, 0.05) : 1 / 60;
    lastFrameMs = now;

    // Two-stage cascaded damping turns discrete mouse-wheel jumps into S-curve glides
    const rawY = window.scrollY;
    smoothY += (rawY - smoothY) * (1 - Math.exp(-SCROLL_DAMP * dt));
    if (Math.abs(rawY - smoothY) < 0.25) smoothY = rawY;

    const state = mapScroll(smoothY);
    targetTime = state.time;

    filmTime += (targetTime - filmTime) * (1 - Math.exp(-FILM_DAMP * dt));
    if (Math.abs(targetTime - filmTime) < 0.0004) filmTime = targetTime;

    // Quantized frame seek eliminates redundant same-frame Chromium decoder stalls
    commitSeek(Math.round(filmTime * FPS));

    // Placement keyframes (avoid redundant style writes when unchanged)
    if (isMobile) {
      const mobVal = `${sampleKeys(filmTime, MOBILE_CENTER).toFixed(2)}%`;
      if (mobVal !== lastShiftVal) {
        filmBox.style.setProperty('--mob-cx', mobVal);
        lastShiftVal = mobVal;
      }
    } else {
      const deskVal = `${sampleKeys(filmTime, DESKTOP_SHIFT).toFixed(2)}vw`;
      if (deskVal !== lastShiftVal) {
        filmBox.style.setProperty('--shift-x', deskVal);
        lastShiftVal = deskVal;
      }
    }

    // Topbar progress, active nav, chapter rail, HUD & scroll hint
    const progVal = `${(state.progress * 100).toFixed(2)}%`;
    if (progVal !== lastProgVal) {
      progressBar.style.width = progVal;
      lastProgVal = progVal;
    }
    scrollHint.classList.toggle('is-hidden', smoothY > 36);
    const activeChapter = activeNavFromTime(filmTime, state.holdId);
    const activeNav = activeChapter === 'outro' ? 'contact' : activeChapter;
    navButtons.forEach((btn) => btn.classList.toggle('is-active', btn.dataset.target === activeNav));
    chapterButtons.forEach((btn) => btn.classList.toggle('is-active', btn.dataset.target === activeChapter));

    const chapterText = CHAPTER_LABELS[activeChapter] || '00 · INTRO';
    if (chapterText !== lastHudChapter) {
      hudChapter.textContent = chapterText;
      lastHudChapter = chapterText;
    }
    const timeText = `00:${filmTime.toFixed(1).padStart(4, '0')}`;
    if (timeText !== lastHudTime) {
      hudTime.textContent = timeText;
      lastHudTime = timeText;
    }

    // Section opacities
    setSectionState(sections.intro, windowOpacity(filmTime, -1, 0, 8.6, 10.6));
    setSectionState(sections.about, windowOpacity(filmTime, 12.2, 13.3, 14.7, 16.3));

    const workOp = windowOpacity(filmTime, 21.5, 22.65, 24.6, 26.3);
    setSectionState(sections.work, workOp);
    if (workOp > 0.01) {
      const workP = clamp((filmTime - 22.65) / 1.55, 0, 1);
      const arrivals = [0.0, 0.24, 0.48];
      projectCards.forEach((card, idx) => {
        const p = easeOutCubic(clamp((workP - arrivals[idx]) / 0.38, 0, 1));
        if (isMobile) {
          card.style.setProperty('--cy', `${((1 - p) * 28).toFixed(1)}px`);
          card.style.setProperty('--cs', lerp(0.92, 1, p).toFixed(3));
        } else {
          card.style.setProperty('--cx', `${((1 - p) * -170).toFixed(1)}px`);
          card.style.setProperty('--ry', `${((1 - p) * -18).toFixed(2)}deg`);
          card.style.setProperty('--cs', lerp(0.84, 1, p).toFixed(3));
        }
        card.style.setProperty('--co', p.toFixed(3));
      });
    }

    const skillsOp = windowOpacity(filmTime, 28.5, 29.3, 33.3, 34.8);
    setSectionState(sections.skills, skillsOp);
    if (skillsOp > 0.01) {
      const walkP = clamp((filmTime - 29.0) / 3.4, 0, 1);
      const count = skillChips.length;
      skillChips.forEach((chip, idx) => {
        const start = (idx / count) * 0.72;
        const p = easeOutCubic(clamp((walkP - start) / 0.28, 0, 1));
        chip.style.setProperty('--sk-s', lerp(0.72, 1, p).toFixed(3));
        if (!isMobile) {
          chip.style.setProperty('--sk-b', p >= 0.99 ? '0px' : `${((1 - p) * 7).toFixed(2)}px`);
        }
        chip.style.setProperty('--sk-o', p.toFixed(3));
      });
    }

    const resumeOp = windowOpacity(filmTime, 36.1, 36.6, 38.0, 38.9);
    setSectionState(sections.resume, resumeOp);
    if (resumeOp > 0.01) {
      const pullP = easeOutCubic(clamp((filmTime - 36.3) / 1.25, 0, 1));
      resumeCard.style.setProperty('--res-y', `${((1 - pullP) * -110).toFixed(2)}vh`);
      resumeCard.style.setProperty('--res-mob-y', `${((1 - pullP) * -105).toFixed(2)}%`);
    }

    // Contact fades gracefully out as Outro finale arrives
    const outroRange = ranges[ranges.length - 1];
    const outroP = outroRange && outroRange.px > 0
      ? clamp((smoothY - outroRange.start) / outroRange.px, 0, 1)
      : 0;
    const contactFade = smoothstep(clamp(outroP / 0.34, 0, 1));
    const contactOp = windowOpacity(filmTime, 38.9, 39.45, 99, 99) * (1 - contactFade);
    setSectionState(sections.contact, contactOp);

    // Keep the waving figure clearly visible behind the frosted Outro card
    const filmExit = smoothstep(clamp((outroP - 0.08) / 0.42, 0, 1));
    const filmOpVal = lerp(1, 0.64, filmExit).toFixed(3);
    if (filmOpVal !== lastFilmOp) {
      filmBox.style.setProperty('--film-op', filmOpVal);
      filmBox.style.setProperty('--film-s', lerp(1, 0.985, filmExit).toFixed(4));
      lastFilmOp = filmOpVal;
    }

    // Finale / Closing Thank-You Card choreography
    const outroEase = easeOutCubic(clamp((outroP - 0.14) / 0.52, 0, 1));
    outroBackdrop.style.setProperty('--outro-dim', smoothstep(clamp((outroP - 0.06) / 0.45, 0, 1)).toFixed(3));
    setSectionState(sections.outro, outroEase);
    sections.outro.classList.toggle('is-shown', outroP > 0.24);
    if (outroEase > 0.01) {
      sections.outro.style.setProperty('--outro-y', `${((1 - outroEase) * 32).toFixed(1)}px`);
      sections.outro.style.setProperty('--outro-s', lerp(0.95, 1, outroEase).toFixed(3));
      sections.outro.style.setProperty('--outro-mob-y', `${((1 - outroEase) * 24).toFixed(1)}px`);
    }

    requestAnimationFrame(render);
  }

  window.addEventListener('resize', () => computeLayout(false));
  mobileQuery.addEventListener('change', (e) => {
    computeLayout(true);
    loadFilm(e.matches);
  });

  computeLayout(true);
  loadFilm(isMobile);
  requestAnimationFrame(render);
})();
