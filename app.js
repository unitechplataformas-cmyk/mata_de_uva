const toggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() {
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Abrir menú');
  navigation.classList.remove('is-open');
}
toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  navigation.classList.toggle('is-open', open);
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
    closeMenu(); toggle.focus();
  }
});
window.matchMedia('(min-width: 701px)').addEventListener('change', closeMenu);
document.querySelectorAll('.story-toggle').forEach((button, index) => {
  const card = button.closest('.story-card');
  const panel = card.querySelector('.story-overlay');
  panel.id = `story-panel-${index}`;
  button.setAttribute('aria-controls', panel.id);
  button.addEventListener('click', () => {
    const open = card.classList.toggle('is-open');
    button.setAttribute('aria-expanded', String(open));
    button.querySelector('span').textContent = open ? '−' : '+';
  });
});
const experiences = [...document.querySelectorAll('.experience-list details')];
const photo = document.querySelector('#experience-photo');
let experienceTimer = null;
let experienceImages = [];
let experienceIndex = 0;

const showExperienceImage = (src, alt) => {
  photo.classList.add('is-changing');
  photo.src = src;
  photo.alt = alt;
  photo.addEventListener('load', () => photo.classList.remove('is-changing'), {once: true});
};

const startExperienceCarousel = detail => {
  if (experienceTimer) window.clearInterval(experienceTimer);
  experienceImages = JSON.parse(detail.dataset.images || '[]');
  experienceIndex = 0;
  showExperienceImage(experienceImages[0], detail.dataset.alt);
  if (experienceImages.length < 2) return;
  experienceTimer = window.setInterval(() => {
    experienceIndex = (experienceIndex + 1) % experienceImages.length;
    showExperienceImage(experienceImages[experienceIndex], detail.dataset.alt);
  }, 2500);
};

experiences.forEach(detail => detail.addEventListener('toggle', () => {
  if (!detail.open) return;
  experiences.forEach(other => { if (other !== detail) other.open = false; });
  startExperienceCarousel(detail);
}));

const initialExperience = experiences.find(detail => detail.open);
if (initialExperience) startExperienceCarousel(initialExperience);

const heroSlides = [...document.querySelectorAll('.hero-slide')];
if (heroSlides.length > 1) {
  let activeSlide = 0;
  window.setInterval(() => {
    heroSlides[activeSlide].classList.remove('is-active');
    activeSlide = (activeSlide + 1) % heroSlides.length;
    heroSlides[activeSlide].classList.add('is-active');
  }, 6000);
}

const landVideo = document.querySelector('.landscape video[data-video-parts]');
if (landVideo) {
  const parts = landVideo.dataset.videoParts.split(',');
  fetchVideoParts(parts).then(blob => {
    landVideo.src = URL.createObjectURL(blob);
    landVideo.play().catch(() => {});
  }).catch(() => {});
}

async function fetchVideoParts(parts) {
  const chunks = await Promise.all(parts.map(async part => {
    const response = await fetch(part);
    if (!response.ok) throw new Error(`Video fragment unavailable: ${part}`);
    return response.arrayBuffer();
  }));
  return new Blob(chunks, {type: 'video/mp4'});
}



const contactCarousel = document.querySelector('.contact-carousel');
if (contactCarousel) {
  const contactItems = [...contactCarousel.querySelectorAll('.contact-carousel-item')];
  const contactImages = contactItems.map(item => item.src);
  let contactIndex = 0;
  let contactTransitioning = false;
  contactImages.forEach(src => { const image = new Image(); image.src = src; });
  const setContactStates = (current, next, outgoing = -1) => {
    contactItems.forEach((item, index) => {
      item.classList.toggle('is-active', index === current);
      item.classList.toggle('is-next', index === next);
      item.classList.toggle('is-outgoing', index === outgoing);
    });
  };
  const advanceContactCarousel = () => {
    if (contactTransitioning) return;
    contactTransitioning = true;
    const nextIndex = (contactIndex + 1) % contactItems.length;
    const followingIndex = (contactIndex + 2) % contactItems.length;
    contactItems[contactIndex].classList.remove('is-active');
    contactItems[contactIndex].classList.add('is-outgoing');
    contactItems[nextIndex].classList.remove('is-next');
    contactItems[nextIndex].classList.add('is-active');
    contactItems[followingIndex].classList.add('is-next');
    window.setTimeout(() => {
      contactIndex = nextIndex;
      setContactStates(contactIndex, (contactIndex + 1) % contactItems.length);
      contactTransitioning = false;
    }, 1000);
  };
  setContactStates(0, 1);
  window.setInterval(advanceContactCarousel, 2000);
}