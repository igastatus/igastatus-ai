// ====================================
// IGASTATUS - Main JavaScript
// Istanbul Airport Flight Tracker
// ====================================

(function() {
    'use strict';

    // ====================================
    // Local Time Display
    // ====================================
    function updateLocalTime() {
        const timeElement = document.getElementById('local-time');
        if (!timeElement) return;

        const now = new Date();
        const options = {
            timeZone: 'Europe/Istanbul',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        };

        const istanbulTime = now.toLocaleTimeString('en-US', options);
        timeElement.textContent = istanbulTime;
    }

    // Update time every second
    updateLocalTime();
    setInterval(updateLocalTime, 1000);

    // ====================================
    // Lazy Loading for Heavy Widgets
    // ====================================
    const lazyLoadObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const container = entry.target;
                const src = container.getAttribute('data-src');

                if (src && !container.querySelector('iframe')) {
                    // Create and insert iframe
                    const iframe = document.createElement('iframe');
                    iframe.src = src;
                    iframe.width = '100%';
                    iframe.height = '100%';
                    iframe.frameBorder = '0';
                    iframe.loading = 'lazy';
                    iframe.setAttribute('importance', 'low');

                    // Remove loading placeholder
                    const placeholder = container.querySelector('.loading-placeholder');
                    if (placeholder) {
                        placeholder.style.opacity = '0';
                        placeholder.style.transition = 'opacity 0.3s';

                        setTimeout(() => {
                            container.innerHTML = '';
                            container.appendChild(iframe);
                        }, 300);
                    } else {
                        container.appendChild(iframe);
                    }

                    observer.unobserve(container);
                }
            }
        });
    }, {
        rootMargin: '200px' // Increased for better mobile experience
    });

    // Observe all lazy-load containers
    document.querySelectorAll('.lazy-load-container').forEach(container => {
        lazyLoadObserver.observe(container);
    });

    // ====================================
    // Lazy Loading for Flight Widgets
    // ====================================
    const flightWidgetObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const widget = entry.target;
                const airport = widget.getAttribute('data-airport');
                const type = widget.getAttribute('data-type');

                if (airport && type && !widget.querySelector('script')) {
                    // Create and insert flight widget script
                    const script = document.createElement('script');
                    script.src = `https://fids.flightradar.live/widgets/airport/${airport}/${type}`;
                    script.async = true;

                    script.onload = () => {
                        const placeholder = widget.querySelector('.loading-placeholder');
                        if (placeholder) {
                            placeholder.style.display = 'none';
                        }
                    };

                    widget.appendChild(script);
                    observer.unobserve(widget);
                }
            }
        });
    }, {
        rootMargin: '200px'
    });

    // Observe all flight widgets
    document.querySelectorAll('.lazy-load-widget').forEach(widget => {
        flightWidgetObserver.observe(widget);
    });

    // ====================================
    // Smooth Scroll for Navigation
    // ====================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ====================================
    // Navbar Scroll Effect - Optimized for Mobile
    // ====================================
    let lastScroll = 0;
    let ticking = false;
    const navbar = document.querySelector('.navbar');

    // Check if on mobile
    const isMobile = () => window.innerWidth <= 768;

    function updateNavbar(currentScroll) {
        if (currentScroll <= 0) {
            navbar.classList.remove('navbar-scrolled');
            navbar.style.transform = 'translateY(0)';
            navbar.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.classList.add('navbar-scrolled');
            navbar.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.15)';

            // On mobile, hide navbar when scrolling down, show when scrolling up
            if (isMobile()) {
                if (currentScroll > lastScroll && currentScroll > 100) {
                    // Scrolling down & past threshold - hide navbar
                    navbar.style.transform = 'translateY(-100%)';
                } else if (currentScroll < lastScroll) {
                    // Scrolling up - show navbar
                    navbar.style.transform = 'translateY(0)';
                }
            }
        }

        lastScroll = currentScroll;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateNavbar(currentScroll);
            });
            ticking = true;
        }
    }, { passive: true });

    // ====================================
    // Flight Count Estimation
    // ====================================
    function estimateFlightCounts() {
        const arrivalsElement = document.getElementById('arrivals-count');
        const departuresElement = document.getElementById('departures-count');

        if (!arrivalsElement || !departuresElement) return;

        // Istanbul Airport handles approximately 500-600 flights per day
        const now = new Date();
        const hourOfDay = now.getHours();

        // Peak hours: 6-10 and 18-22
        let baseFlights = 250;
        if ((hourOfDay >= 6 && hourOfDay <= 10) || (hourOfDay >= 18 && hourOfDay <= 22)) {
            baseFlights = 350;
        } else if (hourOfDay >= 0 && hourOfDay <= 5) {
            baseFlights = 150;
        }

        const arrivals = baseFlights + Math.floor(Math.random() * 50);
        const departures = baseFlights + Math.floor(Math.random() * 50);

        animateValue(arrivalsElement, 0, arrivals, 2000);
        animateValue(departuresElement, 0, departures, 2000);
    }

    // ====================================
    // Animate Number Counter
    // ====================================
    function animateValue(element, start, end, duration) {
        let startTimestamp = null;

        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            element.textContent = value;

            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };

        window.requestAnimationFrame(step);
    }

    // Initial flight count estimation
    estimateFlightCounts();

    // Update flight counts every 5 minutes
    setInterval(estimateFlightCounts, 5 * 60 * 1000);

    // ====================================
    // Airport Status Check
    // ====================================
    function checkAirportStatus() {
        const statusBadge = document.querySelector('.status-badge');
        const statusText = document.querySelector('.status-text');
        const statusIcon = document.querySelector('.status-icon');

        if (!statusBadge || !statusText || !statusIcon) return;

        // Istanbul Airport operates 24/7, but activity varies
        const now = new Date();
        const hour = now.getHours();

        if (hour >= 1 && hour <= 5) {
            statusText.textContent = 'Low Activity';
            statusIcon.textContent = '🌙';
            statusBadge.style.background = 'linear-gradient(135deg, #f39c12, #e67e22)';
        } else {
            statusText.textContent = 'Airport Operational';
            statusIcon.textContent = '✈️';
            statusBadge.style.background = 'linear-gradient(135deg, #e74c3c, #c0392b)';
        }
    }

    checkAirportStatus();
    setInterval(checkAirportStatus, 10 * 60 * 1000); // Check every 10 minutes

    // ====================================
    // Performance Monitoring
    // ====================================
    if ('PerformanceObserver' in window) {
        // Monitor Largest Contentful Paint (LCP)
        const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
        });

        try {
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
            console.warn('LCP observation not supported');
        }
    }

    // ====================================
    // Error Handling for External Resources
    // ====================================
    window.addEventListener('error', (e) => {
        if (e.target.tagName === 'IFRAME') {
            console.warn('Failed to load iframe:', e.target.src);
            const container = e.target.parentElement;
            if (container && container.classList.contains('lazy-load-container')) {
                const placeholder = document.createElement('div');
                placeholder.className = 'loading-placeholder';
                placeholder.innerHTML = '<p style="color: #ef4444;">Failed to load content. Please refresh the page.</p>';
                container.innerHTML = '';
                container.appendChild(placeholder);
            }
        }
    }, true);

    // ====================================
    // Intersection Observer for Scroll Animations
    // ====================================
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Add animation classes to sections
    document.querySelectorAll('.section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        animationObserver.observe(section);
    });

    // ====================================
    // Console Welcome Message
    // ====================================
    console.log('%cIGASTATUS', 'font-size: 24px; font-weight: bold; color: #e74c3c;');
    console.log('%cIstanbul Airport Live Status', 'font-size: 14px; color: #6b7280;');
    console.log('%cMade with ❤️ for Aviation Enthusiasts', 'font-size: 12px; color: #f39c12;');
    console.log('%cGitHub: https://github.com/igastatus/igastatus-ai', 'font-size: 11px; color: #6b7280;');

    // ====================================
    // Live Activity Dashboard
    // ====================================
    function updateActivityDashboard() {
        const now = new Date();
        const hour = now.getHours();

        // Aircraft in air (simulated)
        const aircraftInAir = Math.floor(15 + Math.random() * 15 + (hour >= 6 && hour <= 22 ? 10 : 0));
        animateValue(document.getElementById('aircraft-in-air'), 0, aircraftInAir, 1500);

        // Hourly arrivals/departures
        let baseRate = 15;
        if ((hour >= 6 && hour <= 10) || (hour >= 18 && hour <= 22)) baseRate = 28;
        else if (hour >= 0 && hour <= 5) baseRate = 8;

        const arrivals = baseRate + Math.floor(Math.random() * 8);
        const departures = baseRate + Math.floor(Math.random() * 8);
        animateValue(document.getElementById('hourly-arrivals'), 0, arrivals, 1500);
        animateValue(document.getElementById('hourly-departures'), 0, departures, 1500);

        // Wind (simulated)
        const windSpeed = Math.floor(5 + Math.random() * 15);
        const windDeg = Math.floor(Math.random() * 360);
        animateValue(document.getElementById('wind-speed'), 0, windSpeed, 1500);

        const windArrow = document.getElementById('wind-arrow');
        if (windArrow) {
            windArrow.style.transform = `translate(-50%, -100%) rotate(${windDeg}deg)`;
        }

        const windDir = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(windDeg / 45)];
        const windDirection = document.getElementById('wind-direction');
        if (windDirection) windDirection.textContent = `Direction: ${windDir} (${windDeg}°)`;

        // Active runways based on wind
        const runways = document.querySelectorAll('.runway');
        runways.forEach(rw => rw.classList.remove('active'));

        if (windDeg >= 135 && windDeg <= 315) {
            // South wind - use 35L/35R
            document.querySelectorAll('[data-runway="35L"], [data-runway="35R"]').forEach(r => r.classList.add('active'));
        } else {
            // North wind - use 17L/17R
            document.querySelectorAll('[data-runway="17L"], [data-runway="17R"]').forEach(r => r.classList.add('active'));
        }

        // Terminal congestion
        const congestionLevels = ['Low', 'Normal', 'Moderate', 'High'];
        let congestionIndex = 1; // Normal
        if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) congestionIndex = 2;
        else if (hour >= 0 && hour <= 5) congestionIndex = 0;

        const congestionLevel = document.getElementById('congestion-level');
        const congestionBar = document.getElementById('congestion-bar');
        if (congestionLevel) congestionLevel.textContent = congestionLevels[congestionIndex];
        if (congestionBar) congestionBar.style.width = `${(congestionIndex + 1) * 25}%`;
    }

    // Initial update
    if (document.querySelector('.activity-dashboard')) {
        updateActivityDashboard();
        setInterval(updateActivityDashboard, 60000); // Update every minute
    }

    // ====================================
    // Debug Mode
    // ====================================
    if (window.location.search.includes('debug=true')) {
        document.body.style.border = '3px solid red';
        console.log('Debug mode enabled');
        console.log('Lazy load containers:', document.querySelectorAll('.lazy-load-container').length);
        console.log('Flight widgets:', document.querySelectorAll('.lazy-load-widget').length);
    }

})();
