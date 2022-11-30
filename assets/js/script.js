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
  const headerMenuOpenBtn = document.getElementById('header-menu-open');
  const headerMenuCloseBtn = document.getElementById('header-menu-close');
  const headerMenuBackdrop = document.getElementById('header-menu-backdrop');

  headerMenuOpenBtn.addEventListener('click', openMobileMenu);
  headerMenuCloseBtn.addEventListener('click', closeMobileMenu);
  headerMenuBackdrop.addEventListener('click', closeMobileMenu);

  function closeMobileMenu() {
    header.classList.remove('menu-active');
  }

  function openMobileMenu() {
    header.classList.add('menu-active');
    
  }

  // Accordion
  const accordion = document.getElementsByClassName('smply-accordion');

  for (let i = 0; i < accordion.length; i++) {
    accordion[i].addEventListener('click', function() {
      this.classList.toggle('active');

      const panel = this.nextElementSibling;

      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
      } else {
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  }

  // Scroll to next section
  const scrollBtn = document.getElementsByClassName('arrows-scroll-btn');

  for (let i = 0; i < scrollBtn.length; i++) {
    scrollBtn[i].addEventListener('click', function() {
      const parent = this.closest('.s-scrollable');
      const nextSection = parent.nextElementSibling;

      if(nextSection) nextSection.scrollIntoView({behavior: 'smooth'});
    });
  }

  // Form submiting

  async function submit() {
    try {

    } catch(error) {
      console.log(error);
    }
  }

  const contactForm = document.getElementById('contacts-form');

  contactForm.addEventListener('submit', function(event) {
    event.preventDefault();

    
  });
});