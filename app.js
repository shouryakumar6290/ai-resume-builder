// State Management
let resumeData = {
    fullName: "John Doe",
    jobTitle: "Software Engineer",
    email: "john@example.com",
    phone: "+1 234 567 8900",
    location: "New York, NY",
    summary: "Passionate software engineer with 5+ years of experience in developing scalable web applications. Strong background in JavaScript, React, and Node.js.",
    experience: [
        { company: "Tech Solutions", role: "Senior Developer", date: "2020 - Present", desc: "Leading the frontend team in building modern web apps." }
    ],
    education: [
        { school: "State University", degree: "B.S. in Computer Science", date: "2016 - 2020" }
    ],
    skills: "JavaScript, React, HTML5, CSS3, Node.js, Python, SQL, Git",
    template: "modern"
};

// Selectors
const form = document.getElementById('resume-form');
const previewContainer = document.getElementById('preview-container');
const templateButtons = document.querySelectorAll('.btn-template');
const addExperienceBtn = document.getElementById('btn-add-experience');
const addEducationBtn = document.getElementById('btn-add-education');
const exportBtn = document.getElementById('btn-export');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderEditor();
    updatePreview();
    lucide.createIcons();
});

// Event Listeners
form.addEventListener('input', (e) => {
    const { id, value } = e.target;
    if (id && !id.includes('-')) {
        resumeData[id] = value;
        updatePreview();
    }
});

templateButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        templateButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        resumeData.template = btn.dataset.template;
        updatePreview();
    });
});

addExperienceBtn.addEventListener('click', () => {
    resumeData.experience.push({ company: "", role: "", date: "", desc: "" });
    renderEditor();
    updatePreview();
});

addEducationBtn.addEventListener('click', () => {
    resumeData.education.push({ school: "", degree: "", date: "" });
    renderEditor();
    updatePreview();
});

exportBtn.addEventListener('click', () => {
    window.print();
});

// Functions
function renderEditor() {
    // Render Experience List
    const expList = document.getElementById('experience-list');
    expList.innerHTML = '';
    resumeData.experience.forEach((exp, index) => {
        const div = document.createElement('div');
        div.className = 'item-card';
        div.innerHTML = `
            <button class="btn-remove" onclick="removeItem('experience', ${index})"><i data-lucide="trash-2"></i></button>
            <div class="input-group">
                <input type="text" placeholder="Company" value="${exp.company}" oninput="updateItem('experience', ${index}, 'company', this.value)">
            </div>
            <div class="input-group">
                <input type="text" placeholder="Role" value="${exp.role}" oninput="updateItem('experience', ${index}, 'role', this.value)">
            </div>
            <div class="input-group">
                <input type="text" placeholder="Date Range" value="${exp.date}" oninput="updateItem('experience', ${index}, 'date', this.value)">
            </div>
            <div class="input-group">
                <textarea placeholder="Description" rows="2" oninput="updateItem('experience', ${index}, 'desc', this.value)">${exp.desc}</textarea>
            </div>
        `;
        expList.appendChild(div);
    });

    // Render Education List
    const eduList = document.getElementById('education-list');
    eduList.innerHTML = '';
    resumeData.education.forEach((edu, index) => {
        const div = document.createElement('div');
        div.className = 'item-card';
        div.innerHTML = `
            <button class="btn-remove" onclick="removeItem('education', ${index})"><i data-lucide="trash-2"></i></button>
            <div class="input-group">
                <input type="text" placeholder="School" value="${edu.school}" oninput="updateItem('education', ${index}, 'school', this.value)">
            </div>
            <div class="input-group">
                <input type="text" placeholder="Degree" value="${edu.degree}" oninput="updateItem('education', ${index}, 'degree', this.value)">
            </div>
            <div class="input-group">
                <input type="text" placeholder="Date Range" value="${edu.date}" oninput="updateItem('education', ${index}, 'date', this.value)">
            </div>
        `;
        eduList.appendChild(div);
    });
    
    lucide.createIcons();
}

function updateItem(type, index, field, value) {
    resumeData[type][index][field] = value;
    updatePreview();
}

function removeItem(type, index) {
    resumeData[type].splice(index, 1);
    renderEditor();
    updatePreview();
}

function updatePreview() {
    const templateId = `template-${resumeData.template}-html`;
    const templateContent = document.getElementById(templateId).content.cloneNode(true);
    
    // Fill text content
    templateContent.querySelectorAll('.r-name').forEach(el => el.textContent = resumeData.fullName);
    templateContent.querySelectorAll('.r-jobtitle').forEach(el => el.textContent = resumeData.jobTitle);
    templateContent.querySelectorAll('.r-email').forEach(el => el.textContent = resumeData.email);
    templateContent.querySelectorAll('.r-phone').forEach(el => el.textContent = resumeData.phone);
    templateContent.querySelectorAll('.r-location').forEach(el => el.textContent = resumeData.location);
    templateContent.querySelectorAll('.r-summary').forEach(el => el.textContent = resumeData.summary);

    // Fill Experience
    const expContainer = templateContent.querySelector('.r-experience-list');
    if (expContainer) {
        resumeData.experience.forEach(exp => {
            const item = document.createElement('div');
            item.className = 'r-item';
            item.innerHTML = `
                <div class="r-item-header">
                    <span class="r-item-title">${exp.company}</span>
                    <span class="r-item-date">${exp.date}</span>
                </div>
                <div class="r-item-subtitle">${exp.role}</div>
                <div class="r-item-desc">${exp.desc}</div>
            `;
            expContainer.appendChild(item);
        });
    }

    // Fill Education
    const eduContainer = templateContent.querySelector('.r-education-list');
    if (eduContainer) {
        resumeData.education.forEach(edu => {
            const item = document.createElement('div');
            item.className = 'r-item';
            item.innerHTML = `
                <div class="r-item-header">
                    <span class="r-item-title">${edu.school}</span>
                    <span class="r-item-date">${edu.date}</span>
                </div>
                <div class="r-item-subtitle">${edu.degree}</div>
            `;
            eduContainer.appendChild(item);
        });
    }

    // Fill Skills
    const skillsContainer = templateContent.querySelector('.r-skills-list');
    if (skillsContainer) {
        const skillsArr = resumeData.skills.split(',').map(s => s.trim()).filter(s => s);
        skillsArr.forEach(skill => {
            const span = document.createElement('span');
            span.className = 'skills-badge';
            span.textContent = skill;
            skillsContainer.appendChild(span);
        });
    }

    previewContainer.innerHTML = '';
    previewContainer.appendChild(templateContent);
    lucide.createIcons();
}

window.updateItem = updateItem;
window.removeItem = removeItem;
