(function () {
  'use strict';

  var IMG = './assets/';

  /* Dodavanje novog projekta ili fotografije: samo dopunite ovu listu. */
  var PROJECTS = [
    { category: "Kuhinje", title: "Kuhinja po meri",
      desc: "Radne površine i elementi projektovani za vaš raspored i naviku kuvanja.",
      images: [
        IMG + "hf_20260911_234025_8815b729-5d64-4bc0-8d35-db4143166068.png",
        IMG + "hf_20260912_234700_19a4cfe0-b362-403e-a1e7-175738d0f48b.png",
        IMG + "hf_20260912_234700_932171fe-ca9f-4584-8410-9517530bf22e.png",
        IMG + "hf_20260912_234700_deba2f93-c7ea-4f47-84f6-a2f5767dcd3b.png",
        IMG + "hf_20260912_234700_0f28e403-63ec-46dc-8572-01afbea2b90c.png"
      ] },
    { category: "Kupatila", title: "Kupatilo po meri",
      desc: "Ormarići i radne ploče otporni na vlagu, uklopljeni u svaki, i najmanji, prostor.",
      images: [
        IMG + "hf_20260911_234025_837609f3-fa01-484e-baf9-2ede5215e074.png",
        IMG + "hf_20260912_234710_cbf5fd9c-563f-4ec5-9a10-716dfcc27d4c.png"
      ] },
    { category: "Dnevni boravak", title: "Dnevni boravak po meri",
      desc: "Elementi za televizor, police i ormari koji se uklapaju u zid, ne stoje pored njega.",
      images: [IMG + "hf_20260911_231058_60cebad0-0048-4ae3-bb95-8f305f385d83.png"] },
    { category: "Spavaće sobe", title: "Spavaća soba po meri",
      desc: "Ormari od poda do plafona koji koriste svaki centimetar sobe.",
      images: [IMG + "hf_20260911_234025_abab5479-edff-44dd-a183-25e602e580b3.png"] },
    { category: "Plakari", title: "Plakar po meri",
      desc: "Garderoberi i plakari sa unutrašnjom organizacijom kakva vama odgovara.",
      images: [IMG + "hf_20260911_234025_aa4c27b0-f2b6-41d4-88ca-188234ff0cd9.png"] }
  ];

  var FILTERS = ["Sve", "Kuhinje", "Kupatila", "Dnevni boravak", "Spavaće sobe", "Plakari"];
  var SPANS = [
    { col: 3, ratio: "4/3" }, { col: 3, ratio: "4/3" },
    { col: 2, ratio: "3/4" }, { col: 2, ratio: "3/4" },
    { col: 2, ratio: "3/4" }, { col: 6, ratio: "21/9" }
  ];
  /* Hero klipovi: 1440px, bez zvuka, ~1 MB po klipu. */
  var HERO_CLIPS = [
    IMG + "hero-1.mp4",
    IMG + "hero-2.mp4",
    IMG + "hero-3.mp4"
  ];

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var pad = function (n) { return (n < 10 ? '0' : '') + n; };

  /* ---------- godina u footeru ---------- */
  var yearEl = $('[data-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- animacija pri skrolu ---------- */
  (function reveal() {
    var els = $$('[data-reveal]');
    if (!els.length || reduce || !('IntersectionObserver' in window)) return;
    els.forEach(function (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(22px)';
      el.style.transition = 'opacity .8s ease, transform .8s ease';
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.style.opacity = '1';
          e.target.style.transform = 'none';
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.18 });
    els.forEach(function (el) { io.observe(el); });
  })();

  /* ---------- navigacija ---------- */
  (function nav() {
    var navEl = $('[data-nav]');
    var inner = $('[data-nav-inner]');
    var logo = $('[data-logo]');
    var burger = $('[data-burger]');
    var sentinel = document.getElementById('top');
    if (!navEl) return;

    function set(solid) {
      var links = $$('a', navEl);
      navEl.style.background = solid ? 'var(--bone)' : 'transparent';
      navEl.style.borderBottomColor = solid ? 'var(--stone-line)' : 'transparent';
      if (inner) inner.style.padding = solid ? '13px clamp(16px,3vw,32px)' : '24px clamp(16px,3vw,32px)';
      links.forEach(function (a) { a.style.color = solid ? '#000' : '#fff'; });
      if (logo) logo.style.filter = solid ? 'brightness(0)' : 'invert(1)';
      if (burger) burger.style.color = solid ? '#000' : '#fff';
    }
    function onScroll() {
      var y = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
      if (!y && sentinel) y = -sentinel.getBoundingClientRect().top;
      set(y > 8);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    if (sentinel && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (en) {
        en.forEach(function (e) { set(!e.isIntersecting); });
      }, { threshold: 0 }).observe(sentinel);
    }

    /* mobilni meni */
    var menu = document.getElementById('mobileMenu');
    if (burger && menu) {
      var openMenu = function (open) {
        menu.style.display = open ? 'flex' : 'none';
        document.body.style.overflow = open ? 'hidden' : '';
        burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      };
      burger.addEventListener('click', function () { openMenu(menu.style.display !== 'flex'); });
      var closeBtn = $('[data-menu-close]', menu);
      if (closeBtn) closeBtn.addEventListener('click', function () { openMenu(false); });
      $$('[data-menu-link]', menu).forEach(function (a) {
        a.addEventListener('click', function () { openMenu(false); });
      });
    }
  })();

  /* ---------- hero video ---------- */
  (function hero() {
    if (reduce) return;
    var vidA = $('[data-hero-video="a"]');
    var vidB = $('[data-hero-video="b"]');
    if (!vidA || !vidB) return;
    var speed = 0.6, active = vidA, next = vidB, idx = 0, transitioning = false, lazyDone = false;

    function silence(el) {
      el.muted = true; el.defaultMuted = true; el.volume = 0;
      el.setAttribute('muted', ''); el.setAttribute('playsinline', ''); el.setAttribute('webkit-playsinline', '');
    }
    function play(el) {
      silence(el); el.playbackRate = speed;
      var p = el.play();
      if (p && p.catch) p.catch(function () {});
    }
    function revealer(el) {
      return function () {
        if (el !== active) return;
        el.style.opacity = '1';
        if (lazyDone) return;
        lazyDone = true;
        standby(HERO_CLIPS[(idx + 1) % HERO_CLIPS.length]);
      };
    }
    function standby(src) {
      var el = next;
      el.removeAttribute('autoplay');
      el.src = src;
      el.playbackRate = speed;
      el.load();
      var hold = function () { if (el !== active) { try { el.pause(); el.currentTime = 0; } catch (e) {} } };
      hold();
      el.addEventListener('loadeddata', hold, { once: true });
    }
    function onTime() {
      if (transitioning) return;
      if (!active.paused && active.currentTime > 0.05) active.style.opacity = '1';
      if (active.duration && active.currentTime >= active.duration - 0.9) {
        transitioning = true;
        active.removeEventListener('timeupdate', onTime);
        crossfade();
      }
    }
    function crossfade() {
      try { next.currentTime = 0; } catch (e) {}
      play(next);
      next.style.opacity = '1';
      active.style.opacity = '0';
      setTimeout(function () {
        try { active.pause(); } catch (e) {}
        idx = (idx + 1) % HERO_CLIPS.length;
        var spare = active; active = next; next = spare;
        standby(HERO_CLIPS[(idx + 1) % HERO_CLIPS.length]);
        transitioning = false;
        active.addEventListener('timeupdate', onTime);
      }, 1100);
    }

    var holdIfStandby = function (e) {
      var el = e.target;
      if (transitioning || el === active) return;
      try { el.pause(); el.currentTime = 0; } catch (err) {}
    };
    silence(vidA); silence(vidB);
    vidA.addEventListener('play', holdIfStandby);
    vidB.addEventListener('play', holdIfStandby);
    vidA.addEventListener('playing', revealer(vidA));
    vidB.addEventListener('playing', revealer(vidB));
    vidA.addEventListener('timeupdate', onTime);
    vidA.src = HERO_CLIPS[0];
    vidA.playbackRate = speed;
    vidA.load();
    play(vidA);
    vidA.addEventListener('loadedmetadata', function () { play(vidA); }, { once: true });
    vidA.addEventListener('canplay', function () { play(vidA); }, { once: true });

    function kick() { if (active.paused) play(active); }
    ['touchstart', 'pointerdown', 'click', 'scroll', 'keydown'].forEach(function (ev) {
      document.addEventListener(ev, kick, { passive: true });
    });
    document.addEventListener('visibilitychange', function () { if (!document.hidden) kick(); });
    setTimeout(kick, 1200);
    setTimeout(kick, 4000);
  })();

  /* ---------- projekti: filteri, grid, album ---------- */
  (function gallery() {
    var gridEl = document.getElementById('grid');
    var filtersEl = document.getElementById('filters');
    var counterEl = document.getElementById('counter');
    var lb = document.getElementById('lightbox');
    if (!gridEl || !filtersEl || !lb) return;

    var filter = 'Sve', open = -1, imgIdx = 0, touchX = null;

    function visible() {
      return filter === 'Sve' ? PROJECTS : PROJECTS.filter(function (p) { return p.category === filter; });
    }

    function renderFilters() {
      filtersEl.innerHTML = '';
      FILTERS.forEach(function (label) {
        var b = document.createElement('button');
        b.type = 'button';
        b.textContent = label;
        var active = filter === label;
        b.style.cssText = 'flex:none; cursor:pointer; font-family:inherit; font-size:14.5px; padding:9px 18px; border:0; border-radius:2px; white-space:nowrap; transition:background .45s ease, color .45s ease;'
          + (active ? ' background:#171717; color:#F4F1EA;' : ' background:transparent; color:var(--walnut-soft);');
        b.addEventListener('click', function () { filter = label; render(); });
        filtersEl.appendChild(b);
      });
    }

    function renderGrid() {
      var list = visible();
      gridEl.style.opacity = '0';
      gridEl.innerHTML = '';
      list.forEach(function (p, i) {
        var s = SPANS[i % SPANS.length];
        var card = document.createElement('div');
        card.setAttribute('role', 'button');
        card.tabIndex = 0;
        card.style.cssText = 'grid-column:span ' + s.col + '; position:relative; overflow:hidden; cursor:pointer; aspect-ratio:' + s.ratio + '; background:#e6e0d6;';

        var img = document.createElement('img');
        img.src = p.images[0];
        img.alt = p.title + ', KonForm';
        img.loading = 'lazy';
        img.style.cssText = 'width:100%; height:100%; object-fit:cover; transition:transform .7s cubic-bezier(.2,.7,.2,1), filter .7s ease;';

        var shade = document.createElement('div');
        shade.style.cssText = 'position:absolute; inset:auto 0 0 0; height:55%; pointer-events:none; background:linear-gradient(180deg, rgba(23,23,23,0) 0%, rgba(23,23,23,0.62) 100%);';

        var bar = document.createElement('div');
        bar.style.cssText = 'position:absolute; left:22px; right:20px; bottom:18px; display:flex; align-items:center; justify-content:space-between; gap:16px; pointer-events:none;';
        var cat = document.createElement('span');
        cat.textContent = p.category;
        cat.style.cssText = 'color:#F4F1EA; font-size:clamp(17px,1.7vw,22px); font-weight:500; text-shadow:0 1px 14px rgba(0,0,0,0.35);';
        var arrow = document.createElement('span');
        arrow.textContent = '→';
        arrow.style.cssText = 'color:#F4F1EA; font-size:20px; opacity:0.7; transition:transform .5s ease, opacity .5s ease;';
        bar.appendChild(cat); bar.appendChild(arrow);

        card.appendChild(img); card.appendChild(shade); card.appendChild(bar);

        card.addEventListener('mouseenter', function () {
          img.style.transform = 'scale(1.025)';
          img.style.filter = 'brightness(0.93)';
          arrow.style.transform = 'translateX(4px)';
          arrow.style.opacity = '1';
        });
        card.addEventListener('mouseleave', function () {
          img.style.transform = 'scale(1)';
          img.style.filter = 'none';
          arrow.style.transform = 'none';
          arrow.style.opacity = '0.7';
        });
        card.addEventListener('click', function () { openAlbum(i); });
        card.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openAlbum(i); }
        });
        gridEl.appendChild(card);
      });
      requestAnimationFrame(function () {
        gridEl.style.transition = 'opacity .5s ease';
        gridEl.style.opacity = '1';
      });
      if (counterEl) counterEl.textContent = '01 / ' + pad(list.length);
    }

    function renderAlbum() {
      var list = visible();
      var p = list[open];
      if (!p) { lb.style.display = 'none'; document.body.style.overflow = ''; return; }
      var n = p.images.length;
      if (imgIdx > n - 1) imgIdx = n - 1;

      lb.style.display = 'flex';
      $('[data-lb-cat]', lb).textContent = p.category;
      $('[data-lb-counter]', lb).textContent = pad(imgIdx + 1) + ' / ' + pad(n);
      $('[data-lb-title]', lb).textContent = p.title;
      $('[data-lb-desc]', lb).textContent = p.desc;

      var img = $('[data-lb-img]', lb);
      img.style.opacity = '0';
      var url = p.images[imgIdx];
      var pre = new Image();
      pre.onload = function () { img.src = url; img.alt = p.title + ', fotografija ' + (imgIdx + 1); img.style.opacity = '1'; };
      pre.src = url;

      var thumbs = $('[data-lb-thumbs]', lb);
      thumbs.innerHTML = '';
      p.images.forEach(function (src, ti) {
        var t = document.createElement('img');
        t.src = src;
        t.alt = p.title + ', sličica ' + (ti + 1);
        t.loading = 'lazy';
        t.style.cssText = 'width:74px; height:58px; object-fit:cover; cursor:pointer; transition:opacity .4s ease, outline-color .4s ease; outline:1px solid '
          + (ti === imgIdx ? 'rgba(244,241,234,0.85)' : 'transparent') + '; opacity:' + (ti === imgIdx ? '1' : '0.5') + ';';
        t.addEventListener('click', function () { imgIdx = ti; renderAlbum(); });
        thumbs.appendChild(t);
      });
    }

    function openAlbum(i) { open = i; imgIdx = 0; document.body.style.overflow = 'hidden'; renderAlbum(); }
    function closeAlbum() { open = -1; document.body.style.overflow = ''; lb.style.display = 'none'; }
    function step(d) {
      var list = visible();
      var p = list[open];
      if (!p) return;
      var n = p.images.length;
      if (n > 1) imgIdx = (imgIdx + d + n) % n;
      else { open = (open + d + list.length) % list.length; imgIdx = 0; }
      renderAlbum();
    }

    $('[data-lb-close]', lb).addEventListener('click', closeAlbum);
    $('[data-lb-prev]', lb).addEventListener('click', function () { step(-1); });
    $('[data-lb-next]', lb).addEventListener('click', function () { step(1); });
    var stage = $('[data-lb-stage]', lb);
    stage.addEventListener('touchstart', function (e) { touchX = e.touches[0].clientX; }, { passive: true });
    stage.addEventListener('touchend', function (e) {
      if (touchX == null) return;
      var dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 45) step(dx < 0 ? 1 : -1);
      touchX = null;
    });
    document.addEventListener('keydown', function (e) {
      if (open < 0) return;
      if (e.key === 'Escape') closeAlbum();
      else if (e.key === 'ArrowLeft') step(-1);
      else if (e.key === 'ArrowRight') step(1);
    });

    function render() { renderFilters(); renderGrid(); closeAlbum(); }
    render();
  })();
})();
