document.addEventListener('DOMContentLoaded', () => {
  setupIntroAnimation();
  updateCurrentYear();
  setupQuoteForm();
  applyServiceFromUrl();
  setupCounters();
  setupHomepageMotion();
});

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
    'astro-turf': 'Astro Turf'
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
