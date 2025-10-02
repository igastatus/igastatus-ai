// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initClock();
    initFlightStats();
    initScrollEffects();
    initLiveATC();
});

// Real-time clock
function initClock() {
    const clockElement = document.getElementById('local-time');
    
    function updateClock() {
        const now = new Date();
        const options = {
            timeZone: 'Europe/Istanbul',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        };
        clockElement.textContent = now.toLocaleTimeString('en-US', options);
    }
    
    updateClock();
    setInterval(updateClock, 1000);
}

// Flight statistics
function initFlightStats() {
    // Simulate real-time flight counts
    // In production, these would come from an API
    const arrivalsElement = document.getElementById('arrivals-count');
    const departuresElement = document.getElementById('departures-count');
    
    // Random numbers for demo - replace with actual API calls
    const arrivals = Math.floor(Math.random() * 100) + 300;
    const departures = Math.floor(Math.random() * 100) + 300;
    
    animateCounter(arrivalsElement, 0, arrivals, 2000);
    animateCounter(departuresElement, 0, departures, 2000);
    
    // Update every 5 minutes
    setInterval(() => {
        const newArrivals = Math.floor(Math.random() * 100) + 300;
        const newDepartures = Math.floor(Math.random() * 100) + 300;
        animateCounter(arrivalsElement, arrivals, newArrivals, 1000);
        animateCounter(departuresElement, departures, newDepartures, 1000);
    }, 300000);
}

// Counter animation
function animateCounter(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 16);
}

// Scroll effects
function initScrollEffects() {
    // Navbar background on scroll
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        }
    });
    
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(section);
    });
}

// Auto-play Live ATC
function initLiveATC() {
    // Wait for the embed to load and try to auto-play
    setTimeout(() => {
        const atcEmbed = document.querySelector('.atc-container embed');
        if (atcEmbed) {
            // Try to find and click play button if available
            try {
                const contentWindow = atcEmbed.contentWindow || atcEmbed.contentDocument;
                if (contentWindow) {
                    const playButton = contentWindow.document.querySelector('button[aria-label="Play"]') || 
                                     contentWindow.document.querySelector('.play-button');
                    if (playButton) {
                        playButton.click();
                    }
                }
            } catch (e) {
                // Cross-origin restriction, can't auto-play
                console.log('ATC auto-play not available due to cross-origin restrictions');
            }
        }
    }, 3000);
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Handle CheckWX widget initialization
window.addEventListener('load', () => {
    // CheckWX widgets will auto-initialize with their script
    console.log('CheckWX widgets loaded');
});

// Error handling for external scripts
window.addEventListener('error', (e) => {
    // Silently handle external script errors
    if (e.target.tagName === 'SCRIPT' || e.target.tagName === 'IFRAME') {
        e.preventDefault();
    }
}, true);
