// Enhanced animations and interactions
document.addEventListener('DOMContentLoaded', function() {
    // Boot sequence animation for tech stack
    function initBootSequence() {
        const techHexagons = document.querySelectorAll('.tech-hexagon');
        techHexagons.forEach((hexagon, index) => {
            hexagon.style.opacity = '0';
            hexagon.style.transform = 'scale(0.8)';
            
            setTimeout(() => {
                hexagon.style.transition = 'all 0.3s ease';
                hexagon.style.opacity = '1';
                hexagon.style.transform = 'scale(1)';
                hexagon.classList.add('animate-in');
            }, index * 50);
        });
    }

    // Observe tech stack section for boot sequence
    const techStackSection = document.getElementById('tech-stack');
    if (techStackSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(initBootSequence, 300);
                    observer.disconnect();
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(techStackSection);
    }

    // Enhanced hover effects for buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroSection = document.getElementById('hero');
        
        if (heroSection && scrolled < window.innerHeight) {
            heroSection.style.transform = 'translateY(' + scrolled * 0.5 + 'px)';
        }
    });

    // Dynamic cursor for tech hexagons
    const techHexagons = document.querySelectorAll('.tech-hexagon');
    techHexagons.forEach(hexagon => {
        hexagon.addEventListener('mouseenter', function() {
            document.body.style.cursor = 'pointer';
        });
        
        hexagon.addEventListener('mouseleave', function() {
            document.body.style.cursor = 'default';
        });
    });
});

