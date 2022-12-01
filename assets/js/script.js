import * as params from '@params';

document.addEventListener('DOMContentLoaded', function() {
  const header = document.getElementById('site-header');

  // Fixed header

  function detectOffset() {
    if(window.scrollY > 1) {
      header.classList.add('active');
    } else {
      header.classList.remove('active');
    }
  }

  detectOffset();

  window.addEventListener('scroll', detectOffset);

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

  const hubspotForm = params.hubspotForm;
  const hubspotPortalId = params.hubspotPortalId;
  const hubspotContactFormId = params.hubspotContactFormId;
  const hubspotGetInTouchFormId = params.hubspotGetInTouchFormId;

  const formNotifField = document.getElementById('form-notif');
  const submitBtn = document.getElementById('submit-btn');

  async function submit(data, form, formId) {
    try {
      submitBtn.disabled = true;
      const response = await fetch(`${hubspotForm}/${hubspotPortalId}/${formId}`, {
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

      if (response.ok) {
        submitNotifHandler({
          status: 'ok',
          text: 'Submitted'
        });
        form.reset();
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

    setTimeout(() => {
      formNotifField.innerHTML = '';
    }, 3000);
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

  function validateOnEntry(fields) {
    fields.forEach(field => {
      const input = document.getElementById(`${field}`);

      input.addEventListener('input', () => {
        validateFields(input);
        if(isFormValid(fields)) {
          submitBtn.disabled = false;
        } else {
          submitBtn.disabled = true;
        }
      });
    });
  }

  function validateOnSubmit(form, fields, formId) {
    form.addEventListener('submit', function(event) {
      event.preventDefault();

      fields.forEach(field => {
        const input = document.getElementById(`${field}`);
        validateFields(input);
      });
  
      const formData = getFormData(form);

      if(!isFormValid(fields)) {
        submitBtn.disabled = true;
      } else {
        submit(transformData(formData), form, formId);
      }
    });
  }

  function validateFields(field) {

    if (field.value.trim() === '') {
      setStatus(field, 'This field cannot be blank', 'error');
      return;
    } else {
      setStatus(field, null, 'success');
    }

    if (field.type === 'text') {
      const re = /^[a-zA-Z\s]+$/
      if(re.test(field.value)) {
        setStatus(field, null, 'success');
      } else {
        setStatus(field, 'Please enter only letters', 'error');
      }
    }

    if (field.type === 'email') {
      const re = /\S+@\S+\.\S+/
      if (re.test(field.value)) {
        setStatus(field, null, 'success');
      } else {
        setStatus(field, 'Please enter valid email address', 'error');
      }
    }
  }

  function setStatus(field, message, status) {
    const errorMessage = field.parentElement.querySelector('.input-error-message');

    if (status === 'success') {
      if (errorMessage) { errorMessage.innerText = "" }
      field.classList.remove('input-error');
    }

    if (status === 'error') {
      field.parentElement.querySelector('.input-error-message').innerText = message;
      field.classList.add('input-error');
    }
  }

  function isFormValid(fields) {
    isValid = true;
    fields.forEach(field => {
      const input = document.getElementById(`${field}`);
      if(input.classList.contains('input-error')) isValid = false;
    });
    return isValid;
  }

  const contactForm = document.getElementById('contacts-form');
  const getInTouchForm = document.getElementById('get-in-touch-form');

  const formFields = ['name', 'email'];

  if(contactForm) {
    validateOnEntry(formFields);
    validateOnSubmit(contactForm, formFields, hubspotContactFormId);
  }

  if(getInTouchForm) {
    validateOnEntry(formFields);
    validateOnSubmit(getInTouchForm, formFields, hubspotGetInTouchFormId);
  }
});