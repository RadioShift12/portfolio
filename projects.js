let currentId = 0; 

// Part 2: Security - Rate Limiting Closure
const checkRateLimit = (() => {
    let lastSubmit = 0;
    const limit = 5000; // 5 second cooldown
    return () => {
        const now = Date.now();
        if (now - lastSubmit < limit) return false;
        lastSubmit = now;
        return true;
    };
})();

// Part 3: Object-Oriented Implementation
class Project {
    #id;
    
    constructor({ title, description, technologiesUsed, image }) {
        this.#id = currentId++; 
        // Part 2: XSS Protection / Sanitization system
        this.title = this.sanitize(title);
        this.description = this.sanitize(description);
        this.technologiesUsed = technologiesUsed.map(t => this.sanitize(t));
        this.image = image || 'placeholder.png';
    }

    // I didnt know JS had getters, so that is pretty cool.
    get ID() {
        return this.#id;
    }

    // Securely escapes input by using textContent first, I found this approach online, if I still shouldnt use it, please let me know.
    sanitize(str) {
        const div = document.createElement('div');
        div.textContent = str; 
        return div.innerHTML; 
    }

    // Method for daa access
    getDetails() {
        return {
            title: this.title,
            description: this.description,
            tech: this.technologiesUsed,
            image: this.image
        };
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Part 2: CSRF Protection Setup
    const csrfToken = Math.random().toString(36).substring(2);
    sessionStorage.setItem('project_csrf_token', csrfToken);

    const initialData = [
        {
            title: "Pen Plotter",
            image: "printer.jpg",
            description: "A pen plotter based on the frame of a 3d printer.",
            technologiesUsed: ["Arduino", "CNC", "3D Printing"]
        },
        {
            title: "Alarm Clock",
            image: "clock.png",
            description: "A 3D printed alarm clock with a remote control.",
            technologiesUsed: ["ESP32", "C++"]
        },
        {
            title: "Portfolio website",
            image: "site.png",
            description: "A portfolio website to showcase my projects and skills.",
            technologiesUsed: ["HTML", "CSS", "JavaScript"]
        }
    ];

    let projectInstances = initialData.map(data => new Project(data));

    const displayArea = document.getElementById('project-display-area');
    const searchInput = document.getElementById('project-search');
    const submissionForm = document.getElementById('project-submission-form');
    const statusDiv = document.getElementById('submission-status');

    function renderProjects(list) {
        displayArea.replaceChildren();

        if (list.length === 0) {
            const noMatch = document.createElement('p');
            noMatch.textContent = "No projects found matching your search.";
            displayArea.appendChild(noMatch);
            return;
        }

        // Part 3: Array Iteration & Destructuring
        list.forEach(project => {
            try {
                const { title, description, tech, image } = project.getDetails();

                const article = document.createElement('article');
                article.className = 'project-item';

                const h2 = document.createElement('h2');
                h2.textContent = title;

                const img = document.createElement('img');
                img.src = image;
                img.className = 'project-img';
                img.onerror = () => { img.src = 'placeholder.png'; };

                const p = document.createElement('p');
                p.textContent = description;

                const techDiv = document.createElement('div');
                techDiv.className = 'tech-tags';
                tech.forEach(t => {
                    const span = document.createElement('span');
                    span.className = 'tag';
                    span.textContent = t;
                    techDiv.appendChild(span);
                });

                article.append(h2, img, p, techDiv);
                displayArea.appendChild(article);
            } catch (error) {
                // Part 4: Fallback Content
                console.error("Render Error:", error);
                const errorFallback = document.createElement('div');
                errorFallback.textContent = "Error loading project content.";
                displayArea.appendChild(errorFallback);
            }
        });
    }

    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = projectInstances.filter(p => {
            const details = p.getDetails();
            return details.title.toLowerCase().includes(term) || 
                   details.tech.some(t => t.toLowerCase().includes(term));
        });
        renderProjects(filtered);
    });

    // Form Submissions with Security Checks
    submissionForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!checkRateLimit()) {
            statusDiv.textContent = "Too many requests. Please wait.";
            statusDiv.style.color = "orange";
            return;
        }

        const storedToken = sessionStorage.getItem('project_csrf_token');
        if (!storedToken) {
            console.error("Security: CSRF validation failed.");
            return;
        }

        const title = document.getElementById('new-title').value;
        const desc = document.getElementById('new-desc').value;
        const tech = document.getElementById('new-tech').value.split(',').map(t => t.trim());

        const newProj = new Project({ title, description: desc, technologiesUsed: tech });

        projectInstances.push(newProj);
        renderProjects(projectInstances);
        submissionForm.reset();
        statusDiv.textContent = "Project added successfully!";
        statusDiv.style.color = "green";
    });

    renderProjects(projectInstances);
});