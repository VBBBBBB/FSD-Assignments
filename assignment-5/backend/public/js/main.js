/* Vagabond Journeys Client Logic */

document.addEventListener('DOMContentLoaded', () => {
    // Reveal animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.dest-card, .contact-container, .section-title');
    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s cubic-bezier(0.165, 0.84, 0.44, 1)';
        revealObserver.observe(el);
    });

    // Handle success message
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('success')) {
        const form = document.querySelector('form');
        const successMsg = document.createElement('div');
        successMsg.style.cssText = `
            background: rgba(0, 212, 255, 0.1);
            color: var(--primary-color);
            padding: 20px;
            border-radius: 12px;
            border: 1px solid var(--primary-color);
            margin-bottom: 20px;
            text-align: center;
            font-weight: 700;
            animation: fadeIn 0.5s ease-out;
        `;
        successMsg.innerText = "Thank you! Your inquiry has been received. Our travel specialist will contact you soon.";
        form.prepend(successMsg);
        
        // Remove success param after 5 seconds to avoid re-triggering on reload
        setTimeout(() => {
            window.history.replaceState({}, document.title, window.location.pathname);
        }, 5000);
    }
});
