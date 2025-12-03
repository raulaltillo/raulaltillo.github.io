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
  window.addEventListener('resize', adjustWeatherIframePosition);



    // Balloon animation on page load (threaded, waits for image load)
    const balloonUrls = [
      "https://images.vexels.com/media/users/3/235359/isolated/lists/a7b2e87a806cdb01aacb17ecc22188d4-party-balloons-floating.png",
      "https://cdn-icons-png.flaticon.com/256/6225/6225382.png",
      "https://icons.iconarchive.com/icons/google/noto-emoji-activities/256/52706-balloon-icon.png",
      "https://www.i2clipart.com/cliparts/8/9/6/6/1282258966756880cc2b52af0385010594c653.png",
      "https://pngfile.net/files/preview/960x1465/11647506186qbqbfiveard4vuinrdfgcunwvqd6t023y3iar9panxqhwc8im42gfn0fr9q0zdmybjc4534md2p7iop9dskfeix0m1lbwx4uyhkt.png",
      "https://www.nicepng.com/png/full/146-1468552_blue-and-red-balloon-png-balloon-png.png",
      "https://www.transparentpng.com/thumb/balloons/blue-balloon-free-png-1.png",
      "https://images.vexels.com/media/users/3/159176/isolated/preview/0e5eb2447e25906e2cf15c77b3d147e1-balloon-string-circle-illustration.png",
      "https://purepng.com/public/uploads/large/balloons-s1m.png",
      "https://static.vecteezy.com/system/resources/previews/048/332/552/non_2x/single-red-and-yellow-balloon-floating-free-png.png",
      "https://gallery.yopriceville.com/var/resizes/Free-Clipart-Pictures/Balloons-PNG/Single_Balloon_PNG_Green_Clipart.png?m=1629829951",
      "https://freesvg.org/img/rg1024-two-ballons.png",
      "https://www.misskatecuttables.com/uploads/shopping_cart/7089/large_balloons.png"

    ];

    function loadImage(url) {
      return new Promise((resolve, reject) => {
        const img = document.createElement("img");
        img.src = url;
        img.onload = () => resolve(img);
        img.onerror = reject;
      });
    }

    async function showBalloonsThreaded() {
      const balloonCount = Math.floor(Math.random() * 11) + 10; // 10-20 balloons
      const body = document.body;
      const balloons = [];

      for (let i = 0; i < balloonCount; i++) {
        // Each balloon is handled independently
        (async () => {
          const url = balloonUrls[Math.floor(Math.random() * balloonUrls.length)];
          try {
            const img = await loadImage(url);
            img.style.position = "fixed";
            img.style.left = `${Math.random() * 80 + 10}vw`;
            img.style.bottom = "-120px";
            img.style.width = `${Math.random() * 40 + 60}px`;
            img.style.zIndex = 9999;
            img.style.transition = "bottom 2.5s cubic-bezier(.42,.01,.58,1), opacity 0.5s";
            img.style.opacity = "1";
            img.className = "balloon-anim";
            body.appendChild(img);
            balloons.push(img);

            // Random delay before animating
            const delay = Math.floor(Math.random() * 251) + 100; // 100-350ms
            await new Promise(res => setTimeout(res, delay));
            img.style.bottom = `${window.innerHeight + 120}px`;
          } catch (e) {
            // If image fails to load, skip this balloon
          }
        })();
      }

      // Remove balloons after animation
      setTimeout(() => {
        balloons.forEach(b => {
          b.style.opacity = "0";
          setTimeout(() => b.remove(), 500);
        });
      }, 3200);
    }

    window.addEventListener("DOMContentLoaded", showBalloonsThreaded);
  // Adjust when page loads and when window resizes
  window.addEventListener('load', adjustWeatherIframePosition);


