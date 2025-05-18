// Wait for the DOM to be fully loaded before running scripts
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize Lucide icons
    // Ensure this is called after the DOM elements with data-lucide attributes are present.
    if (window.lucide) {
        lucide.createIcons();
    } else {
        console.warn("Lucide icons script not loaded or initialized yet.");
    }

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerElement = this.closest('header');
                // Check if Alpine.js data store __x is available and has mobileMenuOpen
                if (headerElement && headerElement.__x && typeof headerElement.__x.mobileMenuOpen === 'boolean') {
                     headerElement.__x.mobileMenuOpen = false; // Close mobile menu if open
                }
            
                const headerOffset = document.querySelector('header').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // Active link highlighting based on scroll position
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('header nav a');
    const mobileNavLinks = document.querySelectorAll('div.md\\:hidden a[href^="#"]'); // Mobile nav links
    
    function updateActiveLink() {
        let current = 'home'; // Default to home
        const headerHeight = document.querySelector('header').offsetHeight;

        sections.forEach(section => {
            // Adjust offset for better accuracy, considering a portion of the viewport
            const sectionTop = section.offsetTop - headerHeight - window.innerHeight * 0.3; 
            if (pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        
        // If scrolled to the very bottom, ensure the last section is active
        if ((window.innerHeight + Math.ceil(window.pageYOffset)) >= document.body.offsetHeight - 2) { // -2 for tolerance
             current = sections[sections.length - 1].getAttribute('id');
        }


        [...navLinks, ...mobileNavLinks].forEach(link => {
            const linkHref = link.getAttribute('href').substring(1);
            // Remove all potentially active classes first
            link.classList.remove('text-indigo-600', 'font-semibold', 'bg-indigo-100');
            
            // Apply default styles based on whether it's a mobile or desktop link
            if (link.closest('div.md\\:hidden')) { // Mobile links
                link.classList.add('text-gray-700','hover:bg-indigo-50'); // Ensure rounded-md is part of base mobile link style if needed
            } else { // Desktop links
                 link.classList.add('text-gray-700','hover:text-indigo-600');
            }

            // Apply active styles
            if (linkHref === current) {
                link.classList.add('text-indigo-600', 'font-semibold');
                if (link.closest('div.md\\:hidden')) {
                    link.classList.add('bg-indigo-100'); // Active mobile style
                }
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveLink, { passive: true }); // Use passive listener for scroll performance
    window.addEventListener('load', updateActiveLink); // Also run on load for initial state
    window.addEventListener('resize', updateActiveLink); // Update on window resize

});
