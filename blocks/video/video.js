/*
 * Video Block
 * Show a video referenced by a link
 * https://www.hlx.live/developer/block-collection/video
 */

import { ensureDOMPurify } from '../../scripts/scripts.js';
import { DOMPURIFY } from '../../scripts/aem.js';
import { getYoutubeEmbedHtml, getVimeoEmbedHtml } from '../../scripts/utils.js';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

async function htmlToElement(html) {
  await ensureDOMPurify();
  const temp = document.createElement('div');
  temp.innerHTML = window.DOMPurify.sanitize(html, DOMPURIFY);
  return temp.firstElementChild;
}

function getVideoElement(source, autoplay, background) {
  const video = document.createElement('video');
  video.setAttribute('controls', '');
  if (autoplay) video.setAttribute('autoplay', '');
  if (background) {
    video.setAttribute('loop', '');
    video.setAttribute('playsinline', '');
    video.removeAttribute('controls');
    video.addEventListener('canplay', () => {
      video.muted = true;
      if (autoplay) video.play();
    });
  }

  const sourceEl = document.createElement('source');
  sourceEl.setAttribute('src', source);
  const ext = source.split('/').pop().split('.').pop();
  const type = ['mp4', 'webm', 'ogg'].includes(ext) ? `video/${ext}` : 'video/mp4';
  sourceEl.setAttribute('type', type);
  video.append(sourceEl);

  return video;
}

function openVideoModal(link) {
  const overlay = document.createElement('div');
  overlay.className = 'video-modal-overlay';

  const modal = document.createElement('div');
  modal.className = 'video-modal';

  const closeBtn = document.createElement('button');
  closeBtn.className = 'video-modal-close';
  closeBtn.setAttribute('type', 'button');
  closeBtn.setAttribute('aria-label', 'Close video');

  const isYoutube = link.includes('youtube') || link.includes('youtu.be');
  const isVimeo = link.includes('vimeo');

  if (isYoutube || isVimeo) {
    const iframe = document.createElement('iframe');
    const url = new URL(link);
    if (isYoutube) {
      const vid = url.searchParams.get('v') || url.pathname.split('/').pop();
      iframe.src = `https://www.youtube.com/embed/${vid}?autoplay=1`;
    } else {
      const vid = url.pathname.split('/').pop();
      iframe.src = `https://player.vimeo.com/video/${vid}?autoplay=1`;
    }
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('allow', 'autoplay; encrypted-media');
    iframe.setAttribute('frameborder', '0');
    modal.append(iframe);
  } else {
    const video = getVideoElement(link, true, false);
    video.setAttribute('autoplay', '');
    video.addEventListener('click', () => {
      if (video.paused) video.play();
      else video.pause();
    });
    modal.append(video);
  }

  modal.append(closeBtn);
  overlay.append(modal);
  document.body.append(overlay);

  requestAnimationFrame(() => overlay.classList.add('active'));

  const close = () => {
    overlay.classList.remove('active');
    overlay.addEventListener('transitionend', () => overlay.remove(), { once: true });
    document.body.style.overflow = '';
  };

  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  }, { once: true });

  document.body.style.overflow = 'hidden';
}

const loadVideoEmbed = async (block, link, autoplay, background) => {
  if (block.dataset.embedLoaded === 'true') {
    return;
  }
  const url = new URL(link);

  const isYoutube = link.includes('youtube') || link.includes('youtu.be');
  const isVimeo = link.includes('vimeo');

  if (isYoutube) {
    const embedWrapper = await htmlToElement(getYoutubeEmbedHtml(url, autoplay, background));
    block.append(embedWrapper);
    embedWrapper.querySelector('iframe').addEventListener('load', () => {
      block.dataset.embedLoaded = true;
    });
  } else if (isVimeo) {
    const embedWrapper = await htmlToElement(getVimeoEmbedHtml(url, autoplay, background));
    block.append(embedWrapper);
    embedWrapper.querySelector('iframe').addEventListener('load', () => {
      block.dataset.embedLoaded = true;
    });
  } else {
    const videoEl = getVideoElement(link, autoplay, background);
    block.append(videoEl);
    videoEl.addEventListener('canplay', () => {
      block.dataset.embedLoaded = true;
    });
  }
};

export default async function decorate(block) {
  const placeholder = block.querySelector('picture');
  const link = block.querySelector('a').href;
  block.textContent = '';
  block.dataset.embedLoaded = false;

  const autoplay = block.classList.contains('autoplay');
  if (placeholder) {
    block.classList.add('placeholder');
    const wrapper = document.createElement('div');
    wrapper.className = 'video-placeholder';
    wrapper.append(placeholder);

    if (!autoplay) {
      wrapper.insertAdjacentHTML(
        'beforeend',
        '<div class="video-placeholder-play"><button type="button" title="Play"></button></div>',
      );
      wrapper.addEventListener('click', () => {
        openVideoModal(link);
      });
    }
    block.append(wrapper);
  }

  if (!placeholder || autoplay) {
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        observer.disconnect();
        const playOnLoad = autoplay && !prefersReducedMotion.matches;
        loadVideoEmbed(block, link, playOnLoad, autoplay);
      }
    });
    observer.observe(block);
  }
}
