import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const isDesktop = window.matchMedia('(min-width: 900px)');

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const megaMenu = nav.querySelector('.nav-megamenu');
    if (nav.getAttribute('aria-expanded') === 'true') {
      // eslint-disable-next-line no-use-before-define
      toggleMegaMenu(nav, false);
    } else if (megaMenu) {
      // eslint-disable-next-line no-use-before-define
      closeMegaMenu(nav);
    }
  }
}

function closeMegaMenu(nav) {
  nav.setAttribute('aria-expanded', 'false');
  nav.querySelector('.nav-hamburger button').setAttribute('aria-label', 'Open navigation');
  document.body.style.overflowY = '';
  const overlay = document.querySelector('.nav-megamenu-overlay');
  if (overlay) overlay.classList.remove('active');
}

function openMegaMenu(nav) {
  nav.setAttribute('aria-expanded', 'true');
  nav.querySelector('.nav-hamburger button').setAttribute('aria-label', 'Close navigation');
  if (!isDesktop.matches) {
    document.body.style.overflowY = 'hidden';
  }
  const overlay = document.querySelector('.nav-megamenu-overlay');
  if (overlay) overlay.classList.add('active');
}

function toggleMegaMenu(nav, forceState = null) {
  const isOpen = nav.getAttribute('aria-expanded') === 'true';
  const shouldOpen = forceState !== null ? forceState : !isOpen;
  if (shouldOpen) {
    openMegaMenu(nav);
  } else {
    closeMegaMenu(nav);
  }
}

function setupHorizontalNav(navBar) {
  if (!navBar) return;
  navBar.querySelectorAll(':scope .default-content-wrapper > ul > li').forEach((item) => {
    if (item.querySelector('ul')) {
      item.classList.add('nav-drop');
      item.addEventListener('mouseenter', () => {
        if (isDesktop.matches) item.setAttribute('aria-expanded', 'true');
      });
      item.addEventListener('mouseleave', () => {
        if (isDesktop.matches) item.setAttribute('aria-expanded', 'false');
      });
    }
  });
}

export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  const classes = ['brand', 'megamenu', 'tools', 'bar'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  // Brand: remove button styling
  const navBrand = nav.querySelector('.nav-brand');
  if (navBrand) {
    const brandLink = navBrand.querySelector('.button');
    if (brandLink) {
      brandLink.className = '';
      brandLink.closest('.button-container').className = '';
    }
  }

  // Megamenu: extract home icon and remove button styling
  const navMegamenu = nav.querySelector('.nav-megamenu');
  let homeIcon = null;
  if (navMegamenu) {
    const firstP = navMegamenu.querySelector(':scope .default-content-wrapper > p');
    if (firstP && (firstP.querySelector('.icon') || firstP.textContent.includes(':icon-'))) {
      homeIcon = firstP;
      firstP.classList.add('nav-home');
    }
    navMegamenu.querySelectorAll('.button-container').forEach((bc) => {
      bc.classList.remove('button-container');
      const btn = bc.querySelector('.button');
      if (btn) btn.classList.remove('button');
    });
  }

  // Tools: remove button styling and set up search toggle
  const navTools = nav.querySelector('.nav-tools');
  if (navTools) {
    navTools.querySelectorAll('.button-container').forEach((bc) => {
      bc.classList.remove('button-container');
      const btn = bc.querySelector('.button');
      if (btn) btn.classList.remove('button');
    });

    const searchLink = navTools.querySelector('a[href*="search"]');
    if (searchLink) {
      searchLink.addEventListener('click', (e) => {
        e.preventDefault();
        const searchPanel = nav.querySelector('.nav-search-panel');
        if (searchPanel) searchPanel.classList.toggle('active');
      });
    }
  }

  // Horizontal bar: setup dropdowns on hover
  const navBar = nav.querySelector('.nav-bar');
  setupHorizontalNav(navBar);

  // Hamburger button
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.addEventListener('click', () => toggleMegaMenu(nav));
  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');

  // Place home icon inside hamburger area (left group)
  if (homeIcon) {
    homeIcon.remove();
    hamburger.append(homeIcon);
  }

  // Desktop: open megamenu on hover over hamburger area
  if (isDesktop.matches) {
    hamburger.addEventListener('mouseenter', () => openMegaMenu(nav));
  }
  nav.addEventListener('mouseleave', (e) => {
    if (isDesktop.matches && nav.getAttribute('aria-expanded') === 'true') {
      if (!nav.contains(e.relatedTarget)) {
        closeMegaMenu(nav);
      }
    }
  });

  // Close megamenu when mouse leaves the megamenu section
  if (navMegamenu) {
    const megamenuContainer = document.createElement('div');
    megamenuContainer.className = 'nav-megamenu-container';
    megamenuContainer.append(navMegamenu);
    nav.insertBefore(megamenuContainer, nav.querySelector('.nav-tools'));

    megamenuContainer.addEventListener('mouseleave', () => {
      if (isDesktop.matches) closeMegaMenu(nav);
    });
  }

  window.addEventListener('keydown', closeOnEscape);

  // Respond to viewport changes
  isDesktop.addEventListener('change', () => {
    if (isDesktop.matches) {
      closeMegaMenu(nav);
    }
  });

  // Search panel
  const searchPanel = document.createElement('div');
  searchPanel.className = 'nav-search-panel';
  const searchForm = document.createElement('form');
  searchForm.action = '/en/search';
  searchForm.method = 'get';
  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.name = 'q';
  searchInput.placeholder = 'Insert search term';
  searchInput.setAttribute('aria-label', 'Search');
  searchForm.append(searchInput);
  searchPanel.append(searchForm);
  nav.append(searchPanel);

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);

  // Page overlay behind megamenu
  const overlay = document.createElement('div');
  overlay.className = 'nav-megamenu-overlay';
  overlay.addEventListener('click', () => closeMegaMenu(nav));
  navWrapper.append(overlay);
}
