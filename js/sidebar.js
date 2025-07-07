// Glass Sidebar Functionality
class GlassSidebar {
    constructor() {
        this.sidebar = document.getElementById("glass-sidebar");
        this.overlay = document.getElementById("sidebar-overlay");
        this.toggleBtn = document.getElementById("sidebar-toggle");
        this.closeBtn = document.getElementById("sidebar-close");
        this.mainContent = document.querySelector(".main-content");
        this.sidebarLinks = document.querySelectorAll(".sidebar-link");
        this.isOpen = false;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateActiveLink();
        this.handleScroll();
    }

    bindEvents() {
        // Toggle sidebar
        this.toggleBtn?.addEventListener("click", () => this.toggleSidebar());
        this.closeBtn?.addEventListener("click", () => this.closeSidebar());
        this.overlay?.addEventListener("click", () => this.closeSidebar());

        // Sidebar links
        this.sidebarLinks.forEach(link => {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                const targetId = link.getAttribute("href");
                this.navigateToSection(targetId);
                this.closeSidebar();
            });
        });

        // Close sidebar on escape key
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && this.isOpen) {
                this.closeSidebar();
            }
        });

        // Handle scroll to update active link
        window.addEventListener("scroll", () => {
            this.updateActiveLink();
        });

        // Handle resize
        window.addEventListener("resize", () => {
            if (window.innerWidth > 768 && this.isOpen) {
                this.closeSidebar();
            }
        });
    }

    toggleSidebar() {
        if (this.isOpen) {
            this.closeSidebar();
        } else {
            this.openSidebar();
        }
    }

    openSidebar() {
        this.isOpen = true;
        this.sidebar?.classList.add("active");
        this.overlay?.classList.add("active");
        this.toggleBtn?.classList.add("active");
        this.mainContent?.classList.add("sidebar-open");
        
        // Prevent body scroll
        document.body.style.overflow = "hidden";
        
        // Animate sidebar links
        this.animateLinks();
    }

    closeSidebar() {
        this.isOpen = false;
        this.sidebar?.classList.remove("active");
        this.overlay?.classList.remove("active");
        this.toggleBtn?.classList.remove("active");
        this.mainContent?.classList.remove("sidebar-open");
        
        // Restore body scroll
        document.body.style.overflow = "";
    }

    animateLinks() {
        this.sidebarLinks.forEach((link, index) => {
            link.style.transform = "translateX(-20px)";
            link.style.opacity = "0";
            
            setTimeout(() => {
                link.style.transition = "all 0.3s ease";
                link.style.transform = "translateX(0)";
                link.style.opacity = "1";
            }, index * 50 + 200);
        });
    }

    navigateToSection(targetId) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const offsetTop = targetElement.offsetTop;
            window.scrollTo({
                top: offsetTop,
                behavior: "smooth"
            });
        }
    }

    updateActiveLink() {
        const sections = document.querySelectorAll("section[id]");
        const scrollPos = window.scrollY + 100;

        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = section.getAttribute("id");

            if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
                // Remove active class from all links
                this.sidebarLinks.forEach(link => {
                    link.classList.remove("active");
                });

                // Add active class to current section link
                const activeLink = document.querySelector(`[data-section="${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add("active");
                }
            }
        });
    }

    handleScroll() {
        let ticking = false;

        const updateScrollEffects = () => {
            const scrollY = window.scrollY;
            
            // Update toggle button opacity based on scroll
            if (this.toggleBtn) {
                const opacity = Math.max(0.7, 1 - scrollY / 1000);
                this.toggleBtn.style.opacity = opacity;
            }

            ticking = false;
        };

        window.addEventListener("scroll", () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollEffects);
                ticking = true;
            }
        });
    }
}

// Enhanced sidebar interactions
class SidebarEnhancements {
    constructor() {
        this.init();
    }

    init() {
        this.addHoverEffects();
        this.addGlowEffects();
        this.addSoundEffects();
    }

    addHoverEffects() {
        const sidebarLinks = document.querySelectorAll(".sidebar-link");
        
        sidebarLinks.forEach(link => {
            link.addEventListener("mouseenter", () => {
                this.createRipple(link);
            });
        });
    }

    createRipple(element) {
        const ripple = document.createElement("span");
        ripple.className = "ripple-effect";
        ripple.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: rgba(0, 255, 136, 0.3);
            transform: translate(-50%, -50%);
            animation: rippleAnimation 0.6s ease-out;
            pointer-events: none;
            z-index: 0;
        `;

        // Add ripple animation
        const style = document.createElement("style");
        style.textContent = `
            @keyframes rippleAnimation {
                to {
                    width: 100px;
                    height: 100px;
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);

        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    addGlowEffects() {
        const sidebar = document.getElementById("glass-sidebar");
        
        if (sidebar) {
            sidebar.addEventListener("mouseenter", () => {
                sidebar.style.borderRight = "1px solid rgba(0, 255, 136, 0.3)";
            });

            sidebar.addEventListener("mouseleave", () => {
                sidebar.style.borderRight = "1px solid rgba(0, 255, 136, 0.1)";
            });
        }
    }

    addSoundEffects() {
        // Add subtle visual feedback for interactions
        const interactiveElements = document.querySelectorAll(".sidebar-link, .sidebar-toggle, .social-link");
        
        interactiveElements.forEach(element => {
            element.addEventListener("click", () => {
                element.style.transform = "scale(0.95)";
                setTimeout(() => {
                    element.style.transform = "";
                }, 150);
            });
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    new GlassSidebar();
    new SidebarEnhancements();
});

// Add glass effect based on scroll
window.addEventListener("scroll", () => {
    const sidebar = document.getElementById("glass-sidebar");
    const scrollY = window.scrollY;
    
    if (sidebar) {
        const blurAmount = Math.min(20 + scrollY / 50, 30);
        sidebar.style.backdropFilter = `blur(${blurAmount}px)`;
        sidebar.style.webkitBackdropFilter = `blur(${blurAmount}px)`;
    }
});

