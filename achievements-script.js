// Achievements page specific JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Category filtering functionality
    const categoryButtons = document.querySelectorAll('.category-btn');
    const achievementCards = document.querySelectorAll('.achievement-card');
    const categorySections = document.querySelectorAll('.category-section');
    const achievementsGrid = document.querySelector('.achievements-grid');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get selected category
            const selectedCategory = this.getAttribute('data-category');
            
            // Hide all category sections
            categorySections.forEach(section => {
                section.classList.remove('active');
            });
            
            // Show selected category section
            const targetSection = document.querySelector(`.category-section[data-category="${selectedCategory}"]`);
            if (targetSection) {
                targetSection.classList.add('active');
                // Hide the main grid when showing category sections
                achievementsGrid.style.display = 'none';
            } else {
                // If no specific section found, show all cards in main grid
                achievementsGrid.style.display = 'grid';
            }
            
            // Special case for "all" or when no category sections exist
            if (selectedCategory === 'all' || !targetSection) {
                categorySections.forEach(section => {
                    section.classList.remove('active');
                });
                achievementsGrid.style.display = 'grid';
            }
            
            // Add animation effect
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            console.log('Selected category:', selectedCategory);
        });
    });
    
    // Donate button functionality for achievement cards
    const donateButtons = document.querySelectorAll('.donate-btn-card');
    
    donateButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Add click animation
            this.style.transform = 'translateX(-50%) scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'translateX(-50%) translateY(0)';
            }, 150);
            
            // Here you would typically redirect to a donation page
            console.log('Donate button clicked');
            alert('Thank you for your interest in donating! This would redirect to a donation page.');
        });
    });
    
    // Scroll animations for stats
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Animate numbers
                const numberElement = entry.target.querySelector('.stat-number');
                if (numberElement) {
                    animateNumber(numberElement);
                }
            }
        });
    }, observerOptions);
    
    // Observe stat cards
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
    
    // Number animation function
    function animateNumber(element) {
        const text = element.textContent;
        const hasLakh = text.includes('Lakh');
        const hasCr = text.includes('Cr');
        const hasRupee = text.includes('₹');
        
        // Extract number
        let numberStr = text.replace(/[^\d.]/g, '');
        let targetNumber = parseFloat(numberStr);
        
        if (isNaN(targetNumber)) return;
        
        let currentNumber = 0;
        const increment = targetNumber / 50; // 50 steps
        const duration = 1500; // 1.5 seconds
        const stepTime = duration / 50;
        
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
    
    // Achievement cards hover effects
    achievementCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Smooth scroll for any anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add loading animation
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    window.addEventListener('load', function() {
        document.body.style.opacity = '1';
    });
    
    // Initialize with first category active
    const firstCategoryBtn = document.querySelector('.category-btn.active');
    if (firstCategoryBtn) {
        const firstCategory = firstCategoryBtn.getAttribute('data-category');
        const firstSection = document.querySelector(`.category-section[data-category="${firstCategory}"]`);
        if (firstSection) {
            firstSection.classList.add('active');
            achievementsGrid.style.display = 'none';
        }
    }
});