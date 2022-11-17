document.addEventListener('DOMContentLoaded', function() {
  const header = document.getElementById('site-header');

  window.addEventListener('scroll', function() {
    if(window.scrollY > 1) {
      header.classList.add('active');
    } else {
      header.classList.remove('active');
    }
  });
});