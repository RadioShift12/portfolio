// PART 2 STEP 1
// Global error listener to catch unhandled errors
window.addEventListener('error', (event) => {
    console.error(`Global Error Caught: ${event.message} at ${event.filename}:${event.lineno}`);
});

document.addEventListener('DOMContentLoaded', () => {

    const projects = [ 
        {
            title: "Pen Plotter",
            id: 1,
            image: "printer.jpg",
            description: "A pen plotter based on the frame of a 3d printer.",
            technologiesUsed: ["Nema 17 Stepper Motors", "Arduino", "3D Printed Parts"],
        },
        {
            title: "Alarm Clock",
            id: 2,
            image: "clock.png",
            description: "A 3D printed alarm clock with a remote control.",
            technologiesUsed: ["ESP32", "3D Printed Parts"],
        },
        {
            title: "Portfolio website",
            id: 3,
            image: "site.png",
            description: "A portfolio website to showcase my projects and skills.",
            technologiesUsed: ["HTML", "CSS", "JavaScript"],
        },
        { 
            title: "Example",
            image: "site.png",
            description: "This will fail validation.",
            technologiesUsed: ["HTML5", "CSS3", "JavaScript"]
        }
    ];

    const searchInput = document.getElementById('project-search');
    const displayArea = document.getElementById('project-display-area');

    
    function renderProjects(filteredList) {
        
        while (displayArea.firstChild) {
            displayArea.removeChild(displayArea.firstChild);
        }

        
        if (filteredList.length === 0) {
            const noMatch = document.createElement('p');
            noMatch.className = 'error-msg';
            noMatch.textContent = "No projects found matching your search.";
            displayArea.appendChild(noMatch);
            return;
        }

        filteredList.forEach(project => {
            
            if (!project.title || !project.description || !project.technologiesUsed || !project.id) {
                
                console.error("Invalid project data:", project);
                return;
            }

            
            const article = document.createElement('article');
            article.className = 'project-item';

            const h2 = document.createElement('h2');
            h2.textContent = project.title;

            const img = document.createElement('img');
            
            // PART 2 STEP 1
            // Fallback if image fails to load
            img.onerror = () => {
                img.src = 'placeholder.png';
                console.warn(`Image failed to load for project: ${project.title}`);
            };
            img.src = project.image || 'placeholder.png'; // Fallback if image property is missing
            img.alt = project.title || 'Project Image';
            img.className = 'project-img';

            const p = document.createElement('p');
            p.textContent = project.description;

            const techDiv = document.createElement('div');
            techDiv.className = 'tech-tags';

            project.technologiesUsed.forEach(tech => {
                const span = document.createElement('span');
                span.className = 'tag';
                span.textContent = tech;
                techDiv.appendChild(span);
            });

            
            article.append(h2, img, p, techDiv);
            displayArea.appendChild(article);
        });
    }

    
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        // STEP 3 PART 1
        console.log(`User is searching for: ${searchTerm}`); // Testing log
        const filtered = projects.filter(project => {
            const matchTitle = project.title.toLowerCase().includes(searchTerm);
            const matchTech = project.technologiesUsed.some(tech =>
                tech.toLowerCase().includes(searchTerm)
            );
            return matchTitle || matchTech;
        });
        // STEP 3 PART 1
        if (filtered.length === 0) {
            console.warn("Search returned no results."); // Testing warning
        }
        renderProjects(filtered);
    });

    
    const submissionForm = document.getElementById('project-submission-form');
    const statusDiv = document.getElementById('submission-status');

    submissionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        statusDiv.textContent = ""; 

        
        const title = document.getElementById('new-title').value.trim();
        const desc = document.getElementById('new-desc').value.trim();
        const techInput = document.getElementById('new-tech').value.trim();
        const fileInput = document.getElementById('new-image'); 
        
        if (!title || !desc || !techInput) {
            statusDiv.textContent = "Please fill in all required fields.";
            statusDiv.style.color = "red";
            return;
        }

        
        
        let projectImage = "site.png"; 
        if (fileInput.files && fileInput.files[0]) {
            
            projectImage = URL.createObjectURL(fileInput.files[0]);
        }

        const newProject = {
            id: Date.now(), 
            title: title,
            description: desc,
            technologiesUsed: techInput.split(',').map(t => t.trim()),
            image: projectImage 
        };

        
        projects.push(newProject);
        renderProjects(projects);
        
        
        statusDiv.textContent = "Project added successfully!";
        statusDiv.style.color = "green";
        submissionForm.reset();
        
        
        console.log("New Project Added with Image:", newProject);
    });
    try {
        renderProjects(projects);
    } catch (error) {
        console.error("Failed to render projects:", error);
        const errorDisplay = document.createElement('p');
        errorDisplay.textContent = "Encountered an error loading the projects. Please refresh.";
        displayArea.appendChild(errorDisplay);
    }
});

// Shows the global error handler in action by calling a function that doesn't exist
nonExistentFunction();