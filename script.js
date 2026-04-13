document.addEventListener('DOMContentLoaded', () => {
  setupIntroAnimation();
  updateCurrentYear();
  setupQuoteForm();
  applyServiceFromUrl();
  setupCounters();
  setupHomepageMotion();
  setupServicesDropdown();
  setupMobileMenuLinkCloseFallback();
});

const SERVICE_MENU_ITEMS = [
  { label: 'Interior Renovation', slug: 'interior-renovation' },
  { label: 'Modular Kitchen', slug: 'modular-kitchen' },
  { label: 'Wardrobes', slug: 'wardrobes' },
  { label: 'Prayer Area', slug: 'prayer-area' },
  { label: 'Bed Cots', slug: 'bed-cots' },
  { label: 'Partitions', slug: 'partitions' },
  { label: 'TV Units', slug: 'tv-units' },
  { label: 'Crockery Shelf', slug: 'crockery-shelf' },
  { label: 'Wall Paneling', slug: 'wall-paneling' },
  { label: 'False Ceiling Works', slug: 'false-ceiling-works' },
  { label: 'Handrails', slug: 'handrails' },
  { label: 'Putty / Painting', slug: 'putty-painting' },
  { label: 'Wallpaper / Texture', slug: 'wallpaper-texture' },
  { label: 'Curtains', slug: 'curtains' },
  { label: 'Electrical / Plumping', slug: 'electrical-plumping' },
  { label: 'Tiling', slug: 'tiling' },
  { label: 'Bathroom Doors', slug: 'bathroom-doors' },
  { label: 'Space Planning', slug: 'space-planning' },
  { label: '3D Visualization', slug: 'visualization-3d' },
  { label: 'Estimations', slug: 'estimations' }
];

function markIntroComplete(root = document.documentElement) {
  if (root.dataset.introComplete === 'true') {
    return;
  }

  root.dataset.introComplete = 'true';
  document.dispatchEvent(new CustomEvent('dreamnest:intro-complete'));
}

function motionIsReduced() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function hasFinePointer() {
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
}

function setupIntroAnimation() {
  const root = document.documentElement;
  const intro = document.getElementById('siteIntro');

  if (!intro) {
    markIntroComplete(root);
    return;
  }

  const shouldAnimate = root.classList.contains('intro-pending');

  if (!shouldAnimate) {
    intro.remove();
    markIntroComplete(root);
    return;
  }

  const logo = intro.querySelector('.site-intro__logo');
  const startedAt = window.performance ? performance.now() : Date.now();
  let hasFinished = false;
  let releaseQueued = false;
  let pageReady = document.readyState === 'complete';
  let logoReady = !logo || logo.complete;
  let exitTimer;
  let cleanupTimer;

  const onKeyDown = (event) => {
    if (event.key === 'Escape') {
      startExit();
    }
  };

  const cleanup = () => {
    if (hasFinished) {
      return;
    }

    hasFinished = true;
    window.clearTimeout(exitTimer);
    window.clearTimeout(cleanupTimer);
    document.removeEventListener('keydown', onKeyDown);
    root.classList.remove('intro-playing', 'intro-exit', 'intro-pending');
    intro.remove();
    markIntroComplete(root);

    try {
      sessionStorage.setItem('dreamnestIntroSeen', '1');
    } catch (error) {
      // Ignore storage access issues and continue.
    }
  };

  const startExit = () => {
    if (hasFinished || root.classList.contains('intro-exit')) {
      return;
    }

    root.classList.add('intro-exit');
    cleanupTimer = window.setTimeout(cleanup, 720);
  };

  const queueExit = () => {
    if (releaseQueued || hasFinished) {
      return;
    }

    releaseQueued = true;
    const elapsed = (window.performance ? performance.now() : Date.now()) - startedAt;
    const remainingIntroTime = Math.max(1200 - elapsed, 0);
    exitTimer = window.setTimeout(startExit, remainingIntroTime);
  };

  const tryRelease = () => {
    if (pageReady && logoReady) {
      queueExit();
    }
  };

  root.classList.add('intro-playing');
  intro.addEventListener('click', startExit, { once: true });
  document.addEventListener('keydown', onKeyDown);

  if (logo && !logo.complete) {
    logo.addEventListener('load', () => {
      logoReady = true;
      tryRelease();
    }, { once: true });

    logo.addEventListener('error', () => {
      logoReady = true;
      tryRelease();
    }, { once: true });
  }

  if (!pageReady) {
    window.addEventListener('load', () => {
      pageReady = true;
      tryRelease();
    }, { once: true });
  }

  tryRelease();
  window.setTimeout(startExit, 2800);
}

function updateCurrentYear() {
  const yearSpan = document.getElementById('current-year');

  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}

function setupQuoteForm() {
  const quoteForm = document.getElementById('quote-form');

  if (!quoteForm) {
    return;
  }

  quoteForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.getElementById('name')?.value || '';
    const phone = document.getElementById('phone')?.value || '';
    const area = document.getElementById('area')?.value || '';
    const service = document.getElementById('service')?.value || '';
    const budget = document.getElementById('budget')?.value || '';

    const message = `Hello Dream Nest! I want a Free Quote.%0A%0A*Name:* ${name}%0A*Phone:* ${phone}%0A*Area:* ${area}%0A*Service:* ${service}%0A*Budget:* ${budget}`;
    window.open(`https://wa.me/923036047227?text=${message}`, '_blank');
  });
}

function applyServiceFromUrl() {
  const serviceSelect = document.getElementById('service');

  if (!serviceSelect) {
    return;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const serviceParam = urlParams.get('service');

  if (!serviceParam) {
    return;
  }

  const serviceMap = {
    wallpaper: 'Wallpaper',
    'pvc-floor': 'PVC Vinyl Floor',
    'wooden-floor': 'Wooden Floor',
    blinds: 'Window Blinds',
    curtains: 'Curtains',
    carpet: 'Carpet',
    'astro-turf': 'Astro Turf',
    'interior-renovation': 'Interior Renovation',
    'modular-kitchen': 'Modular Kitchen',
    wardrobes: 'Wardrobes',
    'prayer-area': 'Prayer Area',
    'bed-cots': 'Bed Cots',
    partitions: 'Partitions',
    'tv-units': 'TV Units',
    'crockery-shelf': 'Crockery Shelf',
    'wall-paneling': 'Wall Paneling',
    'false-ceiling-works': 'False Ceiling Works',
    handrails: 'Handrails',
    'putty-painting': 'Putty / Painting',
    'wallpaper-texture': 'Wallpaper / Texture',
    'electrical-plumping': 'Electrical / Plumping',
    tiling: 'Tiling',
    'bathroom-doors': 'Bathroom Doors',
    'space-planning': 'Space Planning',
    'visualization-3d': '3D Visualization',
    estimations: 'Estimations'
  };

  const mappedService = serviceMap[serviceParam.toLowerCase()] || serviceParam;

  for (let index = 0; index < serviceSelect.options.length; index += 1) {
    if (serviceSelect.options[index].value === mappedService) {
      serviceSelect.selectedIndex = index;
      break;
    }
  }
}

function setupCounters() {
  const counters = document.querySelectorAll('.counter');
  const statsSection = document.querySelector('.stats');

  if (!counters.length || !statsSection) {
    return;
  }

  const setFinalValue = (counter) => {
    const target = Number(counter.getAttribute('data-target')) || 0;
    const suffix = counter.getAttribute('data-suffix') || '';
    counter.innerText = `${target}${suffix}`;
  };

  if (motionIsReduced()) {
    counters.forEach(setFinalValue);
    return;
  }

  const animateCounter = (counter) => {
    if (counter.dataset.counted === 'true') {
      return;
    }

    const target = Number(counter.getAttribute('data-target')) || 0;
    const suffix = counter.getAttribute('data-suffix') || '';
    const duration = 1400;
    let startTime;

    counter.dataset.counted = 'true';

    const step = (timestamp) => {
      if (startTime === undefined) {
        startTime = timestamp;
      }

      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      counter.innerText = `${Math.round(target * easedProgress)}${suffix}`;

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  };

  const startCounting = () => {
    counters.forEach(animateCounter);
  };

  if (!('IntersectionObserver' in window)) {
    startCounting();
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      startCounting();
      observer.disconnect();
    }
  }, { threshold: 0.5 });

  observer.observe(statsSection);
}

function setupHomepageMotion() {
  if (motionIsReduced()) {
    return;
  }

  const motionTargets = document.querySelectorAll('.motion-reveal, .magnetic, .tilt-card');

  if (!motionTargets.length) {
    return;
  }

  setupScrollReveals();
  setupHeroReveals();
  setupMagneticInteractions();
  setupTiltCards();
}

function setupHeroReveals() {
  const heroReveals = document.querySelectorAll('.hero-reveal');

  if (!heroReveals.length) {
    return;
  }

  const revealHeroItems = () => {
    window.requestAnimationFrame(() => {
      heroReveals.forEach((item) => {
        item.classList.add('is-visible');
      });
    });
  };

  if (document.documentElement.dataset.introComplete === 'true') {
    revealHeroItems();
    return;
  }

  document.addEventListener('dreamnest:intro-complete', revealHeroItems, { once: true });
}

function setupScrollReveals() {
  const revealItems = document.querySelectorAll('.motion-reveal:not(.hero-reveal)');

  if (!revealItems.length) {
    return;
  }

  if (!('IntersectionObserver' in window)) {
    revealItems.forEach((item) => {
      item.classList.add('is-visible');
    });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.18,
    rootMargin: '0px 0px -10% 0px'
  });

  revealItems.forEach((item) => {
    observer.observe(item);
  });
}

function setupMagneticInteractions() {
  if (!hasFinePointer()) {
    return;
  }

  const magneticItems = document.querySelectorAll('.magnetic');

  magneticItems.forEach((item) => {
    let frameId = 0;

    const resetPosition = () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }

      frameId = window.requestAnimationFrame(() => {
        item.style.setProperty('--magnetic-x', '0px');
        item.style.setProperty('--magnetic-y', '0px');
        frameId = 0;
      });
    };

    item.addEventListener('pointermove', (event) => {
      const rect = item.getBoundingClientRect();
      const strength = Number(item.getAttribute('data-magnetic-strength')) || 14;
      const offsetX = (((event.clientX - rect.left) / rect.width) - 0.5) * strength;
      const offsetY = (((event.clientY - rect.top) / rect.height) - 0.5) * strength;

      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }

      frameId = window.requestAnimationFrame(() => {
        item.style.setProperty('--magnetic-x', `${offsetX.toFixed(2)}px`);
        item.style.setProperty('--magnetic-y', `${offsetY.toFixed(2)}px`);
        frameId = 0;
      });
    });

    item.addEventListener('pointerleave', resetPosition);
    item.addEventListener('pointercancel', resetPosition);
  });
}

function setupTiltCards() {
  if (!hasFinePointer()) {
    return;
  }

  const tiltCards = document.querySelectorAll('.tilt-card');

  tiltCards.forEach((card) => {
    let frameId = 0;

    const resetTilt = () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }

      frameId = window.requestAnimationFrame(() => {
        card.style.setProperty('--tilt-rotate-x', '0deg');
        card.style.setProperty('--tilt-rotate-y', '0deg');
        card.style.setProperty('--pointer-x', '50%');
        card.style.setProperty('--pointer-y', '50%');
        frameId = 0;
      });
    };

    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const pointerX = (event.clientX - rect.left) / rect.width;
      const pointerY = (event.clientY - rect.top) / rect.height;
      const rotateY = (pointerX - 0.5) * 10;
      const rotateX = (0.5 - pointerY) * 10;

      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }

      frameId = window.requestAnimationFrame(() => {
        card.style.setProperty('--tilt-rotate-x', `${rotateX.toFixed(2)}deg`);
        card.style.setProperty('--tilt-rotate-y', `${rotateY.toFixed(2)}deg`);
        card.style.setProperty('--pointer-x', `${(pointerX * 100).toFixed(2)}%`);
        card.style.setProperty('--pointer-y', `${(pointerY * 100).toFixed(2)}%`);
        frameId = 0;
      });
    });

    card.addEventListener('pointerleave', resetTilt);
    card.addEventListener('pointercancel', resetTilt);
  });
}

function setupServicesDropdown() {
  const desktopServicesLink = document.querySelector('.nav-links > li > a[href="services.html"]');
  const mobileServicesLink = document.querySelector('.mobile-menu ul > li > a[href="services.html"]');

  if (!desktopServicesLink && !mobileServicesLink) {
    return;
  }

  injectServicesDropdownStyles();

  if (desktopServicesLink) {
    buildDesktopServicesDropdown(desktopServicesLink);
  }

  if (mobileServicesLink) {
    buildMobileServicesDropdown(mobileServicesLink);
  }

  setupDesktopDropdownInteractions();
}

function injectServicesDropdownStyles() {
  if (document.getElementById('servicesDropdownStyles')) {
    return;
  }

  const style = document.createElement('style');
  style.id = 'servicesDropdownStyles';
  style.textContent = `
    .services-dropdown {
      position: relative;
    }

    .services-dropdown__toggle {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      background: none;
      border: none;
      padding: 0;
      font: inherit;
      font-weight: 500;
      font-size: 0.95rem;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      white-space: nowrap;
      color: inherit;
      cursor: pointer;
      transition: color 0.3s ease;
    }

    .services-dropdown__toggle:hover,
    .services-dropdown__toggle:focus-visible,
    .services-dropdown.is-open .services-dropdown__toggle,
    .services-dropdown__toggle.active {
      color: var(--accent);
      outline: none;
    }

    .services-dropdown__toggle i {
      font-size: 0.72rem;
      transition: transform 0.3s ease;
    }

    .services-dropdown.is-open .services-dropdown__toggle i {
      transform: rotate(180deg);
    }

    .services-dropdown__menu {
      position: absolute;
      top: calc(100% + 1rem);
      left: 50%;
      width: min(320px, 82vw);
      padding: 0.8rem;
      border-radius: 20px;
      background: rgba(255, 255, 255, 0.98);
      border: 1px solid rgba(var(--accent-rgb), 0.14);
      box-shadow: 0 24px 60px rgba(7, 7, 7, 0.16);
      transform: translate(-50%, 12px);
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
      transition: opacity 0.24s ease, transform 0.24s ease, visibility 0.24s ease;
      backdrop-filter: blur(16px);
      z-index: 1200;
    }

    .services-dropdown.is-open .services-dropdown__menu {
      transform: translate(-50%, 0);
      opacity: 1;
      visibility: visible;
      pointer-events: auto;
    }

    .services-dropdown__item,
    .services-dropdown__more {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 0.9rem 1rem;
      border-radius: 14px;
      color: var(--primary) !important;
      font-size: 0.96rem !important;
      font-weight: 500;
      letter-spacing: 0 !important;
      text-transform: none !important;
      background: transparent;
      transition: background 0.24s ease, color 0.24s ease, transform 0.24s ease;
    }

    .services-dropdown__item:hover,
    .services-dropdown__more:hover {
      background: var(--cream);
      color: var(--accent) !important;
      transform: translateX(4px);
    }

    .services-dropdown__more {
      margin-top: 0.35rem;
      border-top: 1px solid rgba(var(--accent-rgb), 0.08);
      border-radius: 0 0 14px 14px;
      padding-top: 1rem;
      font-weight: 600;
    }

    .mobile-services-dropdown {
      display: block !important;
    }

    .mobile-services-toggle {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      background: transparent;
      border: none;
      color: var(--primary);
      padding: 1rem 1.2rem;
      border-radius: 12px;
      font: inherit;
      font-size: 1.1rem;
      font-weight: 500;
      text-align: left;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .mobile-services-toggle:hover,
    .mobile-services-toggle:focus-visible,
    .mobile-services-toggle.active {
      background: var(--cream);
      color: var(--accent);
      outline: none;
    }

    .mobile-services-toggle i {
      font-size: 0.82rem;
      transition: transform 0.3s ease;
    }

    .mobile-services-dropdown.is-open .mobile-services-toggle i {
      transform: rotate(180deg);
    }

    .mobile-services-menu {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.35s ease;
      padding-left: 0.85rem;
    }

    .mobile-services-dropdown.is-open .mobile-services-menu {
      max-height: 640px;
    }

    .mobile-services-item,
    .mobile-services-more {
      display: block;
      padding: 0.85rem 1rem;
      margin-top: 0.45rem;
      border-radius: 12px;
      background: rgba(var(--accent-rgb), 0.05);
      color: var(--primary) !important;
      font-size: 0.96rem !important;
      font-weight: 500;
      letter-spacing: 0 !important;
      text-transform: none !important;
      transition: all 0.3s ease;
    }

    .mobile-services-item:hover,
    .mobile-services-more:hover {
      background: var(--cream);
      color: var(--accent) !important;
      transform: translateX(8px);
    }

    .mobile-services-more {
      margin-top: 0.65rem;
      font-weight: 600;
    }
  `;

  document.head.appendChild(style);
}

function buildDesktopServicesDropdown(link) {
  const parentItem = link.parentElement;

  if (!parentItem || parentItem.classList.contains('services-dropdown')) {
    return;
  }

  const isActive = link.classList.contains('active');
  const featuredServices = SERVICE_MENU_ITEMS.slice(0, 6);
  const menuMarkup = featuredServices.map((service) => `
    <a href="services.html#${service.slug}" class="services-dropdown__item" role="menuitem">
      <span>${service.label}</span>
      <i class="fas fa-arrow-right"></i>
    </a>
  `).join('');

  parentItem.classList.add('services-dropdown');
  parentItem.innerHTML = `
    <button type="button" class="services-dropdown__toggle${isActive ? ' active' : ''}" aria-expanded="false" aria-haspopup="true">
      <span>Services</span>
      <i class="fas fa-chevron-down" aria-hidden="true"></i>
    </button>
    <div class="services-dropdown__menu" role="menu">
      ${menuMarkup}
      <a href="services.html#all-services" class="services-dropdown__more" role="menuitem">See More Services</a>
    </div>
  `;
}

function buildMobileServicesDropdown(link) {
  const parentItem = link.parentElement;

  if (!parentItem || parentItem.classList.contains('mobile-services-dropdown')) {
    return;
  }

  const isActive = link.classList.contains('active');
  const featuredServices = SERVICE_MENU_ITEMS.slice(0, 6);
  const submenuMarkup = featuredServices.map((service) => `
    <a href="services.html#${service.slug}" class="mobile-services-item">${service.label}</a>
  `).join('');

  parentItem.classList.add('mobile-services-dropdown');
  if (isActive) {
    parentItem.classList.add('is-open');
  }

  parentItem.innerHTML = `
    <button type="button" class="mobile-services-toggle${isActive ? ' active' : ''}" aria-expanded="${isActive ? 'true' : 'false'}">
      <span>Services</span>
      <i class="fas fa-chevron-down" aria-hidden="true"></i>
    </button>
    <div class="mobile-services-menu">
      ${submenuMarkup}
      <a href="services.html#all-services" class="mobile-services-more">See More Services</a>
    </div>
  `;

  const toggle = parentItem.querySelector('.mobile-services-toggle');

  if (!toggle) {
    return;
  }

  toggle.addEventListener('click', () => {
    const isOpen = parentItem.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });
}

function setupDesktopDropdownInteractions() {
  const desktopDropdown = document.querySelector('.services-dropdown');
  const toggle = desktopDropdown?.querySelector('.services-dropdown__toggle');

  if (!desktopDropdown || !toggle) {
    return;
  }

  const closeDropdown = () => {
    desktopDropdown.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  };

  toggle.addEventListener('click', (event) => {
    event.preventDefault();
    const isOpen = desktopDropdown.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  document.addEventListener('click', (event) => {
    if (desktopDropdown.contains(event.target)) {
      return;
    }

    closeDropdown();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeDropdown();
    }
  });
}

function setupMobileMenuLinkCloseFallback() {
  const mobileMenu = document.getElementById('mobileMenu');
  const menuToggle = document.getElementById('menuToggle');
  const mobileOverlay = document.getElementById('mobileOverlay');

  if (!mobileMenu || !menuToggle || !mobileOverlay) {
    return;
  }

  mobileMenu.addEventListener('click', (event) => {
    const link = event.target.closest('a');

    if (!link) {
      return;
    }

    menuToggle.classList.remove('active');
    mobileMenu.classList.remove('active');
    mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
  });
}
