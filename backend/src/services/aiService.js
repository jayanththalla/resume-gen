const axios = require('axios');

class AIService {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    this.model = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';
    this.baseURL = 'https://api.openai.com/v1';
  }

  async callOpenAI(messages, options = {}) {
    try {
      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: this.model,
          messages,
          temperature: options.temperature || 0.7,
          max_tokens: options.maxTokens || 2000,
          top_p: options.topP || 1,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API error:', error.response?.data || error.message);
      throw new Error('Failed to get AI response');
    }
  }

  async analyzeJobDescription({ jobDescription, companyName, jobTitle, requirements }) {
    const prompt = `
Analyze the following job description and extract key information:

Job Description:
${jobDescription}

Company Name: ${companyName || 'Not specified'}
Job Title: ${jobTitle || 'Not specified'}
Additional Requirements: ${requirements?.join(', ') || 'None'}

Please provide a JSON response with the following structure:
{
  "keywords": ["keyword1", "keyword2", ...],
  "requirements": ["requirement1", "requirement2", ...],
  "skills": {
    "technical": ["skill1", "skill2", ...],
    "soft": ["skill1", "skill2", ...]
  },
  "experience": {
    "years": "X-Y years",
    "level": "entry/mid/senior",
    "domains": ["domain1", "domain2", ...]
  },
  "education": ["education requirement 1", ...],
  "companyInfo": {
    "industry": "industry",
    "size": "company size",
    "culture": "company culture insights"
  },
  "jobInfo": {
    "responsibilities": ["responsibility1", ...],
    "benefits": ["benefit1", ...],
    "location": "location"
  },
  "atsScore": {
    "importance": 0.0-1.0,
    "keyFactors": ["factor1", "factor2", ...]
  }
}
`;

    const messages = [
      {
        role: 'system',
        content: 'You are an expert ATS (Applicant Tracking System) analyzer and career consultant. Provide detailed, accurate analysis in valid JSON format.'
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    const response = await this.callOpenAI(messages);
    
    try {
      return JSON.parse(response);
    } catch (error) {
      console.error('Failed to parse AI response as JSON:', response);
      throw new Error('Invalid AI response format');
    }
  }

  async getOptimizationSuggestions({ jobDescription, resumeContent }) {
    const prompt = `
Compare the following resume with the job description and provide optimization suggestions:

JOB DESCRIPTION:
${jobDescription}

RESUME:
${resumeContent}

Provide suggestions in JSON format:
{
  "overallScore": 0-100,
  "missingKeywords": ["keyword1", "keyword2", ...],
  "suggestions": [
    {
      "section": "section name",
      "current": "current text",
      "suggested": "improved text",
      "reason": "explanation",
      "impact": "high/medium/low"
    }
  ],
  "strengthsToHighlight": ["strength1", "strength2", ...],
  "weaknessesToAddress": ["weakness1", "weakness2", ...],
  "atsOptimizations": ["optimization1", "optimization2", ...]
}
`;

    const messages = [
      {
        role: 'system',
        content: 'You are an expert resume optimizer specializing in ATS compatibility. Provide specific, actionable suggestions.'
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    const response = await this.callOpenAI(messages);
    
    try {
      return JSON.parse(response);
    } catch (error) {
      console.error('Failed to parse optimization suggestions:', response);
      throw new Error('Invalid optimization response format');
    }
  }

  async extractCompanyInfo({ companyName, jobDescription }) {
    const prompt = `
Research and extract information about the company "${companyName}" based on the job description context:

Job Description Context:
${jobDescription || 'No additional context provided'}

Provide company information in JSON format:
{
  "name": "${companyName}",
  "industry": "industry sector",
  "size": "estimated company size",
  "culture": "company culture description",
  "values": ["value1", "value2", ...],
  "recentNews": ["news item 1", "news item 2", ...],
  "keyPeople": ["person 1", "person 2", ...],
  "products": ["product 1", "product 2", ...],
  "competitors": ["competitor 1", "competitor 2", ...],
  "opportunities": ["opportunity 1", "opportunity 2", ...]
}
`;

    const messages = [
      {
        role: 'system',
        content: 'You are a company research expert. Provide comprehensive company information based on available context and general knowledge.'
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    const response = await this.callOpenAI(messages);
    
    try {
      return JSON.parse(response);
    } catch (error) {
      console.error('Failed to parse company info:', response);
      throw new Error('Invalid company info response format');
    }
  }

  async generateColdEmail({ companyInfo, jobInfo, personalInfo, resumeContent }) {
    const prompt = `
Generate a personalized cold email for a job application:

COMPANY INFO:
${JSON.stringify(companyInfo, null, 2)}

JOB INFO:
${JSON.stringify(jobInfo, null, 2)}

PERSONAL INFO:
${JSON.stringify(personalInfo, null, 2)}

RESUME HIGHLIGHTS:
${resumeContent}

Generate a professional, personalized cold email in JSON format:
{
  "subject": "compelling subject line",
  "body": "email body with proper formatting",
  "keyPoints": ["key point 1", "key point 2", ...],
  "callToAction": "specific call to action",
  "tone": "professional/friendly/enthusiastic",
  "length": "short/medium/long"
}
`;

    const messages = [
      {
        role: 'system',
        content: 'You are an expert cold email writer specializing in job applications. Write compelling, personalized emails that get responses.'
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    const response = await this.callOpenAI(messages);
    
    try {
      return JSON.parse(response);
    } catch (error) {
      console.error('Failed to parse cold email:', response);
      throw new Error('Invalid cold email response format');
    }
  }

  async chatOptimization({ message, resumeContent, jobDescription, history }) {
    const systemPrompt = `
You are an expert resume optimization assistant. You help users improve their resumes for specific job applications.

Context:
- Job Description: ${jobDescription}
- Resume Content: ${resumeContent}

Previous conversation:
${history.map(h => `${h.role}: ${h.content}`).join('\n')}

Provide helpful, specific advice about resume optimization, keyword inclusion, and ATS compatibility.
Be conversational but professional. Offer specific suggestions when possible.
`;

    const messages = [
      {
        role: 'system',
        content: systemPrompt
      },
      {
        role: 'user',
        content: message
      }
    ];

    const response = await this.callOpenAI(messages, { temperature: 0.8 });
    
    return {
      response,
      suggestions: await this.extractSuggestionsFromChat(response, resumeContent)
    };
  }

  async extractSuggestionsFromChat(chatResponse, resumeContent) {
    // Extract actionable suggestions from chat response
    const prompt = `
Based on this chat response about resume optimization:
"${chatResponse}"

And this resume content:
"${resumeContent}"

Extract specific, actionable suggestions in JSON format:
{
  "suggestions": [
    {
      "type": "add/modify/remove",
      "section": "section name",
      "suggestion": "specific suggestion",
      "priority": "high/medium/low"
    }
  ]
}
`;

    const messages = [
      {
        role: 'system',
        content: 'Extract actionable suggestions from resume optimization advice.'
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    try {
      const response = await this.callOpenAI(messages, { temperature: 0.3 });
      return JSON.parse(response);
    } catch (error) {
      return { suggestions: [] };
    }
  }
}

module.exports = new AIService();