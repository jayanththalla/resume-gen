class CreativeTemplate {
  constructor() {
    this.name = 'Creative Professional';
    this.description = 'Unique design for creative professionals and designers';
    this.preview = '/templates/previews/creative.jpg';
    this.category = 'creative';
  }

  async generate({ personalInfo, sections }) {
    const latexContent = `
\\documentclass[a4paper,10pt]{article}

\\usepackage[top=0.75in, bottom=0.75in, left=0.55in, right=0.85in]{geometry}
\\usepackage{graphicx}
\\usepackage{url}
\\usepackage{palatino}
\\usepackage{tabularx}
\\fontfamily{SansSerif}
\\selectfont

\\usepackage[usenames,dvipsnames]{xcolor}
\\usepackage{hyperref}
\\definecolor{linkcolour}{rgb}{0,0.2,0.6}
\\hypersetup{colorlinks,breaklinks,urlcolor=linkcolour, linkcolor=linkcolour}

\\usepackage{titlesec}
\\titleformat{\\section}{\\Large\\scshape\\raggedright}{}{0em}{}[\\titlerule]
\\titlespacing{\\section}{0pt}{3pt}{3pt}

\\begin{document}

\\pagestyle{empty}

\\font\\fb=''[cmr10]''

%--------------------TITLE-------------
\\par{\\centering
    {\\Huge ${personalInfo.name || 'Your Name'}}
    \\bigskip\\par}

\\section{Personal Data}
\\begin{tabular}{rl}
    \\textsc{Address:}   & ${personalInfo.address || 'Your Address'} \\\\
    \\textsc{Phone:}     & ${personalInfo.phone || '+1 555 123 4567'} \\\\
    \\textsc{Email:}     & \\href{mailto:${personalInfo.email || 'your@email.com'}}{${personalInfo.email || 'your@email.com'}} \\\\
    \\textsc{Portfolio:} & \\href{${personalInfo.portfolio || 'https://yourportfolio.com'}}{${personalInfo.portfolio || 'yourportfolio.com'}} \\\\
    \\textsc{LinkedIn:}  & \\href{${personalInfo.linkedin || 'https://linkedin.com/in/yourprofile'}}{linkedin.com/in/yourprofile}
\\end{tabular}

\\section{Creative Profile}
${sections.summary || 'A passionate creative professional with expertise in design, innovation, and visual communication. Experienced in creating compelling visual narratives and user experiences.'}

\\section{Work Experience}
${this.generateCreativeExperience(sections.experience || [])}

\\section{Skills \\& Expertise}
${this.generateCreativeSkills(sections.skills || {})}

\\section{Portfolio Projects}
${this.generatePortfolioProjects(sections.projects || [])}

\\section{Education}
${this.generateEducationSection(sections.education || [])}

\\section{Awards \\& Recognition}
${this.generateAwardsSection(sections.awards || [])}

\\section{Software Proficiency}
${this.generateSoftwareSection(sections.software || [])}

\\end{document}
`;

    return {
      content: latexContent,
      metadata: {
        template: 'creative',
        generatedAt: new Date().toISOString(),
        sections: Object.keys(sections)
      }
    };
  }

  generateCreativeExperience(experiences) {
    return experiences.map(exp => `
\\textsc{${exp.duration || 'Jan 2022 - Present'}} & \\textbf{${exp.position || 'Creative Director'}} at \\textsc{${exp.company || 'Company Name'}} \\\\
& \\footnotesize{${exp.description || 'Led creative initiatives and managed design projects from concept to completion.'}} \\\\
${(exp.achievements || []).map(achievement => `& \\footnotesize{• ${achievement}} \\\\`).join('')}
\\multicolumn{2}{c}{} \\\\`).join('\n');
  }

  generateCreativeSkills(skills) {
    let skillsContent = '';
    
    if (skills.design?.length) {
      skillsContent += `\\textsc{Design Skills:} & ${skills.design.join(', ')} \\\\\n`;
    }
    
    if (skills.software?.length) {
      skillsContent += `\\textsc{Software:} & ${skills.software.join(', ')} \\\\\n`;
    }
    
    if (skills.creative?.length) {
      skillsContent += `\\textsc{Creative Skills:} & ${skills.creative.join(', ')} \\\\\n`;
    }
    
    if (skills.technical?.length) {
      skillsContent += `\\textsc{Technical:} & ${skills.technical.join(', ')} \\\\\n`;
    }
    
    return `\\begin{tabular}{rl}\n${skillsContent}\\end{tabular}`;
  }

  generatePortfolioProjects(projects) {
    return projects.map(project => `
\\textsc{${project.date || 'Date'}} & \\textbf{${project.title || 'Project Title'}} \\\\
& \\footnotesize{${project.description || 'Creative project description highlighting design challenges and solutions.'}} \\\\
${project.client ? `& \\footnotesize{\\textit{Client: ${project.client}}} \\\\` : ''}
${project.url ? `& \\footnotesize{\\href{${project.url}}{View Project}} \\\\` : ''}
\\multicolumn{2}{c}{} \\\\`).join('\n');
  }

  generateEducationSection(education) {
    return education.map(edu => `
\\textsc{${edu.year || '2020'}} & \\textbf{${edu.degree || 'Bachelor of Fine Arts'}} in \\textbf{${edu.field || 'Graphic Design'}} \\\\
& \\textsc{${edu.institution || 'Art Institute'}} \\\\
${edu.gpa ? `& GPA: ${edu.gpa} \\\\` : ''}
${edu.honors ? `& \\footnotesize{${edu.honors}} \\\\` : ''}
\\multicolumn{2}{c}{} \\\\`).join('\n');
  }

  generateAwardsSection(awards) {
    return awards.map(award => `
\\textsc{${award.date || 'Date'}} & \\textbf{${award.name || 'Award Name'}} \\\\
& \\footnotesize{${award.description || 'Award description'}} \\\\
${award.organization ? `& \\footnotesize{\\textit{${award.organization}}} \\\\` : ''}
\\multicolumn{2}{c}{} \\\\`).join('\n');
  }

  generateSoftwareSection(software) {
    return software.map(soft => `
\\textsc{${soft.category || 'Category'}} & ${(soft.tools || []).join(', ')} \\\\`).join('\n');
  }
}

module.exports = new CreativeTemplate();