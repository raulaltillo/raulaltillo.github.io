window.addEventListener('load', function() {
    document.getElementById('content').classList.add('visible');
  });

  document.querySelectorAll('.topnav a').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const href = this.getAttribute('href');

      const content = document.getElementById('content');
      content.classList.remove('visible');

      setTimeout(() => {
        window.location.href = href; // Just normally move the user after fade
      }, 500); // Match the fade-out time (in ms)
    });
  });