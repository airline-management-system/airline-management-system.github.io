// Function to initialize Lucide icons with retries
function initializeLucideIconsWithRetry(maxRetries = 10, retryInterval = 200) {
    let retries = 0;

    function attemptInitialization() {
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            try {
                console.log("Lucide object found. Attempting to create Lucide icons...");
                window.lucide.createIcons();
                console.log("Lucide icons should have been created.");

                // Optional: Verify if icons were actually rendered
                // const firstIcon = document.querySelector('[data-lucide]');
                // if (firstIcon && firstIcon.innerHTML.includes('<svg')) {
                //     console.log("First Lucide icon appears to be rendered.");
                // } else if (firstIcon) {
                //     console.warn("First Lucide icon tag found, but no SVG content. Check attributes and script execution.");
                // } else {
                //     // This might be normal if there are no icons on the page yet, or if they are added dynamically later
                //     // console.warn("No elements with data-lucide attribute found by the script at this point.");
                // }

            } catch (error) {
                console.error("Error creating Lucide icons:", error);
            }
        } else {
            retries++;
            if (retries <= maxRetries) {
                console.warn(`Lucide object not available. Retrying in ${retryInterval}ms... (Attempt ${retries}/${maxRetries})`);
                setTimeout(attemptInitialization, retryInterval);
            } else {
                console.error(`Lucide object not available after ${maxRetries} retries. Icons will not be initialized.`);
            }
        }
    }

    attemptInitialization(); // Start the first attempt
}

// Wait for the DOM to be fully loaded before running other scripts
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded and parsed.");
    
    // Attempt to initialize Lucide icons (it will retry if Lucide is not ready)
    initializeLucideIconsWithRetry(); 

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerElement = this.closest('header');
                if (headerElement && headerElement.__x && typeof headerElement.__x.mobileMenuOpen === 'boolean') {
                     headerElement.__x.mobileMenuOpen = false; 
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
    const navLinks = document.querySelectorAll('header nav a:not([target="_blank"])');
    const mobileNavLinks = document.querySelectorAll('div.md\\:hidden a[href^="#"]:not([target="_blank"])');
    
    function updateActiveLink() {
        let current = 'home'; 
        const headerHeight = document.querySelector('header').offsetHeight;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - window.innerHeight * 0.3; 
            if (pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        
        if ((window.innerHeight + Math.ceil(window.pageYOffset)) >= document.body.offsetHeight - 2) { 
             current = sections[sections.length - 1].getAttribute('id');
        }

        [...navLinks, ...mobileNavLinks].forEach(link => {
            const linkHref = link.getAttribute('href').substring(1);
            link.classList.remove('text-indigo-600', 'font-semibold', 'bg-indigo-100');
            if (link.closest('div.md\\:hidden')) { 
                link.classList.add('text-gray-700','hover:bg-indigo-50');
            } else { 
                 link.classList.add('text-gray-700','hover:text-indigo-600');
            }

            if (linkHref === current) {
                link.classList.add('text-indigo-600', 'font-semibold');
                if (link.closest('div.md\\:hidden')) {
                    link.classList.add('bg-indigo-100');
                }
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveLink, { passive: true }); 
    window.addEventListener('load', () => {
        console.log("Window fully loaded (all resources).");
        updateActiveLink(); // Update active link on load
        // One final attempt to initialize Lucide, in case it loaded very late.
        // The initializeLucideIconsWithRetry called in DOMContentLoaded should ideally handle it.
        // This is an extra safeguard.
        if (!window.lucide || !window.lucide.createIcons) { // Only if not already clearly available
             initializeLucideIconsWithRetry(5, 100); // Fewer retries here
        } else if (document.querySelector('[data-lucide]:not(:has(svg))')) {
            // If lucide is available but some icons were missed (e.g. dynamic content)
            console.log("Lucide available, attempting to re-create icons for any missed elements on window.load");
            initializeLucideIconsWithRetry(1,0); // Attempt once more immediately
        }
    }); 
    window.addEventListener('resize', updateActiveLink);
});
