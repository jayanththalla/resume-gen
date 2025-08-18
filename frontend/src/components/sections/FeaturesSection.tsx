import React from 'react';
import { FileText, Brain, Mail, Cloud, Zap, Target, Download, Globe } from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: Brain,
      title: 'ATS-Optimized Resumes',
      description: 'AI analyzes job descriptions and optimizes your resume with missing keywords and tailored content.',
      color: 'blue',
    },
    {
      icon: FileText,
      title: 'LaTeX or Template-Based',
      description: 'Import from Overleaf, upload .tex files, or choose from our ATS-friendly templates.',
      color: 'teal',
    },
    {
      icon: Zap,
      title: 'Chat-Like Customization',
      description: 'Interactive editing experience where you can approve, reject, or modify AI suggestions.',
      color: 'orange',
    },
    {
      icon: Target,
      title: 'Keyword Analysis',
      description: 'Advanced keyword extraction identifies gaps between your resume and job requirements.',
      color: 'green',
    },
    {
      icon: Download,
      title: 'Multi-Format Export',
      description: 'Export your optimized resume in PDF and DOCX formats with professional formatting.',
      color: 'purple',
    },
    {
      icon: Cloud,
      title: 'Auto Cloud Backup',
      description: 'Automatically saves to Google Drive with organized naming: CompanyName_YourName.',
      color: 'indigo',
    },
    {
      icon: Mail,
      title: 'Smart Cold Emails',
      description: 'AI-generated personalized outreach emails with your resume automatically attached.',
      color: 'pink',
    },
    {
      icon: Globe,
      title: 'Direct Email Sending',
      description: 'Send emails directly through Gmail or Outlook APIs with professional templates.',
      color: 'cyan',
    },
  ];

  const colorMap = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    teal: 'bg-teal-50 text-teal-600 border-teal-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-200',
    pink: 'bg-pink-50 text-pink-600 border-pink-200',
    cyan: 'bg-cyan-50 text-cyan-600 border-cyan-200',
  };

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Powerful Features for Job Success
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to create ATS-optimized resumes and send personalized outreach emails that get results.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white rounded-xl border border-gray-200 p-6 hover:shadow-xl hover:border-gray-300 transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 ${colorMap[feature.color as keyof typeof colorMap]}`}>
                <feature.icon className="h-6 w-6" />
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to optimize your resume?</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Join thousands of job seekers who have improved their ATS pass rates and landed more interviews.
            </p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transform hover:scale-105 transition-all duration-200 shadow-lg">
              Start Free Trial
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};