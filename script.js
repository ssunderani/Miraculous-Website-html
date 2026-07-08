document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 1. HEADER SCROLL EFFECT & ACTIVE LINKS
  // ==========================================================================
  const header = document.querySelector('.main-header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');

  window.addEventListener('scroll', () => {
    // Scroll header styling
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Active nav link on scroll
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= (sectionTop - 150)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // ==========================================================================
  // 2. MOBILE DRAWER MENU
  // ==========================================================================
  const burgerBtn = document.querySelector('.mobile-menu-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const overlay = document.querySelector('.drawer-overlay');
  const drawerClose = document.querySelector('.drawer-close');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  const toggleDrawer = () => {
    drawer.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = drawer.classList.contains('active') ? 'hidden' : '';
  };

  burgerBtn.addEventListener('click', toggleDrawer);
  drawerClose.addEventListener('click', toggleDrawer);
  overlay.addEventListener('click', toggleDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (drawer.classList.contains('active')) {
        toggleDrawer();
      }
    });
  });

  // ==========================================================================
  // 3. AUTHOR BIO EXPANSION
  // ==========================================================================
  const btnReadMore = document.getElementById('btn-read-more');
  const bioExtra = document.getElementById('authors-bio-extra');

  if (btnReadMore && bioExtra) {
    btnReadMore.addEventListener('click', () => {
      bioExtra.classList.toggle('active');
      if (bioExtra.classList.contains('active')) {
        btnReadMore.innerHTML = 'CLOSE BIOGRAPHIES <i class="fa-solid fa-arrow-up"></i>';
      } else {
        btnReadMore.innerHTML = 'READ FULL BIOGRAPHIES <i class="fa-solid fa-arrow-right"></i>';
      }
    });
  }

  // ==========================================================================
  // 4. 3D BOOK HOVER EFFECT (HERO SECTION)
  // ==========================================================================
  const heroBook = document.getElementById('hero-book');

  if (heroBook) {
    heroBook.addEventListener('mousemove', (e) => {
      const box = heroBook.getBoundingClientRect();
      const x = e.clientX - box.left - (box.width / 2);
      const y = e.clientY - box.top - (box.height / 2);
      
      // Calculate tilt angles (max 15 degrees)
      const tiltX = -(y / (box.height / 2)) * 15;
      const tiltY = (x / (box.width / 2)) * 15;
      
      heroBook.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.03)`;
    });

    heroBook.addEventListener('mouseleave', () => {
      heroBook.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
      heroBook.style.transition = 'transform 0.5s ease';
    });

    heroBook.addEventListener('mouseenter', () => {
      heroBook.style.transition = 'none';
    });
  }

  // ==========================================================================
  // 5. TESTIMONIALS CAROUSEL
  // ==========================================================================
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.dot');
  let currentSlide = 0;
  let slideInterval;

  const showSlide = (n) => {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    currentSlide = (n + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  };

  const startSlideShow = () => {
    slideInterval = setInterval(() => {
      showSlide(currentSlide + 1);
    }, 6000);
  };

  const resetSlideShow = () => {
    clearInterval(slideInterval);
    startSlideShow();
  };

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const target = parseInt(dot.getAttribute('data-slide'));
      showSlide(target);
      resetSlideShow();
    });
  });

  startSlideShow();

  // ==========================================================================
  // 6. CONTACT FORM VALIDATION & SUBMIT
  // ==========================================================================
  const contactForm = document.getElementById('contact-form');
  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const subjectInput = document.getElementById('contact-subject');
  const messageInput = document.getElementById('contact-message');

  const showInputError = (input, isValid) => {
    const parent = input.parentElement;
    if (isValid) {
      parent.classList.remove('has-error');
    } else {
      parent.classList.add('has-error');
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.toLowerCase());
  };

  // Blur validation
  nameInput.addEventListener('blur', () => showInputError(nameInput, nameInput.value.trim() !== ''));
  emailInput.addEventListener('blur', () => showInputError(emailInput, validateEmail(emailInput.value)));
  subjectInput.addEventListener('blur', () => showInputError(subjectInput, subjectInput.value.trim() !== ''));
  messageInput.addEventListener('blur', () => showInputError(messageInput, messageInput.value.trim() !== ''));

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const isNameValid = nameInput.value.trim() !== '';
    const isEmailValid = validateEmail(emailInput.value);
    const isSubjectValid = subjectInput.value.trim() !== '';
    const isMessageValid = messageInput.value.trim() !== '';

    showInputError(nameInput, isNameValid);
    showInputError(emailInput, isEmailValid);
    showInputError(subjectInput, isSubjectValid);
    showInputError(messageInput, isMessageValid);

    if (isNameValid && isEmailValid && isSubjectValid && isMessageValid) {
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      
      // Simulate API call
      submitBtn.disabled = true;
      submitBtn.textContent = 'SENDING...';

      setTimeout(() => {
        showToast('Message Sent!', 'Thank you. LTC Justin Foote will get back to you shortly.');
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        
        // Remove error states if lingering
        document.querySelectorAll('.form-group').forEach(group => group.classList.remove('has-error'));
      }, 1500);
    }
  });

  // ==========================================================================
  // 7. TOAST NOTIFICATION UTILITY
  // ==========================================================================
  const toast = document.getElementById('toast-notification');
  const toastTitle = document.getElementById('toast-title');
  const toastDesc = document.getElementById('toast-desc');

  const showToast = (title, description) => {
    toastTitle.textContent = title;
    toastDesc.textContent = description;
    toast.classList.add('active');
    
    setTimeout(() => {
      toast.classList.remove('active');
    }, 4000);
  };

  // ==========================================================================
  // 8. CHECKOUT MODAL SYSTEM
  // ==========================================================================
  const checkoutModal = document.getElementById('checkout-modal');
  const checkoutClose = document.querySelector('.checkout-close');
  const buyButtons = document.querySelectorAll('.btn-buy');
  
  // Elements inside checkout summary
  const itemFormatText = document.getElementById('checkout-item-format');
  const itemPriceText = document.getElementById('checkout-item-price');
  const qtyVal = document.getElementById('qty-val');
  const qtyMinus = document.getElementById('qty-minus');
  const qtyPlus = document.getElementById('qty-plus');
  const summarySubtotal = document.getElementById('summary-subtotal');
  const summaryTotal = document.getElementById('summary-total');

  let currentPrice = 0.00;

  const updateCheckoutTotals = () => {
    const qty = parseInt(qtyVal.value);
    const subtotal = currentPrice * qty;
    summarySubtotal.textContent = `$${subtotal.toFixed(2)}`;
    summaryTotal.textContent = `$${subtotal.toFixed(2)}`;
  };

  buyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const format = btn.getAttribute('data-format');
      const price = parseFloat(btn.getAttribute('data-price'));
      
      currentPrice = price;
      itemFormatText.textContent = `Format: ${format}`;
      itemPriceText.textContent = `$${price.toFixed(2)}`;
      qtyVal.value = 1;
      
      updateCheckoutTotals();
      
      checkoutModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeCheckout = () => {
    checkoutModal.classList.remove('active');
    document.body.style.overflow = '';
  };

  checkoutClose.addEventListener('click', closeCheckout);
  checkoutModal.addEventListener('click', (e) => {
    if (e.target === checkoutModal) {
      closeCheckout();
    }
  });

  // Quantity controls
  qtyMinus.addEventListener('click', () => {
    let val = parseInt(qtyVal.value);
    if (val > 1) {
      qtyVal.value = val - 1;
      updateCheckoutTotals();
    }
  });

  qtyPlus.addEventListener('click', () => {
    let val = parseInt(qtyVal.value);
    if (val < 10) {
      qtyVal.value = val + 1;
      updateCheckoutTotals();
    }
  });

  // Shipping Form validation & submission
  const checkoutForm = document.getElementById('checkout-form');
  const shipName = document.getElementById('ship-name');
  const shipEmail = document.getElementById('ship-email');
  const shipAddress = document.getElementById('ship-address');
  const shipCity = document.getElementById('ship-city');
  const shipZip = document.getElementById('ship-zip');
  const cardNum = document.getElementById('card-num');
  const cardExpiry = document.getElementById('card-expiry');
  const cardCvv = document.getElementById('card-cvv');

  // Blur checks
  shipName.addEventListener('blur', () => showInputError(shipName, shipName.value.trim() !== ''));
  shipEmail.addEventListener('blur', () => showInputError(shipEmail, validateEmail(shipEmail.value)));
  shipAddress.addEventListener('blur', () => showInputError(shipAddress, shipAddress.value.trim() !== ''));
  shipCity.addEventListener('blur', () => showInputError(shipCity, shipCity.value.trim() !== ''));
  shipZip.addEventListener('blur', () => showInputError(shipZip, shipZip.value.trim() !== ''));
  cardNum.addEventListener('blur', () => showInputError(cardNum, cardNum.value.replace(/\s/g, '').length >= 15));
  cardExpiry.addEventListener('blur', () => showInputError(cardExpiry, /^\d{2}\/\d{2}$/.test(cardExpiry.value.trim())));
  cardCvv.addEventListener('blur', () => showInputError(cardCvv, /^\d{3,4}$/.test(cardCvv.value.trim())));

  checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const isNameValid = shipName.value.trim() !== '';
    const isEmailValid = validateEmail(shipEmail.value);
    const isAddressValid = shipAddress.value.trim() !== '';
    const isCityValid = shipCity.value.trim() !== '';
    const isZipValid = shipZip.value.trim() !== '';
    const isCardValid = cardNum.value.replace(/\s/g, '').length >= 15;
    const isExpiryValid = /^\d{2}\/\d{2}$/.test(cardExpiry.value.trim());
    const isCvvValid = /^\d{3,4}$/.test(cardCvv.value.trim());

    showInputError(shipName, isNameValid);
    showInputError(shipEmail, isEmailValid);
    showInputError(shipAddress, isAddressValid);
    showInputError(shipCity, isCityValid);
    showInputError(shipZip, isZipValid);
    showInputError(cardNum, isCardValid);
    showInputError(cardExpiry, isExpiryValid);
    showInputError(cardCvv, isCvvValid);

    if (isNameValid && isEmailValid && isAddressValid && isCityValid && isZipValid && isCardValid && isExpiryValid && isCvvValid) {
      const orderBtn = document.getElementById('btn-place-order');
      const originalText = orderBtn.textContent;
      
      orderBtn.disabled = true;
      orderBtn.textContent = 'PROCESSING...';

      setTimeout(() => {
        closeCheckout();
        showToast('Order Placed!', 'Your simulated test order was successful! Thank you.');
        checkoutForm.reset();
        orderBtn.disabled = false;
        orderBtn.textContent = originalText;
        
        // Remove error states if lingering
        document.querySelectorAll('.form-group').forEach(group => group.classList.remove('has-error'));
      }, 2000);
    }
  });

  // ==========================================================================
  // 9. LIGHTBOX GALLERY
  // ==========================================================================
  const lightbox = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxCloseBtn = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');
  
  let activeGalleryIndex = 0;
  const galleryImagesData = [];

  galleryItems.forEach((item, index) => {
    const imgEl = item.querySelector('.gallery-img');
    const descEl = item.querySelector('.gallery-overlay span');
    galleryImagesData.push({
      src: imgEl.src,
      alt: imgEl.alt,
      caption: descEl ? descEl.textContent : 'Photo'
    });

    item.addEventListener('click', () => {
      activeGalleryIndex = index;
      openLightbox(index);
    });
  });

  const openLightbox = (index) => {
    const data = galleryImagesData[index];
    lightboxImg.src = data.src;
    lightboxImg.alt = data.alt;
    lightboxCaption.textContent = data.caption;
    
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.style.display = 'none';
    if (!checkoutModal.classList.contains('active')) {
      document.body.style.overflow = '';
    }
  };

  lightboxCloseBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target === lightboxCloseBtn) {
      closeLightbox();
    }
  });

  lightboxPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    activeGalleryIndex = (activeGalleryIndex - 1 + galleryImagesData.length) % galleryImagesData.length;
    openLightbox(activeGalleryIndex);
  });

  lightboxNext.addEventListener('click', (e) => {
    e.stopPropagation();
    activeGalleryIndex = (activeGalleryIndex + 1) % galleryImagesData.length;
    openLightbox(activeGalleryIndex);
  });

  // Close lightbox on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
      closeCheckout();
    }
  });

  // ==========================================================================
  // 10. SCROLL REVEAL (FADE-IN EFFECT)
  // ==========================================================================
  const scrollElements = document.querySelectorAll('.fade-in-scroll');

  const elementInView = (el, dividend = 1) => {
    const elementTop = el.getBoundingClientRect().top;
    return (
      elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend
    );
  };

  const displayScrollElement = (element) => {
    element.classList.add('visible');
  };

  const hideScrollElement = (element) => {
    element.classList.remove('visible');
  };

  const handleScrollAnimation = () => {
    scrollElements.forEach((el) => {
      if (elementInView(el, 1.15)) {
        displayScrollElement(el);
      }
    });
  };

  window.addEventListener('scroll', () => {
    handleScrollAnimation();
  });

  // Trigger once initially
  handleScrollAnimation();
});
