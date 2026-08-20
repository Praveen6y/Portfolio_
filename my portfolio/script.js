document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // THEME TOGGLE FUNCTIONALITY
    // ==========================================
    const themeToggleBtn = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;
    const themeIcon = themeToggleBtn.querySelector('i');

    // Load initial theme from localStorage or system setting
    const savedTheme = localStorage.getItem('portfolio-theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    const activeTheme = savedTheme || systemTheme;

    // Apply the active theme
    setTheme(activeTheme);

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    });

    function setTheme(theme) {
        htmlElement.setAttribute('data-theme', theme);
        localStorage.setItem('portfolio-theme', theme);

        if (theme === 'dark') {
            themeIcon.className = 'fa-solid fa-sun'; // sun icon for light mode transition
        } else {
            themeIcon.className = 'fa-solid fa-moon'; // moon icon for dark mode transition
        }
    }

    // ==========================================
    // MOBILE NAV MENU TOGGLE
    // ==========================================
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinksContainer = document.getElementById('navLinks');
    const mobileMenuIcon = mobileMenuBtn.querySelector('i');

    mobileMenuBtn.addEventListener('click', () => {
        navLinksContainer.classList.toggle('active');
        const isActive = navLinksContainer.classList.contains('active');

        // Toggle icon between bars and close X
        if (isActive) {
            mobileMenuIcon.className = 'fa-solid fa-xmark';
        } else {
            mobileMenuIcon.className = 'fa-solid fa-bars';
        }
    });

    // Close menu when clicking navigation links on mobile
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinksContainer.classList.contains('active')) {
                navLinksContainer.classList.remove('active');
                mobileMenuIcon.className = 'fa-solid fa-bars';
            }
        });
    });

    // ==========================================
    // INTERACTIVE MOUSE CURSOR GLOW & BG TRACKING
    // ==========================================
    const cursorGlow = document.getElementById('cursorGlow');
    const htmlDoc = document.documentElement;

    // Only activate glow and interactive grid on desktop devices
    if (window.matchMedia('(pointer: fine)').matches) {
        document.addEventListener('mousemove', (e) => {
            const x = e.clientX;
            const y = e.clientY;

            cursorGlow.style.opacity = '1';
            cursorGlow.style.left = `${x}px`;
            cursorGlow.style.top = `${y}px`;

            // Inject mouse coordinates for the background grid reveal
            htmlDoc.style.setProperty('--mouse-x', `${x}px`);
            htmlDoc.style.setProperty('--mouse-y', `${y}px`);
        });

        document.addEventListener('mouseleave', () => {
            cursorGlow.style.opacity = '0';
        });
    }

    // ==========================================
    // HERO AUTO-TYPING TEXT EFFECT (SDE Focus)
    // ==========================================
    const typingTextSpan = document.getElementById('typingText');
    const roles = ["Software Development Engineer", "Problem Solver", "Full-Stack Developer", "Systems Programmer"];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeEffect() {
        const currentRole = roles[roleIndex];

        if (isDeleting) {
            // Delete characters
            typingTextSpan.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // faster deletion
        } else {
            // Write characters
            typingTextSpan.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 120; // natural typing speed
        }

        // Handle transitions between typing and deleting
        if (!isDeleting && charIndex === currentRole.length) {
            // Pause at completion
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            // Move to next role
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 500; // pause before next word
        }

        setTimeout(typeEffect, typingSpeed);
    }

    // Start type effect
    if (typingTextSpan) {
        setTimeout(typeEffect, 1000);
    }

    // ==========================================
    // PORTFOLIO FILTER LOGIC
    // ==========================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Toggle active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            projectCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');

                if (filterValue === 'all' || cardCategory === filterValue) {
                    // Show item
                    card.style.display = 'block';
                    // Quick timeout for trigger transition
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    // Hide item
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 350); // matches transition time
                }
            });
        });
    });

    // ==========================================
    // SCROLL REVEAL (INTERSECTION OBSERVER)
    // ==========================================
    const revealElements = document.querySelectorAll('.scroll-reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // ==========================================
    // ACTIVE NAVIGATION LINK HIGHLIGHTING
    // ==========================================
    const sections = document.querySelectorAll('section');

    const navObserverOptions = {
        threshold: 0.3,
        rootMargin: '-80px 0px 0px 0px' // adjust for header height
    };

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${activeId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, navObserverOptions);

    sections.forEach(section => {
        navObserver.observe(section);
    });

    // ==========================================
    // CONTACT FORM VALIDATION & SUBMISSION
    // ==========================================
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameInput = document.getElementById('formName');
            const emailInput = document.getElementById('formEmail');
            const messageInput = document.getElementById('formMessage');

            let isValid = true;

            // Name validation
            if (nameInput.value.trim() === '') {
                showError(nameInput, 'nameError');
                isValid = false;
            } else {
                clearError(nameInput, 'nameError');
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value.trim())) {
                showError(emailInput, 'emailError');
                isValid = false;
            } else {
                clearError(emailInput, 'emailError');
            }

            // Message validation
            if (messageInput.value.trim() === '') {
                showError(messageInput, 'messageError');
                isValid = false;
            } else {
                clearError(messageInput, 'messageError');
            }

            if (isValid) {
                const name = nameInput.value.trim();
                const email = emailInput.value.trim();
                const message = messageInput.value.trim();

                // Format WhatsApp message text
                const formattedMessage = `Hello Boda Praveen! I reached out via your Portfolio contact form:\n\n` +
                    `*Name:* ${name}\n` +
                    `*Email:* ${email}\n\n` +
                    `*Message:* ${message}`;

                // IMPORTANT: Replace this with your actual WhatsApp phone number (with country code, no +, no spaces)
                const whatsappPhoneNumber = "916305731337"; // e.g. "919876543210" for India

                const whatsappUrl = `https://wa.me/${whatsappPhoneNumber}?text=${encodeURIComponent(formattedMessage)}`;

                const submitBtn = contactForm.querySelector('.btn-submit');
                const originalBtnContent = submitBtn.innerHTML;

                // Disable button and show redirecting feedback
                submitBtn.disabled = true;
                submitBtn.innerHTML = `<span>Redirecting to WhatsApp...</span> <i class="fa-solid fa-circle-notch fa-spin"></i>`;

                setTimeout(() => {
                    // Open WhatsApp redirect in new window/tab
                    window.open(whatsappUrl, '_blank');

                    // Success indicator
                    submitBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)'; // Green gradient
                    submitBtn.innerHTML = `<span>Redirected!</span> <i class="fa-solid fa-check"></i>`;

                    // Reset form fields
                    contactForm.reset();

                    // Restore original button state after 3 seconds
                    setTimeout(() => {
                        submitBtn.disabled = false;
                        submitBtn.style.background = '';
                        submitBtn.innerHTML = originalBtnContent;
                    }, 3000);

                }, 1000);
            }
        });

        // Add blur/input event listeners to clear error dynamically
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                const group = input.parentElement;
                if (group.classList.contains('error')) {
                    group.classList.remove('error');
                }
            });
        });
    }

    function showError(input, errorId) {
        const group = input.parentElement;
        group.classList.add('error');
    }

    function clearError(input, errorId) {
        const group = input.parentElement;
        group.classList.remove('error');
    }

    // ==========================================
    // CERTIFICATE MODAL LIGHTBOX
    // ==========================================
    const certModal = document.getElementById('certModal');
    const modalImg = document.getElementById('modalImg');
    const captionText = document.getElementById('caption');
    const viewButtons = document.querySelectorAll('.cert-view-btn');
    const closeModal = certModal ? certModal.querySelector('.close-modal') : null;

    if (certModal && viewButtons.length > 0 && closeModal) {
        viewButtons.forEach(button => {
            button.addEventListener('click', () => {
                const certSrc = button.getAttribute('data-cert');
                if (!certSrc) return; // Skip lightbox modal if no data-cert is provided (e.g. drive links)

                const certTitle = button.closest('.cert-card').querySelector('h3').textContent;
                const certProvider = button.closest('.cert-card').querySelector('.cert-provider').textContent;

                certModal.classList.add('active');
                modalImg.src = certSrc;
                captionText.textContent = `${certProvider} - ${certTitle}`;
                document.body.style.overflow = 'hidden'; // prevent scrolling behind modal
            });
        });

        // Close on close button click
        closeModal.addEventListener('click', () => {
            certModal.classList.remove('active');
            document.body.style.overflow = '';
        });

        // Close on clicking outside the image
        certModal.addEventListener('click', (e) => {
            if (e.target === certModal) {
                certModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Close on Escape key press
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && certModal.classList.contains('active')) {
                certModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // ==========================================
    // PROJECTS HORIZONTAL SLIDER NAVIGATION
    // ==========================================
    const projectsGrid = document.querySelector('.projects-grid');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    if (projectsGrid && prevBtn && nextBtn) {
        const getScrollStep = () => {
            const firstCard = projectsGrid.querySelector('.project-card');
            if (firstCard) {
                return firstCard.offsetWidth + 30; // card width + gap
            }
            return 410;
        };

        prevBtn.addEventListener('click', () => {
            projectsGrid.scrollBy({ left: -getScrollStep(), behavior: 'smooth' });
        });

        nextBtn.addEventListener('click', () => {
            projectsGrid.scrollBy({ left: getScrollStep(), behavior: 'smooth' });
        });

        const updateSliderButtons = () => {
            const scrollLeft = projectsGrid.scrollLeft;
            const maxScroll = projectsGrid.scrollWidth - projectsGrid.clientWidth;
            
            if (scrollLeft <= 5) {
                prevBtn.style.opacity = '0.2';
                prevBtn.style.pointerEvents = 'none';
            } else {
                prevBtn.style.opacity = '1';
                prevBtn.style.pointerEvents = 'auto';
            }
            
            if (scrollLeft >= maxScroll - 5) {
                nextBtn.style.opacity = '0.2';
                nextBtn.style.pointerEvents = 'none';
            } else {
                nextBtn.style.opacity = '1';
                nextBtn.style.pointerEvents = 'auto';
            }
        };

        projectsGrid.addEventListener('scroll', updateSliderButtons);
        window.addEventListener('resize', updateSliderButtons);
        
        // Run initial update after font load/rendering
        setTimeout(updateSliderButtons, 500);
    }

    // ==========================================
    // CERTIFICATIONS HORIZONTAL SLIDER NAVIGATION
    // ==========================================
    const certsGrid = document.querySelector('.certifications-grid');
    const prevCertBtn = document.querySelector('.prev-cert-btn');
    const nextCertBtn = document.querySelector('.next-cert-btn');

    if (certsGrid && prevCertBtn && nextCertBtn) {
        const getScrollStep = () => {
            const firstCard = certsGrid.querySelector('.cert-card');
            if (firstCard) {
                return firstCard.offsetWidth + 30; // card width + gap
            }
            return 410;
        };

        prevCertBtn.addEventListener('click', () => {
            certsGrid.scrollBy({ left: -getScrollStep(), behavior: 'smooth' });
        });

        nextCertBtn.addEventListener('click', () => {
            certsGrid.scrollBy({ left: getScrollStep(), behavior: 'smooth' });
        });

        const updateSliderButtons = () => {
            const scrollLeft = certsGrid.scrollLeft;
            const maxScroll = certsGrid.scrollWidth - certsGrid.clientWidth;
            
            if (scrollLeft <= 5) {
                prevCertBtn.style.opacity = '0.2';
                prevCertBtn.style.pointerEvents = 'none';
            } else {
                prevCertBtn.style.opacity = '1';
                prevCertBtn.style.pointerEvents = 'auto';
            }
            
            if (scrollLeft >= maxScroll - 5) {
                nextCertBtn.style.opacity = '0.2';
                nextCertBtn.style.pointerEvents = 'none';
            } else {
                nextCertBtn.style.opacity = '1';
                nextCertBtn.style.pointerEvents = 'auto';
            }
        };

        certsGrid.addEventListener('scroll', updateSliderButtons);
        window.addEventListener('resize', updateSliderButtons);
        
        // Run initial update after font load/rendering
        setTimeout(updateSliderButtons, 500);
    }

    // ==========================================
    // CODING PROFILES HORIZONTAL SLIDER NAVIGATION
    // ==========================================
    const profilesGrid = document.querySelector('.profiles-grid');
    const prevProfileBtn = document.querySelector('.prev-profile-btn');
    const nextProfileBtn = document.querySelector('.next-profile-btn');

    if (profilesGrid && prevProfileBtn && nextProfileBtn) {
        const getScrollStep = () => {
            const firstCard = profilesGrid.querySelector('.profile-card');
            if (firstCard) {
                return firstCard.offsetWidth + 30; // card width + gap
            }
            return 410;
        };

        prevProfileBtn.addEventListener('click', () => {
            profilesGrid.scrollBy({ left: -getScrollStep(), behavior: 'smooth' });
        });

        nextProfileBtn.addEventListener('click', () => {
            profilesGrid.scrollBy({ left: getScrollStep(), behavior: 'smooth' });
        });

        const updateSliderButtons = () => {
            const scrollLeft = profilesGrid.scrollLeft;
            const maxScroll = profilesGrid.scrollWidth - profilesGrid.clientWidth;
            
            if (scrollLeft <= 5) {
                prevProfileBtn.style.opacity = '0.2';
                prevProfileBtn.style.pointerEvents = 'none';
            } else {
                prevProfileBtn.style.opacity = '1';
                prevProfileBtn.style.pointerEvents = 'auto';
            }
            
            if (scrollLeft >= maxScroll - 5) {
                nextProfileBtn.style.opacity = '0.2';
                nextProfileBtn.style.pointerEvents = 'none';
            } else {
                nextProfileBtn.style.opacity = '1';
                nextProfileBtn.style.pointerEvents = 'auto';
            }
        };

        profilesGrid.addEventListener('scroll', updateSliderButtons);
        window.addEventListener('resize', updateSliderButtons);
        
        // Run initial update after font load/rendering
        setTimeout(updateSliderButtons, 500);
    }
});
