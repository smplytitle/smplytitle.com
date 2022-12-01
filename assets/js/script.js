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

  const hubspotForm = 'https://api.hsforms.com/submissions/v3/integration/submit';
  const hubspotPortalId = '23474905';
  const hubspotFormId = '5c17587b-7c14-4b96-bb76-f5f2a2235074';

  const formNotifField = document.getElementById('form-notif');
  const submitBtn = document.getElementById('submit-btn');

  async function submit(data) {
    try {
      submitBtn.disabled = true;
      const response = await fetch(`${hubspotForm}/${hubspotPortalId}/${hubspotFormId}`, {
        method: 'POST',
        body: JSON.stringify({
          context: {
            pageUri: window.location.href,
            pageName: document.title,
          },
          fields: data,
        }),
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      });
      console.log(response);
      if (response.ok) {
        submitNotifHandler({
          status: 'ok',
          text: 'Submitted'
        });
      }
      if (response.status === 400) {
        submitNotifHandler({
          status: 'error',
          text: 'Something went wrong. Please try again later.'
        });
      }
    } catch(error) {
      console.log(error);
    } finally {
      submitBtn.disabled = false;
    }
  }

  function submitNotifHandler(notif) {
    formNotifField.classList.remove('error', 'success');

    if(notif.status === 'error') {
      formNotifField.innerHTML = notif.text;
      formNotifField.classList.add('error');
    } else if(notif.status === 'ok') {
      formNotifField.innerHTML = notif.text;
      formNotifField.classList.add('success');
    }
  }

  function getFormData(form) {
    const inputs = form.getElementsByTagName('input');
    return Object.values(inputs).reduce((obj,field) => { obj[field.name] = field.value; return obj }, {})
  }

  function transformData(data) {
    const result = [];
    Object.entries(data).forEach(([name, value]) => {
      result.push({ name, value });
    });
    return result;
  }

  const contactForm = document.getElementById('contacts-form');

  if(contactForm) {
    contactForm.addEventListener('submit', function(event) {
      event.preventDefault();
  
      const formData = getFormData(contactForm);
  
      if(formData.fullname && formData.email) submit(transformData(formData));
      
    });
  }
});