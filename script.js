// script.js

// Smooth scrolling for navigation links
document.querySelectorAll('nav ul li a').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href').substring(1);
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      window.scrollTo({
        top: targetSection.offsetTop - 20,
        behavior: 'smooth'
      });
    }
  });
});

// Optional: highlight nav link of the current section as user scrolls
window.addEventListener('scroll', () => {
  const scrollPos = window.scrollY || window.pageYOffset;

  document.querySelectorAll('main section').forEach(section => {
    if (
      scrollPos >= section.offsetTop - 60 &&
      scrollPos < section.offsetTop + section.offsetHeight
    ) {
      document.querySelectorAll('nav ul li a').forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('href').substring(1) === section.id) {
          a.classList.add('active');
        }
      });
    }
  });
});
