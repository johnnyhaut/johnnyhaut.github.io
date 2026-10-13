document.addEventListener("DOMContentLoaded", setup);

async function setup(){
    setupNavToggle(); 
    setupProjectsCarousel(); 
}

// Used to setup the mobile hamburger nav toggle
function setupNavToggle() {
  const toggle = document.getElementById('navToggle');
  const overlay = document.getElementById('navOverlay');
  const close = document.getElementById('navClose');

  if (!toggle || !overlay || !close) return;

  toggle.addEventListener('click', () => {
    overlay.classList.add('open');
    toggle.style.display = 'none';        // hide hamburger when overlay opens
  });

  close.addEventListener('click', () => {
    overlay.classList.remove('open');
    toggle.style.display = 'block';       // restore hamburger when overlay closes
  });
}

// Used to setup the projects carousel (shows multiple slides, auto-advances, pauses on hover)
function setupProjectsCarousel() {
  const track = document.getElementById('projectTrack');
  const dotsContainer = document.getElementById('projectDots');
  const prevBtn = document.getElementById('prevProject');
  const nextBtn = document.getElementById('nextProject');
  const wrapper = document.querySelector('.carousel-track-wrapper');

  if (!track || !dotsContainer || !prevBtn || !nextBtn || !wrapper) return;

  const slides = track.querySelectorAll('.project-slide');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const AUTOPLAY_DELAY = 5000;
  let current = 0;
  let autoplayId = null;

  function getVisibleCount() {
    const width = window.innerWidth;
    if (width <= 600) return 1;
    if (width <= 900) return 2;
    return 3;
  }

  function getMaxIndex() {
    return Math.max(0, slides.length - getVisibleCount());
  }

  function buildDots() {
    dotsContainer.innerHTML = '';
    const maxIndex = getMaxIndex();
    for (let i = 0; i <= maxIndex; i++) {
      const dot = document.createElement('button');
      dot.classList.add('carousel-dot');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => { goTo(i); restartAutoplay(); });
      dotsContainer.appendChild(dot);
    }
  }

  function render() {
    const slideWidth = slides[0].getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    track.style.transform = `translateX(-${current * (slideWidth + gap)}px)`;
    const dots = dotsContainer.querySelectorAll('.carousel-dot');
    dots.forEach((dot, i) => dot.classList.toggle('active', i === current));
  }

  function goTo(index) {
    const maxIndex = getMaxIndex();
    current = Math.max(0, Math.min(index, maxIndex));
    render();
  }

  function next() {
    const maxIndex = getMaxIndex();
    goTo(current >= maxIndex ? 0 : current + 1);
  }
  function prev() {
    const maxIndex = getMaxIndex();
    goTo(current <= 0 ? maxIndex : current - 1);
  }

  function startAutoplay() {
    if (prefersReducedMotion) return;
    stopAutoplay();
    autoplayId = setInterval(next, AUTOPLAY_DELAY);
  }
  function stopAutoplay() {
    if (autoplayId) clearInterval(autoplayId);
  }
  function restartAutoplay() { startAutoplay(); }

  nextBtn.addEventListener('click', () => { next(); restartAutoplay(); });
  prevBtn.addEventListener('click', () => { prev(); restartAutoplay(); });

  wrapper.addEventListener('mouseenter', stopAutoplay);
  wrapper.addEventListener('mouseleave', startAutoplay);

  window.addEventListener('resize', () => {
    buildDots();
    goTo(Math.min(current, getMaxIndex()));
  });

  buildDots();
  render();
  startAutoplay();
}