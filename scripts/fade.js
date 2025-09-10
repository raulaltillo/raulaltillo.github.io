window.addEventListener('load', function() {
    document.getElementById('content').classList.add('visible');
  });

  document.querySelectorAll('.topnav a').forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return; // Don't fade if it's the current page
      
      e.preventDefault();
      const content = document.getElementById('content');
      content.classList.remove('visible');

      setTimeout(() => {
        window.location.href = href;
      }, 250);
    });
  });

  
  const weatherIcon = document.getElementById('weather-icon');
  const iframeContainer = document.getElementById('weatherIframeContainer');
  
  // Helper function for fade in
  function fadeIn(element) {
    element.style.opacity = 0;
    element.style.display = 'block';
    let last = +new Date();
    const tick = function() {
      element.style.opacity = +element.style.opacity + (new Date() - last) / 200;
      last = +new Date();
  
      if (+element.style.opacity < 1) {
        requestAnimationFrame(tick);
      }
    };
    tick();
  }
  
  // Helper function for fade out
  function fadeOut(element) {
    element.style.opacity = 1;
    const tick = function() {
      element.style.opacity = +element.style.opacity - 0.05;
      if (+element.style.opacity > 0) {
        requestAnimationFrame(tick);
      } else {
        element.style.display = 'none';
      }
    };
    tick();
  }
  
  // Mostrar/ocultar iframe al hacer click
  weatherIcon.addEventListener('click', (e) => {
    e.stopPropagation(); // No cerrar al hacer click en el icono
    if (iframeContainer.style.display === 'block') {
      fadeOut(iframeContainer);
    } else {
      fadeIn(iframeContainer);
    }
  });
  
  // Cerrar iframe si haces click fuera
  document.addEventListener('click', (e) => {
    if (!iframeContainer.contains(e.target) && e.target !== weatherIcon) {
      fadeOut(iframeContainer);
    }
  });
  
  function adjustWeatherIframePosition() {
    const navbar = document.querySelector('.topnav');
    const iframeContainer = document.getElementById('weatherIframeContainer');
    if (navbar && iframeContainer) {
      const navbarHeight = navbar.offsetHeight;
      iframeContainer.style.top = navbarHeight + 'px';
    }
  }

  // Adjust when page loads and when window resizes
  window.addEventListener('load', adjustWeatherIframePosition);
  window.addEventListener('resize', adjustWeatherIframePosition);