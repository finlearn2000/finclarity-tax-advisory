/* ==========================================
   Finclarity Interactivity - Vanilla JS
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. STICKY NAVBAR EFFECT ---
  const navbar = document.getElementById('navbar');
  const handleScrollNavbar = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScrollNavbar);
  handleScrollNavbar(); // Initial call in case page starts scrolled


  // --- 2. MOBILE MENU DRAWER ---
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  const toggleMenu = () => {
    mobileToggle.classList.toggle('open');
    navMenu.classList.toggle('open');
  };

  const closeMenu = () => {
    mobileToggle.classList.remove('open');
    navMenu.classList.remove('open');
  };

  mobileToggle.addEventListener('click', toggleMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });


  // --- 3. SCROLLSPY (ACTIVE LINK MARKING) ---
  const sections = document.querySelectorAll('section');
  
  const scrollSpy = () => {
    const scrollPosition = window.scrollY + 120; // Offset for header height and threshold

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };
  window.addEventListener('scroll', scrollSpy);
  scrollSpy(); // Initial call


  // --- 4. BACK TO TOP BUTTON ---
  const backToTopBtn = document.getElementById('back-to-top');

  const handleBackToTopVisibility = () => {
    if (window.scrollY > 500) {
      backToTopBtn.style.display = 'flex';
    } else {
      backToTopBtn.style.display = 'none';
    }
  };
  window.addEventListener('scroll', handleBackToTopVisibility);
  handleBackToTopVisibility();

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });


  // --- 5. SCROLL REVEAL ANIMATIONS ---
  const revealElements = document.querySelectorAll('.scroll-reveal');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Once revealed, no need to keep observing this element
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null, // viewport
    threshold: 0.15, // trigger when 15% of the element is visible
    rootMargin: '0px 0px -50px 0px' // offset bottom triggers slightly
  });

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });


  // --- 6. FORM SUBMISSION & VALIDATION ---
  const form = document.getElementById('consultation-form');
  const feedback = document.getElementById('form-feedback');
  const submitBtn = document.getElementById('form-submit');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Reset feedback
    feedback.className = 'form-feedback';
    feedback.style.display = 'none';
    feedback.innerText = '';

    // Collect field values
    const name = document.getElementById('form-name').value.trim();
    const email = document.getElementById('form-email').value.trim();
    const phone = document.getElementById('form-phone').value.trim();
    const service = document.getElementById('form-service').value;
    const message = document.getElementById('form-message').value.trim();

    // Basic Validation Check
    if (!name || !email || !phone || !service || !message) {
      feedback.classList.add('error');
      feedback.innerText = 'Please complete all required fields.';
      feedback.style.display = 'block';
      return;
    }

    // Email pattern check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      feedback.classList.add('error');
      feedback.innerText = 'Please provide a valid email address.';
      feedback.style.display = 'block';
      return;
    }

    // Disable button during submission
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Sending message... <i class="fa-solid fa-spinner fa-spin"></i>';

    // Prepare form data
    const formData = new FormData(form);

    // If access key is placeholder, simulate submission with guidance message
    if (formData.get('access_key') === 'YOUR_ACCESS_KEY_HERE') {
      console.warn("Finclarity: Please replace 'YOUR_ACCESS_KEY_HERE' in index.html with a valid key from web3forms.com to receive live emails.");
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Send Message <i class="fa-regular fa-paper-plane"></i>';
        
        feedback.classList.add('success');
        feedback.innerText = `Thank you, ${name}! Your request has been submitted (Demo Mode). Please set your Web3Forms access key in index.html to receive actual email alerts.`;
        feedback.style.display = 'block';
        form.reset();
      }, 1200);
      return;
    }

    // Submit live using Web3Forms AJAX
    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData
    })
    .then(async (response) => {
      let result = await response.json();
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Send Message <i class="fa-regular fa-paper-plane"></i>';

      if (response.status === 200) {
        feedback.classList.add('success');
        feedback.innerText = `Thank you, ${name}! Your consultation request has been successfully sent. We will contact you at ${email} shortly.`;
        feedback.style.display = 'block';
        form.reset();
      } else {
        feedback.classList.add('error');
        feedback.innerText = result.message || 'Something went wrong. Please try again later.';
        feedback.style.display = 'block';
      }
    })
    .catch(error => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Send Message <i class="fa-regular fa-paper-plane"></i>';
      feedback.classList.add('error');
      feedback.innerText = 'Network error. Please check your connection and try again.';
      feedback.style.display = 'block';
    });
  });

});
