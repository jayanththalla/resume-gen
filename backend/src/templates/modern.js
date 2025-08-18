class ModernTemplate {
  constructor() {
    this.name = 'Modern Professional';
    this.description = 'Contemporary design with clean lines and modern typography';
    this.preview = '/templates/previews/modern.jpg';
    this.category = 'modern';
  }

  async generate({ personalInfo, sections }) {
    const latexContent = `
\\documentclass[11pt,a4paper,sans]{moderncv}

\\moderncvstyle{banking}
\\moderncvcolor{blue}

\\usepackage[scale=0.75]{geometry}
\\usepackage[utf8]{inputenc}

\\name{${personalInfo.name || 'Your'}}{ Name}
\\title{${personalInfo.title || 'Professional Title'}}
\\address{${personalInfo.address || 'Your Address'}}{${personalInfo.city || 'City'}, ${personalInfo.state || 'State'} ${personalInfo.zipCode || 'ZIP'}}{}
\\phone[mobile]{${personalInfo.phone || '+1~(555)~123~4567'}}
\\email{${personalInfo.email || 'your.email@example.com'}}
\\homepage{${personalInfo.website || 'www.yourwebsite.com'}}
\\social[linkedin]{${personalInfo.linkedinUsername || 'yourlinkedin'}}
\\social[github]{${personalInfo.githubUsername || 'yourgithub'}}

\\photo[64pt][0.4pt]{picture}

\\begin{document}

\\makecvtitle

\\section{Professional Summary}
${sections.summary || 'A brief professional summary highlighting your key qualifications and career objectives.'}

\\section{Experience}
${this.generateExperienceSection(sections.experience || [])}

\\section{Education}
${this.generateEducationSection(sections.education || [])}

\\section{Skills}
${this.generateSkillsSection(sections.skills || {})}

\\section{Projects}
${this.generateProjectsSection(sections.projects || [])}

\\section{Certifications}
${this.generateCertificationsSection(sections.certifications || [])}

\\section{Achievements}
${this.generateAchievementsSection(sections.achievements || [])}

\\end{document}
`;

    return {
      content: latexContent,
      metadata: {
        template: 'modern',
        generatedAt: new Date().toISOString(),
        sections: Object.keys(sections)
      }
    };
  }

  generateExperienceSection(experiences) {
    return experiences.map(exp => `
\\cventry{${exp.duration || '2020--Present'}}{${exp.position || 'Position Title'}}{${exp.company || 'Company Name'}}{${exp.location || 'Location'}}{}{
${exp.description || 'Job description highlighting key responsibilities and achievements.'}
\\begin{itemize}
${(exp.achievements || []).map(achievement => `\\item ${achievement}`).join('\n')}
\\end{itemize}
}`).join('\n');
  }

  generateEducationSection(education) {
    return education.map(edu => `
\\cventry{${edu.year || '2016--2020'}}{${edu.degree || 'Degree'} in ${edu.field || 'Field of Study'}}{${edu.institution || 'University Name'}}{${edu.location || 'Location'}}{\\textit{${edu.gpa ? `GPA: ${edu.gpa}` : ''}}}{${edu.description || ''}}`).join('\n');
  }

  generateSkillsSection(skills) {
    let skillsContent = '';
    
    if (skills.technical?.length) {
      skillsContent += `\\cvitem{Technical Skills}{${skills.technical.join(', ')}}\n`;
    }
    
    if (skills.frameworks?.length) {
      skillsContent += `\\cvitem{Frameworks}{${skills.frameworks.join(', ')}}\n`;
    }
    
    if (skills.tools?.length) {
      skillsContent += `\\cvitem{Tools & Technologies}{${skills.tools.join(', ')}}\n`;
    }
    
    if (skills.soft?.length) {
      skillsContent += `\\cvitem{Soft Skills}{${skills.soft.join(', ')}}\n`;
    }
    
    if (skills.languages?.length) {
      skillsContent += `\\cvitem{Languages}{${skills.languages.join(', ')}}\n`;
    }
    
    return skillsContent || '\\cvitem{Skills}{Please add your skills}';
  }

  generateProjectsSection(projects) {
    return projects.map(project => `
\\cventry{${project.date || 'Date'}}{${project.title || 'Project Title'}}{}{}{}{
${project.description || 'Project description and key achievements.'}
\\begin{itemize}
${(project.technologies || []).map(tech => `\\item Technology: ${tech}`).join('\n')}
${project.link ? `\\item Link: \\href{${project.link}}{${project.link}}` : ''}
\\end{itemize}
}`).join('\n');
  }

  generateCertificationsSection(certifications) {
    return certifications.map(cert => `
\\cvitem{}{${cert.name || 'Certification Name'} - ${cert.issuer || 'Issuer'} (${cert.date || 'Date'})`).join('\n');
  }

  generateAchievementsSection(achievements) {
    return achievements.map(achievement => `
\\cvitem{}{${achievement}}`).join('\n');
  }
}

module.exports = new ModernTemplate();