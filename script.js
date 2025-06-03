// script.js

// DOM elements
const header = document.querySelector('header');
const navLinks = document.querySelectorAll('nav ul li a');
const sections = document.querySelectorAll('main section');
const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  initSmoothScrolling();
  initScrollSpy();
  initAnimations();
  highlightCurrentNavLink();
  initThemeToggle();
});

// Smooth scrolling for navigation links
function initSmoothScrolling() {
  navLinks.forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);
      
      if (targetSection) {
        const headerHeight = header.offsetHeight;
        window.scrollTo({
          top: targetSection.offsetTop - headerHeight,
          behavior: 'smooth'
        });
      }
    });
  });
}

// Advanced scroll spy for active navigation highlighting
function initScrollSpy() {
  window.addEventListener('scroll', debounce(() => {
    highlightCurrentNavLink();
    
    // Header shadow effect on scroll
    if (window.scrollY > 10) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, 20));
}

// Determine which section is currently in view
function highlightCurrentNavLink() {
  let scrollPosition = window.scrollY || window.pageYOffset;
  const headerHeight = header.offsetHeight;
  
  // Find the current section
  sections.forEach(section => {
    const sectionTop = section.offsetTop - headerHeight - 20;
    const sectionBottom = sectionTop + section.offsetHeight;
    
    if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
      // Remove active class from all links
      navLinks.forEach(link => link.classList.remove('active'));
      
      // Add active class to corresponding link
      const currentLink = document.querySelector(`nav ul li a[href="#${section.id}"]`);
      if (currentLink) {
        currentLink.classList.add('active');
      }
    }
  });
}

// Form validation and submission handling
function initContactForm() {
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      // Validate the form first
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const message = document.getElementById('message').value;
      
      if (!name || !email || !message) {
        e.preventDefault();
        showNotification('Please fill in all fields', 'error');
        return;
      }
      
      if (!isValidEmail(email)) {
        e.preventDefault();
        showNotification('Please enter a valid email address', 'error');
        return;
      }
      
      // If we're in development or our AJAX fails, we'll let the form submit naturally
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('Development mode detected - using traditional form submission');
        return; // Let the form submit naturally
      }
      
      // Prevent default for AJAX submission
      e.preventDefault();
      
      // Show a loading notification
      showNotification('Sending your message...', 'info');
      
      // Update button state to show loading
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const btnText = submitBtn.querySelector('.btn-text');
      const btnLoading = submitBtn.querySelector('.btn-loading');
      
      btnText.style.display = 'none';
      btnLoading.style.display = 'inline-block';
      submitBtn.disabled = true;
      
      // Get the form data
      const formData = new FormData(contactForm);
      
      // Use XHR as a backup to fetch, as it handles CORS differently
      const xhr = new XMLHttpRequest();
      xhr.open('POST', contactForm.action);
      xhr.setRequestHeader('Accept', 'application/json');
      
      xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
          console.log('Form submitted successfully via XHR');
          showNotification('Your message has been sent successfully!', 'success');
          contactForm.reset();
          
          // Reset button state
          btnText.style.display = 'inline-block';
          btnLoading.style.display = 'none';
          submitBtn.disabled = false;
          
          // Redirect after a short delay
          setTimeout(() => {
            window.location.href = formData.get('_next') || 'thank-you.html';
          }, 2000);
        } else {
          console.error('XHR Error:', xhr.responseText);
          // If XHR fails, try traditional form submission
          console.log('Falling back to traditional form submission');
          showNotification('Redirecting to form processor...', 'info');
          contactForm.submit();
        }
      };
      
      xhr.onerror = function() {
        console.error('XHR Network Error');
        // If XHR fails, try traditional form submission
        console.log('Falling back to traditional form submission');
        showNotification('Redirecting to form processor...', 'info');
        contactForm.submit();
      };
      
      xhr.send(formData);
    });
  }
}

// Email validation helper
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Check if Formspree is properly configured
function checkFormspreeEndpoint() {
  if (!contactForm) return;
  
  const formspreeAction = contactForm.action;
  if (!formspreeAction || !formspreeAction.includes('formspree.io')) {
    console.warn('Formspree endpoint not properly configured:', formspreeAction);
    return;
  }
  
  // Make a HEAD request to check if the endpoint is valid
  fetch(formspreeAction, {
    method: 'HEAD',
    headers: {
      'Accept': 'application/json'
    }
  })
  .then(response => {
    if (response.ok) {
      console.log('Formspree endpoint is valid and accessible');
    } else {
      console.warn('Formspree endpoint returned status:', response.status);
    }
  })
  .catch(error => {
    console.error('Error checking Formspree endpoint:', error);
  });
}

// Initialize animations for page elements
function initAnimations() {
  // Reveal elements as they enter the viewport
  const revealElements = document.querySelectorAll('.timeline-item, .portfolio-item, .cert-item');
  
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    
    revealElements.forEach(el => {
      el.classList.add('reveal-element');
      revealObserver.observe(el);
    });
  } else {
    // Fallback for browsers without IntersectionObserver
    revealElements.forEach(el => el.classList.add('revealed'));
  }
}

// Create and display notification messages
function showNotification(message, type = 'info') {
  // Remove any existing notifications
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  // Create new notification
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <p>${message}</p>
      <button class="notification-close">&times;</button>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Show with animation
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  // Add close button functionality
  const closeButton = notification.querySelector('.notification-close');
  closeButton.addEventListener('click', () => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  });
  
  // Auto-dismiss after 5 seconds
  setTimeout(() => {
    if (document.body.contains(notification)) {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }
  }, 5000);
}

// Utility function to debounce frequent events
function debounce(func, delay) {
  let timeout;
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), delay);
  };
}

// Add CSS for notification styling
function addNotificationStyles() {
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    .notification {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 1000;
      max-width: 400px;
      transform: translateY(100px);
      opacity: 0;
      transition: transform 0.3s ease, opacity 0.3s ease;
    }
    
    .notification.show {
      transform: translateY(0);
      opacity: 1;
    }
    
    .notification-content {
      padding: 15px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    
    .notification.success .notification-content {
      background-color: #10b981;
      color: white;
    }
    
    .notification.error .notification-content {
      background-color: #ef4444;
      color: white;
    }
    
    .notification.info .notification-content {
      background-color: #3b82f6;
      color: white;
    }
    
    .notification-close {
      background: transparent;
      border: none;
      color: inherit;
      font-size: 20px;
      cursor: pointer;
      margin-left: 10px;
    }
    
    .reveal-element {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .reveal-element.revealed {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  document.head.appendChild(styleEl);
}

// Theme toggle functionality
function initThemeToggle() {
  // Check for saved user preference, first in localStorage, then prefer-color-scheme
  const savedTheme = localStorage.getItem('theme') || 
                    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  
  // Apply the saved theme
  setTheme(savedTheme);
  
  // Theme toggle button click event
  themeToggle.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Add animation class
    document.body.classList.add('theme-transition');
    setTimeout(() => {
      document.body.classList.remove('theme-transition');
    }, 500);
  });
}

// Apply theme to HTML element
function setTheme(theme) {
  htmlElement.setAttribute('data-theme', theme);
  
  // Update toggle button icon
  const themeIcon = themeToggle.querySelector('i');
  if (theme === 'dark') {
    themeIcon.className = 'fas fa-sun';
  } else {
    themeIcon.className = 'fas fa-moon';
  }
}

// Add the notification styles
addNotificationStyles();

// PDF export functionality has been completely removed
// Initialize PDF Export functionality
function initPdfExport() {
  // PDF export functionality is temporarily disabled as we're using a direct link
  // This code is kept for future reference
  /*
  const pdfBtn = document.getElementById('pdf-export');
  
  if (pdfBtn) {
    console.log('PDF Export button found, adding event listener');
    
    // Remove any existing listeners to avoid duplicates
    const newBtn = pdfBtn.cloneNode(true);
    if (pdfBtn.parentNode) {
      pdfBtn.parentNode.replaceChild(newBtn, pdfBtn);
    }
    
    // Add direct onclick handler for maximum compatibility
    newBtn.onclick = function(e) {
      // No longer preventing default as we're using a direct link
      console.log('PDF Export button clicked!');
  */
      
      // Create and show loading overlay
      const loadingOverlay = document.createElement('div');
      loadingOverlay.className = 'pdf-loading';
      loadingOverlay.innerHTML = `
        <div class="pdf-loading-content">
          <div class="pdf-loading-spinner"></div>
          <h3>Generating CV</h3>
          <p>Please wait, this may take a moment...</p>
        </div>
      `;
      document.body.appendChild(loadingOverlay);
      
      // Set current theme to light for better PDF output
      const currentTheme = htmlElement.getAttribute('data-theme');
      htmlElement.setAttribute('data-theme', 'light');
      
      // Create a clone of the content to modify for PDF
      const contentClone = document.cloneNode(true);
      const mainContent = contentClone.body;
      
      // Remove elements we don't want in the PDF
      const elementsToRemove = mainContent.querySelectorAll('.theme-toggle, #themeToggle');
      elementsToRemove.forEach(el => {
        if (el && el.parentNode) {
          el.parentNode.removeChild(el);
        }
      });
      
      // Configure PDF options
      const options = {
        margin: [10, 10, 10, 10],
        filename: 'Jordan_Reynoldson_Portfolio.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          logging: false,
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      
      // Generate PDF from original document (not clone, as cloning causes issues with styles)
      // Use a timeout to allow the notification to show before starting the heavy PDF generation
      setTimeout(() => {
        // Add a class to the body for PDF specific styling
        document.body.classList.add('generating-pdf');
        
        // Create container for PDF content
        const mainElement = document.querySelector('main');
        
        // Change the filename to CV
        options.filename = 'Jordan_Reynoldson_CV.pdf';
        
        // Ensure html2pdf is available
        if (typeof html2pdf === 'undefined') {
          console.error('html2pdf library not loaded!');
          
          // Remove loading overlay and show error
          const loadingOverlay = document.querySelector('.pdf-loading');
          if (loadingOverlay) loadingOverlay.remove();
          
          showNotification('Error: PDF generation library not loaded', 'error');
          return;
        }
        
        // Generate the PDF with promises
        html2pdf()
          .set(options)
          .from(mainElement)
          .save()
          .then(() => {
            console.log('PDF generation successful');
            
            // Restore original theme
            htmlElement.setAttribute('data-theme', currentTheme);
            
            // Remove PDF generation class
            document.body.classList.remove('generating-pdf');
            
            // Remove loading overlay
            const loadingOverlay = document.querySelector('.pdf-loading');
            if (loadingOverlay) {
              loadingOverlay.remove();
            }
            
            // Show success notification
            showNotification('CV successfully downloaded!', 'success');
          })
          .catch((error) => {
            console.error('PDF generation error:', error);
            
            // Restore original theme
            htmlElement.setAttribute('data-theme', currentTheme);
            
            // Remove PDF generation class
            document.body.classList.remove('generating-pdf');
            
            // Remove loading overlay
            const loadingOverlay = document.querySelector('.pdf-loading');
            if (loadingOverlay) {
              loadingOverlay.remove();
            }
            
            // Show error notification
            showNotification('Error downloading CV. Please try again.', 'error');
          });
      }, 100);
    };
  

