import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation, getBlockId } from '../../scripts/scripts.js';
import { createCard } from '../card/card.js';

export default function decorate(block) {
  const blockId = getBlockId('card-carousel');
  block.setAttribute('id', blockId);
  block.setAttribute('aria-label', `carousel-${blockId}`);
  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', 'Carousel');

  const rows = [...block.children];
  const slideCount = rows.length;

  const container = document.createElement('div');
  container.classList.add('card-carousel-slides-container');

  const track = document.createElement('div');
  track.classList.add('card-carousel-track');

  const cards = rows.map((row) => {
    const card = createCard(row);
    card.classList.add('card-carousel-slide');
    row.remove();
    return card;
  });

  // Clone cards for infinite loop: prepend last card, append first card
  const cloneBefore = cards[slideCount - 1].cloneNode(true);
  cloneBefore.classList.add('clone');
  const cloneAfter = cards[0].cloneNode(true);
  cloneAfter.classList.add('clone');

  track.append(cloneBefore);
  cards.forEach((card, i) => {
    card.dataset.slideIndex = i;
    track.append(card);
  });
  track.append(cloneAfter);

  track.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  container.append(track);

  const prevBtn = document.createElement('button');
  prevBtn.type = 'button';
  prevBtn.classList.add('card-carousel-prev');
  prevBtn.setAttribute('aria-label', 'Previous Slide');

  const nextBtn = document.createElement('button');
  nextBtn.type = 'button';
  nextBtn.classList.add('card-carousel-next');
  nextBtn.setAttribute('aria-label', 'Next Slide');

  container.append(prevBtn, nextBtn);
  block.prepend(container);

  const indicatorsNav = document.createElement('nav');
  indicatorsNav.setAttribute('aria-label', `Card Carousel Slide Controls for ${blockId}`);
  const indicatorList = document.createElement('ol');
  indicatorList.classList.add('card-carousel-indicators');
  for (let i = 0; i < slideCount; i += 1) {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = String(i + 1);
    btn.setAttribute('aria-label', `Show Slide ${i + 1} of ${slideCount}`);
    li.append(btn);
    indicatorList.append(li);
  }
  indicatorsNav.append(indicatorList);
  block.append(indicatorsNav);

  // Track position: index 0 = clone, index 1 = first real card
  // trackIndex represents position in the extended track (0-based from clone)
  let trackIndex = 1; // start at first real card
  let isTransitioning = false;
  const allSlides = track.querySelectorAll('.card-carousel-slide');

  function getSlideStep() {
    const slide = allSlides[0];
    const style = window.getComputedStyle(slide);
    const marginLeft = parseFloat(style.marginLeft) || 0;
    const marginRight = parseFloat(style.marginRight) || 0;
    return slide.getBoundingClientRect().width + marginLeft + marginRight;
  }

  function setTrackPosition(animate) {
    const slideStep = getSlideStep();
    const slideWidth = allSlides[0].getBoundingClientRect().width;
    const containerWidth = container.getBoundingClientRect().width;
    const marginLeft = parseFloat(window.getComputedStyle(allSlides[0]).marginLeft) || 0;
    const offset = (containerWidth / 2) - (slideWidth / 2) - (trackIndex * slideStep) - marginLeft;
    track.style.transition = animate ? 'transform 0.5s cubic-bezier(0.2, 0.89, 0.75, 0.99)' : 'none';
    track.style.transform = `translateX(${offset}px)`;
  }

  function updateActiveState() {
    const realIndex = (((trackIndex - 1) % slideCount) + slideCount) % slideCount;
    allSlides.forEach((slide) => slide.classList.remove('active'));
    // The active card is at trackIndex in the allSlides NodeList
    allSlides[trackIndex]?.classList.add('active');

    indicatorList.querySelectorAll('button').forEach((btn, i) => {
      if (i === realIndex) btn.setAttribute('disabled', 'true');
      else btn.removeAttribute('disabled');
    });
  }

  function goNext() {
    if (isTransitioning) return;
    isTransitioning = true;
    trackIndex += 1;
    setTrackPosition(true);
    updateActiveState();
  }

  function goPrev() {
    if (isTransitioning) return;
    isTransitioning = true;
    trackIndex -= 1;
    setTrackPosition(true);
    updateActiveState();
  }

  track.addEventListener('transitionend', () => {
    isTransitioning = false;
    // If we've moved to the clone after the last real card, snap to first real
    if (trackIndex >= slideCount + 1) {
      trackIndex = 1;
      setTrackPosition(false);
    }
    // If we've moved to the clone before the first real card, snap to last real
    if (trackIndex <= 0) {
      trackIndex = slideCount;
      setTrackPosition(false);
    }
    updateActiveState();
  });

  prevBtn.addEventListener('click', goPrev);
  nextBtn.addEventListener('click', goNext);

  indicatorList.querySelectorAll('button').forEach((btn, i) => {
    btn.addEventListener('click', () => {
      if (isTransitioning) return;
      isTransitioning = true;
      trackIndex = i + 1;
      setTrackPosition(true);
      updateActiveState();
    });
  });

  // Initialize
  setTrackPosition(false);
  updateActiveState();

  // Autoplay
  let autoplayInterval;
  const startAutoplay = () => {
    autoplayInterval = setInterval(goNext, 5000);
  };
  const stopAutoplay = () => clearInterval(autoplayInterval);

  startAutoplay();
  block.addEventListener('mouseenter', stopAutoplay);
  block.addEventListener('mouseleave', startAutoplay);

  // Drag/swipe support
  let dragStartX = 0;
  let dragCurrentX = 0;
  let isDragging = false;
  let dragOffset = 0;

  function getBaseOffset() {
    const slideStep = getSlideStep();
    const slideWidth = allSlides[0].getBoundingClientRect().width;
    const containerWidth = container.getBoundingClientRect().width;
    const marginL = parseFloat(window.getComputedStyle(allSlides[0]).marginLeft) || 0;
    return (containerWidth / 2) - (slideWidth / 2) - (trackIndex * slideStep) - marginL;
  }

  function onDragStart(e) {
    if (isTransitioning) return;
    isDragging = true;
    dragStartX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    dragOffset = getBaseOffset();
    track.style.transition = 'none';
    stopAutoplay();
  }

  function onDragMove(e) {
    if (!isDragging) return;
    e.preventDefault();
    dragCurrentX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const diff = dragCurrentX - dragStartX;
    track.style.transform = `translateX(${dragOffset + diff}px)`;
  }

  function onDragEnd() {
    if (!isDragging) return;
    isDragging = false;
    const diff = dragCurrentX - dragStartX;
    const threshold = getSlideStep() * 0.2;
    if (diff < -threshold) {
      goNext();
    } else if (diff > threshold) {
      goPrev();
    } else {
      setTrackPosition(true);
    }
    startAutoplay();
  }

  container.addEventListener('mousedown', onDragStart);
  container.addEventListener('mousemove', onDragMove);
  container.addEventListener('mouseup', onDragEnd);
  container.addEventListener('mouseleave', () => { if (isDragging) onDragEnd(); });
  container.addEventListener('touchstart', onDragStart, { passive: true });
  container.addEventListener('touchmove', onDragMove, { passive: false });
  container.addEventListener('touchend', onDragEnd);
  container.style.cursor = 'grab';
  container.addEventListener('mousedown', () => { container.style.cursor = 'grabbing'; });
  container.addEventListener('mouseup', () => { container.style.cursor = 'grab'; });
}
