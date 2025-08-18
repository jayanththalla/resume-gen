import React, { useState } from 'react';
import { Send, Sparkles, Building, Briefcase } from 'lucide-react';
import { Button } from '../common/Button';
import { JobDescription } from '../../types/resume';

interface JdInputProps {
  onSubmit: (jd: JobDescription) => void;
  isProcessing?: boolean;
}

export const JdInput: React.FC<JdInputProps> = ({ onSubmit, isProcessing = false }) => {
  const [content, setContent] = useState('');
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim() || !company.trim() || !position.trim()) {
      return;
    }

    // Extract keywords and requirements (simplified for demo)
    const keywords = extractKeywords(content);
    const requirements = extractRequirements(content);

    const jobDescription: JobDescription = {
      id: Date.now().toString(),
      content: content.trim(),
      company: company.trim(),
      position: position.trim(),
      keywords,
      requirements,
      createdAt: new Date(),
    };

    onSubmit(jobDescription);
  };

  const extractKeywords = (text: string): string[] => {
    // Simplified keyword extraction - in real app, this would use NLP
    const commonKeywords = [
      'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'AWS', 'Docker',
      'Kubernetes', 'SQL', 'MongoDB', 'Git', 'Agile', 'Scrum', 'REST API', 'GraphQL',
      'Machine Learning', 'Data Analysis', 'Project Management', 'Leadership'
    ];
    
    return commonKeywords.filter(keyword => 
      text.toLowerCase().includes(keyword.toLowerCase())
    );
  };

  const extractRequirements = (text: string): string[] => {
    // Extract bullet points or numbered requirements
    const lines = text.split('\n');
    return lines
      .filter(line => line.trim().match(/^[-•*]\s|^\d+\.\s/))
      .map(line => line.replace(/^[-•*]\s|^\d+\.\s/, '').trim())
      .filter(line => line.length > 0);
  };

  const isFormValid = content.trim() && company.trim() && position.trim();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <Sparkles className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Let's Start with the Job Description
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Paste the job description below, and I'll analyze it to optimize your resume with the right keywords and content.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Company and Position */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
              <Building className="w-4 h-4 inline mr-2" />
              Company Name
            </label>
            <input
              type="text"
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g., Google, Microsoft, Startup Inc."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              disabled={isProcessing}
            />
          </div>
          
          <div>
            <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-2">
              <Briefcase className="w-4 h-4 inline mr-2" />
              Position Title
            </label>
            <input
              type="text"
              id="position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="e.g., Software Engineer, Product Manager"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              disabled={isProcessing}
            />
          </div>
        </div>

        {/* Job Description */}
        <div>
          <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700 mb-2">
            Job Description
          </label>
          <textarea
            id="jobDescription"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste the complete job description here. Include requirements, responsibilities, and preferred qualifications..."
            rows={12}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
            disabled={isProcessing}
          />
          <div className="flex justify-between items-center mt-2">
            <p className="text-sm text-gray-500">
              {content.length} characters • {content.split(/\s+/).filter(word => word.length > 0).length} words
            </p>
            {content.length > 0 && (
              <p className="text-sm text-green-600">
                ✓ Looking good! The more details, the better the optimization.
              </p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center pt-4">
          <Button
            type="submit"
            size="lg"
            icon={Send}
            disabled={!isFormValid || isProcessing}
            className="min-w-48"
          >
            {isProcessing ? 'Analyzing...' : 'Analyze Job Description'}
          </Button>
        </div>
      </form>

      {/* Tips */}
      <div className="mt-12 bg-blue-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">💡 Pro Tips for Better Results</h3>
        <ul className="space-y-2 text-blue-800">
          <li className="flex items-start">
            <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            Include the complete job posting with requirements, responsibilities, and qualifications
          </li>
          <li className="flex items-start">
            <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            Don't edit or summarize - paste the original text for best keyword extraction
          </li>
          <li className="flex items-start">
            <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            The more detailed the JD, the more personalized your resume optimization will be
          </li>
        </ul>
      </div>
    </div>
  );
};