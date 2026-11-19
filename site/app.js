/**
 * Cinematic AI Character Portfolio - Scroll Engine & Controller
 * Strictly follows AI_Character_Portfolio_Visual_Guide.pdf
 */

(function () {
  'use strict';

  // Retrieve configuration
  const CFG = window.CONFIG || {};

  // DOM Elements
  const DOM = {
    loader: document.getElementById('loader'),
    loaderFill: document.getElementById('loader-fill'),
    loaderPct: document.getElementById('loader-pct'),
    progressBar: document.getElementById('progress-bar'),
    navbar: document.getElementById('navbar'),
    navMenu: document.getElementById('nav-menu'),
    navToggle: document.getElementById('nav-toggle'),
    navLinks: document.querySelectorAll('.nav-link'),
    brandLink: document.getElementById('brand-link'),
    stage: document.getElementById('stage'),
    film: document.getElementById('film'),
    characterFrame: document.getElementById('character-frame'),
    scrollTrack: document.getElementById('scroll-track'),
    scrollHint: document.getElementById('scroll-hint'),
    sections: {
      intro: document.getElementById('section-intro'),
      about: document.getElementById('section-about'),
      work: document.getElementById('section-work'),
      skills: document.getElementById('section-skills'),
      resume: document.getElementById('section-resume'),
      contact: document.getElementById('section-contact')
    },
    projectsContainer: document.getElementById('projects-container'),
    skillsContainer: document.getElementById('skills-container'),
    statsContainer: document.getElementById('cfg-stats-container'),
    contactForm: document.getElementById('contact-form'),
    formFeedback: document.getElementById('form-feedback')
  };

  // ---------------------------------------------------------------------------
  // 1. SEGMENTS SPECIFICATION (Visual Guide Pages 14-15)
  // ---------------------------------------------------------------------------
  const segments = [
    { t: [0.0, 7.6],   h: 1.5, id: 'intro-approach' },
    { t: [7.6, 7.6],   h: 1.4, id: 'intro' },          // HOLD: Move 01 finishes turn
    { t: [7.6, 14.6],  h: 1.5, id: 'about-approach' },
    { t: [14.6, 14.6], h: 1.5, id: 'about' },          // HOLD: Move 02 close-up
    { t: [14.6, 26.5], h: 2.0, id: 'work-approach' },
    { t: [26.5, 26.5], h: 1.8, id: 'work' },           // HOLD: Move 04 typing at desk
    { t: [26.5, 37.5], h: 2.0, id: 'skills-approach' },
    { t: [37.5, 37.5], h: 1.5, id: 'skills' },         // HOLD: Move 05 walks left
    { t: [37.5, 42.3], h: 1.4, id: 'resume-drop' },
    { t: [42.3, 42.3], h: 1.5, id: 'resume' },         // HOLD: Move 06a pulls down
    { t: [42.3, 45.7], h: 1.3, id: 'contact-wave' },
    { t: [45.7, 46.0], h: 1.6, id: 'contact' }         // HOLD: Move 06b waves hello
  ];

  // Section time windows for fade transitions (Page 15)
  const timingWindows = {
    intro:   { start: 2.0,  hold: 7.6,  end: 8.8,  stageX: '20vw' },
    about:   { start: 10.0, hold: 14.6, end: 16.5, stageX: '-18vw' },
    work:    { start: 24.0, hold: 26.5, end: 29.5, stageX: '-16vw' },
    skills:  { start: 30.5, hold: 37.5, end: 39.5, stageX: '-18vw' },
    resume:  { start: 39.5, hold: 42.3, end: 43.8, stageX: '0vw' },
    contact: { start: 44.0, hold: 45.7, end: 46.0, stageX: '-16vw' }
  };

  // State variables
  let totalTrackHeight = 0;
  let segmentOffsets = [];
  let currentTargetTime = 0;
  let smoothedPlayhead = 0;
  let isSeeking = false;
  let activeSectionKey = 'intro';
  let hasScrolled = false;

  // ---------------------------------------------------------------------------
  // 2. INITIALIZE CONTENT FROM CONFIG
  // ---------------------------------------------------------------------------
  function populateContent() {
    if (!CFG.name) return;

    // Headings and Meta
    const line1 = document.getElementById('cfg-name-line1');
    const line2 = document.getElementById('cfg-name-line2');
    const role = document.getElementById('cfg-role');
    const status = document.getElementById('cfg-status');
    const aboutTitle = document.getElementById('cfg-about-title');
    const about = document.getElementById('cfg-about');
    const githubLink = document.getElementById('cfg-github');
    const linkedinLink = document.getElementById('cfg-linkedin');
    const emailLink = document.getElementById('cfg-email');

    if (line1) line1.textContent = CFG.nameLine1 || "S. J.";
    if (line2) line2.textContent = CFG.nameLine2 || "SURYAKANTH";
    if (role) role.textContent = CFG.role || "";
    if (status) status.textContent = CFG.status || "";
    if (aboutTitle) aboutTitle.textContent = CFG.aboutTitle || "";
    if (about) about.textContent = CFG.about || "";

    if (githubLink && CFG.social) githubLink.href = CFG.social.github || "#";
    if (linkedinLink && CFG.social) linkedinLink.href = CFG.social.linkedin || "#";
    if (emailLink && CFG.email) emailLink.href = "mailto:" + CFG.email;

    // Stats
    if (DOM.statsContainer && CFG.stats) {
      DOM.statsContainer.innerHTML = CFG.stats.map(s => `
        <div class="stat-box">
          <span class="stat-value">${s.value}</span>
          <span class="stat-label">${s.label}</span>
        </div>
      `).join('');
    }

    // Projects Grid (Cards fly in from the laptop side)
    if (DOM.projectsContainer && CFG.projects) {
      DOM.projectsContainer.innerHTML = CFG.projects.map(p => `
        <article class="project-card">
          <div class="project-top">
            <span class="project-tech">${p.tech}</span>
            <h3 class="project-title">${p.title}</h3>
            <p class="project-desc">${p.description}</p>
          </div>
          <div class="project-footer">
            <span class="project-tag">${p.featured ? 'Featured Build' : 'Interactive'}</span>
            <a href="${p.codeUrl}" target="_blank" rel="noopener" class="project-link">
              <span>View Code</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
            </a>
          </div>
        </article>
      `).join('');
    }

    // Skills Categorized
    if (DOM.skillsContainer && CFG.skillCategories) {
      DOM.skillsContainer.innerHTML = CFG.skillCategories.map(cat => `
        <div class="skill-category-box">
          <h4 class="category-name">${cat.category}</h4>
          <div class="skill-chips">
            ${cat.skills.map(skill => `<span class="skill-chip">${skill}</span>`).join('')}
          </div>
        </div>
      `).join('');
    }
  }

  // ---------------------------------------------------------------------------
  // 3. TRACK CALCULATIONS & SCROLL MAPPING
  // ---------------------------------------------------------------------------
  function computeTrackDimensions() {
    const vh = window.innerHeight;
    let accumulated = 0;
    segmentOffsets = [];

    segments.forEach(seg => {
      const segPixelHeight = seg.h * vh;
      segmentOffsets.push({
        seg,
        startPx: accumulated,
        endPx: accumulated + segPixelHeight,
        heightPx: segPixelHeight
      });
      accumulated += segPixelHeight;
    });

    totalTrackHeight = accumulated;
    if (DOM.scrollTrack) {
      DOM.scrollTrack.style.height = `${totalTrackHeight + vh}px`;
    }
  }

  function scrollYToFilmTime(scrollY) {
    if (scrollY <= 0) return segments[0].t[0];
    if (scrollY >= totalTrackHeight) return segments[segments.length - 1].t[1];

    for (let i = 0; i < segmentOffsets.length; i++) {
      const item = segmentOffsets[i];
      if (scrollY >= item.startPx && scrollY <= item.endPx) {
        const seg = item.seg;
        if (seg.t[0] === seg.t[1]) {
          // In a HOLD
          return seg.t[0];
        }
        const fraction = (scrollY - item.startPx) / item.heightPx;
        return seg.t[0] + fraction * (seg.t[1] - seg.t[0]);
      }
    }
    return segments[0].t[0];
  }

  function holdTimeToScrollY(targetTime) {
    // Finds the center of the hold segment for smooth scrolling navigation
    for (let i = 0; i < segmentOffsets.length; i++) {
      const item = segmentOffsets[i];
      if (item.seg.t[0] === targetTime && item.seg.t[1] === targetTime) {
        return item.startPx + (item.heightPx * 0.5);
      }
    }
    return 0;
  }

  // ---------------------------------------------------------------------------
  // 4. VIDEO PRELOAD & INITIALIZATION
  // ---------------------------------------------------------------------------
  function initVideo() {
    const isMobile = window.innerWidth <= 760;
    const filmSrc = isMobile
      ? (CFG.media && CFG.media.mobileFilm ? CFG.media.mobileFilm : 'media/film_mobile.mp4')
      : (CFG.media && CFG.media.desktopFilm ? CFG.media.desktopFilm : 'media/film.mp4');

    const updateLoader = (pct) => {
      if (DOM.loaderFill) DOM.loaderFill.style.width = `${pct}%`;
      if (DOM.loaderPct) DOM.loaderPct.textContent = `${Math.round(pct)}%`;
      if (DOM.loader) DOM.loader.setAttribute('aria-valuenow', Math.round(pct));
    };

    const finishLoading = () => {
      updateLoader(100);
      setTimeout(() => {
        if (DOM.loader) DOM.loader.classList.add('is-hidden');
        document.body.classList.remove('is-loading');
      }, 350);
    };

    // iOS Touch to unlock seeking
    const unlockIOS = () => {
      DOM.film.play().then(() => {
        DOM.film.pause();
      }).catch(() => {});
      window.removeEventListener('touchstart', unlockIOS);
    };
    window.addEventListener('touchstart', unlockIOS, { once: true });

    // Download video with fetch + progress if supported, fallback to direct src
    fetch(filmSrc)
      .then(response => {
        if (!response.ok) throw new Error('Fetch failed');
        const contentLength = response.headers.get('content-length');
        if (!contentLength || !response.body) {
          throw new Error('No content-length for progress stream');
        }

        const total = parseInt(contentLength, 10);
        let loaded = 0;
        const reader = response.body.getReader();

        return new Response(
          new ReadableStream({
            start(controller) {
              function push() {
                reader.read().then(({ done, value }) => {
                  if (done) {
                    controller.close();
                    return;
                  }
                  loaded += value.byteLength;
                  const pct = Math.min(99, (loaded / total) * 100);
                  updateLoader(pct);
                  controller.enqueue(value);
                  push();
                }).catch(err => controller.error(err));
              }
              push();
            }
          })
        ).blob();
      })
      .then(blob => {
        const blobUrl = URL.createObjectURL(blob);
        DOM.film.src = blobUrl;
        DOM.film.load();
        finishLoading();
      })
      .catch(() => {
        // Fallback: direct src assignment
        DOM.film.src = filmSrc;
        DOM.film.load();

        let progressInterval = setInterval(() => {
          if (DOM.film.readyState >= 2) {
            clearInterval(progressInterval);
            finishLoading();
          }
        }, 150);

        // Safety fallback: dismiss loader after 2.5s maximum
        setTimeout(() => {
          clearInterval(progressInterval);
          finishLoading();
        }, 2500);
      });

    DOM.film.addEventListener('seeking', () => { isSeeking = true; });
    DOM.film.addEventListener('seeked', () => { isSeeking = false; });
  }

  // ---------------------------------------------------------------------------
  // 5. RENDER LOOP (60fps Scroll Scrubbing with Lerp Smoothing)
  // ---------------------------------------------------------------------------
  function updateSectionsAndStage(time) {
    const isDesktop = window.innerWidth > 760;

    // Detect active section based on timing windows
    let matchedSection = 'intro';
    for (const [key, win] of Object.entries(timingWindows)) {
      if (time >= win.start && time <= win.end) {
        matchedSection = key;
        break;
      }
    }

    if (matchedSection !== activeSectionKey) {
      activeSectionKey = matchedSection;

      // Update section classes
      Object.entries(DOM.sections).forEach(([k, el]) => {
        if (!el) return;
        if (k === activeSectionKey) {
          el.classList.add('active');
        } else {
          el.classList.remove('active');
        }
      });

      // Update Navigation links
      DOM.navLinks.forEach(link => {
        if (link.dataset.target === activeSectionKey) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });

      // Stage horizontal lateral shift for desktop
      if (isDesktop && DOM.stage) {
        const stageX = timingWindows[activeSectionKey]?.stageX || '0vw';
        DOM.stage.style.setProperty('--stage-x', stageX);
      }
    }

    // Contact SVG frame tracking
    if (DOM.characterFrame) {
      if (time >= 43.5) {
        DOM.characterFrame.classList.add('is-active');
        if (time >= 43.9) {
          DOM.characterFrame.classList.add('is-drawn');
        } else {
          DOM.characterFrame.classList.remove('is-drawn');
        }
      } else {
        DOM.characterFrame.classList.remove('is-active', 'is-drawn');
      }
    }

    // Top progress bar percentage
    if (DOM.progressBar) {
      const scrollMax = totalTrackHeight || 1;
      const pct = Math.min(100, Math.max(0, (window.scrollY / scrollMax) * 100));
      DOM.progressBar.style.width = `${pct}%`;
    }

    // Scroll hint fadeout
    if (window.scrollY > 40 && !hasScrolled) {
      hasScrolled = true;
      if (DOM.scrollHint) DOM.scrollHint.classList.add('is-faded');
    }
  }

  function tick() {
    currentTargetTime = scrollYToFilmTime(window.scrollY);

    // Playhead lerp smoothing: ~0.16 per frame (Page 14)
    smoothedPlayhead += (currentTargetTime - smoothedPlayhead) * 0.16;

    // Only seek when gap > 0.02s and video is ready and not already seeking
    if (DOM.film && DOM.film.readyState >= 1) {
      const diff = Math.abs(DOM.film.currentTime - smoothedPlayhead);
      if (diff > 0.02 && !isSeeking) {
        DOM.film.currentTime = smoothedPlayhead;
      }
    }

    updateSectionsAndStage(smoothedPlayhead);
    requestAnimationFrame(tick);
  }

  // ---------------------------------------------------------------------------
  // 6. EVENT LISTENERS & INTERACTIVITY
  // ---------------------------------------------------------------------------
  function setupEvents() {
    // Window Resize
    window.addEventListener('resize', () => {
      computeTrackDimensions();
    });

    // Navigation Smooth Scroll to Section Holds
    document.querySelectorAll('[data-target]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetKey = btn.dataset.target;
        const holdTime = timingWindows[targetKey]?.hold ?? 0;
        const targetScrollY = holdTimeToScrollY(holdTime);

        window.scrollTo({
          top: targetScrollY,
          behavior: 'smooth'
        });

        // Close mobile nav if open
        if (DOM.navMenu) DOM.navMenu.classList.remove('is-open');
      });
    });

    // Brand Link (Back to top)
    if (DOM.brandLink) {
      DOM.brandLink.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // Mobile Nav Toggle
    if (DOM.navToggle && DOM.navMenu) {
      DOM.navToggle.addEventListener('click', () => {
        const isOpen = DOM.navMenu.classList.toggle('is-open');
        DOM.navToggle.setAttribute('aria-expanded', isOpen);
      });
    }

    // Contact Form handling
    if (DOM.contactForm) {
      DOM.contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('form-name')?.value.trim();
        const email = document.getElementById('form-email')?.value.trim();
        const msg = document.getElementById('form-msg')?.value.trim();

        if (!name || !email || !msg) {
          if (DOM.formFeedback) {
            DOM.formFeedback.textContent = "Please fill in all fields.";
            DOM.formFeedback.style.color = "#ff6b6b";
          }
          return;
        }

        const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
        const body = encodeURIComponent(`Hi Suryakanth,\n\n${msg}\n\nFrom: ${name} (${email})`);
        const mailtoUrl = `mailto:${CFG.email || 'suryakanth2004sk@gmail.com'}?subject=${subject}&body=${body}`;

        if (DOM.formFeedback) {
          DOM.formFeedback.textContent = "Opening your email client to send message...";
          DOM.formFeedback.style.color = "#34d399";
        }

        setTimeout(() => {
          window.location.href = mailtoUrl;
        }, 500);
      });
    }
  }

  // ---------------------------------------------------------------------------
  // 7. INITIALIZE
  // ---------------------------------------------------------------------------
  function init() {
    populateContent();
    computeTrackDimensions();
    initVideo();
    setupEvents();
    requestAnimationFrame(tick);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
