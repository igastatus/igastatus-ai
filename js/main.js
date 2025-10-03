// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initClock();
    initFlightStats();
    initScrollEffects();
    initLazyLoading();
    initLiveATC();
});

// Lazy Loading with Intersection Observer
function initLazyLoading() {
    const lazyLoadOptions = {
        root: null,
        rootMargin: '200px', // Start loading 200px before element is visible
        threshold: 0.01
    };

    // Lazy load iframe containers
    const lazyContainers = document.querySelectorAll('.lazy-load-container');
    const containerObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const container = entry.target;
                const src = container.getAttribute('data-src');
                
                if (src && !container.getAttribute('data-loaded')) {
                    // Determine height based on container
                    let height = '700';
                    if (container.classList.contains('weather-map')) {
                        height = '500';
                    }
                    
                    const iframe = document.createElement('iframe');
                    iframe.src = src;
                    iframe.width = '100%';
                    iframe.height = height;
                    iframe.frameBorder = '0';
                    iframe.classList.add('lazy-iframe');
                    iframe.title = container.closest('section').querySelector('.section-title').textContent;
                    
                    // Add iframe after loading placeholder
                    container.appendChild(iframe);
                    container.setAttribute('data-loaded', 'true');
                    
                    // Remove placeholder after iframe loads
                    iframe.addEventListener('load', () => {
                        setTimeout(() => {
                            const placeholder = container.querySelector('.loading-placeholder');
                            if (placeholder) {
                                placeholder.style.opacity = '0';
                                placeholder.style.transition = 'opacity 0.3s';
                                setTimeout(() => placeholder.remove(), 300);
                            }
                        }, 500);
                    });
                    
                    observer.unobserve(container);
                }
            }
        });
    }, lazyLoadOptions);

    lazyContainers.forEach(container => containerObserver.observe(container));

    // Lazy load flight widgets
    const lazyWidgets = document.querySelectorAll('.lazy-load-widget');
    const widgetObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const widget = entry.target;
                const airport = widget.getAttribute('data-airport');
                const type = widget.getAttribute('data-type');
                
                if (airport && type && !widget.getAttribute('data-loaded')) {
                    // Create script element
                    const script = document.createElement('script');
                    script.src = `https://fids.flightradar.live/widgets/airport/${airport}/${type}`;
                    script.async = true;
                    
                    script.addEventListener('load', () => {
                        setTimeout(() => {
                            const placeholder = widget.querySelector('.loading-placeholder');
                            if (placeholder) {
                                placeholder.style.opacity = '0';
                                placeholder.style.transition = 'opacity 0.3s';
                                setTimeout(() => placeholder.remove(), 300);
                            }
                        }, 1000);
                    });
                    
                    widget.appendChild(script);
                    widget.setAttribute('data-loaded', 'true');
                    
                    observer.unobserve(widget);
                }
            }
        });
    }, lazyLoadOptions);

    lazyWidgets.forEach(widget => widgetObserver.observe(widget));
}

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
