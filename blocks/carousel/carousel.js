import { moveInstrumentation, getBlockId } from '../../scripts/scripts.js';
import { createSliderControls } from '../../scripts/slider.js';

function createSlide(row, slideIndex, carouselId) {
  const slide = document.createElement('li');
  slide.dataset.slideIndex = slideIndex;
  slide.setAttribute('id', `carousel-${carouselId}-slide-${slideIndex}`);
  slide.classList.add('carousel-slide');

  row.querySelectorAll(':scope > div').forEach((column, colIdx) => {
    column.classList.add(`carousel-slide-${colIdx === 0 ? 'image' : 'content'}`);
    slide.append(column);
  });

  const labeledBy = slide.querySelector('h1, h2, h3, h4, h5, h6');
  if (labeledBy) {
    slide.setAttribute('aria-labelledby', labeledBy.getAttribute('id'));
  }

  return slide;
}

export default async function decorate(block) {
  const blockId = getBlockId('carousel');
  block.setAttribute('id', blockId);
  block.setAttribute('aria-label', `carousel-${blockId}`);
  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', 'Carousel');

  const rows = [...block.querySelectorAll(':scope > div')];
  const slideCount = rows.length;
  const isSingleSlide = slideCount < 2;

  const container = document.createElement('div');
  container.classList.add('carousel-slides-container');

  const track = document.createElement('ul');
  track.classList.add('carousel-slides');
  track.setAttribute('tabindex', '0');
  track.setAttribute('aria-label', 'Carousel slides');

  const slides = rows.map((row, idx) => {
    const slide = createSlide(row, idx, blockId);
    moveInstrumentation(row, slide);
    row.remove();
    return slide;
  });

  // Clone last and first for infinite loop
  const cloneLast = slides[slideCount - 1].cloneNode(true);
  cloneLast.classList.add('carousel-clone');
  const cloneFirst = slides[0].cloneNode(true);
  cloneFirst.classList.add('carousel-clone');

  track.append(cloneLast);
  slides.forEach((slide) => track.append(slide));
  track.append(cloneFirst);

  // Force eager loading on all carousel images
  track.querySelectorAll('img').forEach((img) => {
    img.loading = 'eager';
  });

  container.append(track);
  block.prepend(container);

  let indicatorsNav = null;
  if (!isSingleSlide) {
    const controls = createSliderControls(slideCount);
    indicatorsNav = controls.indicatorsNav;
    block.append(indicatorsNav);

    const indicators = indicatorsNav.querySelectorAll('button');
    indicators.forEach((btn, idx) => {
      btn.textContent = String(idx + 1);
    });
  }

  // Transform-based infinite carousel
  let trackIndex = 1; // index 0 = clone of last, 1 = first real slide
  let isTransitioning = false;
  const allSlides = track.querySelectorAll('.carousel-slide');

  const getSlideWidth = () => allSlides[0].getBoundingClientRect().width;

  const setTrackPosition = (animate) => {
    const slideWidth = getSlideWidth();
    const offset = -(trackIndex * slideWidth);
    track.style.transition = animate ? 'transform 0.5s cubic-bezier(0.2, 0.89, 0.75, 0.99)' : 'none';
    track.style.transform = `translateX(${offset}px)`;
  };

  const updateActiveState = () => {
    const realIndex = (((trackIndex - 1) % slideCount) + slideCount) % slideCount;
    if (indicatorsNav) {
      indicatorsNav.querySelectorAll('button').forEach((btn, i) => {
        if (i === realIndex) btn.setAttribute('disabled', 'true');
        else btn.removeAttribute('disabled');
      });
    }
    block.dataset.activeSlide = realIndex;
  };

  const goNext = () => {
    if (isTransitioning) return;
    isTransitioning = true;
    trackIndex += 1;
    setTrackPosition(true);
    updateActiveState();
  };

  const goPrev = () => {
    if (isTransitioning) return;
    isTransitioning = true;
    trackIndex -= 1;
    setTrackPosition(true);
    updateActiveState();
  };

  track.addEventListener('transitionend', () => {
    isTransitioning = false;
    if (trackIndex >= slideCount + 1) {
      trackIndex = 1;
      setTrackPosition(false);
    }
    if (trackIndex <= 0) {
      trackIndex = slideCount;
      setTrackPosition(false);
    }
    updateActiveState();
  });

  if (indicatorsNav) {
    indicatorsNav.querySelectorAll('button').forEach((btn, i) => {
      btn.addEventListener('click', () => {
        if (isTransitioning) return;
        isTransitioning = true;
        trackIndex = i + 1;
        setTrackPosition(true);
        updateActiveState();
      });
    });
  }

  // Initialize
  setTrackPosition(false);
  updateActiveState();

  if (!isSingleSlide) {
    // Keyboard navigation
    track.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); goPrev(); }
      if (e.key === 'ArrowRight') { e.preventDefault(); goNext(); }
    });

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

    const onDragStart = (e) => {
      if (isTransitioning) return;
      isDragging = true;
      dragStartX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
      dragOffset = -(trackIndex * getSlideWidth());
      track.style.transition = 'none';
      stopAutoplay();
    };

    const onDragMove = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      dragCurrentX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
      const diff = dragCurrentX - dragStartX;
      track.style.transform = `translateX(${dragOffset + diff}px)`;
    };

    const onDragEnd = () => {
      if (!isDragging) return;
      isDragging = false;
      const diff = dragCurrentX - dragStartX;
      const threshold = getSlideWidth() * 0.2;
      if (diff < -threshold) {
        goNext();
      } else if (diff > threshold) {
        goPrev();
      } else {
        setTrackPosition(true);
      }
      startAutoplay();
    };

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
}
