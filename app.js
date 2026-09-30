/**
 * AMUL KOOL ROSE — HIGH-PERFORMANCE 95% AUTO-INTRO SCROLL ANIMATION ENGINE
 * Handles:
 * 1. Preloading 240 high-definition frames with real-time progress.
 * 2. Automatic 95% intro reveal animation at page launch before user scrolling.
 * 3. High-performance full-screen canvas rendering with DPR scaling & cover fit.
 * 4. Fast & responsive LERP frame interpolation on user scroll.
 * 5. Hero heading & subheading dynamic fade-out on 30% scroll.
 * 6. Transparent navigation bar with active links & mobile drawer menu.
 * 7. Cool & Modern Restaurant Reservations booking system with live preview.
 * 8. Web Audio API zero-dependency ambient sound & toggle.
 * 9. Quick order modal and scroll reveal observer.
 */

// Configuration
const CONFIG = {
  totalFrames: 240,
  introRatio: 0.95, // Automatically complete 95% (Frame 228) before user scrolls
  framePath: (index) => `./ezgif-79682e0a1532d24d-jpg/ezgif-frame-${String(index).padStart(3, '0')}.jpg`,
  lerpFactor: 0.32, // Smooth, responsive coefficient
};

// Global State
const state = {
  images: [],
  loadedCount: 0,
  isLoaded: false,
  currentFrame: 1,
  targetFrame: 1,
  userHasScrolled: false,
  introFinished: false,
  soundEnabled: false,
  audioCtx: null,
  ambientNodes: null,
  
  // Reservation State
  reservation: {
    partySize: '2',
    partyType: 'Intimate Table',
    date: '',
    time: '07:00 PM',
    tasting: 'Classic Rose Flight',
    name: '',
    phone: '',
  }
};

// DOM Elements
const elements = {
  preloader: document.getElementById('preloader'),
  loaderPercent: document.getElementById('loader-percent'),
  loaderCircle: document.getElementById('loader-circle'),
  loaderBarFill: document.getElementById('loader-bar-fill'),
  loaderStatus: document.getElementById('loader-status'),
  
  header: document.getElementById('main-header'),
  storyContainer: document.getElementById('hero') || document.getElementById('story'),
  canvas: document.getElementById('sequence-canvas'),
  heroBrandOverlay: document.getElementById('hero-brand-overlay'),
  
  // Navigation & Menu
  navLinks: document.querySelectorAll('.nav-link'),
  mobileMenuBtn: document.getElementById('mobile-menu-btn'),
  mobileMenuDrawer: document.getElementById('mobile-menu-drawer'),
  mobileNavLinks: document.querySelectorAll('.mobile-nav-link'),
  menuIcon: document.getElementById('menu-icon'),
  
  soundBtn: document.getElementById('sound-btn'),
  
  // Modal & Order
  openOrderBtn: document.getElementById('open-order-btn'),
  orderModal: document.getElementById('order-modal'),
  closeModalBtn: document.getElementById('close-modal-btn'),
  packOptions: document.querySelectorAll('.pack-option'),
  qtyMinus: document.getElementById('qty-minus'),
  qtyPlus: document.getElementById('qty-plus'),
  qtyVal: document.getElementById('qty-val'),
  totalAmountDisplay: document.getElementById('total-amount-display'),
  confirmOrderBtn: document.getElementById('confirm-order-btn'),
  toast: document.getElementById('toast'),
  toastMessage: document.getElementById('toast-message'),

  // Reservations
  reservationForm: document.getElementById('reservation-form'),
  partyChips: document.querySelectorAll('.party-chip'),
  resDateInput: document.getElementById('res-date'),
  resTimeInput: document.getElementById('res-time'),
  tastingOptions: document.querySelectorAll('.tasting-option'),
  bookingPreviewText: document.getElementById('booking-preview-text'),
};

const ctx = elements.canvas.getContext('2d', { alpha: false });

/* ==========================================================================
   1. IMAGE PRELOADER ENGINE
   ========================================================================== */
function preloadImages() {
  const promises = [];
  const circumference = 2 * Math.PI * 52; // r=52 in SVG

  for (let i = 1; i <= CONFIG.totalFrames; i++) {
    const p = new Promise((resolve) => {
      const img = new Image();
      img.src = CONFIG.framePath(i);
      
      img.onload = () => {
        state.loadedCount++;
        const percent = Math.floor((state.loadedCount / CONFIG.totalFrames) * 100);
        
        // Update UI
        if (elements.loaderPercent) elements.loaderPercent.textContent = `${percent}%`;
        if (elements.loaderBarFill) elements.loaderBarFill.style.width = `${percent}%`;
        if (elements.loaderCircle) {
          const offset = circumference - (percent / 100) * circumference;
          elements.loaderCircle.style.strokeDashoffset = offset;
        }
        if (elements.loaderStatus) {
          elements.loaderStatus.textContent = `Preloading Frame ${state.loadedCount} of ${CONFIG.totalFrames}...`;
        }

        resolve(img);
      };

      img.onerror = () => {
        console.warn(`Failed to load frame ${i}`);
        state.loadedCount++;
        resolve(img);
      };

      state.images[i] = img;
    });

    promises.push(p);
  }

  return Promise.all(promises).then(() => {
    state.isLoaded = true;
    setTimeout(() => {
      if (elements.preloader) {
        elements.preloader.classList.add('hidden');
        document.body.classList.remove('loading');
      }
      resizeCanvas();
      renderFrame(1);
      
      // Auto-play 95% opening sequence before user scrolls
      playIntroSequence();
    }, 300);
  });
}

/* ==========================================================================
   2. AUTOMATIC 95% INTRO SEQUENCE (BEFORE USER SCROLLING)
   ========================================================================== */
function playIntroSequence() {
  const target95 = Math.round(CONFIG.totalFrames * CONFIG.introRatio); // Frame 228 (95%)
  const startTime = performance.now();
  const duration = 2000; // 2.0s smooth cinematic reveal

  function step(now) {
    if (state.userHasScrolled) return; // User took over by scrolling
    
    const elapsed = now - startTime;
    const t = Math.min(1, elapsed / duration);
    // Cubic ease-out
    const ease = 1 - Math.pow(1 - t, 3);
    
    state.targetFrame = 1 + ease * (target95 - 1);
    
    if (t < 1) {
      requestAnimationFrame(step);
    } else {
      state.introFinished = true;
      state.targetFrame = target95;
    }
  }
  
  requestAnimationFrame(step);
}

/* ==========================================================================
   3. CANVAS SCALING & RENDERING
   ========================================================================== */
function resizeCanvas() {
  if (!elements.canvas) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const width = window.innerWidth;
  const height = window.innerHeight;

  elements.canvas.width = width * dpr;
  elements.canvas.height = height * dpr;
  elements.canvas.style.width = `${width}px`;
  elements.canvas.style.height = `${height}px`;

  ctx.scale(dpr, dpr);
  renderFrame(Math.round(state.currentFrame));
}

function renderFrame(frameIndex) {
  if (!state.isLoaded || !elements.canvas) return;
  
  const clampedIndex = Math.max(1, Math.min(CONFIG.totalFrames, Math.round(frameIndex)));
  const img = state.images[clampedIndex];
  if (!img || !img.complete || img.naturalWidth === 0) return;

  const canvasWidth = window.innerWidth;
  const canvasHeight = window.innerHeight;

  // Compute cover dimensions
  const imgRatio = img.naturalWidth / img.naturalHeight;
  const canvasRatio = canvasWidth / canvasHeight;

  let drawWidth, drawHeight, offsetX, offsetY;

  if (canvasRatio > imgRatio) {
    drawWidth = canvasWidth;
    drawHeight = canvasWidth / imgRatio;
    offsetX = 0;
    offsetY = (canvasHeight - drawHeight) / 2;
  } else {
    drawWidth = canvasHeight * imgRatio;
    drawHeight = canvasHeight;
    offsetX = (canvasWidth - drawWidth) / 2;
    offsetY = 0;
  }

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
}

/* ==========================================================================
   4. SCROLL PROGRESSION & HERO HEADING FADE-OUT
   ========================================================================== */
function updateScrollTarget() {
  const container = elements.storyContainer || document.getElementById('hero') || document.getElementById('story');
  if (!container) return;

  const rect = container.getBoundingClientRect();
  const containerHeight = container.offsetHeight - window.innerHeight;
  const scrolled = -rect.top;
  
  // Progress ratio 0.0 -> 1.0
  let progress = scrolled / containerHeight;
  progress = Math.max(0, Math.min(1, progress));

  if (window.scrollY > 5) {
    state.userHasScrolled = true;
  }

  const target95 = Math.round(CONFIG.totalFrames * CONFIG.introRatio); // Frame 228

  if (state.userHasScrolled) {
    // When user scrolls, progress smoothly completes 95% -> 100%
    state.targetFrame = target95 + progress * (CONFIG.totalFrames - target95);
  }

  // Fade headline and subheadline away on 30% scroll
  if (elements.heroBrandOverlay) {
    if (progress <= 0.30) {
      const fadeProgress = progress / 0.30;
      const opacity = 1 - fadeProgress;
      const translateY = -fadeProgress * 40;
      elements.heroBrandOverlay.style.opacity = opacity.toFixed(3);
      elements.heroBrandOverlay.style.transform = `translateY(${translateY}px)`;
      elements.heroBrandOverlay.style.visibility = 'visible';
    } else {
      elements.heroBrandOverlay.style.opacity = '0';
      elements.heroBrandOverlay.style.visibility = 'hidden';
    }
  }

  // Active navigation link tracking
  updateActiveNavLink();
}

function updateActiveNavLink() {
  const sections = ['hero', 'menu', 'quote-section', 'reservations'];
  const scrollPos = window.scrollY + 140;

  sections.forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.offsetTop;
    const height = el.offsetHeight;
    if (scrollPos >= top && scrollPos < top + height) {
      elements.navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}

// 60FPS RAF Render Loop
let lastRenderedFrame = -1;

function animationLoop() {
  if (state.isLoaded) {
    // Fast LERP interpolation
    const diff = state.targetFrame - state.currentFrame;
    if (Math.abs(diff) > 0.01) {
      state.currentFrame += diff * CONFIG.lerpFactor;
    } else {
      state.currentFrame = state.targetFrame;
    }

    const roundedFrame = Math.round(state.currentFrame);
    if (roundedFrame !== lastRenderedFrame) {
      renderFrame(roundedFrame);
      lastRenderedFrame = roundedFrame;
    }
  }

  requestAnimationFrame(animationLoop);
}

/* ==========================================================================
   5. RESERVATIONS SYSTEM LOGIC
   ========================================================================== */
function initReservations() {
  // Set default date to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dateString = tomorrow.toISOString().split('T')[0];
  if (elements.resDateInput) {
    elements.resDateInput.value = dateString;
    elements.resDateInput.min = new Date().toISOString().split('T')[0];
    state.reservation.date = dateString;
  }

  updateReservationPreview();

  // Party size selection
  elements.partyChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      elements.partyChips.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      state.reservation.partySize = chip.dataset.size;
      state.reservation.partyType = chip.dataset.type;
      updateReservationPreview();
    });
  });

  // Date & Time changes
  if (elements.resDateInput) {
    elements.resDateInput.addEventListener('change', (e) => {
      state.reservation.date = e.target.value;
      updateReservationPreview();
    });
  }

  if (elements.resTimeInput) {
    elements.resTimeInput.addEventListener('change', (e) => {
      state.reservation.time = e.target.value;
      updateReservationPreview();
    });
  }

  // Tasting option selection
  elements.tastingOptions.forEach((opt) => {
    opt.addEventListener('click', () => {
      elements.tastingOptions.forEach((o) => o.classList.remove('selected'));
      opt.classList.add('selected');
      const radio = opt.querySelector('input');
      if (radio) {
        radio.checked = true;
        state.reservation.tasting = radio.value;
      }
      updateReservationPreview();
    });
  });

  // Form submission
  if (elements.reservationForm) {
    elements.reservationForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('res-name')?.value || 'Guest';
      const guests = state.reservation.partySize === '1' ? '1 Guest (Bar)' : `${state.reservation.partySize} Guests (${state.reservation.partyType})`;
      
      showToast(`🎉 Reservation Confirmed for ${name}! Table for ${guests} on ${state.reservation.date || 'selected date'} at ${state.reservation.time}.`);
      elements.reservationForm.reset();
      
      // Reset preview
      if (elements.resDateInput) elements.resDateInput.value = dateString;
      updateReservationPreview();
    });
  }
}

function updateReservationPreview() {
  if (!elements.bookingPreviewText) return;
  const sizeText = state.reservation.partySize === '1' ? 'Tasting Bar Counter' : `${state.reservation.partySize} Guests (${state.reservation.partyType})`;
  const dateFormatted = state.reservation.date ? new Date(state.reservation.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' }) : 'Tomorrow';
  
  elements.bookingPreviewText.textContent = `${sizeText} • ${dateFormatted} at ${state.reservation.time} • ${state.reservation.tasting}`;
}

/* ==========================================================================
   6. WEB AUDIO API PROCEDURAL AMBIENT SYNTHESIZER
   ========================================================================== */
function initAudio() {
  if (state.audioCtx) return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  
  state.audioCtx = new AudioContext();
  
  // Ambient Soft Warm Chord Synth
  const masterGain = state.audioCtx.createGain();
  masterGain.gain.setValueAtTime(0.08, state.audioCtx.currentTime);

  const filter = state.audioCtx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(420, state.audioCtx.currentTime);

  const freqs = [174.61, 220.00, 261.63]; // F3, A3, C4
  const oscs = freqs.map((f) => {
    const osc = state.audioCtx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(f, state.audioCtx.currentTime);
    osc.connect(filter);
    osc.start();
    return osc;
  });

  filter.connect(masterGain);
  masterGain.connect(state.audioCtx.destination);

  state.ambientNodes = { masterGain, filter, oscs };
}

function toggleAudio() {
  initAudio();
  if (!state.audioCtx) return;

  if (state.audioCtx.state === 'suspended') {
    state.audioCtx.resume();
  }

  state.soundEnabled = !state.soundEnabled;
  if (elements.soundBtn) {
    elements.soundBtn.classList.toggle('playing', state.soundEnabled);
  }

  if (state.ambientNodes) {
    const targetGain = state.soundEnabled ? 0.08 : 0.0;
    state.ambientNodes.masterGain.gain.setTargetAtTime(targetGain, state.audioCtx.currentTime, 0.2);
  }

  showToast(state.soundEnabled ? 'Ambient Audio On' : 'Ambient Audio Muted');
}

/* ==========================================================================
   7. ORDER MODAL & CHECKOUT LOGIC
   ========================================================================== */
let selectedPackPrice = 180;
let currentQuantity = 1;

function updateOrderTotal() {
  const total = selectedPackPrice * currentQuantity;
  if (elements.totalAmountDisplay) {
    elements.totalAmountDisplay.textContent = `₹${total}`;
  }
}

function openModal() {
  if (elements.orderModal) {
    elements.orderModal.classList.add('open');
  }
}

function closeModal() {
  if (elements.orderModal) {
    elements.orderModal.classList.remove('open');
  }
}

function showToast(message) {
  if (!elements.toast || !elements.toastMessage) return;
  elements.toastMessage.textContent = message;
  elements.toast.classList.add('show');
  setTimeout(() => {
    elements.toast.classList.remove('show');
  }, 4000);
}

/* ==========================================================================
   8. EVENT LISTENERS
   ========================================================================== */
function setupEventListeners() {
  // Window Resize
  window.addEventListener('resize', resizeCanvas, { passive: true });

  // Scroll Tracking
  window.addEventListener('scroll', () => {
    updateScrollTarget();
    
    // Header shadow on scroll
    if (elements.header) {
      elements.header.classList.toggle('scrolled', window.scrollY > 50);
    }
  }, { passive: true });

  // Mobile Menu Drawer Toggle
  if (elements.mobileMenuBtn && elements.mobileMenuDrawer) {
    elements.mobileMenuBtn.addEventListener('click', () => {
      const isOpen = elements.mobileMenuDrawer.classList.toggle('open');
      if (elements.menuIcon) {
        elements.menuIcon.textContent = isOpen ? 'close' : 'menu';
      }
    });
  }

  // Close Mobile Drawer on Link Click
  if (elements.mobileNavLinks) {
    elements.mobileNavLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (elements.mobileMenuDrawer) {
          elements.mobileMenuDrawer.classList.remove('open');
          if (elements.menuIcon) elements.menuIcon.textContent = 'menu';
        }
      });
    });
  }

  // Sound Button
  if (elements.soundBtn) {
    elements.soundBtn.addEventListener('click', toggleAudio);
  }

  // Modal Open/Close
  if (elements.openOrderBtn) elements.openOrderBtn.addEventListener('click', openModal);
  if (elements.closeModalBtn) elements.closeModalBtn.addEventListener('click', closeModal);
  
  if (elements.orderModal) {
    elements.orderModal.addEventListener('click', (e) => {
      if (e.target === elements.orderModal) closeModal();
    });
  }

  // Video Modal
  const openVideoBtn = document.getElementById('open-video-btn');
  const videoModal = document.getElementById('video-modal');
  const closeVideoModalBtn = document.getElementById('close-video-modal-btn');
  const revealVideoPlayer = document.getElementById('reveal-video-player');

  function openVideoModal() {
    if (videoModal) {
      videoModal.classList.add('open');
      if (revealVideoPlayer) {
        revealVideoPlayer.currentTime = 0;
        revealVideoPlayer.play().catch(() => {});
      }
    }
  }

  function closeVideoModal() {
    if (videoModal) {
      videoModal.classList.remove('open');
      if (revealVideoPlayer) {
        revealVideoPlayer.pause();
      }
    }
  }

  if (openVideoBtn) openVideoBtn.addEventListener('click', openVideoModal);
  if (closeVideoModalBtn) closeVideoModalBtn.addEventListener('click', closeVideoModal);
  if (videoModal) {
    videoModal.addEventListener('click', (e) => {
      if (e.target === videoModal) closeVideoModal();
    });
  }

  // Pack Option Selection
  elements.packOptions.forEach((opt) => {
    opt.addEventListener('click', () => {
      elements.packOptions.forEach((o) => o.classList.remove('selected'));
      opt.classList.add('selected');
      const input = opt.querySelector('input');
      if (input) input.checked = true;
      selectedPackPrice = parseInt(opt.dataset.price, 10);
      updateOrderTotal();
    });
  });

  // Quantity Counter
  if (elements.qtyMinus) {
    elements.qtyMinus.addEventListener('click', () => {
      if (currentQuantity > 1) {
        currentQuantity--;
        if (elements.qtyVal) elements.qtyVal.textContent = currentQuantity;
        updateOrderTotal();
      }
    });
  }

  if (elements.qtyPlus) {
    elements.qtyPlus.addEventListener('click', () => {
      currentQuantity++;
      if (elements.qtyVal) elements.qtyVal.textContent = currentQuantity;
      updateOrderTotal();
    });
  }

  // Confirm Order
  if (elements.confirmOrderBtn) {
    elements.confirmOrderBtn.addEventListener('click', () => {
      closeModal();
      showToast(`🎉 Order Placed! Total: ₹${selectedPackPrice * currentQuantity}. Chilling right now!`);
    });
  }

  // Scroll Reveal Intersection Observer
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length > 0) {
    const revealOnScroll = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, {
      root: null,
      threshold: 0.15,
      rootMargin: "0px 0px -50px 0px"
    });

    reveals.forEach(reveal => revealOnScroll.observe(reveal));
    
    // Trigger immediately for elements already in viewport
    setTimeout(() => {
      reveals.forEach(reveal => {
        const rect = reveal.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
          reveal.classList.add('active');
        }
      });
    }, 100);
  }
}

/* ==========================================================================
   9. INITIALIZATION ENTRYPOINT
   ========================================================================== */
function init() {
  setupEventListeners();
  initReservations();
  preloadImages();
  animationLoop();
}

// Start on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
