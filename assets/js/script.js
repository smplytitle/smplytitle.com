document.addEventListener('DOMContentLoaded', function() {
  const header = document.getElementById('site-header');

  // Fixed header
  window.addEventListener('scroll', function() {
    if(window.scrollY > 1) {
      header.classList.add('active');
    } else {
      header.classList.remove('active');
    }
  });

  // Mobile menu
  const headerMenu = document.getElementById('header-menu');
  const headerMenuOpenBtn = document.getElementById('header-menu-open');
  const headerMenuCloseBtn = document.getElementById('header-menu-close');
  const headerMenuBackdrop = document.getElementById('header-menu-backdrop');

  headerMenuOpenBtn.addEventListener('click', openMobileMenu);
  headerMenuCloseBtn.addEventListener('click', closeMobileMenu);
  headerMenuBackdrop.addEventListener('click', closeMobileMenu);

  function closeMobileMenu() {
    headerMenu.classList.remove('menu-active');
  }

  function openMobileMenu() {
    headerMenu.classList.add('menu-active');
  }
});