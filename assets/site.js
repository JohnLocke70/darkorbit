(function () {
  function debounce(fn, delay) {
    let t = null;
    return function () {
      clearTimeout(t);
      t = setTimeout(() => fn(), delay);
    };
  }

  function equalizeButtonsInNav(nav) {
    const btns = Array.from(nav.querySelectorAll('.nav-btn'));
    if (btns.length === 0) return;

    // 1) reset pour mesurer la largeur "naturelle"
    nav.style.setProperty('--navBtnW', 'auto');
    btns.forEach(b => {
      b.style.width = 'auto';
      b.style.whiteSpace = 'nowrap'; // mesure fiable (1 ligne)
    });

    // 2) mesure après rendu
    requestAnimationFrame(() => {
      let max = 0;

      btns.forEach(b => {
        const cs = getComputedStyle(b);
        const borders = (parseFloat(cs.borderLeftWidth) || 0) + (parseFloat(cs.borderRightWidth) || 0);

        // scrollWidth inclut padding, pas la bordure -> on ajoute borders
        const w = Math.ceil(b.scrollWidth + borders);

        if (w > max) max = w;
      });

      // 3) applique au groupe via variable CSS
      nav.style.setProperty('--navBtnW', max + 'px');

      // nettoyage inline
      btns.forEach(b => {
        b.style.width = '';
        b.style.whiteSpace = '';
      });
    });
  }

  function equalizeAllNavs() {
    document.querySelectorAll('.top-nav').forEach(equalizeButtonsInNav);
  }

  document.addEventListener('DOMContentLoaded', () => {
    equalizeAllNavs();

    // recalcul quand les polices sont prêtes (sinon la mesure peut changer)
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(equalizeAllNavs);
    }

    // recalcul après chargement complet (images, etc.)
    window.addEventListener('load', equalizeAllNavs);

    // recalcul au resize
    window.addEventListener('resize', debounce(equalizeAllNavs, 120));

    // bouton haut de page : scroll dans la zone .work
    const work = document.querySelector('.work');
    const topBtn = document.querySelector('.to-top');
    if (work && topBtn) {
      topBtn.addEventListener('click', () => {
        work.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  });
})();
