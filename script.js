// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Get all navigation links
    const navLinks = document.querySelectorAll('.nav a[href^="#"]:not([href="causes.html"])');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu if open
                const mobileNav = document.querySelector('.mobile-nav');
                if (mobileNav && mobileNav.classList.contains('active')) {
                    mobileNav.classList.remove('active');
                }
            }
        });
    });
    
    // Mobile menu functionality
    function initializeMobileMenu() {
        // Check if elements already exist
        let hamburger = document.querySelector('.hamburger');
        let mobileNav = document.querySelector('.mobile-nav');
        
        // Only create if they don't exist
        if (!hamburger || !mobileNav) {
            createMobileMenuElements();
        }
        
        // Attach event listeners
        attachMobileMenuEvents();
        
        // Add touch support for mobile
        addTouchSupport();
    }
    
    function createMobileMenuElements() {
        const header = document.querySelector('.header');
        const headerContent = document.querySelector('.header-content');
        const nav = document.querySelector('.nav');
        const donateBtn = document.querySelector('.donate-btn.primary');
        
        // Create hamburger button
        const hamburger = document.createElement('button');
        hamburger.className = 'hamburger';
        hamburger.setAttribute('aria-label', 'Toggle navigation menu');
        hamburger.innerHTML = `
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
        `;
        headerContent.appendChild(hamburger);
        
        // Create mobile navigation
        const mobileNav = document.createElement('div');
        mobileNav.className = 'mobile-nav';
        
        // Clone navigation for mobile
        if (nav) {
            const mobileNavContent = nav.cloneNode(true);
            mobileNav.appendChild(mobileNavContent);
        }
        
        // Clone donate button for mobile
        if (donateBtn) {
            const mobileDonateBtn = donateBtn.cloneNode(true);
            mobileNav.appendChild(mobileDonateBtn);
        }
        
        header.appendChild(mobileNav);
    }
    
    function attachMobileMenuEvents() {
        const hamburger = document.querySelector('.hamburger');
        const mobileNav = document.querySelector('.mobile-nav');
        
        if (!hamburger || !mobileNav) return;
        
        // Remove existing event listeners to prevent duplicates
        const newHamburger = hamburger.cloneNode(true);
        hamburger.parentNode.replaceChild(newHamburger, hamburger);
        
        // Add click handler for hamburger
        newHamburger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const isActive = mobileNav.classList.contains('active');
            
            if (isActive) {
                mobileNav.classList.remove('active');
                newHamburger.classList.remove('active');
            } else {
                mobileNav.classList.add('active');
                newHamburger.classList.add('active');
            }
        });
        
        // Add event listeners to mobile nav links
        const mobileNavLinks = mobileNav.querySelectorAll('a');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // Close mobile menu when link is clicked
                mobileNav.classList.remove('active');
                newHamburger.classList.remove('active');
                
                // Handle smooth scrolling for anchor links
                if (this.getAttribute('href').startsWith('#')) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href');
                    const targetSection = document.querySelector(targetId);
                    
                    if (targetSection) {
                        targetSection.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileNav.contains(e.target) && !newHamburger.contains(e.target)) {
                if (mobileNav.classList.contains('active')) {
                    mobileNav.classList.remove('active');
                    newHamburger.classList.remove('active');
                }
            }
        });
    }
    
    // Add touch support for mobile interactions
    function addTouchSupport() {
        let touchStartY = 0;
        let touchEndY = 0;
        
        document.addEventListener('touchstart', function(e) {
            touchStartY = e.changedTouches[0].screenY;
        });
        
        document.addEventListener('touchend', function(e) {
            touchEndY = e.changedTouches[0].screenY;
            handleSwipe();
        });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartY - touchEndY;
            
            if (Math.abs(diff) > swipeThreshold) {
                const mobileNav = document.querySelector('.mobile-nav');
                const hamburger = document.querySelector('.hamburger');
                
                if (diff > 0 && mobileNav && mobileNav.classList.contains('active')) {
                    // Swipe up - close menu
                    mobileNav.classList.remove('active');
                    if (hamburger) hamburger.classList.remove('active');
                }
            }
        }
    }
    
    // Initialize mobile menu
    initializeMobileMenu();
    
    // Handle window resize for mobile menu
    function handleResize() {
        const mobileNav = document.querySelector('.mobile-nav');
        const hamburger = document.querySelector('.hamburger');
        
        if (window.innerWidth > 768) {
            if (mobileNav) {
                mobileNav.classList.remove('active');
            }
            if (hamburger) {
                hamburger.classList.remove('active');
            }
        }
    }
    
    window.addEventListener('resize', handleResize);
    
    // Add functionality for social media icons
    const footerSocialIcons = document.querySelectorAll('.footer .social-icon');
    footerSocialIcons.forEach(icon => {
        icon.addEventListener('click', function(e) {
            e.preventDefault();
            
            const platform = this.getAttribute('data-platform');
            let url = '';
            
            switch(platform) {
                case 'facebook':
                    url = 'https://facebook.com/srivinayakafoundation';
                    break;
                case 'instagram':
                    url = 'https://instagram.com/srivinayakafoundation';
                    break;
                case 'twitter':
                    url = 'https://twitter.com/srivinayakafoundation';
                    break;
                case 'linkedin':
                    url = 'https://linkedin.com/company/srivinayakafoundation';
                    break;
            }
            
            if (url) {
                window.open(url, '_blank');
            }
            
            // Add click animation
            this.style.transform = 'scale(0.95) translateY(-2px)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        });
    });
    
    // Keep existing social icons functionality for other sections
    const socialIcons = document.querySelectorAll('.social-icon:not(.footer .social-icon)');
    socialIcons.forEach(icon => {
        icon.addEventListener('click', function(e) {
            e.preventDefault();
            
            const platform = this.getAttribute('data-platform');
            let url = '';
            
            switch(platform) {
                case 'facebook':
                    url = 'https://facebook.com/srivinayakafoundation';
                    break;
                case 'instagram':
                    url = 'https://instagram.com/srivinayakafoundation';
                    break;
                case 'twitter':
                    url = 'https://twitter.com/srivinayakafoundation';
                    break;
                case 'whatsapp':
                    url = 'https://wa.me/919876543210';
                    break;
                case 'youtube':
                    url = 'https://youtube.com/@srivinayakafoundation';
                    break;
                case 'linkedin':
                    url = 'https://linkedin.com/company/srivinayakafoundation';
                    break;
            }
            
            if (url) {
                window.open(url, '_blank');
            }
            
            // Add click animation
            this.style.transform = 'scale(0.95) translateY(-3px)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        });
        
        // Add hover effect for better user experience
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
    
    // Add click handlers for donate buttons
    const donateButtons = document.querySelectorAll('.donate-btn');
    
    donateButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Redirect to donation page
            window.location.href = 'donate.html';
        });
        
        // Enhanced hover effects
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.15)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });
    
    // Add functionality for cause card donate buttons
    const causeDonateBtns = document.querySelectorAll('.donate-btn-overlay');
    
    causeDonateBtns.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent card click event
            
            // Get the cause type from data attribute
            const causeType = this.getAttribute('data-cause');
            
            // Add click animation
            this.style.transform = 'translateX(-50%) translateY(-2px) scale(0.95)';
            this.style.background = 'linear-gradient(135deg, #ff5722, #e64a19)';
            setTimeout(() => {
                this.style.transform = 'translateX(-50%) translateY(0)';
            }, 150);
            
            // Store cause preference in localStorage for donate page
            if (causeType) {
                localStorage.setItem('selectedCause', causeType);
            }
            
            // Add loading state
            const buttonSpan = this.querySelector('span');
            const originalText = buttonSpan.textContent;
            buttonSpan.textContent = 'Redirecting...';
            this.style.background = 'linear-gradient(135deg, #9ca3af, #6b7280)';
            this.style.cursor = 'not-allowed';
            this.disabled = true;
            
            // Redirect to donate page after short delay
            setTimeout(() => {
                window.location.href = 'donate.html';
            }, 800);
            
            // Show notification
            showNotification(`Redirecting to donate for ${getCauseName(causeType)}...`, 'info');
        });
        
        // Enhanced hover effects for cause donate buttons
        button.addEventListener('mouseenter', function() {
            if (!this.disabled) {
                this.style.transform = 'translateX(-50%) translateY(-6px) scale(1.05)';
                this.style.boxShadow = '0 12px 32px rgba(255, 152, 105, 0.6)';
                this.style.background = 'linear-gradient(135deg, #ff7433, #ff5722)';
            }
        });
        
        button.addEventListener('mouseleave', function() {
            if (!this.disabled) {
                this.style.transform = 'translateX(-50%) translateY(0) scale(1)';
                this.style.boxShadow = '0 8px 24px rgba(255, 152, 105, 0.4)';
                this.style.background = 'linear-gradient(135deg, #ff9869, #ff7433)';
            }
        });
    });
    
    // Helper function to get cause name
    function getCauseName(causeType) {
        const causeNames = {
            'food': 'Food & Nutrition',
            'animal': 'Animal Rescue & Care',
            'orphanage': 'Orphanage Care & Support',
            'education': 'Education for Children'
        };
        return causeNames[causeType] || 'Our Cause';
    }
    
    // Add hover effects for cause cards
    const existingCauseCards = document.querySelectorAll('.cause-card');
    
    existingCauseCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-12px)';
            this.style.transition = 'transform 0.3s ease';
            this.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
        });
        
        // Add click effect
        card.addEventListener('click', function() {
            this.style.transform = 'scale(0.98) translateY(-8px)';
            setTimeout(() => {
                this.style.transform = 'translateY(-12px)';
            }, 150);
        });
    });
    
    // Make cause cards clickable to navigate to causes page
    // Cause cards now scroll to causes section instead
    const clickableCauseCards = document.querySelectorAll('.cause-card');
    clickableCauseCards.forEach(card => {
        card.addEventListener('click', function() {
            const causesSection = document.querySelector('#causes');
            if (causesSection) {
                causesSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Enhanced cause card interactions
    const enhancedCauseCards = document.querySelectorAll('.cause-card');
    
    enhancedCauseCards.forEach((card, index) => {
        // Add staggered animation on load
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`;
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100);
        
        // Enhanced hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.02)';
            this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
            
            // Add ripple effect
            const ripple = document.createElement('div');
            ripple.className = 'card-ripple';
            ripple.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                width: 0;
                height: 0;
                background: rgba(255, 152, 105, 0.1);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                transition: width 0.6s ease, height 0.6s ease;
                pointer-events: none;
                z-index: 1;
            `;
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.style.width = '300px';
                ripple.style.height = '300px';
            }, 10);
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
            
            // Remove ripple effect
            const ripple = this.querySelector('.card-ripple');
            if (ripple) {
                ripple.style.opacity = '0';
                setTimeout(() => {
                    if (ripple.parentNode) {
                        ripple.parentNode.removeChild(ripple);
                    }
                }, 300);
            }
        });
        
        // Add click animation
        card.addEventListener('click', function() {
            this.style.transform = 'translateY(-10px) scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'translateY(-15px) scale(1.02)';
            }, 150);
        });
    });
    
    // Add scroll animation for stats
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Add counter animation for stats
                const statValue = entry.target.querySelector('.stat-value');
                if (statValue && !statValue.dataset.animated) {
                    animateCounter(statValue);
                    statValue.dataset.animated = 'true';
                }
                
                // Add entrance animation
                entry.target.style.animation = 'slideInUp 0.6s ease forwards';
            }
        });
    }, observerOptions);
    
    // Counter animation function
    function animateCounter(element) {
        const text = element.textContent;
        const hasLakh = text.includes('Lakh');
        const hasCr = text.includes('Cr');
        const hasRupee = text.includes('₹');
        
        // Extract number
        let numberStr = text.replace(/[^\d.]/g, '');
        let targetNumber = parseFloat(numberStr);
        
        if (isNaN(targetNumber)) return;
        
        let currentNumber = 0;
        const increment = targetNumber / 60; // 60 steps for smoother animation
        const duration = 2000; // 2 seconds
        const stepTime = duration / 60;
        
        const timer = setInterval(() => {
            currentNumber += increment;
            
            if (currentNumber >= targetNumber) {
                currentNumber = targetNumber;
                clearInterval(timer);
            }
            
            let displayNumber = currentNumber.toFixed(2);
            let displayText = displayNumber;
            
            if (hasRupee) displayText = '₹' + displayText;
            if (hasCr) displayText += ' Cr+';
            else if (hasLakh) displayText += ' Lakh+';
            else displayText += '+';
            
            element.textContent = displayText;
        }, stepTime);
    }
    
    // Observe stats items
    const statItems = document.querySelectorAll('.stat-item');
    statItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease, background 0.3s ease, box-shadow 0.3s ease';
        observer.observe(item);
    });
    
    // Add scroll animations for other sections
    const animatedSections = document.querySelectorAll('.about, .impact, .transparency, .contact');
    animatedSections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        
        const sectionObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });
        
        sectionObserver.observe(section);
    });
    
    // Enhanced loading animation
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.8s ease';
    
    // Add progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'loading-progress';
    progressBar.innerHTML = '<div class="progress-fill"></div>';
    document.body.appendChild(progressBar);
    
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 90) progress = 90;
        progressBar.querySelector('.progress-fill').style.width = progress + '%';
    }, 100);
    
    window.addEventListener('load', function() {
        clearInterval(progressInterval);
        progressBar.querySelector('.progress-fill').style.width = '100%';
        
        setTimeout(() => {
            document.body.style.opacity = '1';
            progressBar.style.opacity = '0';
            setTimeout(() => {
                if (progressBar.parentNode) {
                    document.body.removeChild(progressBar);
                }
            }, 500);
        }, 300);
    });
    
    // Smooth scroll enhancement
    function smoothScrollTo(target, duration = 1000) {
        const targetPosition = target.offsetTop - 100; // Account for header
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;
        
        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }
        
        function easeInOutQuad(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }
        
        requestAnimationFrame(animation);
    }
    
    // Update smooth scrolling for navigation links
    const enhancedNavLinks = document.querySelectorAll('.nav a[href^="#"]:not([href="causes.html"])');
    
    enhancedNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                smoothScrollTo(targetSection);
                
                // Close mobile menu if open
                const mobileNav = document.querySelector('.mobile-nav');
                if (mobileNav && mobileNav.classList.contains('active')) {
                    mobileNav.classList.remove('active');
                }
            }
        });
    });
    
    // Add parallax effect to hero section
    const hero = document.querySelector('.hero');
    const heroImage = document.querySelector('.hero-image');
    
    if (hero && heroImage) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            if (scrolled < hero.offsetHeight) {
                heroImage.style.transform = `translateY(${rate}px)`;
            }
        });
    }
    
    // Add intersection observer for impact gallery images
    const impactImages = document.querySelectorAll('.impact-image');
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'scale(1)';
                }, index * 200);
            }
        });
    }, { threshold: 0.2 });
    
    impactImages.forEach(image => {
        image.style.opacity = '0';
        image.style.transform = 'scale(0.8)';
        image.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        imageObserver.observe(image);
    });
    
    // Add scroll-to-top button
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
        </svg>
    `;
    scrollToTopBtn.title = 'Back to top';
    document.body.appendChild(scrollToTopBtn);
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
        
        // Add scroll progress indicator
        const scrollProgress = (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        scrollToTopBtn.style.background = `conic-gradient(#ff9869 ${scrollProgress}%, rgba(255, 152, 105, 0.2) ${scrollProgress}%)`;
    });
    
    scrollToTopBtn.addEventListener('click', function() {
        this.style.transform = 'scale(0.9)';
        setTimeout(() => {
            this.style.transform = '';
        }, 150);
        smoothScrollTo(document.body, 800);
    });
    
    // Add loading animation
    // (This section is now handled above with enhanced loading)
    
    // Quick Contact form functionality
    const quickContactForm = document.getElementById('quickContactForm');
    const quickFormSuccess = document.getElementById('quickFormSuccess');
    
    if (quickContactForm) {
        quickContactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(quickContactForm);
            const data = Object.fromEntries(formData);
            
            // Validate required fields
            const requiredFields = ['name', 'email', 'phone', 'address', 'caseDescription'];
            let isValid = true;
            
            requiredFields.forEach(field => {
                const input = document.getElementById(field);
                if (!data[field] || data[field].trim() === '') {
                    input.style.borderColor = '#ef4444';
                    input.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
                    isValid = false;
                } else {
                    input.style.borderColor = '#22c55e';
                    input.style.boxShadow = '0 0 0 3px rgba(34, 197, 94, 0.1)';
                }
            });
            
            if (!isValid) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }
            
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                document.getElementById('email').style.borderColor = '#ef4444';
                document.getElementById('email').style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            // Show loading state
            const submitBtn = quickContactForm.querySelector('.send-message-btn');
            const btnText = submitBtn.querySelector('.btn-text');
            const originalText = btnText.textContent;
            
            submitBtn.disabled = true;
            btnText.textContent = 'Sending...';
            submitBtn.style.background = '#9ca3af';
            
            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                console.log('Form submitted:', data);
                
                // Hide form and show success message
                quickContactForm.style.display = 'none';
                quickFormSuccess.style.display = 'block';
                
                showNotification('Message sent successfully!', 'success');
                
                // Reset form after showing success
                setTimeout(() => {
                    quickContactForm.reset();
                    quickContactForm.style.display = 'flex';
                    quickFormSuccess.style.display = 'none';
                    
                    // Reset button state
                    submitBtn.disabled = false;
                    btnText.textContent = originalText;
                    submitBtn.style.background = '#22c55e';
                    
                    // Reset form field styles
                    const inputs = quickContactForm.querySelectorAll('input, textarea');
                    inputs.forEach(input => {
                        input.style.borderColor = '#d1d5db';
                        input.style.boxShadow = 'none';
                    });
                }, 3000);
                
            }, 2000); // Simulate 2 second processing time
        });
    }
    
    // Notification system
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ'}</span>
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
            notification.style.opacity = '1';
        }, 10);
        
        const closeNotification = () => {
            notification.style.transform = 'translateX(100%)';
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        };
        
        notification.querySelector('.notification-close').addEventListener('click', closeNotification);
        
        setTimeout(closeNotification, 5000); // Auto close after 5 seconds
        
        // Real-time validation
        const inputs = quickContactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                if (this.hasAttribute('required') && !this.value.trim()) {
                    this.style.borderColor = '#ef4444';
                    this.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
                } else if (this.type === 'email' && this.value) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (emailRegex.test(this.value)) {
                        this.style.borderColor = '#22c55e';
                        this.style.boxShadow = '0 0 0 3px rgba(34, 197, 94, 0.1)';
                    } else {
                        this.style.borderColor = '#ef4444';
                        this.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
                    }
                } else if (this.value.trim()) {
                    this.style.borderColor = '#22c55e';
                    this.style.boxShadow = '0 0 0 3px rgba(34, 197, 94, 0.1)';
                } else {
                    this.style.borderColor = '#d1d5db';
                    this.style.boxShadow = 'none';
                }
            });
            
            input.addEventListener('focus', function() {
                this.style.borderColor = '#3b82f6';
                this.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
            });
        });
    }
    
    // Add form field animations
    const formInputs = document.querySelectorAll('.quick-contact-form input, .quick-contact-form textarea');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'translateY(-2px)';
            this.style.borderColor = '#3b82f6';
            this.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1), 0 4px 15px rgba(59, 130, 246, 0.1)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'translateY(0)';
            if (!this.value) {
                this.style.borderColor = '#d1d5db';
                this.style.boxShadow = 'none';
            }
        });
    });
    
    // Add keyboard navigation support
    document.addEventListener('keydown', function(e) {
        // ESC key to close modals
        if (e.key === 'Escape') {
            const modal = document.querySelector('.donation-modal');
            if (modal) {
                modal.querySelector('.modal-close').click();
            }
        }
        
        // Enter key on buttons
        if (e.key === 'Enter' && e.target.tagName === 'BUTTON') {
            e.target.click();
        }
        
        // Space key for scroll to top when focused
        if (e.key === ' ' && e.target === scrollToTopBtn) {
            e.preventDefault();
            scrollToTopBtn.click();
        }
    });
    
    // Add click functionality for contact options
    const contactOptions = document.querySelectorAll('.contact-option');
    contactOptions.forEach(option => {
        option.addEventListener('click', function() {
            const optionType = this.classList[1]; // whatsapp, instagram, phone, email, address
            
            switch(optionType) {
                case 'whatsapp':
                    window.open('https://wa.me/919876543210', '_blank');
                    break;
                case 'instagram':
                    window.open('https://instagram.com/srivinayakafoundation', '_blank');
                    break;
                case 'phone':
                    window.location.href = 'tel:+919876543210';
                    break;
                case 'email':
                    window.location.href = 'mailto:office@vinayaka.foundation';
                    break;
                case 'address':
                    window.open('https://maps.google.com/?q=No.6,+Dhanammal+Street,+Spurtank+Road,+Chetpet,+Chennai+600-031', '_blank');
                    break;
            }
            
            // Add click animation
            this.style.transform = 'scale(0.98)';
            this.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
            setTimeout(() => {
                this.style.transform = '';
                this.style.boxShadow = '';
            }, 150);
        });
        
        // Add hover effects for contact options
        option.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.02)';
            this.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
        });
        
        option.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
        });
    });
    
    // Add performance optimizations
    // Debounce scroll events
    let scrollTimeout;
    const originalScrollHandler = window.onscroll;
    
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        
        scrollTimeout = setTimeout(() => {
            // Scroll-dependent animations here
        }, 10);
    }, { passive: true });
    
    // Preload images for better performance
    const imageUrls = [
        '/rectangle-4.png',
        '/rectangle-5.png',
        '/rectangle-6.png',
        '/rectangle-7.png',
        '/rectangle-11.png',
        '/rectangle-12.png',
        '/rectangle-13.png',
        '/rectangle-16.png'
    ];
    
    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
    
    // Add reduced motion support
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
        // Disable animations for users who prefer reduced motion
        const style = document.createElement('style');
        style.textContent = `
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
                scroll-behavior: auto !important;
            }
        `;
        document.head.appendChild(style);
    }
});