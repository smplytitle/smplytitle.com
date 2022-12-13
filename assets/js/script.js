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

  const hubspotFormApi = params.hubspotFormApi;
  const hubspotPortalId = params.hubspotPortalId;
  const hubspotContactFormId = params.hubspotContactFormId;
  const hubspotGetInTouchFormId = params.hubspotGetInTouchFormId;
  const hubspotSubscriptioFormId = params.hubspotSubscriptioFormId;

  async function submit(data, form, formId) {
    const submitBtn = form.querySelector('.submit-btn-js');
    const errorData = {
      status: 'error',
      text: 'Something went wrong. Please try again later.'
    };
    try {
      submitBtn.disabled = true;
      const response = await fetch(`${hubspotFormApi}/${hubspotPortalId}/${formId}`, {
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
        const btnText = submitBtn.innerText;
        submitBtn.innerText = 'Submitted';
        submitBtn.classList.add('submitted');
        form.reset();
        setTimeout(() => {
          submitBtn.innerText = btnText;
          submitBtn.classList.remove('submitted');
          submitBtn.disabled = false;
        }, 2500);
      }
      if (response.status === 400) {
        submitBtn.disabled = false;
        submitNotifHandler(form, errorData);
      }
    } catch(error) {
      submitBtn.disabled = false;
      submitNotifHandler(form, errorData);
    }
  }

  function submitNotifHandler(form, notif) {
    const formNotifField = form.querySelector('.form-notif-js');

    formNotifField.classList.remove('error');

    if(notif.status === 'error') {
      formNotifField.innerText = notif.text;
      formNotifField.classList.add(notif.status);
    }

    setTimeout(() => {
      formNotifField.innerText = '';
      formNotifField.classList.remove('error');
    }, 2500);
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

  function validateOnEntry(form, fields) {
    const submitBtn = form.querySelector('.submit-btn-js');

    fields.forEach(field => {
      const input = form.querySelector(`.${field}`);
      input.addEventListener('input', () => {
        validateFields(input);
        if(isFormValid(form, fields)) {
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

      const submitBtn = form.querySelector('.submit-btn-js');

      fields.forEach(field => {
        const input = form.querySelector(`.${field}`);
        validateFields(input);
      });

      const formData = getFormData(form);

      if(!isFormValid(form, fields)) {
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
      if (errorMessage) { 
        errorMessage.innerText = "";
        errorMessage.style.display = 'none';
      }
      field.classList.remove('input-error');
    }

    if (status === 'error') {
      errorMessage.innerText = message;
      errorMessage.style.display = 'block';
      field.classList.add('input-error');
    }
  }

  function isFormValid(form, fields) {
    isValid = true;
    fields.forEach(field => {
      const input = form.querySelector(`.${field}`);
      if(input.classList.contains('input-error')) isValid = false;
    });
    return isValid;
  }

  const contactForm = document.getElementById('contacts-form');
  const getInTouchForm = document.getElementById('get-in-touch-form');

  const formFields = ['fullname-js', 'email-js'];

  if(contactForm) {
    validateOnEntry(contactForm, formFields);
    validateOnSubmit(contactForm, formFields, hubspotContactFormId);
  }

  if(getInTouchForm) {
    validateOnEntry(getInTouchForm, formFields);
    validateOnSubmit(getInTouchForm, formFields, hubspotGetInTouchFormId);
  }


  // Subscription form

  const subscribeForm = document.querySelectorAll('.subscribe-form-js');

  if(subscribeForm) {
    for (let i = 0; i < subscribeForm.length; i++) {
      const fields = ['subscribe-email-js'];
      validateOnEntry(subscribeForm[i], fields);
      validateOnSubmit(subscribeForm[i], fields, hubspotSubscriptioFormId);
    }
  }
});