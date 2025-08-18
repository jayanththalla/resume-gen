const aiService = require('./aiService');
const fileService = require('./fileService');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

class ResumeService {
  constructor() {
    this.templates = {
      classic: require('../templates/classic'),
      modern: require('../templates/modern'),
      technical: require('../templates/technical'),
      creative: require('../templates/creative')
    };
  }

  async parseResume(content) {
    try {
      // Parse different resume formats
      if (this.isLatexContent(content)) {
        return await this.parseLatexResume(content);
      } else if (this.isMarkdownContent(content)) {
        return await this.parseMarkdownResume(content);
      } else {
        return await this.parsePlainTextResume(content);
      }
    } catch (error) {
      console.error('Resume parsing error:', error);
      throw new Error('Failed to parse resume content');
    }
  }

  isLatexContent(content) {
    return content.includes('\\documentclass') || content.includes('\\begin{document}');
  }

  isMarkdownContent(content) {
    return content.includes('#') || content.includes('##') || content.includes('**');
  }

  async parseLatexResume(latexContent) {
    // Extract sections from LaTeX resume
    const sections = {
      personalInfo: this.extractPersonalInfo(latexContent),
      summary: this.extractSection(latexContent, 'summary'),
      experience: this.extractExperience(latexContent),
      education: this.extractEducation(latexContent),
      skills: this.extractSkills(latexContent),
      projects: this.extractProjects(latexContent),
      certifications: this.extractCertifications(latexContent)
    };

    return {
      type: 'latex',
      originalContent: latexContent,
      sections,
      structure: this.analyzeStructure(latexContent)
    };
  }

  async parseMarkdownResume(markdownContent) {
    // Parse markdown resume format
    const sections = {
      personalInfo: this.extractMarkdownPersonalInfo(markdownContent),
      summary: this.extractMarkdownSection(markdownContent, 'Summary'),
      experience: this.extractMarkdownExperience(markdownContent),
      education: this.extractMarkdownEducation(markdownContent),
      skills: this.extractMarkdownSkills(markdownContent)
    };

    return {
      type: 'markdown',
      originalContent: markdownContent,
      sections,
      structure: { format: 'markdown' }
    };
  }

  async parsePlainTextResume(textContent) {
    // Use AI to parse unstructured text resume
    const prompt = `
Parse this resume and extract structured information:

${textContent}

Return JSON with sections:
{
  "personalInfo": {
    "name": "",
    "email": "",
    "phone": "",
    "location": "",
    "linkedin": "",
    "github": ""
  },
  "summary": "",
  "experience": [
    {
      "company": "",
      "position": "",
      "duration": "",
      "description": "",
      "achievements": []
    }
  ],
  "education": [
    {
      "institution": "",
      "degree": "",
      "field": "",
      "year": "",
      "gpa": ""
    }
  ],
  "skills": {
    "technical": [],
    "soft": [],
    "tools": [],
    "languages": []
  }
}
`;

    try {
      const aiResponse = await aiService.callOpenAI([
        {
          role: 'system',
          content: 'You are a resume parsing expert. Extract structured data from resumes accurately.'
        },
        {
          role: 'user',
          content: prompt
        }
      ]);

      const sections = JSON.parse(aiResponse);
      return {
        type: 'text',
        originalContent: textContent,
        sections,
        structure: { format: 'text' }
      };
    } catch (error) {
      throw new Error('Failed to parse plain text resume');
    }
  }

  extractPersonalInfo(content) {
    const info = {};
    
    // Extract email
    const emailMatch = content.match(/[\w\.-]+@[\w\.-]+\.\w+/);
    if (emailMatch) info.email = emailMatch[0];
    
    // Extract phone
    const phoneMatch = content.match(/[\+]?[1-9]?[\d\s\-\(\)]{10,}/);
    if (phoneMatch) info.phone = phoneMatch[0];
    
    // Extract name (usually first non-command line)
    const nameMatch = content.match(/^([A-Z][a-z]+\s+[A-Z][a-z]+)/m);
    if (nameMatch) info.name = nameMatch[1];

    return info;
  }

  extractSection(content, sectionName) {
    const regex = new RegExp(`\\\\section{${sectionName}}([\\s\\S]*?)(?=\\\\section|$)`, 'i');
    const match = content.match(regex);
    return match ? match[1].trim() : '';
  }

  extractExperience(content) {
    // Extract work experience entries
    const experiences = [];
    const experiencePattern = /\\textbf{([^}]+)}\s*\\hfill\s*([^\\]+)\\\\([^\\]*)\\\\\s*\\textit{([^}]+)}/g;
    
    let match;
    while ((match = experiencePattern.exec(content)) !== null) {
      experiences.push({
        position: match[1],
        duration: match[2].trim(),
        company: match[4],
        description: match[3].trim()
      });
    }
    
    return experiences;
  }

  extractEducation(content) {
    const education = [];
    const eduPattern = /\\textbf{([^}]+)}\s*\\hfill\s*([^\\]+)\\\\([^\\]*)/g;
    
    let match;
    while ((match = eduPattern.exec(content)) !== null) {
      education.push({
        institution: match[1],
        duration: match[2].trim(),
        degree: match[3].trim()
      });
    }
    
    return education;
  }

  extractSkills(content) {
    const skillsSection = this.extractSection(content, 'Skills');
    if (!skillsSection) return { technical: [], soft: [], tools: [] };
    
    return {
      technical: this.extractSkillsList(skillsSection, 'Technical'),
      soft: this.extractSkillsList(skillsSection, 'Soft'),
      tools: this.extractSkillsList(skillsSection, 'Tools')
    };
  }

  extractSkillsList(content, category) {
    const pattern = new RegExp(`${category}[^:]*:([^\\n]+)`, 'i');
    const match = content.match(pattern);
    
    if (match) {
      return match[1].split(',').map(skill => skill.trim()).filter(Boolean);
    }
    
    return [];
  }

  extractProjects(content) {
    const projects = [];
    const projectPattern = /\\textbf{([^}]+)}\s*([^\\]*)/g;
    
    let match;
    while ((match = projectPattern.exec(content)) !== null) {
      projects.push({
        title: match[1],
        description: match[2].trim()
      });
    }
    
    return projects;
  }

  extractCertifications(content) {
    const certifications = [];
    const certPattern = /\\item\s*([^\\]+)/g;
    
    let match;
    while ((match = certPattern.exec(content)) !== null) {
      certifications.push(match[1].trim());
    }
    
    return certifications;
  }

  extractMarkdownPersonalInfo(content) {
    const lines = content.split('\n');
    const info = {};
    
    for (const line of lines) {
      if (line.includes('@')) {
        const emailMatch = line.match(/[\w\.-]+@[\w\.-]+\.\w+/);
        if (emailMatch) info.email = emailMatch[0];
      }
      
      if (line.includes('phone') || line.includes('Phone')) {
        const phoneMatch = line.match(/[\+]?[1-9]?[\d\s\-\(\)]{10,}/);
        if (phoneMatch) info.phone = phoneMatch[0];
      }
    }
    
    return info;
  }

  extractMarkdownSection(content, sectionName) {
    const regex = new RegExp(`#+\\s*${sectionName}[^\\n]*\\n([\\s\\S]*?)(?=#+|$)`, 'i');
    const match = content.match(regex);
    return match ? match[1].trim() : '';
  }

  extractMarkdownExperience(content) {
    const experiences = [];
    const experienceSection = this.extractMarkdownSection(content, 'Experience');
    
    if (experienceSection) {
      const entries = experienceSection.split(/\n(?=##|\*\*)/);
      
      for (const entry of entries) {
        const lines = entry.split('\n').filter(Boolean);
        if (lines.length >= 2) {
          experiences.push({
            position: lines[0].replace(/[#*]/g, '').trim(),
            company: lines[1].replace(/[#*]/g, '').trim(),
            description: lines.slice(2).join(' ')
          });
        }
      }
    }
    
    return experiences;
  }

  extractMarkdownEducation(content) {
    const education = [];
    const educationSection = this.extractMarkdownSection(content, 'Education');
    
    if (educationSection) {
      const entries = educationSection.split(/\n(?=##|\*\*)/);
      
      for (const entry of entries) {
        const lines = entry.split('\n').filter(Boolean);
        if (lines.length >= 2) {
          education.push({
            degree: lines[0].replace(/[#*]/g, '').trim(),
            institution: lines[1].replace(/[#*]/g, '').trim()
          });
        }
      }
    }
    
    return education;
  }

  extractMarkdownSkills(content) {
    const skillsSection = this.extractMarkdownSection(content, 'Skills');
    const skills = { technical: [], soft: [], tools: [] };
    
    if (skillsSection) {
      const lines = skillsSection.split('\n');
      
      for (const line of lines) {
        if (line.includes(':')) {
          const [category, skillsList] = line.split(':');
          const cleanCategory = category.replace(/[#*-]/g, '').trim().toLowerCase();
          const skillArray = skillsList.split(',').map(s => s.trim()).filter(Boolean);
          
          if (cleanCategory.includes('technical') || cleanCategory.includes('programming')) {
            skills.technical = skillArray;
          } else if (cleanCategory.includes('soft') || cleanCategory.includes('interpersonal')) {
            skills.soft = skillArray;
          } else if (cleanCategory.includes('tool') || cleanCategory.includes('software')) {
            skills.tools = skillArray;
          }
        }
      }
    }
    
    return skills;
  }

  analyzeStructure(content) {
    return {
      documentClass: this.extractDocumentClass(content),
      packages: this.extractPackages(content),
      sections: this.extractSectionNames(content),
      format: 'latex'
    };
  }

  extractDocumentClass(content) {
    const match = content.match(/\\documentclass(?:\[([^\]]+)\])?\{([^}]+)\}/);
    return match ? { options: match[1], class: match[2] } : null;
  }

  extractPackages(content) {
    const packages = [];
    const packagePattern = /\\usepackage(?:\[([^\]]+)\])?\{([^}]+)\}/g;
    
    let match;
    while ((match = packagePattern.exec(content)) !== null) {
      packages.push({
        name: match[2],
        options: match[1]
      });
    }
    
    return packages;
  }

  extractSectionNames(content) {
    const sections = [];
    const sectionPattern = /\\section\{([^}]+)\}/g;
    
    let match;
    while ((match = sectionPattern.exec(content)) !== null) {
      sections.push(match[1]);
    }
    
    return sections;
  }

  async optimizeResume({ resumeContent, jobDescription, options = {} }) {
    try {
      // Get AI suggestions for optimization
      const suggestions = await aiService.getOptimizationSuggestions({
        jobDescription,
        resumeContent
      });

      // Apply optimizations based on suggestions
      let optimizedContent = resumeContent;

      if (options.autoApply) {
        optimizedContent = await this.applyOptimizations(resumeContent, suggestions);
      }

      return {
        originalContent: resumeContent,
        optimizedContent,
        suggestions,
        score: suggestions.overallScore,
        changes: suggestions.suggestions,
        keywords: suggestions.missingKeywords
      };

    } catch (error) {
      console.error('Resume optimization error:', error);
      throw new Error('Failed to optimize resume');
    }
  }

  async applyOptimizations(content, suggestions) {
    let optimizedContent = content;

    for (const suggestion of suggestions.suggestions) {
      if (suggestion.impact === 'high' && suggestion.current && suggestion.suggested) {
        optimizedContent = optimizedContent.replace(
          suggestion.current,
          suggestion.suggested
        );
      }
    }

    return optimizedContent;
  }

  async generateFromTemplate({ template, personalInfo, sections }) {
    try {
      const templateGenerator = this.templates[template];
      
      if (!templateGenerator) {
        throw new Error('Template not found');
      }

      const generatedResume = await templateGenerator.generate({
        personalInfo,
        sections
      });

      return {
        content: generatedResume.content,
        template,
        metadata: generatedResume.metadata
      };

    } catch (error) {
      console.error('Resume generation error:', error);
      throw new Error('Failed to generate resume from template');
    }
  }

  async exportResume({ content, format, companyName }) {
    try {
      const fileName = this.generateFileName(companyName, format);
      
      let filePath;
      
      if (format.toLowerCase() === 'pdf') {
        filePath = await fileService.generatePDF(content, fileName);
      } else if (format.toLowerCase() === 'docx') {
        filePath = await fileService.generateDOCX(content, fileName);
      } else {
        throw new Error('Unsupported export format');
      }

      return {
        path: filePath,
        name: fileName,
        format
      };

    } catch (error) {
      console.error('Resume export error:', error);
      throw new Error('Failed to export resume');
    }
  }

  generateFileName(companyName, format) {
    const timestamp = new Date().toISOString().slice(0, 10);
    const sanitizedCompany = companyName 
      ? companyName.replace(/[^a-zA-Z0-9]/g, '_') 
      : 'Resume';
    
    return `${sanitizedCompany}_${timestamp}.${format.toLowerCase()}`;
  }

  async getTemplates() {
    return Object.keys(this.templates).map(key => ({
      id: key,
      name: this.templates[key].name,
      description: this.templates[key].description,
      preview: this.templates[key].preview,
      category: this.templates[key].category
    }));
  }

  async chatOptimization({ message, resumeContent, jobDescription, history }) {
    try {
      const response = await aiService.chatOptimization({
        message,
        resumeContent,
        jobDescription,
        history
      });

      return {
        response: response.response,
        suggestions: response.suggestions,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Chat optimization error:', error);
      throw new Error('Failed to process chat optimization');
    }
  }
}

module.exports = new ResumeService();