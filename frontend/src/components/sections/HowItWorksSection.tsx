import React from 'react';
import { Upload, Brain, Download, Mail } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      number: 1,
      icon: Upload,
      title: 'Upload & Input',
      description: 'Paste the job description and upload your LaTeX resume or choose from our templates.',
      details: ['Paste job description', 'Upload .tex file or use templates', 'Import from Overleaf'],
    },
    {
      number: 2,
      icon: Brain,
      title: 'AI Analysis & Optimization',
      description: 'AI compares your resume with the job requirements and suggests keyword optimizations.',
      details: ['Keyword gap analysis', 'Content tailoring', 'ATS compatibility check'],
    },
    {
      number: 3,
      icon: Download,
      title: 'Preview & Export',
      description: 'Review the optimized resume, make final edits, and export in multiple formats.',
      details: ['Live PDF preview', 'Export PDF & DOCX', 'Auto-save to Google Drive'],
    },
    {
      number: 4,
      icon: Mail,
      title: 'Smart Outreach',
      description: 'Generate personalized cold emails and send them directly with your resume attached.',
      details: ['AI-generated emails', 'Personalized content', 'Direct sending via Gmail/Outlook'],
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Simple 4-step process to transform your resume and land more interviews
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-teal-200 to-orange-200"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Step Card */}
                <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100 hover:border-blue-200 transition-all duration-300 group">
                  {/* Step Number */}
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-teal-600 text-white rounded-full font-bold text-xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    {step.number}
                  </div>
                  
                  {/* Icon */}
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors duration-300">
                      <step.icon className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">
                    {step.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 text-center leading-relaxed">
                    {step.description}
                  </p>
                  
                  {/* Details */}
                  <ul className="space-y-2">
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-center text-sm text-gray-500">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-3"></div>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Arrow (hidden on mobile) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-24 -right-4 w-8 h-8">
                    <div className="w-0 h-0 border-l-8 border-l-blue-300 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Demo Video Placeholder */}
        <div className="mt-20">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">See It In Action</h3>
              <p className="text-gray-600">Watch how ResumeAI transforms a regular resume into an ATS-optimized masterpiece</p>
            </div>
            
            {/* Video placeholder */}
            <div className="relative bg-gray-900 rounded-xl overflow-hidden aspect-video">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-teal-600/20"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="bg-white text-blue-600 w-20 h-20 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-lg">
                  <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </button>
              </div>
              
              {/* Demo metrics overlay */}
              <div className="absolute bottom-4 left-4 bg-black/70 text-white px-4 py-2 rounded-lg">
                <div className="text-sm">Demo: Marketing Manager Position</div>
                <div className="text-xs text-gray-300">ATS Score: 87% → 94%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};