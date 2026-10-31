const toggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
const isMobileMenu = () => window.matchMedia('(max-width: 700px)').matches;
function closeMenu() {
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Abrir menú');
  navigation.setAttribute('aria-hidden', isMobileMenu() ? 'true' : 'false');
  navigation.classList.remove('is-open');
  document.body.classList.remove('menu-open');
}

navigation.setAttribute('aria-hidden', isMobileMenu() ? 'true' : 'false');

// Corrección de navegación: las agendas de Nosotros abren Contacto directamente.
if (document.body?.classList.contains('nosotros-page')) {
  document.querySelectorAll('a').forEach(link => {
    const label = link.textContent.replace(/\s+/g, ' ').trim();
    if (label === 'Agenda una visita') link.setAttribute('href', '../contacto/');
  });
}
toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  navigation.setAttribute('aria-hidden', isMobileMenu() ? String(!open) : 'false');
  navigation.classList.toggle('is-open', open);
  document.body.classList.toggle('menu-open', open);
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('pointerdown', event => {
  if (toggle.getAttribute('aria-expanded') !== 'true') return;
  if (!event.target.closest('.site-header')) closeMenu();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
    closeMenu(); toggle.focus();
  }
});
const desktopQuery = window.matchMedia('(min-width: 701px)');
if (desktopQuery.addEventListener) desktopQuery.addEventListener('change', closeMenu);
else desktopQuery.addListener(closeMenu);
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
const experienceCarousel = document.querySelector('[data-experience-carousel]');
const experienceCards = experienceCarousel ? [...experienceCarousel.querySelectorAll('.experience-card')] : [];
const experienceDots = experienceCarousel ? [...experienceCarousel.querySelectorAll('[data-experience-target]')] : [];
let activeExperience = 1;
let experienceRotationTimer = null;
const experiencePhotos = experienceCards.map(card => [...card.querySelectorAll('.experience-card-image')]);
const experiencePhotoIndexes = experiencePhotos.map(() => 0);
const preloadImageElements = images => Promise.all(images.map(image => {
  if (image.complete && image.naturalWidth > 0) return Promise.resolve();
  const preload = new Image();
  preload.decoding = 'async';
  const source = image.currentSrc || image.src;
  return new Promise(resolve => {
    const done = () => resolve();
    preload.addEventListener('load', done, {once:true});
    preload.addEventListener('error', done, {once:true});
    preload.src = source;
  }).then(() => typeof preload.decode === 'function' ? preload.decode().catch(() => {}) : undefined);
}));
const setExperiencePosition = (card, position) => {
  card.classList.remove('is-prev', 'is-active', 'is-next');
  card.classList.add(position);
};
const updateExperiencePositions = nextIndex => {
  activeExperience = nextIndex;
  experienceCards.forEach((card, index) => {
    const offset = (index - activeExperience + experienceCards.length) % experienceCards.length;
    setExperiencePosition(card, offset === 0 ? 'is-active' : offset === 1 ? 'is-next' : 'is-prev');
    card.setAttribute('aria-current', offset === 0 ? 'true' : 'false');
  });
  experienceDots.forEach((dot, index) => {
    const selected = index === activeExperience;
    dot.classList.toggle('is-active', selected);
    dot.setAttribute('aria-selected', selected ? 'true' : 'false');
  });
};
const rotateExperiencePhotos = categoryIndex => {
  const layers = experiencePhotos[categoryIndex];
  if (!layers || layers.length < 2) return;
  const current = experiencePhotoIndexes[categoryIndex];
  const next = (current + 1) % layers.length;
  layers[next].classList.add('is-next-image');
  requestAnimationFrame(() => {
    layers[current].classList.remove('is-active');
    layers[next].classList.add('is-active');
  });
  window.setTimeout(() => {
    layers[current].classList.remove('is-next-image');
    layers[next].classList.remove('is-next-image');
  }, 1200);
  experiencePhotoIndexes[categoryIndex] = next;
};
const startExperienceRotation = () => {
  if (experienceRotationTimer) window.clearInterval(experienceRotationTimer);
  const allImages = experiencePhotos.flat();
  preloadImageElements(allImages).then(() => {
    if (!experienceCarousel || document.visibilityState === 'hidden') return;
    experienceRotationTimer = window.setInterval(() => {
      experiencePhotos.forEach((_, index) => rotateExperiencePhotos(index));
    }, 6000);
  });
};
if (experienceCarousel && experienceCards.length === 3) {
  updateExperiencePositions(activeExperience);
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  experienceDots.forEach(dot => dot.addEventListener('click', () => updateExperiencePositions(Number(dot.dataset.experienceTarget))));
  experienceCards.forEach((card, index) => {
    card.addEventListener('click', () => {
      if (!finePointer.matches) updateExperiencePositions(index);
    });
    card.addEventListener('pointerenter', () => {
      if (finePointer.matches) updateExperiencePositions(index);
    });
    card.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); updateExperiencePositions(index); }
    });
  });
  experienceCarousel.addEventListener('pointerleave', () => {
    if (finePointer.matches) updateExperiencePositions(1);
  });
  startExperienceRotation();
  window.addEventListener('pagehide', () => window.clearInterval(experienceRotationTimer));
}
const middleGalleryTrack = document.querySelector('.middle-gallery-track');
if (middleGalleryTrack) {
  const middleGalleryItems = [...middleGalleryTrack.children];
  middleGalleryItems.forEach((item, index) => {
    item.dataset.galleryIndex = String(index);
    const image = item.querySelector('img');
    const source = item.getAttribute('href');
    const freshSource = source ? `${source}${source.includes('?') ? '&' : '?'}v=official19` : source;
    if (freshSource) item.setAttribute('href', freshSource);
    if (image && freshSource) image.setAttribute('src', freshSource);
    item.setAttribute('aria-label', `Abrir fotografía ${index + 1} de ${middleGalleryItems.length}`);
    if (image) image.dataset.galleryIndex = String(index);
  });
  middleGalleryItems.forEach(item => middleGalleryTrack.appendChild(item.cloneNode(true)));

  const lightbox = document.querySelector('[data-gallery-lightbox]');
  const lightboxImage = lightbox?.querySelector('[data-lightbox-image]');
  const lightboxCaption = lightbox?.querySelector('[data-lightbox-caption]');
  const previousButton = lightbox?.querySelector('[data-lightbox-prev]');
  const nextButton = lightbox?.querySelector('[data-lightbox-next]');
  const closeButton = lightbox?.querySelector('[data-lightbox-close]');
  const galleryImages = middleGalleryItems.map(item => ({
    src: item.getAttribute('href'),
    alt: item.querySelector('img')?.alt || ''
  }));
  let lightboxIndex = -1;
  let lastGalleryTrigger = null;
  const updateLightbox = index => {
    if (!lightboxImage || !galleryImages[index]) return;
    lightboxIndex = index;
    const image = galleryImages[index];
    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    if (lightboxCaption) lightboxCaption.textContent = `${index + 1} / ${galleryImages.length}`;
    if (previousButton) previousButton.disabled = index === 0;
    if (nextButton) nextButton.disabled = index === galleryImages.length - 1;
  };
  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');
    lightboxImage?.removeAttribute('src');
    lastGalleryTrigger?.focus();
    lightboxIndex = -1;
  };
  const openLightbox = (index, trigger) => {
    if (!lightbox || !galleryImages[index]) return;
    lastGalleryTrigger = trigger;
    updateLightbox(index);
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-open');
    closeButton?.focus();
  };
  middleGalleryTrack.addEventListener('click', event => {
    const link = event.target.closest('.middle-gallery-link');
    if (!link) return;
    event.preventDefault();
    openLightbox(Number(link.dataset.galleryIndex), link);
  });
  middleGalleryTrack.addEventListener('keydown', event => {
    const link = event.target.closest('.middle-gallery-link');
    if (!link || (event.key !== 'Enter' && event.key !== ' ')) return;
    event.preventDefault();
    openLightbox(Number(link.dataset.galleryIndex), link);
  });
  previousButton?.addEventListener('click', () => { if (lightboxIndex > 0) updateLightbox(lightboxIndex - 1); });
  nextButton?.addEventListener('click', () => { if (lightboxIndex < galleryImages.length - 1) updateLightbox(lightboxIndex + 1); });
  closeButton?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', event => { if (event.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', event => {
    if (!lightbox?.classList.contains('is-open')) return;
    if (event.key === 'Escape') closeLightbox();
    else if (event.key === 'ArrowLeft' && lightboxIndex > 0) updateLightbox(lightboxIndex - 1);
    else if (event.key === 'ArrowRight' && lightboxIndex < galleryImages.length - 1) updateLightbox(lightboxIndex + 1);
  });
}
const heroSlides = [...document.querySelectorAll('.hero-slide')];
if (heroSlides.length > 1) {
  let activeSlide = 0;
  let heroRotationTimer = null;
  const startHeroRotation = () => {
    if (document.visibilityState === 'hidden') return;
    heroRotationTimer = window.setInterval(() => {
      heroSlides[activeSlide].classList.remove('is-active');
      activeSlide = (activeSlide + 1) % heroSlides.length;
      heroSlides[activeSlide].classList.add('is-active');
    }, 5000);
  };
  const warmHeroSlides = () => preloadImageElements(heroSlides.slice(1));
  const scheduleHeroWarmup = () => {
    if ('requestIdleCallback' in window) window.requestIdleCallback(warmHeroSlides, {timeout: 2500});
    else window.setTimeout(warmHeroSlides, 2500);
  };
  const activeHero = heroSlides[0];
  if (activeHero.complete && activeHero.naturalWidth > 0) {
    startHeroRotation();
    scheduleHeroWarmup();
  } else {
    activeHero.addEventListener('load', () => {
      startHeroRotation();
      scheduleHeroWarmup();
    }, {once:true});
  }
  window.addEventListener('pagehide', () => window.clearInterval(heroRotationTimer));
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
  let contactRotationTimer = null;
  preloadImageElements(contactItems).then(() => {
    if (document.visibilityState === 'hidden') return;
    contactRotationTimer = window.setInterval(advanceContactCarousel, 2000);
  });
  window.addEventListener('pagehide', () => window.clearInterval(contactRotationTimer));
}
const floatingInfoToggle = document.querySelector('.floating-info-toggle');
const floatingInfoPanel = document.querySelector('#floating-info-panel');
if (floatingInfoToggle && floatingInfoPanel) {
  const closeFloatingInfo = () => {
    floatingInfoToggle.setAttribute('aria-expanded', 'false');
    floatingInfoPanel.setAttribute('aria-hidden', 'true');
    floatingInfoPanel.classList.remove('is-open');
  };
  floatingInfoToggle.addEventListener('click', () => {
    const isOpen = floatingInfoToggle.getAttribute('aria-expanded') === 'true';
    if (isOpen) closeFloatingInfo();
    else {
      floatingInfoToggle.setAttribute('aria-expanded', 'true');
      floatingInfoPanel.setAttribute('aria-hidden', 'false');
      floatingInfoPanel.classList.add('is-open');
      floatingInfoPanel.querySelector('input')?.focus();
    }
  });
  floatingInfoPanel.addEventListener('submit', event => {
    event.preventDefault();
    closeFloatingInfo();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeFloatingInfo();
  });
}


const aboutCarousel = document.querySelector('[data-about-carousel]');
if (aboutCarousel) {
  const aboutSlides = [...aboutCarousel.querySelectorAll('[data-about-slide]')];
  const aboutDots = [...document.querySelectorAll('[data-about-target]')];
  let aboutIndex = 0;
  let aboutTimer;
  const showAboutSlide = (index) => {
    aboutIndex = (index + aboutSlides.length) % aboutSlides.length;
    aboutSlides.forEach((slide, i) => slide.classList.toggle('is-active', i === aboutIndex));
    aboutDots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === aboutIndex);
      dot.setAttribute('aria-selected', String(i === aboutIndex));
    });
  };
  const restartAboutTimer = () => {
    window.clearInterval(aboutTimer);
    aboutTimer = window.setInterval(() => showAboutSlide(aboutIndex + 1), 5000);
  };
  aboutDots.forEach((dot, i) => dot.addEventListener('click', () => { showAboutSlide(i); restartAboutTimer(); }));
  aboutCarousel.addEventListener('mouseenter', () => window.clearInterval(aboutTimer));
  aboutCarousel.addEventListener('mouseleave', restartAboutTimer);
  preloadImageElements(aboutSlides.flatMap(slide => [...slide.querySelectorAll('img')])).then(restartAboutTimer);
  window.addEventListener('pagehide', () => window.clearInterval(aboutTimer));
}

// Nuestro Sello: la información cambia al pasar el cursor, tocar o enfocar una botella.
const bottleButtons = [...document.querySelectorAll('.nosotros-bottle[data-bottle]')];
const bottleCopy = document.querySelector('[data-bottle-copy]');
if (bottleButtons.length && bottleCopy) {
  const bottleContent = {
    quebranto: {
      label: 'Rosado',
      title: 'Quebranto',
      text: 'Elaborado a partir de uvas tintas con un contacto limitado con sus pieles, ofrece un punto intermedio entre la expresión frutal de los tintos y la ligereza de los blancos.'
    },
    '1524': {
      label: 'Tinto',
      title: '1524',
      text: 'Elaborado a partir de uvas tintas, el vino tinto obtiene su color y buena parte de su estructura del contacto con las pieles durante su elaboración. Puede ofrecer aromas frutales, taninos y una gran variedad de matices según las uvas y el proceso.'
    },
    'segundo-aire': {
      label: 'Blanco',
      title: 'Segundo Aire',
      text: 'Los vinos blancos se caracterizan por su frescura y sus aromas, que pueden recordar a frutas, flores o notas cítricas. Suelen ser una opción ligera y versátil, ideal para acompañar distintos momentos y comidas.'
    },
    'fondo-de-tierra': {
      label: 'Ensamble de uvas',
      title: 'Fondo de tierra',
      text: 'Un ensamble combina dos o más variedades de uva para crear un vino con identidad propia. Cada variedad aporta características distintas, buscando equilibrio y complejidad en el resultado final.'
    }
  };
  let activeBottle = bottleButtons.find(button => button.classList.contains('is-active'))?.dataset.bottle || 'segundo-aire';
  const renderBottle = key => {
    const content = bottleContent[key];
    if (!content || key === activeBottle) return;
    activeBottle = key;
    bottleCopy.classList.add('is-changing');
    bottleButtons.forEach(button => {
      const selected = button.dataset.bottle === key;
      button.classList.toggle('is-active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    window.setTimeout(() => {
      bottleCopy.querySelector('.nosotros-kicker').textContent = content.label;
      bottleCopy.querySelector('h3').textContent = content.title;
      bottleCopy.querySelector(':scope > p:last-child').textContent = content.text;
      bottleCopy.classList.remove('is-changing');
    }, 180);
  };
  bottleButtons.forEach(button => {
    button.addEventListener('mouseenter', () => renderBottle(button.dataset.bottle));
    button.addEventListener('focus', () => renderBottle(button.dataset.bottle));
    button.addEventListener('click', () => renderBottle(button.dataset.bottle));
  });
}
