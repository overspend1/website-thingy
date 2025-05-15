// Loading Skeleton
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.getElementById('skeleton-overlay').classList.add('hide');
        // Fix the progress bar calculation (66/140 = 48.88%)
        const fill = document.getElementById('progress-fill');
        if (fill) {
            fill.style.width = '48.88%';
        }
    }, 900);
    
    // Create stars animation - only if not mobile
    if (window.innerWidth > 600) {
        createStars();
    } else {
        // Create fewer stars for mobile
        createStars(true);
    }
    
    // Initialize animations
    initializeAnimations();
});

// Theme Toggle - Fixed
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light');
        themeToggle.innerHTML = document.body.classList.contains('light')
            ? '<i class="fas fa-sun"></i>'
            : '<i class="fas fa-moon"></i>';
        
        // Update status indicator color based on theme
        const statusIndicator = document.querySelector('.status-indicator');
        if (statusIndicator) {
            if (document.body.classList.contains('light')) {
                statusIndicator.style.background = '#111216';
            } else {
                statusIndicator.style.background = '#fafafa';
            }
        }
        
        // Recreate stars for theme change
        setTimeout(createStars, 300);
    });
}

// Mobile Nav Toggle - Enhanced with error handling
const sidebar = document.getElementById('sidebar');
const mobileNavToggle = document.getElementById('mobile-nav-toggle');
if (mobileNavToggle && sidebar) {
    mobileNavToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });
    
    // Close sidebar when clicking outside
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 1024 && sidebar.classList.contains('active')) {
            if (!sidebar.contains(e.target) && !mobileNavToggle.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        }
    });
}

// Scroll To Top Button - Enhanced
const scrollBtn = document.getElementById('scroll-top-btn');
if (scrollBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 200) {
            scrollBtn.classList.add('show');
        } else {
            scrollBtn.classList.remove('show');
        }
    });
    
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Copy crypto address to clipboard - With better error handling
document.querySelectorAll('.crypto-address').forEach(el => {
    el.addEventListener('click', function() {
        const address = this.getAttribute('data-address');
        if (address) {
            try {
                navigator.clipboard.writeText(address).then(() => {
                    this.classList.add('copied');
                    setTimeout(() => this.classList.remove('copied'), 1800);
                }).catch(err => {
                    console.error('Could not copy text: ', err);
                    showNotification('Failed to copy. Please try manually selecting and copying the address.');
                });
            } catch (err) {
                // Fallback for browsers that don't support clipboard API
                const textarea = document.createElement('textarea');
                textarea.value = address;
                textarea.style.position = 'fixed';
                document.body.appendChild(textarea);
                textarea.select();
                try {
                    document.execCommand('copy');
                    this.classList.add('copied');
                    setTimeout(() => this.classList.remove('copied'), 1800);
                } catch (e) {
                    showNotification('Failed to copy. Please try manually selecting and copying the address.');
                }
                document.body.removeChild(textarea);
            }
        }
    });
});

// Copy text to clipboard function
function copyToClipboard(text) {
    try {
        navigator.clipboard.writeText(text);
    } catch (err) {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }
}

// Notification helper function
function showNotification(message, duration = 3000) {
    const notification = document.getElementById('notification');
    if (notification) {
        notification.textContent = message;
        notification.classList.add('show');
        setTimeout(() => notification.classList.remove('show'), duration);
    }
}

// Create animated stars background - Enhanced and optimized for mobile
function createStars(isMobile = false) {
    const starsContainer = document.getElementById('stars-container');
    if (!starsContainer) return;
    
    // Significantly reduce stars and animations on mobile for better performance
    const starsCount = isMobile ? 50 : 250;
    
    // Clear any existing stars
    starsContainer.innerHTML = '';
    
    // Use document fragment for better performance
    const fragment = document.createDocumentFragment();
    
    for (let i = 0; i < starsCount; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        
        // Random position
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        
        // Random size (0.5px to 3px)
        const size = 0.5 + Math.random() * 2.5;
        
        // Apply styles
        star.style.left = `${x}px`;
        star.style.top = `${y}px`;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        
        // Random opacity
        star.style.opacity = 0.2 + Math.random() * 0.8;
        
        // Only add animation to some stars, and none on mobile
        if (!isMobile && i % 5 === 0) { // Even more limited - only 20% of stars twinkle
            const animationDuration = 1 + Math.random() * 3;
            star.style.animation = `twinkle ${animationDuration}s infinite alternate`;
        }
        
        // Add to fragment
        fragment.appendChild(star);
    }
    
    // Add all stars at once
    starsContainer.appendChild(fragment);
    
    // Add shooting stars - but not on mobile
    if (!isMobile) {
        // Limit to just 1 shooting star for better performance
        setTimeout(() => createShootingStar(), 2000);
    }
    
    // Add twinkle keyframes dynamically if not already added
    if (!document.getElementById('twinkle-animation')) {
        const style = document.createElement('style');
        style.id = 'twinkle-animation';
        style.textContent = `
            @keyframes twinkle {
                0% { opacity: 0.2; transform: scale(1); }
                50% { opacity: 0.8; transform: scale(1.2); }
                100% { opacity: 1; transform: scale(1); }
            }
        `;
        document.head.appendChild(style);
    }
}

// Create shooting stars at random intervals - Optimized
function createShootingStar() {
    // Don't create shooting stars on mobile
    if (window.innerWidth <= 600) return;
    
    const starsContainer = document.getElementById('stars-container');
    if (!starsContainer) return;
    
    const shootingStar = document.createElement('div');
    shootingStar.classList.add('shooting-star');
    
    // Random position and size
    const length = 50 + Math.random() * 100;
    shootingStar.style.width = `${length}px`;
    
    // Randomize starting position
    const startX = Math.random() * window.innerWidth;
    const startY = Math.random() * window.innerHeight * 0.7;
    shootingStar.style.left = `${startX}px`;
    shootingStar.style.top = `${startY}px`;
    
    // Randomize animation duration
    const duration = 2 + Math.random() * 4;
    shootingStar.style.animation = `shooting ${duration}s linear`;
    
    starsContainer.appendChild(shootingStar);
    
    // Remove after animation completes
    setTimeout(() => {
        if (shootingStar.parentNode === starsContainer) {
            starsContainer.removeChild(shootingStar);
        }
        
        // Create new shooting star with longer delay on mobile
        const nextStarDelay = 5000 + Math.random() * 5000; // 5-10 second delay
        setTimeout(createShootingStar, nextStarDelay);
    }, duration * 1000);
}

// Initialize animations with IntersectionObserver for better performance
function initializeAnimations() {
    // Use a simpler animation approach on mobile
    if (window.innerWidth <= 600) {
        // Just add the animate-in class with some delay
        document.querySelectorAll('section').forEach((section, index) => {
            setTimeout(() => {
                section.classList.add('animate-in');
            }, index * 150);
        });
        return;
    }
    
    // Use IntersectionObserver on desktop
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -10% 0px' // Trigger slightly before element comes into view
        });
        
        document.querySelectorAll('section').forEach(section => {
            section.classList.remove('animate-in');
            observer.observe(section);
        });
    }
}

// Function to adjust crypto addresses for different screen sizes
function adjustCryptoAddresses() {
    const cryptoAddresses = document.querySelectorAll('.crypto-address .address');
    const isMobile = window.innerWidth <= 600;
    
    cryptoAddresses.forEach(addressElement => {
        const fullAddress = addressElement.getAttribute('data-full-address') || addressElement.textContent;
        
        // Store full address if we haven't already
        if (!addressElement.getAttribute('data-full-address')) {
            addressElement.setAttribute('data-full-address', fullAddress);
        }
        
        // Truncate addresses on mobile
        if (isMobile) {
            const truncated = fullAddress.substring(0, 6) + '...' + 
                             fullAddress.substring(fullAddress.length - 4);
            addressElement.textContent = truncated;
        } else {
            addressElement.textContent = fullAddress;
        }
    });
}

// Call on load with throttling
window.addEventListener('DOMContentLoaded', () => {
    // Delay non-critical operations
    setTimeout(() => {
        adjustCryptoAddresses();
    }, 1000);
});
