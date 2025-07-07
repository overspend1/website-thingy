// Enhanced Contact Button Animations
class ContactAnimations {
    constructor() {
        this.init();
    }

    init() {
        this.setupContactButtons();
        this.setupHoverEffects();
        this.setupClickEffects();
    }

    setupContactButtons() {
        const contactButtons = document.querySelectorAll(".contact-btn");
        
        contactButtons.forEach((btn, index) => {
            // Staggered entrance animation
            btn.style.opacity = "0";
            btn.style.transform = "translateY(30px)";
            
            setTimeout(() => {
                btn.style.transition = "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)";
                btn.style.opacity = "1";
                btn.style.transform = "translateY(0)";
            }, index * 200);

            // Add unique color themes
            this.addButtonTheme(btn);
        });
    }

    addButtonTheme(btn) {
        const themes = {
            "email-btn": {
                color: "#ff6b6b",
                shadow: "rgba(255, 107, 107, 0.3)"
            },
            "github-btn": {
                color: "#00ff88",
                shadow: "rgba(0, 255, 136, 0.3)"
            },
            "telegram-btn": {
                color: "#00ccff",
                shadow: "rgba(0, 204, 255, 0.3)"
            }
        };

        const theme = themes[btn.id];
        if (theme) {
            btn.addEventListener("mouseenter", () => {
                btn.style.borderColor = theme.color;
                btn.style.boxShadow = `0 15px 35px ${theme.shadow}`;
                btn.style.background = `${theme.color}20`;
            });

            btn.addEventListener("mouseleave", () => {
                btn.style.borderColor = "rgba(255, 255, 255, 0.1)";
                btn.style.boxShadow = "none";
                btn.style.background = "rgba(255, 255, 255, 0.05)";
            });
        }
    }

    setupHoverEffects() {
        const contactButtons = document.querySelectorAll(".contact-btn");
        
        contactButtons.forEach(btn => {
            btn.addEventListener("mouseenter", () => {
                this.createParticles(btn);
                this.addGlowEffect(btn);
            });

            btn.addEventListener("mouseleave", () => {
                this.removeGlowEffect(btn);
            });
        });
    }

    createParticles(button) {
        const rect = button.getBoundingClientRect();
        const particleCount = 6;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement("div");
            particle.className = "contact-particle";
            
            particle.style.cssText = `
                position: fixed;
                width: 4px;
                height: 4px;
                background: #00ff88;
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                left: ${rect.left + Math.random() * rect.width}px;
                top: ${rect.top + Math.random() * rect.height}px;
                animation: particleBurst 0.8s ease-out forwards;
            `;

            document.body.appendChild(particle);

            setTimeout(() => {
                particle.remove();
            }, 800);
        }

        // Add particle animation
        if (!document.getElementById("particle-styles")) {
            const style = document.createElement("style");
            style.id = "particle-styles";
            style.textContent = `
                @keyframes particleBurst {
                    0% {
                        opacity: 1;
                        transform: scale(1) translate(0, 0);
                    }
                    100% {
                        opacity: 0;
                        transform: scale(0) translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px);
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    addGlowEffect(button) {
        const icon = button.querySelector(".contact-icon");
        if (icon) {
            icon.style.transform = "scale(1.2) rotate(10deg)";
            icon.style.filter = "drop-shadow(0 0 15px currentColor)";
        }

        const text = button.querySelector(".contact-text");
        if (text) {
            text.style.transform = "translateX(5px)";
        }
    }

    removeGlowEffect(button) {
        const icon = button.querySelector(".contact-icon");
        if (icon) {
            icon.style.transform = "scale(1) rotate(0deg)";
            icon.style.filter = "drop-shadow(0 0 10px currentColor)";
        }

        const text = button.querySelector(".contact-text");
        if (text) {
            text.style.transform = "translateX(0)";
        }
    }

    setupClickEffects() {
        const contactButtons = document.querySelectorAll(".contact-btn");
        
        contactButtons.forEach(btn => {
            btn.addEventListener("click", (e) => {
                this.createClickRipple(e, btn);
                this.addClickAnimation(btn);
            });
        });
    }

    createClickRipple(event, button) {
        const rect = button.getBoundingClientRect();
        const ripple = document.createElement("div");
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(0, 255, 136, 0.3);
            border-radius: 50%;
            pointer-events: none;
            animation: rippleEffect 0.6s ease-out;
            z-index: 0;
        `;

        button.style.position = "relative";
        button.appendChild(ripple);

        // Add ripple animation
        if (!document.getElementById("ripple-styles")) {
            const style = document.createElement("style");
            style.id = "ripple-styles";
            style.textContent = `
                @keyframes rippleEffect {
                    0% {
                        transform: scale(0);
                        opacity: 1;
                    }
                    100% {
                        transform: scale(2);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    addClickAnimation(button) {
        button.style.transform = "scale(0.95)";
        
        setTimeout(() => {
            button.style.transform = "";
        }, 150);

        // Success feedback
        this.showSuccessFeedback(button);
    }

    showSuccessFeedback(button) {
        const feedback = document.createElement("div");
        feedback.textContent = "✓ Opening...";
        feedback.style.cssText = `
            position: absolute;
            top: -40px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 255, 136, 0.9);
            color: #000;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 500;
            white-space: nowrap;
            pointer-events: none;
            animation: feedbackPop 2s ease-out forwards;
            z-index: 1001;
        `;

        button.style.position = "relative";
        button.appendChild(feedback);

        // Add feedback animation
        if (!document.getElementById("feedback-styles")) {
            const style = document.createElement("style");
            style.id = "feedback-styles";
            style.textContent = `
                @keyframes feedbackPop {
                    0% {
                        opacity: 0;
                        transform: translateX(-50%) translateY(10px) scale(0.8);
                    }
                    20% {
                        opacity: 1;
                        transform: translateX(-50%) translateY(0) scale(1);
                    }
                    80% {
                        opacity: 1;
                        transform: translateX(-50%) translateY(0) scale(1);
                    }
                    100% {
                        opacity: 0;
                        transform: translateX(-50%) translateY(-10px) scale(0.8);
                    }
                }
            `;
            document.head.appendChild(style);
        }

        setTimeout(() => {
            feedback.remove();
        }, 2000);
    }
}

// Enhanced contact section scroll reveal
class ContactScrollReveal {
    constructor() {
        this.init();
    }

    init() {
        this.observeContactSection();
    }

    observeContactSection() {
        const contactSection = document.getElementById("contact");
        
        if (!contactSection) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateContactReveal();
                    observer.disconnect();
                }
            });
        }, { threshold: 0.3 });

        observer.observe(contactSection);
    }

    animateContactReveal() {
        const contactContent = document.querySelector(".contact-content");
        const contactButtons = document.querySelectorAll(".contact-btn");

        // Animate content container
        if (contactContent) {
            contactContent.style.opacity = "0";
            contactContent.style.transform = "translateY(30px)";
            
            setTimeout(() => {
                contactContent.style.transition = "all 0.8s ease";
                contactContent.style.opacity = "1";
                contactContent.style.transform = "translateY(0)";
            }, 200);
        }

        // Staggered button animations
        contactButtons.forEach((btn, index) => {
            btn.style.opacity = "0";
            btn.style.transform = "translateY(50px) scale(0.9)";
            
            setTimeout(() => {
                btn.style.transition = "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)";
                btn.style.opacity = "1";
                btn.style.transform = "translateY(0) scale(1)";
            }, 400 + index * 150);
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    new ContactAnimations();
    new ContactScrollReveal();
});

