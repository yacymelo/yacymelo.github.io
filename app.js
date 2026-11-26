// Page views use URL fragments so each academic section can be linked directly.
const views = Array.from(document.querySelectorAll('[data-view]'));
const navigation = Array.from(document.querySelectorAll('[data-page]'));
const pageNames = new Set(views.map(view => view.dataset.view));
const homeTitle = document.title;
const menuButton = document.querySelector('.nav-toggle');
const menu = document.getElementById('primary-navigation');
const mobileLayout = window.matchMedia('(max-width: 900px)');

function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
}

menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
});
menu.addEventListener('click', event => {
  if (!mobileLayout.matches || !event.target.closest('a')) return;
  closeMenu();
  document.getElementById('main').focus({preventScroll: true});
});
document.addEventListener('pointerdown', event => {
  if (!menu.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
});
document.addEventListener('focusin', event => {
  if (!menu.contains(event.target) && event.target !== menuButton) closeMenu();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuButton.focus({preventScroll: true});
  }
});
mobileLayout.addEventListener('change', closeMenu);
window.addEventListener('pageshow', closeMenu);
menuButton.hidden = false;
document.documentElement.classList.add('nav-ready');

function showPage() {
  closeMenu();
  let hash = location.hash.slice(1);
  try { hash = decodeURIComponent(hash); } catch { hash = ''; }
  const target = document.getElementById(hash);
  const currentView = views.find(view => !view.hidden);
  const page = target?.closest('[data-view]')?.dataset.view
    ?? (hash === 'main' ? currentView?.dataset.view : null)
    ?? 'home';
  views.forEach(view => { view.hidden = view.dataset.view !== page; });
  navigation.forEach(link => {
    if (link.dataset.page === page) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  const pageTitle = navigation.find(link => link.dataset.page === page)?.textContent;
  document.title = pageTitle && page !== 'home' ? `${pageTitle} | ${homeTitle}` : homeTitle;
  if (hash && !pageNames.has(hash)) {
    requestAnimationFrame(() => target?.scrollIntoView({block: 'start'}));
  } else {
    window.scrollTo({top: 0, behavior: 'instant'});
  }
}

window.addEventListener('hashchange', showPage);
showPage();
