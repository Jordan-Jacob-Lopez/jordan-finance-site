// Fade-in on scroll
const fadeElements = document.querySelectorAll('.fade-in-element');
const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

fadeElements.forEach(el => observer.observe(el));

// Scroll-spy functionality
const sections = document.querySelectorAll('section[id]');
const spyLinks = document.querySelectorAll('.spy-link');

window.addEventListener('scroll', () => {
  let currentSection = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) {
      currentSection = section.getAttribute('id');
    }
  });

  spyLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentSection}`) {
      link.classList.add('active');
    }
  });
});

// Burger menu + backdrop toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navLinks');
const navBackdrop = document.getElementById('navBackdrop');

if (navToggle && navMenu && navBackdrop) {
  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('show');
    navToggle.classList.toggle('active');
    navBackdrop.classList.toggle('show', isOpen);
  });

  // Close menu when clicking backdrop
  navBackdrop.addEventListener('click', () => {
    navMenu.classList.remove('show');
    navToggle.classList.remove('active');
    navBackdrop.classList.remove('show');
  });

  // Auto-close menu when a nav link is clicked
  const navItems = navMenu.querySelectorAll('a');
  navItems.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('show');
      navToggle.classList.remove('active');
      navBackdrop.classList.remove('show');
    });
  });
}

