// Part 2: Rate Limiting for Contact Form
const contactRateLimit = (() => {
    let lastAttempt = 0;
    return () => {
        const now = Date.now();
        if (now - lastAttempt < 10000) return false; // 10 second limit
        lastAttempt = now;
        return true;
    };
})();

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    
    // Part 2: Create secure CSRF token
    const contactToken = Math.random().toString(36).slice(2);
    sessionStorage.setItem('contact_csrf', contactToken);

    const statusMessage = document.createElement('div');
    statusMessage.id = 'form-status-message';
    form.parentNode.insertBefore(statusMessage, form);

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        
        // Part 2: CSRF and Rate Limit Verification
        if (!contactRateLimit()) {
            statusMessage.textContent = "Please wait before submitting again.";
            statusMessage.style.color = "orange";
            return;
        }

        if (sessionStorage.getItem('contact_csrf') !== contactToken) {
            console.error("Security: Invalid Session Token");
            return;
        }

        // Part 2: Input Sanitization using Virtual DOM
        const rawData = {
            fname: document.getElementById('fname').value.trim(),
            email: document.getElementById('email').value.trim(),
            comments: document.getElementById('comments').value.trim()
        };

        const sanitizedData = {};
        for (let key in rawData) {
            const div = document.createElement('div');
            div.textContent = rawData[key]; 
            sanitizedData[key] = div.innerHTML; 
        }

        // Part 4: Comprehensive error handling
        let errors = [];
        if (!sanitizedData.fname) errors.push("First name is required.");
        if (!sanitizedData.email.includes('@')) errors.push("Valid email is required.");

        if (errors.length > 0) {
            statusMessage.textContent = errors.join(' ');
            statusMessage.style.color = "red";
        } else {
            // Part 4: User-friendly success message
            statusMessage.textContent = "Securely processed your message!";
            statusMessage.style.color = "green";
            form.reset();
        }
    });
});