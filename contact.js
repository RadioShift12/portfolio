// Global error listener to catch unhandled errors
window.addEventListener('error', (event) => {
    console.error(`Global Error Caught: ${event.message} at ${event.filename}:${event.lineno}`);
});

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    
    
    const statusMessage = document.createElement('div');
    statusMessage.id = 'form-status-message';
    form.parentNode.insertBefore(statusMessage, form);

    form.addEventListener('submit', (event) => {
        event.preventDefault(); 
        form.reportValidity(); 
        clearErrors();
        statusMessage.textContent = "";

        const formData = {
            company: document.getElementById('company').value.trim(),
            fname: document.getElementById('fname').value.trim(),
            lname: document.getElementById('lname').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            comments: document.getElementById('comments').value.trim()
        };

        let errors = [];

        
        if (formData.company === "") {
            errors.push({ id: 'company', msg: "Company name is required." });
        }
        if (formData.fname === "") {
            errors.push({ id: 'fname', msg: "First name is required." });
        }
        if (formData.lname === "") {
            errors.push({ id: 'lname', msg: "Last name is required." });
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.email === "" || !emailRegex.test(formData.email)) {
            errors.push({ id: 'email', msg: "Please enter a valid email address." });
        }

        const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
        if (formData.phone !== "" && !phoneRegex.test(formData.phone)) {
            errors.push({ id: 'phone', msg: "Format must be 555-555-5555." });
        }

        
        if (formData.comments === "") {
            errors.push({ id: 'comments', msg: "Please provide a message or comment." });
        }

        if (errors.length > 0) {
            
            console.warn("Validation failed:", errors);
            showErrors(errors);
        } else {
            
            statusMessage.textContent = "Success! Your message has been sent.";
            statusMessage.style.color = "green";
            console.log("Form submitted successfully:", formData);
            form.reset();
        }
    });

    
    function showErrors(errorList) {
        errorList.forEach(error => {
            const inputField = document.getElementById(error.id);
            if (inputField) {
                inputField.style.borderColor = "red";
                
                
                const errorSpan = document.createElement('span');
                errorSpan.className = 'error-msg';
                errorSpan.style.color = 'red';
                errorSpan.style.fontSize = '0.8rem';
                errorSpan.textContent = error.msg; 
                
                inputField.parentNode.insertBefore(errorSpan, inputField.nextSibling);
            }
        });
    }

    function clearErrors() {
        
        document.querySelectorAll('.error-msg').forEach(msg => msg.remove());
        
        document.querySelectorAll('input, textarea').forEach(input => input.style.borderColor = "");
    }
});