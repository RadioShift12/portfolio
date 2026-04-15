import { Project } from './modules/project.js';
// Part 3: Modular Export - Utility for sanitization (Replaces innerHTML)
export function createSafeElement(tag, text) {
    const el = document.createElement(tag);
    el.textContent = text;
    return el;
}

let currentId = 0; 

// Part 2: Security - Rate Limiting Closure (Maintained from B2)
const checkRateLimit = (() => {
    let lastSubmit = 0;
    const limit = 5000; 
    return () => {
        const now = Date.now();
        if (now - lastSubmit < limit) return false;
        lastSubmit = now;
        return true;
    };
})();

document.addEventListener('DOMContentLoaded', async () => {
    // Part 2: CSRF Protection Setup
    const csrfToken = Math.random().toString(36).substring(2);
    sessionStorage.setItem('project_csrf_token', csrfToken);

    const displayArea = document.getElementById('project-display-area');
    const searchInput = document.getElementById('project-search');
    const submissionForm = document.getElementById('project-submission-form');
    const statusDiv = document.getElementById('submission-status');

    let projectInstances = [];

    // Part 3: Secure AJAX data loading using Fetch
    async function loadInitialData() {
        try {
            console.log("Fetching project data...");
            const response = await fetch('projects.json');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            // Inside loadInitialData in projects.js
            projectInstances = data.map(item => new Project({ ...item, currentId: currentId++ }));
            renderProjects(projectInstances);
            
        } catch (error) {
            // Part 4: Comprehensive error handling with user feedback
            console.error("Fetch Error:", error);
            statusDiv.textContent = "Failed to load projects. Please try again later.";
            statusDiv.style.color = "red";
        }
    }

    function renderProjects(list) {
        displayArea.replaceChildren();

        if (list.length === 0) {
            displayArea.appendChild(createSafeElement('p', "No projects found matching your search."));
            return;
        }

        list.forEach(project => {
            try {
                const { title, description, tech, image } = project.getDetails();

                const article = document.createElement('article');
                article.className = 'project-item';

                // Using textContent via createSafeElement helper to avoid innerHTML
                const h2 = createSafeElement('h2', title);
                
                const img = document.createElement('img');
                img.src = image;
                img.className = 'project-img';
                img.alt = title; // Accessibility
                img.onerror = () => { img.src = 'placeholder.png'; };

                const p = createSafeElement('p', description);

                const techDiv = document.createElement('div');
                techDiv.className = 'tech-tags';
                tech.forEach(t => {
                    const span = createSafeElement('span', t);
                    span.className = 'tag';
                    techDiv.appendChild(span);
                });

                article.append(h2, img, p, techDiv);
                displayArea.appendChild(article);
            } catch (err) {
                console.error("Render Item Error:", err);
            }
        });
    }

    // Search logic (Maintained)
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

        // Rate Limit Check
        if (!checkRateLimit()) {
            statusDiv.textContent = "Too many requests. Please wait.";
            statusDiv.style.color = "orange";
            return;
        }

        // Token Validation
        const storedToken = sessionStorage.getItem('project_csrf_token');
        if (!storedToken || storedToken !== csrfToken) {
            console.error("Security: CSRF validation failed.");
            statusDiv.textContent = "Security validation failed.";
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

    // Initial load
    loadInitialData();
});