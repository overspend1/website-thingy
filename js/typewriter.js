// Enhanced Typewriter Effect with Authentic Hobbyist Sequence
class TypewriterEffect {
    constructor(element, texts, options = {}) {
        this.element = element;
        this.texts = texts;
        this.speed = options.speed || 100;
        this.deleteSpeed = options.deleteSpeed || 50;
        this.pauseDuration = options.pauseDuration || 1000;
        this.currentIndex = 0;
        this.currentText = '';
        this.isDeleting = false;
        this.start();
    }

    start() {
        this.type();
    }

    type() {
        const fullText = this.texts[this.currentIndex];
        
        if (this.isDeleting) {
            this.currentText = fullText.substring(0, this.currentText.length - 1);
        } else {
            this.currentText = fullText.substring(0, this.currentText.length + 1);
        }

        this.element.textContent = this.currentText;

        let typeSpeed = this.speed;
        if (this.isDeleting) {
            typeSpeed = this.deleteSpeed;
        }

        if (!this.isDeleting && this.currentText === fullText) {
            typeSpeed = this.pauseDuration;
            this.isDeleting = true;
        } else if (this.isDeleting && this.currentText === '') {
            this.isDeleting = false;
            this.currentIndex = (this.currentIndex + 1) % this.texts.length;
            typeSpeed = 200;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// Initialize typewriter on page load
document.addEventListener('DOMContentLoaded', function() {
    const typewriterElement = document.getElementById('typewriter');
    if (typewriterElement) {
        const texts = [
            'Hobby Programmer',
            'Home Lab Enthusiast', 
            'Weekend Tinkerer',
            'Tech Explorer',
            'ROM Experimenter'
        ];
        
        new TypewriterEffect(typewriterElement, texts, {
            speed: 100,
            deleteSpeed: 50,
            pauseDuration: 2000
        });
    }
});

