class ClassicTemplate {
  constructor() {
    this.name = 'Classic Professional';
    this.description = 'Traditional, clean resume format suitable for all industries';
    this.preview = '/templates/previews/classic.jpg';
    this.category = 'traditional';
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

\\newcommand{\\resumeItem}[1]{
  \\item\\small{
    {#1 \\vspace{-2pt}}
  }
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-2pt}\\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeProjectHeading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\small#1 & #2 \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubItem}[1]{\\resumeItem{#1}\\vspace{-4pt}}
\\renewcommand\\labelitemii{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}
\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

\\begin{document}

%----------HEADING----------
\\begin{center}
    \\textbf{\\Huge \\scshape ${personalInfo.name || 'Your Name'}} \\\\ \\vspace{1pt}
    \\small ${personalInfo.phone || 'Phone'} $|$ \\href{mailto:${personalInfo.email || 'email@example.com'}}{\\underline{${personalInfo.email || 'email@example.com'}}} $|$ 
    \\href{${personalInfo.linkedin || '#'}}{\\underline{LinkedIn}} $|$
    \\href{${personalInfo.github || '#'}}{\\underline{GitHub}}
\\end{center}

%-----------EXPERIENCE-----------
\\section{Experience}
  \\resumeSubHeadingListStart
${this.generateExperienceSection(sections.experience || [])}
  \\resumeSubHeadingListEnd

%-----------EDUCATION-----------
\\section{Education}
  \\resumeSubHeadingListStart
${this.generateEducationSection(sections.education || [])}
  \\resumeSubHeadingListEnd

%-----------SKILLS-----------
\\section{Technical Skills}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
     \\textbf{Languages}{: ${(sections.skills?.technical || []).join(', ')}} \\\\
     \\textbf{Frameworks}{: ${(sections.skills?.frameworks || []).join(', ')}} \\\\
     \\textbf{Developer Tools}{: ${(sections.skills?.tools || []).join(', ')}} \\\\
     \\textbf{Libraries}{: ${(sections.skills?.libraries || []).join(', ')}}
    }}
 \\end{itemize}

%-----------PROJECTS-----------
\\section{Projects}
    \\resumeSubHeadingListStart
${this.generateProjectsSection(sections.projects || [])}
    \\resumeSubHeadingListEnd

\\end{document}
`;

    return {
      content: latexContent,
      metadata: {
        template: 'classic',
        generatedAt: new Date().toISOString(),
        sections: Object.keys(sections)
      }
    };
  }

  generateExperienceSection(experiences) {
    return experiences.map(exp => `
      \\resumeSubheading
        {${exp.position || 'Position'}}{${exp.duration || 'Duration'}}
        {${exp.company || 'Company'}}{${exp.location || 'Location'}}
        \\resumeItemListStart
          \\resumeItem{${exp.description || 'Job description and achievements'}}
${(exp.achievements || []).map(achievement => `          \\resumeItem{${achievement}}`).join('\n')}
        \\resumeItemListEnd`).join('');
  }

  generateEducationSection(education) {
    return education.map(edu => `
      \\resumeSubheading
        {${edu.institution || 'Institution'}}{${edu.year || 'Year'}}
        {${edu.degree || 'Degree'} in ${edu.field || 'Field'}}{${edu.location || 'Location'}}`).join('');
  }

  generateProjectsSection(projects) {
    return projects.map(project => `
      \\resumeProjectHeading
          {\\textbf{${project.title || 'Project Title'}} $|$ \\emph{${(project.technologies || []).join(', ')}}}{${project.date || 'Date'}}
          \\resumeItemListStart
            \\resumeItem{${project.description || 'Project description and key achievements'}}
          \\resumeItemListEnd`).join('');
  }
}

module.exports = new ClassicTemplate();