const nodemailer = require('nodemailer');
const aiService = require('./aiService');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });

    this.templates = {
      application: {
        name: 'Job Application',
        description: 'Standard job application email'
      },
      followUp: {
        name: 'Follow-up',
        description: 'Follow-up after job application'
      },
      networking: {
        name: 'Networking',
        description: 'Networking and informational interviews'
      }
    };
  }

  async generateColdEmail({ jobDescription, companyName, personalInfo, resumeHighlights, emailType = 'application' }) {
    try {
      // Use AI to generate personalized cold email
      const emailContent = await aiService.generateColdEmail({
        companyInfo: { name: companyName },
        jobInfo: { description: jobDescription },
        personalInfo,
        resumeContent: resumeHighlights || ''
      });

      return {
        subject: emailContent.subject,
        body: emailContent.body,
        keyPoints: emailContent.keyPoints,
        callToAction: emailContent.callToAction,
        tone: emailContent.tone,
        length: emailContent.length,
        type: emailType,
        generatedAt: new Date().toISOString()
      };

    } catch (error) {
      console.error('Cold email generation error:', error);
      throw new Error('Failed to generate cold email');
    }
  }

  async generateFollowUpEmail({ originalEmail, daysSinceApplication, companyName, personalInfo }) {
    const prompt = `
Generate a follow-up email for a job application:

Original Email: ${originalEmail}
Days Since Application: ${daysSinceApplication}
Company: ${companyName}
Personal Info: ${JSON.stringify(personalInfo)}

Generate a professional follow-up email in JSON format:
{
  "subject": "follow-up subject line",
  "body": "follow-up email body",
  "tone": "professional/friendly",
  "timing": "appropriate timing note"
}
`;

    try {
      const response = await aiService.callOpenAI([
        {
          role: 'system',
          content: 'You are an expert at writing professional follow-up emails for job applications.'
        },
        {
          role: 'user',
          content: prompt
        }
      ]);

      const emailContent = JSON.parse(response);
      
      return {
        ...emailContent,
        type: 'follow-up',
        generatedAt: new Date().toISOString()
      };

    } catch (error) {
      console.error('Follow-up email generation error:', error);
      throw new Error('Failed to generate follow-up email');
    }
  }

  async sendEmail({ to, subject, body, attachments = [] }) {
    try {
      const mailOptions = {
        from: process.env.GMAIL_USER,
        to,
        subject,
        html: this.formatEmailBody(body),
        attachments: attachments.map(att => ({
          filename: att.filename,
          path: att.path
        }))
      };

      const result = await this.transporter.sendMail(mailOptions);
      
      return {
        messageId: result.messageId,
        response: result.response,
        accepted: result.accepted,
        rejected: result.rejected
      };

    } catch (error) {
      console.error('Email sending error:', error);
      throw new Error('Failed to send email');
    }
  }

  formatEmailBody(body) {
    // Convert plain text to HTML with proper formatting
    return body
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>')
      .replace(/^(.*)$/, '<p>$1</p>')
      .replace(/<p><\/p>/g, '')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');
  }

  async analyzeEmailEffectiveness({ subject, body, recipientInfo = {} }) {
    const prompt = `
Analyze the effectiveness of this job application email:

Subject: ${subject}
Body: ${body}
Recipient Info: ${JSON.stringify(recipientInfo)}

Provide analysis in JSON format:
{
  "overallScore": 0-100,
  "subjectAnalysis": {
    "score": 0-100,
    "feedback": "feedback text",
    "suggestions": ["suggestion1", "suggestion2"]
  },
  "bodyAnalysis": {
    "score": 0-100,
    "strengths": ["strength1", "strength2"],
    "weaknesses": ["weakness1", "weakness2"],
    "suggestions": ["suggestion1", "suggestion2"]
  },
  "personalization": {
    "score": 0-100,
    "level": "low/medium/high",
    "improvements": ["improvement1", "improvement2"]
  },
  "tone": {
    "detected": "professional/casual/enthusiastic",
    "appropriateness": "appropriate/inappropriate",
    "suggestions": ["suggestion1"]
  },
  "callToAction": {
    "present": true/false,
    "clarity": "clear/unclear",
    "strength": "weak/medium/strong"
  }
}
`;

    try {
      const response = await aiService.callOpenAI([
        {
          role: 'system',
          content: 'You are an expert email analyst specializing in job application emails.'
        },
        {
          role: 'user',
          content: prompt
        }
      ]);

      return JSON.parse(response);

    } catch (error) {
      console.error('Email analysis error:', error);
      throw new Error('Failed to analyze email effectiveness');
    }
  }

  async getEmailTemplates() {
    return Object.keys(this.templates).map(key => ({
      id: key,
      name: this.templates[key].name,
      description: this.templates[key].description
    }));
  }

  async verifyEmailConfiguration() {
    try {
      await this.transporter.verify();
      return { configured: true, message: 'Email configuration is valid' };
    } catch (error) {
      console.error('Email verification error:', error);
      return { configured: false, message: 'Email configuration is invalid' };
    }
  }
}

module.exports = new EmailService();