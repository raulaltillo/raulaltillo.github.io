// Prioritize anuncios display before other DOM logic
window.addEventListener('DOMContentLoaded', mostrarAnuncios, { once: true });
let anunciosInFlight = null;
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
window.addEventListener('load', adjustWeatherIframePosition);

function mostrarAnuncios() {
    const hoy = new Date();
  const API_URL = "https://sheetjson.com/spreadsheets/d/1OPkrvh0ccT4O2pbTp5NmIfcqXmHgOQyZWwhEAtrUfCY/edit?gid=0";
  const CACHE_KEY = "anunciosCache";
  const CACHE_TS_KEY = "anunciosCacheTs";
  const TTL_MS = 5 * 60 * 1000;
  const nav = performance.getEntriesByType('navigation')[0];
  const isReload = nav && nav.type === 'reload';

    function useAnuncios(anunciosList) {
        const display = document.querySelector('.anunciosdisplay');
        if (!display) return;

        let textSpan = display.querySelector('.anuncio-text');
        if (!textSpan) {
            textSpan = document.createElement('span');
            textSpan.className = 'anuncio-text';
            textSpan.style.transition = "opacity 0.5s";
            display.innerHTML = '';
            display.appendChild(textSpan);
        }

        function parseFechaLocal(str) {
            if (!str) return null;
            const [d, m, y] = str.split('/').map(Number);
            return new Date(y, m - 1, d);
        }

        function fitTextLocal(text) {
            textSpan.textContent = text;
            textSpan.style.opacity = "0";
            document.body.offsetHeight;
            let truncated = text;
            if (textSpan.scrollWidth > display.clientWidth) {
                let len = text.length;
                while (textSpan.scrollWidth > display.clientWidth && len > 0) {
                    len--;
                    textSpan.textContent = text.slice(0, len) + "...";
                }
                truncated = textSpan.textContent;
            }
            textSpan.style.opacity = "1";
            return truncated;
        }

        const activos = anunciosList.filter(a => {
            const desde = parseFechaLocal(a["Mostrar desde"] || a["Desde"]);
            const hasta = parseFechaLocal(a["Hasta"]);
            if (desde && hoy < desde) return false;
            if (hasta && hoy > hasta) return false;
            return true;
        });

        if (activos.length === 0) {
            textSpan.textContent = "No hay anuncios para mostrar";
            display.style.display = "flex";
            return;
        }

        // Restore index, opacity, and timing from sessionStorage
        let idx = Number(sessionStorage.getItem("anuncioIdx") || 0);
        if (isNaN(idx) || idx >= activos.length) idx = 0;
        let lastOpacity = sessionStorage.getItem("anuncioOpacity");
        let lastText = sessionStorage.getItem("anuncioText");
        let lastStart = Number(sessionStorage.getItem("anuncioStart") || Date.now());
        let now = Date.now();

        display.style.display = "flex";

        // Use lastText if available and valid, otherwise set current
        if (lastText && activos.some(a => fitTextLocal(a["Anuncio"]) === lastText)) {
            textSpan.textContent = lastText;
            textSpan.style.opacity = lastOpacity !== null ? lastOpacity : "1";
        } else {
            textSpan.textContent = fitTextLocal(activos[idx]["Anuncio"]);
            textSpan.style.opacity = "1";
            // Ensure sessionStorage is initialized for first visit
            if (!lastText) {
                sessionStorage.setItem("anuncioIdx", idx);
                sessionStorage.setItem("anuncioOpacity", "1");
                sessionStorage.setItem("anuncioStart", Date.now());
            }
        }

        // Calculate remaining time for current announcement
        let elapsed = now - lastStart;
        let intervalMs = 5000;
        let remaining = intervalMs - elapsed;
        if (remaining < 0 || remaining > intervalMs) remaining = intervalMs;

        function fadeAnnouncementLocal(nextIdx) {
            textSpan.style.opacity = "0";
            sessionStorage.setItem("anuncioOpacity", "0");
            setTimeout(() => {
                const txt = fitTextLocal(activos[nextIdx]["Anuncio"]);
                textSpan.textContent = txt;
                textSpan.style.opacity = "1";
                sessionStorage.setItem("anuncioText", txt);
                sessionStorage.setItem("anuncioOpacity", "1");
                sessionStorage.setItem("anuncioStart", Date.now());
            }, 500);
        }

        let timer;
        function startCycleLocal(delay) {
            timer = setTimeout(function cycle() {
                idx = (idx + 1) % activos.length;
                sessionStorage.setItem("anuncioIdx", idx);
                fadeAnnouncementLocal(idx);
                timer = setTimeout(cycle, intervalMs);
            }, delay);
        }

        // --- Modal popup logic ---
        let modal = document.getElementById('anuncios-modal');
        let overlay = document.getElementById('anuncios-modal-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'anuncios-modal-overlay';
            overlay.style.position = 'fixed';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100vw';
            overlay.style.height = '100vh';
            overlay.style.background = 'rgba(0,0,0,0.45)';
            overlay.style.zIndex = '99998';
            overlay.style.display = 'none';
            overlay.style.opacity = '1';
            overlay.style.transition = 'opacity 0.4s';
            document.body.appendChild(overlay);
        }
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'anuncios-modal';
            modal.style.position = 'fixed';
            modal.style.top = '50%';
            modal.style.left = '50%';
            modal.style.transform = 'translate(-50%, -50%)';
            modal.style.background = '#222';
            modal.style.color = '#fff';
            modal.style.padding = '64px 24px 0px 24px';
            modal.style.borderRadius = '14px';
            modal.style.boxShadow = '0 4px 32px rgba(0,0,0,0.35)';
            modal.style.zIndex = '99999';
            modal.style.maxWidth = '90vw';
            modal.style.maxHeight = '80vh';
            modal.style.overflowY = 'auto';
            modal.style.display = 'none';
            modal.style.opacity = '1';
            modal.style.transition = 'opacity 0.4s';

            // Close button
            const closeBtn = document.createElement('button');
            closeBtn.textContent = 'Cerrar';
            closeBtn.style.position = 'absolute';
            closeBtn.style.top = '12px';
            closeBtn.style.right = '18px';
            closeBtn.style.background = '#2D7A5E';
            closeBtn.style.color = '#fff';
            closeBtn.style.border = 'none';
            closeBtn.style.padding = '8px 18px';
            closeBtn.style.borderRadius = '6px';
            closeBtn.style.fontSize = '1em';
            closeBtn.style.cursor = 'pointer';
            closeBtn.onclick = () => fadeOutModal();

            modal.appendChild(closeBtn);

            const contentDiv = document.createElement('div');
            contentDiv.id = 'anuncios-modal-content';
            contentDiv.style.paddingTop = '24px';
            contentDiv.style.borderTop = '5px solid rgb(68, 68, 68)';
            modal.appendChild(contentDiv);

            document.body.appendChild(modal);
        }

        function fadeOutModal() {
            modal.style.opacity = '0';
            overlay.style.opacity = '0';
            setTimeout(() => {
                modal.style.display = 'none';
                overlay.style.display = 'none';
                modal.style.opacity = '1';
                overlay.style.opacity = '1';
            }, 400);
        }

        function showModalLocal() {
            const contentDiv = modal.querySelector('#anuncios-modal-content');
            contentDiv.innerHTML = '';
            activos.forEach(a => {
                const anuncioDiv = document.createElement('div');
                anuncioDiv.style.marginBottom = '24px';
                anuncioDiv.style.paddingBottom = '12px';
                anuncioDiv.style.borderBottom = '5px solid #444';

                const title = document.createElement('div');
                title.textContent = a["Anuncio"];
                title.style.fontSize = '1.3em';
                title.style.marginBottom = '6px';

                const details = document.createElement('div');
                details.textContent = a["Mas detalles"] || '';
                details.style.fontSize = '1em';
                details.style.whiteSpace = 'pre-line';
                details.style.marginBottom = '4px';

                const dateInfo = document.createElement('div');
                dateInfo.style.fontSize = '0.95em';
                dateInfo.style.color = '#aaa';
                let desde = a["Mostrar desde"] || a["Desde"] || '';
                let hasta = a["Hasta"] || '';
                if (!desde){
                  dateInfo.textContent = `Hasta: ${hasta}`;}
                else{
                  dateInfo.textContent = `Desde: ${desde} ||| Hasta: ${hasta}`;
                }

                anuncioDiv.appendChild(title);
                anuncioDiv.appendChild(details);
                anuncioDiv.appendChild(dateInfo);

                contentDiv.appendChild(anuncioDiv);
            });
            overlay.style.display = 'block';
            overlay.style.opacity = '1';
            modal.style.display = 'block';
            modal.style.opacity = '1';
        }

        display.onclick = showModalLocal;

        // Close modal on click outside (with fade out)
        overlay.onclick = fadeOutModal;
        document.addEventListener('mousedown', function(e) {
            if (modal.style.display === 'block' && !modal.contains(e.target) && e.target !== modal && e.target !== overlay) {
                fadeOutModal();
            }
        });

        // --- End modal popup logic ---

        if (activos.length > 1) {
            sessionStorage.setItem("anuncioStart", now - (intervalMs - remaining));
            startCycleLocal(remaining);
        } else {
            sessionStorage.setItem("anuncioIdx", 0);
            sessionStorage.setItem("anuncioOpacity", "1");
            sessionStorage.setItem("anuncioText", textSpan.textContent);
            sessionStorage.setItem("anuncioStart", Date.now());
        }
    }
  let cached = null;
  let cachedTs = 0;

  try { cached = JSON.parse(sessionStorage.getItem(CACHE_KEY)); } catch (_) { cached = null; }
  cachedTs = Number(sessionStorage.getItem(CACHE_TS_KEY) || 0);

  const fresh = Array.isArray(cached) && (Date.now() - cachedTs) < TTL_MS;

  // If cache is fresh, use it (no API call)
  if (fresh) {
    useAnuncios(cached);
    return;
  }

  // If you want "only when refreshed", and this is not a reload, avoid the API:
  if (!isReload && Array.isArray(cached)) {
    useAnuncios(cached); // stale but acceptable when not refreshed
    return;
  }

  // De-dupe concurrent calls
  if (anunciosInFlight) {
    anunciosInFlight.then(useAnuncios).catch(() => useAnuncios([]));
    return;
  }

  anunciosInFlight = fetch(API_URL)
    .then(res => {
      if (!res.ok) throw new Error("Network response was not ok");
      return res.json();
    })
    .then(anunciosFetched => {
      if (!Array.isArray(anunciosFetched)) anunciosFetched = [];
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(anunciosFetched));
      sessionStorage.setItem(CACHE_TS_KEY, String(Date.now()));
      return anunciosFetched;
    })
    .finally(() => {
      anunciosInFlight = null;
    });

  anunciosInFlight.then(useAnuncios).catch(() => useAnuncios([]));
}

window.addEventListener('load', mostrarAnuncios);
