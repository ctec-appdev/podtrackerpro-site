// PODTrackerPRO - Main JS

document.addEventListener('DOMContentLoaded', function () {
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.1 }
  );

  reveals.forEach(el => revealObserver.observe(el));

  const nav = document.querySelector('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.style.boxShadow =
        window.scrollY > 20 ? '0 4px 40px rgba(0,0,0,0.4)' : 'none';
    });
  }

  const rawPage = window.location.pathname.split('/').pop() || 'index';
  const currentPage = rawPage.includes('.') ? rawPage : rawPage + '.html';

  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;

    const normalizedHref = href.includes('.') ? href : href + '.html';
    if (normalizedHref === currentPage) {
      link.classList.add('active');
    }
  });
});
