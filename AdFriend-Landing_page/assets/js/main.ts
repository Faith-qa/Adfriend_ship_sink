(function () {
  "use strict";

  function toggleScrolled(): void {
    const selectBody = document.querySelector('body') as HTMLBodyElement;
    const selectHeader = document.querySelector('#header') as HTMLElement | null;
    
    if (!selectHeader) return;
    
    if (!selectHeader.classList.contains('scroll-up-sticky') &&
        !selectHeader.classList.contains('sticky-top') &&
        !selectHeader.classList.contains('fixed-top')) return;

    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle') as HTMLElement | null;

  function mobileNavToggle(): void {
    document.body.classList.toggle('mobile-nav-active');
    if (mobileNavToggleBtn) {
      mobileNavToggleBtn.classList.toggle('bi-list');
      mobileNavToggleBtn.classList.toggle('bi-x');
    }
  }

  mobileNavToggleBtn?.addEventListener('click', mobileNavToggle);

  document.querySelectorAll<HTMLAnchorElement>('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToggle();
      }
    });
  });

  document.querySelectorAll<HTMLElement>('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function (e: Event) {
      e.preventDefault();
      const parent = this.parentNode as HTMLElement;
      parent.classList.toggle('active');
      const nextSibling = parent.nextElementSibling as HTMLElement | null;
      nextSibling?.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  const scrollTop = document.querySelector('.scroll-top') as HTMLElement | null;

  function toggleScrollTop(): void {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }

  scrollTop?.addEventListener('click', (e: Event) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  function aosInit(): void {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  const glightbox = GLightbox({ selector: '.glightbox' });
  new PureCounter();

  function initSwiper(): void {
    document.querySelectorAll<HTMLElement>('.init-swiper').forEach(swiperElement => {
      const configElement = swiperElement.querySelector('.swiper-config');
      if (!configElement) return;
      
      try {
        const config = JSON.parse(configElement.innerHTML.trim());
        if (swiperElement.classList.contains('swiper-tab')) {
          initSwiperWithCustomPagination(swiperElement, config);
        } else {
          new Swiper(swiperElement, config);
        }
      } catch (error) {
        console.error('Invalid JSON in Swiper config', error);
      }
    });
  }
  window.addEventListener('load', initSwiper);

  document.querySelectorAll<HTMLElement>('.isotope-layout').forEach(isotopeItem => {
    const layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    const filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    const sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope: Isotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), () => {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container') as HTMLElement, {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll<HTMLElement>('.isotope-filters li').forEach(filters => {
      filters.addEventListener('click', function () {
        const activeFilter = isotopeItem.querySelector('.isotope-filters .filter-active');
        activeFilter?.classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({ filter: this.getAttribute('data-filter') });
        if (typeof aosInit === 'function') aosInit();
      }, false);
    });
  });

  window.addEventListener('load', function () {
    if (window.location.hash) {
      const section = document.querySelector(window.location.hash) as HTMLElement | null;
      if (section) {
        setTimeout(() => {
          const scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  const navmenulinks = document.querySelectorAll<HTMLAnchorElement>('.navmenu a');

  function navmenuScrollspy(): void {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      const section = document.querySelector(navmenulink.hash) as HTMLElement | null;
      if (!section) return;
      const position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    });
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);
})();
