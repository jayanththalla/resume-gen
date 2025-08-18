class TechnicalTemplate {
  constructor() {
    this.name = 'Technical Expert';
    this.description = 'Optimized for software engineers and technical professionals';
    this.preview = '/templates/previews/technical.jpg';
    this.category = 'technical';
  }

  async generate({ personalInfo, sections }) {
    const latexContent = `
\\documentclass[letterpaper,11pt]{article}

\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\usepackage{multicol}

\\pagestyle{fancy}
\\fancyhf{}
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}
\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

\\begin{document}

%----------HEADING----------
\\begin{center}
    \\textbf{\\Huge \\scshape ${personalInfo.name || 'Your Name'}} \\\\ \\vspace{1pt}
    \\small ${personalInfo.phone || 'Phone'} $|$ \\href{mailto:${personalInfo.email || 'email@example.com'}}{\\underline{${personalInfo.email || 'email@example.com'}}} $|$ 
    \\href{${personalInfo.linkedin || '#'}}{\\underline{linkedin.com/in/yourprofile}} $|$
    \\href{${personalInfo.github || '#'}}{\\underline{github.com/yourprofile}} $|$
    \\href{${personalInfo.website || '#'}}{\\underline{yourportfolio.com}}
\\end{center}

%-----------TECHNICAL SKILLS-----------
\\section{Technical Skills}
\\begin{itemize}[leftmargin=0.15in, label={}]
   \\small{\\item{
    \\textbf{Programming Languages}{: ${(sections.skills?.languages || ['Python', 'JavaScript', 'Java', 'C++']).join(', ')}} \\\\
    \\textbf{Web Technologies}{: ${(sections.skills?.web || ['HTML5', 'CSS3', 'React', 'Node.js']).join(', ')}} \\\\
    \\textbf{Frameworks \\& Libraries}{: ${(sections.skills?.frameworks || ['Express.js', 'Spring Boot', 'Django']).join(', ')}} \\\\
    \\textbf{Databases}{: ${(sections.skills?.databases || ['PostgreSQL', 'MongoDB', 'MySQL']).join(', ')}} \\\\
    \\textbf{Cloud \\& DevOps}{: ${(sections.skills?.cloud || ['AWS', 'Docker', 'Kubernetes', 'CI/CD']).join(', ')}} \\\\
    \\textbf{Developer Tools}{: ${(sections.skills?.tools || ['Git', 'VS Code', 'IntelliJ', 'Postman']).join(', ')}}
   }}
\\end{itemize}

%-----------EXPERIENCE-----------
\\section{Experience}
${this.generateTechnicalExperience(sections.experience || [])}

%-----------PROJECTS-----------
\\section{Projects}
${this.generateTechnicalProjects(sections.projects || [])}

%-----------EDUCATION-----------
\\section{Education}
${this.generateEducationSection(sections.education || [])}

%-----------CERTIFICATIONS-----------
\\section{Certifications}
\\begin{itemize}[leftmargin=0.15in, label={}]
${this.generateCertificationsSection(sections.certifications || [])}
\\end{itemize}

\\end{document}
`;

    return {
      content: latexContent,
      metadata: {
        template: 'technical',
        generatedAt: new Date().toISOString(),
        sections: Object.keys(sections)
      }
    };
  }

  generateTechnicalExperience(experiences) {
    return experiences.map(exp => `
\\textbf{${exp.position || 'Software Engineer'}} \\hfill ${exp.duration || 'Jan 2022 - Present'} \\\\
\\textit{${exp.company || 'Company Name'}} \\hfill \\textit{${exp.location || 'Location'}}
\\begin{itemize}[leftmargin=0.15in]
    \\item ${exp.description || 'Led development of scalable web applications using modern technologies'}
${(exp.achievements || []).map(achievement => `    \\item ${achievement}`).join('\n')}
${exp.technologies ? `    \\item \\textbf{Technologies:} ${exp.technologies.join(', ')}` : ''}
\\end{itemize}
\\vspace{5pt}`).join('\n');
  }

  generateTechnicalProjects(projects) {
    return projects.map(project => `
\\textbf{${project.title || 'Project Name'}} $|$ \\emph{${(project.technologies || ['Technology Stack']).join(', ')}} \\hfill ${project.date || 'Date'} \\\\
${project.github ? `\\href{${project.github}}{\\underline{GitHub}} $|$ ` : ''}${project.demo ? `\\href{${project.demo}}{\\underline{Live Demo}}` : ''}
\\begin{itemize}[leftmargin=0.15in]
    \\item ${project.description || 'Project description highlighting technical challenges and solutions'}
${(project.features || []).map(feature => `    \\item ${feature}`).join('\n')}
\\end{itemize}
\\vspace{5pt}`).join('\n');
  }

  generateEducationSection(education) {
    return education.map(edu => `
\\textbf{${edu.degree || 'Bachelor of Science in Computer Science'}} \\hfill ${edu.year || 'May 2020'} \\\\
\\textit{${edu.institution || 'University Name'}} \\hfill \\textit{${edu.location || 'Location'}} \\\\
${edu.gpa ? `GPA: ${edu.gpa}` : ''}${edu.coursework ? ` $|$ Relevant Coursework: ${edu.coursework.join(', ')}` : ''}
\\vspace{5pt}`).join('\n');
  }

  generateCertificationsSection(certifications) {
    return certifications.map(cert => `
    \\item \\textbf{${cert.name || 'Certification Name'}} - ${cert.issuer || 'Issuing Organization'} \\hfill ${cert.date || 'Date'}`).join('\n');
  }
}

module.exports = new TechnicalTemplate();