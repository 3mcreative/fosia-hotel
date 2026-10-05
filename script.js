(() => {
  // ---------------------------------------------------------
  // NAVIGATION — right-side off-canvas menu + gentle links
  // ---------------------------------------------------------
  const menu = document.getElementById('mobileMenu');
  const toggle = document.getElementById('menuToggle');
  const menuBackdrop = (() => {
    if (!menu) return null;
    let backdrop = document.querySelector('.menu-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'menu-backdrop';
      backdrop.setAttribute('aria-hidden', 'true');
      document.body.appendChild(backdrop);
    }
    return backdrop;
  })();
  const setMenu = (open) => {
    if (!menu || !toggle) return;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    toggle.classList.toggle('is-open', open);
    const label = toggle.querySelector('span');
    const icon = toggle.querySelector('iconify-icon');
    if (label) label.textContent = open ? 'CLOSE' : 'MENU';
    if (icon) icon.setAttribute('icon', open ? 'tabler:x' : 'tabler:menu-3');

    // The drawer uses one persistent off-canvas element, matching the
    // CodePen pattern: closed = translated outside the viewport, open =
    // translated back to its resting position. CSS transition handles both
    // directions, so there is no animation/visibility race condition.
    menu.classList.toggle('open', open);
    if (open) menu.scrollTop = 0;
    document.body.classList.toggle('menu-open', open);
    menuBackdrop?.classList.toggle('is-visible', open);
  };
  toggle?.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  menuBackdrop?.addEventListener('click', () => setMenu(false));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  // Right-side hotel submenu: routing is intentionally left as # until final routes are supplied.
  const hotelMenuGroup = menu?.querySelector('.menu-hotels');
  const hotelMenuParent = hotelMenuGroup?.querySelector('.menu-parent');
  hotelMenuParent?.addEventListener('click', () => {
    const open = hotelMenuParent.getAttribute('aria-expanded') === 'true';
    hotelMenuParent.setAttribute('aria-expanded', String(!open));
    hotelMenuGroup?.classList.toggle('is-expanded', !open);
  });
  // ---------------------------------------------------------
  // BANNER LOGO — measured JS marquee.
  // Mouse/focus pauses the current position and resume continues from it.
  // This avoids CSS animation percentage/seam differences between browsers.
  // ---------------------------------------------------------
  const logoStrip = document.querySelector('.banner-logo-section .fosia-logo-marquee');
  const logoTrack = document.querySelector('.banner-logo-section .logo-track');
  const logoSets = logoTrack ? [...logoTrack.querySelectorAll('.logo-set')] : [];
  const logoLinks = [...document.querySelectorAll('.banner-logo-section .logo-set a')];
  let logoSetWidth = 0;
  let logoOffset = 0;
  let logoPaused = false;
  let logoLastTime = performance.now();
  let logoRaf = 0;
  let logoVisibilityPaused = document.hidden;
  let logoLastPointerType = 'mouse';
  const measureLogoMarquee = () => {
    if (!logoTrack || !logoSets.length) return;
    const first = logoSets[0].getBoundingClientRect();
    logoSetWidth = first.width;
    if (!logoSetWidth) return;
    logoOffset = ((logoOffset % logoSetWidth) + logoSetWidth) % logoSetWidth;
    logoTrack.style.setProperty('transform', `translate3d(${-logoOffset}px,0,0)`, 'important');
  };
  const setLogoPaused = paused => {
    logoPaused = paused;
    logoTrack?.classList.toggle('is-marquee-paused', paused);
  };
  const logoStep = now => {
    const dt = Math.min(50, Math.max(0, now - logoLastTime));
    logoLastTime = now;
    if (!logoPaused && !logoVisibilityPaused && logoTrack && logoSetWidth > 0) {
      logoOffset += 42 * (dt / 1000);
      if (logoOffset >= logoSetWidth) logoOffset -= logoSetWidth;
      logoTrack.style.setProperty('transform', `translate3d(${-logoOffset}px,0,0)`, 'important');
    }
    logoRaf = requestAnimationFrame(logoStep);
  };
  measureLogoMarquee();
  logoRaf = requestAnimationFrame(logoStep);
  document.addEventListener('visibilitychange', () => {
    logoVisibilityPaused = document.hidden;
    logoLastTime = performance.now();
    if (document.hidden) {
      if (logoRaf) cancelAnimationFrame(logoRaf);
      logoRaf = 0;
    } else if (!logoRaf && logoTrack && logoSetWidth > 0) {
      logoRaf = requestAnimationFrame(logoStep);
    }
  });
  // Mouse hover is the only intentional marquee pause trigger.
  // Touch/tablet taps must never latch the marquee in a paused state.
  logoStrip?.addEventListener('pointerdown', e => {
    logoLastPointerType = e.pointerType || 'mouse';
    if (logoLastPointerType !== 'mouse') setLogoPaused(false);
  }, {passive:true});
  logoStrip?.addEventListener('pointerenter', e => {
    logoLastPointerType = e.pointerType || 'mouse';
    if (logoLastPointerType === 'mouse') setLogoPaused(true);
  }, {passive:true});
  logoStrip?.addEventListener('pointerleave', e => {
    if ((e.pointerType || logoLastPointerType) === 'mouse') setLogoPaused(false);
  }, {passive:true});
  logoStrip?.addEventListener('touchstart', () => setLogoPaused(false), {passive:true});
  logoStrip?.addEventListener('touchend', () => setLogoPaused(false), {passive:true});
  window.addEventListener('resize', () => {
    measureLogoMarquee();
    updateParallaxTarget();
  }, {passive:true});
  logoLinks.forEach(link => {
    link.addEventListener('click', e => {
      if (logoLastPointerType !== 'mouse') setLogoPaused(false);
      if ((link.getAttribute('href') || '#') === '#') e.preventDefault();
    });
  });

  // ---------------------------------------------------------
  // HERO SLIDER
  // ---------------------------------------------------------
  const heroImages = ['assets/img_19.jpeg','assets/img_35.jpeg','assets/img_26.jpeg','assets/img_16.jpeg','assets/img_12.jpeg'];
  let heroIndex = 0;
  let heroLayer = 0;
  const heroLayers = [document.getElementById('heroImageA'), document.getElementById('heroImageB')];
  const dots = [...document.querySelectorAll('.hero-dots button')];
  if (heroLayers[1]) heroLayers[1].src = heroImages[1];
  const renderHero = (i, immediate=false) => {
    heroIndex = (i + heroImages.length) % heroImages.length;
    const nextLayer = heroLayers[1 - heroLayer];
    if (!nextLayer) return;
    nextLayer.src = heroImages[heroIndex];
    if (immediate) {
      heroLayers.forEach((layer,n)=>layer.classList.toggle('active',n===heroLayer));
      nextLayer.classList.add('active');
    } else {
      nextLayer.classList.add('active');
      heroLayers[heroLayer]?.classList.remove('active');
      heroLayer = 1 - heroLayer;
    }
    dots.forEach((d,n)=>d.classList.toggle('active', n===heroIndex));
  };
  document.querySelector('.hero-prev')?.addEventListener('click', () => renderHero(heroIndex-1));
  document.querySelector('.hero-next')?.addEventListener('click', () => renderHero(heroIndex+1));
  dots.forEach((d,n)=>d.addEventListener('click',()=>renderHero(n)));
  let heroTimer = setInterval(() => renderHero(heroIndex+1), 5500);
  const hero = document.querySelector('.hero');
  hero?.addEventListener('mouseenter', () => clearInterval(heroTimer));
  hero?.addEventListener('mouseleave', () => {
    clearInterval(heroTimer);
    heroTimer = setInterval(() => renderHero(heroIndex+1), 5500);
  });

  // ---------------------------------------------------------
  // HOTEL IMAGE SLIDERS
  // ---------------------------------------------------------
  document.querySelectorAll('.hotel-row').forEach(row => {
    const slides = [...row.querySelectorAll('.slide')];
    let current = 0;
    const count = row.querySelector('.slider-count b');
    const total = row.querySelector('.slider-count span');
    const next = row.querySelector('.slider-next');
    const prev = row.querySelector('.slider-prev');
    if (!slides.length || !count || !next || !prev) return;
    total.textContent = `/ ${String(slides.length).padStart(2,'0')}`;
    const update = i => {
      current=(i+slides.length)%slides.length;
      slides.forEach((slide,n)=>slide.classList.toggle('active',n===current));
      count.textContent=String(current+1).padStart(2,'0');
    };
    next.addEventListener('click',()=>update(current+1));
    prev.addEventListener('click',()=>update(current-1));
  });

  // ---------------------------------------------------------
  // PACKAGE FILTER
  // ---------------------------------------------------------
  const packageCards = [...document.querySelectorAll('.package-grid article')];
  const packageMore = document.querySelector('.package-more');
  const renderPackages = filter => {
    packageCards.forEach((card,index) => {
      const matches = filter === 'all' ? true : card.dataset.category === filter;
      const exceedsInitialLimit = filter === 'all' && index >= 5;
      card.hidden = !matches || exceedsInitialLimit;
    });
    if (packageMore) packageMore.hidden = filter !== 'all' || packageCards.length <= 5;
  };
  renderPackages('all');
  document.querySelectorAll('.package-tabs button').forEach(button => {
    button.addEventListener('click',()=>{
      document.querySelectorAll('.package-tabs button').forEach(b=>b.classList.remove('active'));
      button.classList.add('active');
      renderPackages(button.dataset.filter);
    });
  });

  // ---------------------------------------------------------
  // PACKAGE IMAGE LIGHTBOX
  // ---------------------------------------------------------
  const lightbox = document.getElementById('imageLightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const closeLightbox = () => {
    lightbox?.classList.remove('open');
    lightbox?.setAttribute('aria-hidden','true');
    document.body.classList.remove('no-scroll');
  };
  document.querySelectorAll('.package-grid article').forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('img');
      if (!img || !lightbox || !lightboxImage) return;
      lightboxImage.src = img.currentSrc || img.src;
      lightboxImage.alt = img.alt;
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden','false');
      document.body.classList.add('no-scroll');
    });
  });
  document.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

  // ---------------------------------------------------------
  // MOTION PREFERENCE — shared by all non-essential animations
  // ---------------------------------------------------------
  const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------------------------------------------------------
  // PARALLAX — cross-browser requestAnimationFrame fallback.
  // The motion follows the perspective-parallax idea from the supplied
  // CodePen reference without requiring animation-timeline support.
  // ---------------------------------------------------------
  const parallaxSection = document.querySelector('.parallax-section');
  const parallaxBg = parallaxSection?.querySelector('.parallax-bg');
  let parallaxRaf = 0;
  let parallaxTarget = 0;
  let parallaxCurrent = 0;
  const updateParallaxTarget = () => {
    if (!parallaxSection || !parallaxBg) return;
    const rect = parallaxSection.getBoundingClientRect();
    const viewport = window.innerHeight || document.documentElement.clientHeight;
    const progress = (viewport - rect.top) / (viewport + rect.height);
    const clamped = Math.max(0, Math.min(1, progress));
    parallaxTarget = (clamped - .5) * -120;
    if (!parallaxRaf) parallaxRaf = requestAnimationFrame(runParallax);
  };
  const runParallax = () => {
    parallaxRaf = 0;
    if (!parallaxBg) return;
    parallaxCurrent += (parallaxTarget - parallaxCurrent) * .12;
    parallaxBg.style.setProperty('transform', `translate3d(0,${parallaxCurrent.toFixed(2)}px,0) scale(1.12)`, 'important');
    if (Math.abs(parallaxTarget - parallaxCurrent) > .15) parallaxRaf = requestAnimationFrame(runParallax);
  };
  updateParallaxTarget();
  window.addEventListener('scroll', updateParallaxTarget, {passive:true});

  // ---------------------------------------------------------
  // WELCOME IMAGE PARALLAX — Lerp adaptation of the supplied CodePen.
  // Only welcome-image01 / welcome-image02 are affected. The existing
  // Welcome layout, container sizes and scroll-reveal layer remain intact.
  // ---------------------------------------------------------
  const welcomeImages = [...document.querySelectorAll('.welcome-image')];
  let welcomeParallaxRaf = 0;
  let welcomeParallaxTarget = 0;
  let welcomeParallaxCurrent = 0;
  const welcomeLerp = 0.05;

  const updateWelcomeParallaxTarget = () => {
    if (!welcomeImages.length || reduceMotion()) return;
    const viewport = window.innerHeight || document.documentElement.clientHeight;
    welcomeImages.forEach(image => {
      const card = image.closest('.about-photo');
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const progress = rect.top / viewport;
      const imageHeight = image.getBoundingClientRect().height;
      const diff = rect.height - imageHeight;
      const yPos = diff * progress;
      image.style.setProperty('--welcome-parallax-target', `${yPos}px`);
    });

    if (!welcomeParallaxRaf) welcomeParallaxRaf = requestAnimationFrame(runWelcomeParallax);
  };

  const runWelcomeParallax = () => {
    welcomeParallaxRaf = 0;
    if (!welcomeImages.length || reduceMotion()) return;

    welcomeImages.forEach(image => {
      const target = parseFloat(getComputedStyle(image).getPropertyValue('--welcome-parallax-target')) || 0;
      const current = parseFloat(image.dataset.welcomeParallaxCurrent || '0');
      const next = current + (target - current) * welcomeLerp;
      image.dataset.welcomeParallaxCurrent = String(next);
      image.style.transform = `translate3d(0,${next.toFixed(2)}px,0)`;
    });

    const stillMoving = welcomeImages.some(image => {
      const target = parseFloat(getComputedStyle(image).getPropertyValue('--welcome-parallax-target')) || 0;
      const current = parseFloat(image.dataset.welcomeParallaxCurrent || '0');
      return Math.abs(target - current) > 0.15;
    });
    if (stillMoving) welcomeParallaxRaf = requestAnimationFrame(runWelcomeParallax);
  };

  updateWelcomeParallaxTarget();
  window.addEventListener('scroll', updateWelcomeParallaxTarget, {passive:true});

  // ---------------------------------------------------------
  // OUR EVENTS — 10 unique cards, infinite loop, drag + smooth arrows
  // Arrow movement uses one requestAnimationFrame easing loop instead of
  // native scroll-behavior so the animation remains deterministic even
  // while the infinite-loop boundary is being normalized.
  // ---------------------------------------------------------
  const eventScroller = document.querySelector('.event-grid');
  const prevEvent = document.querySelector('.event-control-prev');
  const nextEvent = document.querySelector('.event-control-next');
  const eventDiscoverAll = document.querySelector('.event-discover-all');
  let eventBaseCards = [];
  let eventBaseWidth = 0;
  let eventCardStep = 0;
  let eventDragging = false;
  let eventTouchCandidate = false;
  let eventTouchStartY = 0;
  let eventTouchLocked = false;
  let eventSuppressClick = false;
  let dragStartX = 0;
  let dragStartScroll = 0;
  let lastDragX = 0;
  let lastDragTime = 0;
  let dragVelocity = 0;
  let eventMomentumRaf = 0;
  let eventScrollRaf = 0;
  let eventAnimating = false;

  const getEventGap = () => eventScroller ? (parseFloat(getComputedStyle(eventScroller).columnGap || getComputedStyle(eventScroller).gap) || 20) : 20;
  const getEventCardWidth = () => eventScroller?.querySelector('.event')?.getBoundingClientRect().width || 0;
  const prepareEventLoop = () => {
    if (!eventScroller || eventScroller.dataset.loopReady === 'true') return;
    eventBaseCards = [...eventScroller.querySelectorAll('.event')].slice(0, 10);
    if (!eventBaseCards.length) return;
    eventScroller.innerHTML = '';
    const makeSet = () => eventBaseCards.map(card => card.cloneNode(true));
    [...makeSet(), ...makeSet(), ...makeSet()].forEach(card => eventScroller.appendChild(card));
    eventScroller.dataset.loopReady = 'true';
  };
  const measureEventTrack = (reset = false) => {
    if (!eventScroller || !eventBaseCards.length) return;
    const gap = getEventGap();
    const cardWidth = getEventCardWidth();
    if (!cardWidth) return;
    eventCardStep = cardWidth + gap;
    eventBaseWidth = (cardWidth + gap) * eventBaseCards.length;
    if (reset) eventScroller.scrollLeft = eventBaseWidth;
  };
  const normalizeEventLoop = () => {
    if (!eventScroller || !eventBaseWidth) return;
    const lower = eventBaseWidth * 0.45;
    const upper = eventBaseWidth * 1.55;
    if (eventScroller.scrollLeft < lower) eventScroller.scrollLeft += eventBaseWidth;
    else if (eventScroller.scrollLeft > upper) eventScroller.scrollLeft -= eventBaseWidth;
  };
  const stopMomentum = () => {
    if (eventMomentumRaf) cancelAnimationFrame(eventMomentumRaf);
    eventMomentumRaf = 0;
  };
  const runMomentum = () => {
    if (!eventScroller || Math.abs(dragVelocity) < 0.08 || reduceMotion()) {
      stopMomentum(); normalizeEventLoop(); return;
    }
    eventScroller.scrollLeft -= dragVelocity * 16;
    dragVelocity *= 0.92;
    eventMomentumRaf = requestAnimationFrame(runMomentum);
  };
  const triggerEventArrowMotion = direction => {
    if (!eventScroller || reduceMotion()) return;
    eventScroller.classList.remove('event-scroll-next','event-scroll-prev');
    void eventScroller.offsetWidth;
    eventScroller.classList.add(direction > 0 ? 'event-scroll-next' : 'event-scroll-prev');
    window.setTimeout(() => eventScroller.classList.remove('event-scroll-next','event-scroll-prev'), 540);
  };
  const easeInOutCubic = t => t < .5 ? 4*t*t*t : 1-Math.pow(-2*t+2,3)/2;
  const animateEventScroll = (target, duration=680) => {
    if (!eventScroller) return;
    stopMomentum();
    if (eventScrollRaf) cancelAnimationFrame(eventScrollRaf);
    if (reduceMotion()) { eventScroller.scrollLeft = target; normalizeEventLoop(); return; }
    const start = eventScroller.scrollLeft;
    const distance = target - start;
    const started = performance.now();
    eventAnimating = true;
    const step = now => {
      const progress = Math.min(1,(now-started)/duration);
      eventScroller.scrollLeft = start + distance * easeInOutCubic(progress);
      if (progress < 1) eventScrollRaf = requestAnimationFrame(step);
      else { eventScrollRaf = 0; eventAnimating = false; normalizeEventLoop(); }
    };
    eventScrollRaf = requestAnimationFrame(step);
  };
  const scrollEvents = direction => {
    if (!eventScroller || !eventCardStep) return;
    triggerEventArrowMotion(direction);
    animateEventScroll(eventScroller.scrollLeft + direction * eventCardStep, 680);
  };
  const fitEventDescriptions = () => {
    if (!eventScroller) return;
    const paragraphs = [...eventScroller.querySelectorAll('.event > .tilt-card-content p')];
    paragraphs.forEach(p => {
      const fullText = p.dataset.fullText || p.textContent.trim();
      p.dataset.fullText = fullText;
      p.replaceChildren(document.createTextNode(fullText));

      const computed = getComputedStyle(p);
      const lineHeight = parseFloat(computed.lineHeight) || (parseFloat(computed.fontSize) * 1.55);
      const maxHeight = lineHeight * 3 + 1;
      const width = p.clientWidth;
      if (!width) return;

      const sourceLink = p.closest('.event')?.querySelector('.tilt-card-content h3 a');
      const href = sourceLink?.getAttribute('href') || '#';
      const linkLabel = 'Read more';
      const marker = '… ';

      const measure = document.createElement('div');
      const pStyles = getComputedStyle(p);
      Object.assign(measure.style, {
        position:'absolute', left:'-100000px', top:'0', visibility:'hidden',
        width:`${width}px`, height:'auto', maxHeight:'none', minHeight:'0',
        overflow:'visible', padding:'0', margin:'0', boxSizing:'border-box',
        font:pStyles.font, fontFamily:pStyles.fontFamily, fontSize:pStyles.fontSize,
        fontWeight:pStyles.fontWeight, lineHeight:pStyles.lineHeight,
        letterSpacing:pStyles.letterSpacing, wordSpacing:pStyles.wordSpacing,
        textTransform:pStyles.textTransform, whiteSpace:'normal',
        overflowWrap:'anywhere', wordBreak:'normal'
      });
      document.body.appendChild(measure);

      const fits = text => {
        measure.textContent = text;
        return measure.scrollHeight <= maxHeight;
      };

      if (fits(fullText)) {
        measure.remove();
        return;
      }

      let low = 0;
      let high = fullText.length;
      let best = '';
      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        const candidate = `${fullText.slice(0, mid).trimEnd()}${marker}${linkLabel}`;
        if (fits(candidate)) {
          best = fullText.slice(0, mid).trimEnd();
          low = mid + 1;
        } else {
          high = mid - 1;
        }
      }

      // Keep the longest readable prefix that fits within exactly three lines.
      // The final anchor is real navigation, not decorative text.
      p.replaceChildren(document.createTextNode(`${best}${marker}`));
      const readMore = document.createElement('a');
      readMore.className = 'event-read-more';
      readMore.href = href;
      readMore.textContent = linkLabel;
      readMore.setAttribute('aria-label', `${linkLabel}: ${sourceLink?.textContent.trim() || 'event article'}`);
      p.appendChild(readMore);
      measure.remove();
    });
  };

  prepareEventLoop();
  requestAnimationFrame(() => {
    measureEventTrack(true);
    fitEventDescriptions();
  });
  let eventResizeTimer = 0;
  window.addEventListener('resize', () => {
    window.clearTimeout(eventResizeTimer);
    eventResizeTimer = window.setTimeout(() => {
      measureEventTrack(false);
      fitEventDescriptions();
    }, 120);
  }, {passive:true});
  prevEvent?.addEventListener('click', () => scrollEvents(-1));
  nextEvent?.addEventListener('click', () => scrollEvents(1));
  eventDiscoverAll?.addEventListener('click', e => { if (eventDiscoverAll.getAttribute('href') === '#') e.preventDefault(); });

  // ---------------------------------------------------------
  // BOOKING BAR — responsive destination dropdown + custom date popups
  // ---------------------------------------------------------
  const bookingForm = document.getElementById('bookingForm');
  const bookingDestination = bookingForm?.querySelector('[data-booking-destination]');
  const bookingSelect = bookingDestination?.querySelector('.booking-native-select');
  const bookingTrigger = bookingDestination?.querySelector('.booking-select-trigger');
  const bookingValue = bookingDestination?.querySelector('.booking-select-value');
  const arrivalInput = bookingForm?.querySelector('input[name="arrival"]');
  const departureInput = bookingForm?.querySelector('input[name="departure"]');
  const arrivalField = arrivalInput?.closest('.date-field');
  const departureField = departureInput?.closest('.date-field');
  const formatBookingDate = value => {
    if (!value) return '';
    const [y,m,d] = value.split('-');
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    return `${String(d).padStart(2,'0')}/${months[Number(m)-1]}/${y}`;
  };
  const today = new Date();
  today.setHours(0,0,0,0);
  const toISODate = date => {
    const y = date.getFullYear();
    const m = String(date.getMonth()+1).padStart(2,'0');
    const d = String(date.getDate()).padStart(2,'0');
    return `${y}-${m}-${d}`;
  };
  const todayISO = toISODate(today);
  if (arrivalInput) arrivalInput.min = todayISO;
  if (departureInput) departureInput.min = todayISO;

  let activePopover = null;
  let activeType = null;
  let calendarMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const closePopover = (immediate=false) => {
    if (!activePopover) return;
    const pop = activePopover;
    activePopover = null;
    activeType = null;
    if (immediate) {
      pop.remove();
      return;
    }
    pop.classList.remove('is-open');
    pop.classList.add('is-closing');
    window.setTimeout(() => pop.remove(), 220);
  };

  const positionPopover = (pop, anchor) => {
    const rect = anchor.getBoundingClientRect();
    const margin = 12;
    const gap = 10;
    const width = Math.min(360, window.innerWidth - margin * 2);
    pop.style.width = `${width}px`;
    pop.style.left = `${Math.max(margin, Math.min(rect.left, window.innerWidth - width - margin))}px`;
    const height = pop.offsetHeight;
    const below = window.innerHeight - rect.bottom - gap;
    const above = rect.top - gap;
    const top = below >= height || below >= above ? rect.bottom + gap : Math.max(margin, rect.top - height - gap);
    pop.style.top = `${Math.max(margin, Math.min(top, window.innerHeight - height - margin))}px`;
  };

  const resetBookingForm = () => {
    if (!bookingSelect) return;
    bookingSelect.value = '';
    if (bookingValue) bookingValue.textContent = 'Select hotels destination';
    bookingDestination?.classList.remove('has-value');
    if (arrivalInput) { arrivalInput.value = ''; arrivalInput.setCustomValidity(''); }
    if (departureInput) { departureInput.value = ''; departureInput.min = todayISO; departureInput.setCustomValidity(''); }
    syncDateDisplay(arrivalInput);
    syncDateDisplay(departureInput);
    bookingForm?.classList.remove('booking-dates-revealed');
    arrivalField?.classList.remove('booking-field-revealed');
    departureField?.classList.remove('booking-field-revealed');
    updateBookingResponsiveState?.();
  };

  const openHotelDropdown = () => {
    closePopover(true);
    const pop = document.createElement('div');
    pop.className = 'booking-popover booking-hotel-popover';
    pop.id = 'bookingHotelListbox';
    pop.setAttribute('role','listbox');
    const options = [...bookingSelect.options].filter(option => option.value);
    const resetOption = `<button type="button" class="booking-hotel-option booking-hotel-reset${!bookingSelect.value ? ' is-selected' : ''}" role="option" aria-selected="${!bookingSelect.value}" data-value="" style="--booking-stagger:0ms"><span>Select hotels destination</span><iconify-icon aria-hidden="true" icon="tabler:check"></iconify-icon></button>`;
    pop.innerHTML = resetOption + options.map((option, i) => `
      <button type="button" class="booking-hotel-option${option.value === bookingSelect.value ? ' is-selected' : ''}" role="option" aria-selected="${option.value === bookingSelect.value}" data-value="${option.value}" style="--booking-stagger:${i * 42}ms">
        <span>${option.textContent}</span>
        <iconify-icon aria-hidden="true" icon="tabler:check"></iconify-icon>
      </button>`).join('');
    document.body.appendChild(pop);
    positionPopover(pop, bookingTrigger);
    requestAnimationFrame(() => pop.classList.add('is-open'));
    activePopover = pop;
    activeType = 'hotel';
    bookingTrigger?.setAttribute('aria-expanded','true');
    pop.querySelectorAll('.booking-hotel-option').forEach(option => option.addEventListener('click', () => {
      if (!option.dataset.value) {
        closePopover();
        bookingTrigger?.setAttribute('aria-expanded','false');
        resetBookingForm();
        return;
      }
      bookingSelect.value = option.dataset.value;
      bookingValue.textContent = option.querySelector('span').textContent;
      bookingDestination.classList.add('has-value');
      bookingTrigger.setAttribute('aria-expanded','false');
      closePopover();
      // Responsive source of truth: below 960px, reveal dates only after hotel selection.
      // At 960px+, dates remain visible regardless of hotel selection.
      updateBookingResponsiveState?.();
    }));
  };

  bookingTrigger?.addEventListener('click', () => {
    if (activeType === 'hotel') {
      bookingTrigger.setAttribute('aria-expanded','false');
      closePopover();
    } else {
      bookingTrigger.setAttribute('aria-expanded','true');
      openHotelDropdown();
    }
  });

  const syncDateDisplay = nativeInput => {
    const field = nativeInput?.closest('.date-field');
    const display = field?.querySelector('.date-display');
    if (display) display.value = formatBookingDate(nativeInput.value);
    field?.classList.toggle('has-value', Boolean(nativeInput?.value));
  };
  syncDateDisplay(arrivalInput);
  syncDateDisplay(departureInput);

  const monthLabel = date => date.toLocaleDateString('en-US', {month:'long', year:'numeric'});
  const clampMonth = date => new Date(date.getFullYear(), date.getMonth(), 1);
  const isBeforeToday = iso => iso < todayISO;

  const renderCalendar = (pop, type) => {
    const nativeInput = type === 'arrival' ? arrivalInput : departureInput;
    const selected = nativeInput?.value || '';
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();
    const cells = [];
    for (let i=0; i<firstDay; i++) {
      const d = prevMonthDays - firstDay + i + 1;
      cells.push(`<span class="booking-calendar-day is-muted">${d}</span>`);
    }
    for (let day=1; day<=daysInMonth; day++) {
      const date = new Date(year, month, day);
      const iso = toISODate(date);
      const disabled = isBeforeToday(iso) || (type === 'departure' && arrivalInput?.value && iso < arrivalInput.value);
      const rangeStart = arrivalInput?.value && iso === arrivalInput.value;
      const rangeEnd = departureInput?.value && iso === departureInput.value;
      const inRange = arrivalInput?.value && departureInput?.value && iso > arrivalInput.value && iso < departureInput.value;
      cells.push(`<button type="button" class="booking-calendar-day${selected === iso ? ' is-selected' : ''}${rangeStart ? ' is-range-start' : ''}${rangeEnd ? ' is-range-end' : ''}${inRange ? ' is-in-range' : ''}" data-date="${iso}" ${disabled ? 'disabled' : ''} style="--booking-stagger:${Math.min(day,28) * 8}ms">${day}</button>`);
    }
    while (cells.length % 7) cells.push('<span class="booking-calendar-day is-muted"></span>');
    pop.querySelector('.booking-calendar-grid').innerHTML = cells.join('');
    pop.querySelector('.booking-calendar-title').textContent = monthLabel(calendarMonth);
    pop.querySelector('.booking-calendar-prev').disabled = calendarMonth <= clampMonth(today);
    pop.querySelectorAll('[data-date]').forEach(dayButton => dayButton.addEventListener('click', () => {
      const value = dayButton.dataset.date;
      nativeInput.value = value;
      nativeInput.dispatchEvent(new Event('change', {bubbles:true}));
      syncDateDisplay(nativeInput);
      if (type === 'arrival') {
        departureInput.min = value || todayISO;
        if (departureInput.value && departureInput.value < value) {
          departureInput.value = '';
          syncDateDisplay(departureInput);
        }
        closePopover();
      } else {
        closePopover();
      }
    }));
  };

  const openDatePicker = type => {
    const anchor = type === 'arrival' ? arrivalField : departureField;
    const nativeInput = type === 'arrival' ? arrivalInput : departureInput;
    if (!anchor || !nativeInput) return;
    closePopover(true);
    const current = nativeInput.value ? new Date(`${nativeInput.value}T00:00:00`) : (type === 'departure' && arrivalInput?.value ? new Date(`${arrivalInput.value}T00:00:00`) : today);
    calendarMonth = new Date(current.getFullYear(), current.getMonth(), 1);
    const pop = document.createElement('div');
    pop.className = 'booking-popover booking-calendar-popover';
    pop.innerHTML = `
      <div class="booking-calendar-head">
        <button type="button" class="booking-calendar-nav booking-calendar-prev" aria-label="Previous month">‹</button>
        <strong class="booking-calendar-title"></strong>
        <button type="button" class="booking-calendar-nav booking-calendar-next" aria-label="Next month">›</button>
      </div>
      <div class="booking-calendar-week"><span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span></div>
      <div class="booking-calendar-grid"></div>`;
    document.body.appendChild(pop);
    renderCalendar(pop, type);
    positionPopover(pop, anchor);
    requestAnimationFrame(() => pop.classList.add('is-open'));
    activePopover = pop;
    activeType = type;
    pop.querySelector('.booking-calendar-prev').addEventListener('click', () => {
      calendarMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth()-1, 1);
      renderCalendar(pop, type);
      positionPopover(pop, anchor);
    });
    pop.querySelector('.booking-calendar-next').addEventListener('click', () => {
      calendarMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth()+1, 1);
      renderCalendar(pop, type);
      positionPopover(pop, anchor);
    });
  };

  [arrivalField, departureField].forEach(field => field?.addEventListener('click', e => {
    if (e.target.closest('.date-display') || e.target.closest('.date-icon')) {
      openDatePicker(field === arrivalField ? 'arrival' : 'departure');
    }
  }));
  arrivalInput?.addEventListener('change', () => {
    syncDateDisplay(arrivalInput);
    departureInput.min = arrivalInput.value || todayISO;
  });
  departureInput?.addEventListener('change', () => syncDateDisplay(departureInput));

  document.addEventListener('pointerdown', e => {
    if (!activePopover) return;
    if (activePopover.contains(e.target)) return;
    if (activeType === 'hotel' && bookingDestination?.contains(e.target)) return;
    if ((activeType === 'arrival' && arrivalField?.contains(e.target)) || (activeType === 'departure' && departureField?.contains(e.target))) return;
    closePopover();
    bookingTrigger?.setAttribute('aria-expanded','false');
  }, {passive:true});

  window.addEventListener('resize', () => {
    if (!activePopover) return;
    const anchor = activeType === 'hotel' ? bookingTrigger : activeType === 'arrival' ? arrivalField : departureField;
    if (anchor) positionPopover(activePopover, anchor);
  }, {passive:true});

  if (bookingForm && arrivalInput && departureInput) {
    bookingForm.addEventListener('submit', e => {
      if (!bookingSelect?.value) {
        e.preventDefault();
        bookingSelect.setCustomValidity('Please select a hotel destination.');
        bookingTrigger?.focus();
        bookingTrigger?.setAttribute('aria-expanded','true');
        openHotelDropdown();
        return;
      }
      bookingSelect.setCustomValidity('');
      arrivalInput.setCustomValidity('');
      departureInput.setCustomValidity('');
      if (arrivalInput.value && departureInput.value && departureInput.value < arrivalInput.value) {
        e.preventDefault();
        departureInput.setCustomValidity('Departure date must be on or after arrival date.');
        openDatePicker('departure');
      }
    });
  }

  const bookingCompactMedia = window.matchMedia('(max-width: 959px)');
  const updateBookingResponsiveState = () => {
    const compact = bookingCompactMedia.matches;
    const hasHotel = Boolean(bookingSelect?.value);
    bookingForm?.classList.toggle('booking-compact', compact);
    bookingForm?.classList.toggle('booking-dates-revealed', !compact || hasHotel);
    if (compact && !hasHotel) {
      arrivalField?.classList.remove('booking-field-revealed');
      departureField?.classList.remove('booking-field-revealed');
    } else {
      arrivalField?.classList.add('booking-field-revealed');
      departureField?.classList.add('booking-field-revealed');
    }
  };
  updateBookingResponsiveState();
  bookingSelect?.addEventListener('change', updateBookingResponsiveState);
  if (bookingCompactMedia.addEventListener) {
    bookingCompactMedia.addEventListener('change', updateBookingResponsiveState);
  } else {
    bookingCompactMedia.addListener(updateBookingResponsiveState);
  }

  const beginEventDrag = (e, touch = false) => {
    stopMomentum();
    if (eventScrollRaf) cancelAnimationFrame(eventScrollRaf);
    eventScrollRaf = 0; eventAnimating = false;
    eventDragging = true; eventTouchLocked = touch;
    dragStartX = e.clientX; dragStartScroll = eventScroller.scrollLeft;
    lastDragX = e.clientX; lastDragTime = performance.now(); dragVelocity = 0;
    eventScroller.classList.add('is-dragging');
    try { eventScroller.setPointerCapture?.(e.pointerId); } catch (_) {}
  };
  eventScroller?.addEventListener('pointerdown', e => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    if (e.pointerType === 'touch') {
      eventTouchStartY = e.clientY; eventTouchCandidate = true; eventTouchLocked = false;
      dragStartX = e.clientX; dragStartScroll = eventScroller.scrollLeft;
      lastDragX = e.clientX; lastDragTime = performance.now(); dragVelocity = 0;
      return;
    }
    beginEventDrag(e, false);
  });
  eventScroller?.addEventListener('pointermove', e => {
    if (!eventScroller) return;
    if (e.pointerType === 'touch' && eventTouchCandidate && !eventDragging) {
      const dx = e.clientX - dragStartX;
      const dy = e.clientY - eventTouchStartY;
      if (Math.abs(dx) < 7 && Math.abs(dy) < 7) return;
      if (Math.abs(dy) > Math.abs(dx)) { eventTouchCandidate = false; return; }
      beginEventDrag(e, true);
    }
    if (!eventDragging) return;
    if (e.pointerType === 'touch' || e.pointerType === 'pen') e.preventDefault();
    const now = performance.now();
    const dt = Math.max(1, now-lastDragTime);
    const dx = e.clientX-lastDragX;
    dragVelocity = dx/dt*1.35;
    eventScroller.scrollLeft = dragStartScroll-(e.clientX-dragStartX);
    lastDragX=e.clientX; lastDragTime=now;
  });
  const stopEventDrag = e => {
    if (!eventDragging) { eventTouchCandidate = false; return; }
    eventDragging=false; eventTouchCandidate=false; eventScroller.classList.remove('is-dragging');
    try { if (e?.pointerId !== undefined) eventScroller.releasePointerCapture?.(e.pointerId); } catch (_) {}
    dragVelocity=Math.max(-1.8,Math.min(1.8,dragVelocity));
    if (Math.abs(dragVelocity)>0.08) runMomentum(); else normalizeEventLoop();
    if (eventTouchLocked) {
      eventSuppressClick=true;
      window.setTimeout(() => { eventSuppressClick=false; }, 120);
    }
    eventTouchLocked=false;
  };
  eventScroller?.addEventListener('pointerup',stopEventDrag);
  eventScroller?.addEventListener('pointercancel',stopEventDrag);
  eventScroller?.addEventListener('pointerleave',e=>{if(eventDragging&&e.pointerType==='mouse'&&e.buttons===0)stopEventDrag(e);});
  eventScroller?.addEventListener('click',e=>{
    if(eventSuppressClick){e.preventDefault();e.stopPropagation();eventSuppressClick=false;}
  },true);
  eventScroller?.addEventListener('scroll',()=>{if(!eventAnimating&&!eventDragging&&!eventMomentumRaf)normalizeEventLoop();},{passive:true});

  // ---------------------------------------------------------
  // CARD EFFECT — local 3D tilt implementation.
  // Event cards keep tilt/scale only; no cursor-following glare is used.
  // ---------------------------------------------------------
  const tiltCards = reduceMotion() ? [] : [...document.querySelectorAll('[data-tilt="true"]')];
  const resetTilt = card => {
    card.classList.remove('card-tilt-active');
    ['--card-rx','--card-ry','--card-mx','--card-my','--spot-x','--spot-y'].forEach(name => card.style.removeProperty(name));
    card.style.removeProperty('transform');
  };
  const applyTilt = (card, clientX, clientY) => {
    const r = card.getBoundingClientRect();
    if (!r.width || !r.height) return;
    const x = Math.max(-.5, Math.min(.5, (clientX-r.left)/r.width-.5));
    const y = Math.max(-.5, Math.min(.5, (clientY-r.top)/r.height-.5));
    const rx = (-y*10).toFixed(2);
    const ry = (x*10).toFixed(2);
    card.style.setProperty('--card-rx',`${rx}deg`);
    card.style.setProperty('--card-ry',`${ry}deg`);
    card.style.setProperty('--card-mx',`${(x*10).toFixed(1)}px`);
    card.style.setProperty('--card-my',`${(y*10).toFixed(1)}px`);
    if (!card.closest('.event-grid')) {
      card.style.setProperty('--spot-x',`${((x+.5)*100).toFixed(1)}%`);
      card.style.setProperty('--spot-y',`${((y+.5)*100).toFixed(1)}%`);
    }
    card.style.setProperty('transform',`perspective(1800px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.03)`,`important`);
    card.classList.add('card-tilt-active');
  };
  tiltCards.forEach(card => {
    const move = e => {
      if (e.pointerType === 'touch') return;
      if (eventDragging && card.closest('.event-grid')) return;
      applyTilt(card,e.clientX,e.clientY);
    };
    const leave = () => resetTilt(card);
    if ('PointerEvent' in window) {
      card.addEventListener('pointermove',move,{passive:true});
      card.addEventListener('pointerleave',leave,{passive:true});
      card.addEventListener('pointercancel',leave,{passive:true});
    } else {
      card.addEventListener('mousemove',move,{passive:true});
      card.addEventListener('mouseleave',leave,{passive:true});
    }
  });

  // ---------------------------------------------------------
  // SCROLL-TRIGGERED REVEALS — bidirectional, crossfade-inspired.
  // The supplied reference uses scroll-driven CSS timelines. For FOSIA,
  // this production layer uses IntersectionObserver so the effect also
  // works in browsers that do not support animation-timeline/view().
  // Elements replay when they leave and re-enter the viewport, so the
  // effect works while scrolling both down and up.
  // ---------------------------------------------------------
  const revealSelectors = [
    '.welcome-wrap',
    '.about-top .copy-block',
    '.about-top .about-photo',
    '.core-values > h2',
    '.value-grid article',
    '.hotel-heading',
    '.hotel-row',
    '.packages-section .section-intro',
    '.package-tabs',
    '.package-grid article',
    '.events-section .section-intro',
    '.event-grid .event',
    '.news-section .section-intro',
    '.news-grid article',
    '.news-section .view-all',
    '.part-of-us .content'
  ];
  const revealItems = [...new Set(revealSelectors.flatMap(selector => [...document.querySelectorAll(selector)]))];
  revealItems.forEach((el, index) => {
    if (el.hidden) return;
    el.classList.add('scroll-reveal');
    if (index % 4 === 1) el.classList.add('from-left');
    else if (index % 4 === 2) el.classList.add('from-right');
    else if (index % 4 === 3) el.classList.add('from-up');
    const delay = (index % 5) + 1;
    el.classList.add(`delay-${delay}`);
  });
  const revealObserver = ('IntersectionObserver' in window && !reduceMotion()) ? new IntersectionObserver(entries => {
    entries.forEach(entry => entry.target.classList.toggle('is-inview', entry.isIntersecting));
  }, {threshold:0.14, rootMargin:'-6% 0px -10% 0px'}) : null;
  if (revealObserver) {
    revealItems.forEach(el => { if (!el.hidden) revealObserver.observe(el); });
  } else {
    revealItems.forEach(el => el.classList.add('is-inview'));
  }

  // ---------------------------------------------------------
  // MOVE-TO STYLE SMOOTH NAVIGATION + BACK TO TOP
  // ---------------------------------------------------------
  const easeOutQuart = t => 1 - Math.pow(1-t,4);
  const smoothScrollTo = (targetY, duration=820) => {
    const startY=window.scrollY, distance=targetY-startY, start=performance.now();
    const step=now=>{
      const progress=Math.min(1,(now-start)/duration);
      window.scrollTo(0,startY+distance*easeOutQuart(progress));
      if(progress<1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const smoothNavigate = (link, closeMenu=false) => {
    const href=link.getAttribute('href')||'';
    if(!href.startsWith('#')||href==='#') return;
    const target=document.querySelector(href);
    if(!target) return;
    if(closeMenu) setMenu(false);
    link.classList.remove('gentle-click'); void link.offsetWidth; link.classList.add('gentle-click');
    window.setTimeout(()=>smoothScrollTo(Math.max(0,target.getBoundingClientRect().top+window.scrollY-10),820),80);
  };
  menu?.querySelectorAll('a[href^="#"]').forEach(link=>link.addEventListener('click',e=>{e.preventDefault();smoothNavigate(link,true);}));
  const backTop=document.querySelector('.back-top');
  const bookingActions=bookingForm?.querySelector('.booking-actions');
  const syncBackTopPlacement=()=>{
    if(!backTop || !bookingActions) return;
    const desktopFixed = window.matchMedia('(min-width: 1201px)').matches;
    if(desktopFixed){
      if(backTop.parentElement !== document.body) document.body.appendChild(backTop);
      backTop.hidden = false;
      backTop.style.removeProperty('display');
    }else{
      if(backTop.parentElement !== bookingActions) bookingActions.appendChild(backTop);
      backTop.hidden = false;
      backTop.style.removeProperty('display');
    }
  };
  const refreshBackTopPlacement=()=>requestAnimationFrame(syncBackTopPlacement);
  syncBackTopPlacement();
  window.addEventListener('resize',refreshBackTopPlacement,{passive:true});
  window.addEventListener('orientationchange',refreshBackTopPlacement,{passive:true});
  window.addEventListener('pageshow',refreshBackTopPlacement,{passive:true});
  backTop?.addEventListener('click',e=>{
    e.preventDefault();
    backTop.classList.remove('gentle-click');
    void backTop.offsetWidth;
    backTop.classList.add('gentle-click');
    window.setTimeout(()=>smoothScrollTo(0,950),70);
  });

  // ---------------------------------------------------------
  // GLOBAL RESIZE / SCROLL
  // ---------------------------------------------------------
  window.addEventListener('resize',()=>{
    requestAnimationFrame(()=>{
      measureLogoMarquee();
      updateParallaxTarget();
    });
  });
})();
