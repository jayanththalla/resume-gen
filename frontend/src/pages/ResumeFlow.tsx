import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useResume } from '../contexts/ResumeContext';
import { ProgressBar } from '../components/common/ProgressBar';
import { JdInput } from '../components/resume/JdInput';
import { ResumeSourceSelector } from '../components/resume/ResumeSourceSelector';
import { ChatInterface } from '../components/resume/ChatInterface';
import { PreviewPane } from '../components/resume/PreviewPane';
import { Button } from '../components/common/Button';

export const ResumeFlow: React.FC = () => {
  const { state, setJobDescription, setResumeSource, addMessage, approveSuggestion, rejectSuggestion, reset } = useResume();

  const steps = ['Job Description', 'Resume Source', 'AI Optimization', 'Preview & Export'];

  const handleJdSubmit = (jd: any) => {
    setJobDescription(jd);
    
    // Simulate AI analysis
    setTimeout(() => {
      addMessage({
        type: 'ai',
        content: `Great! I've analyzed the ${jd.position} position at ${jd.company}. I found ${jd.keywords.length} key technical skills and requirements. Now let's get your resume so I can optimize it for this specific role.`,
      });
    }, 1000);
  };

  const handleSourceSelect = (source: any) => {
    setResumeSource(source);
    
    // Simulate AI processing
    setTimeout(() => {
      addMessage({
        type: 'ai',
        content: `Perfect! I've received your resume. Now I'm analyzing it against the job requirements for ${state.jobDescription?.position} at ${state.jobDescription?.company}. I'll identify missing keywords and suggest improvements to maximize your ATS score.`,
      });
      
      // Add mock suggestions after a delay
      setTimeout(() => {
        const mockSuggestions = [
          {
            id: '1',
            type: 'keyword' as const,
            section: 'Technical Skills',
            original: 'JavaScript, HTML, CSS',
            suggested: 'JavaScript, TypeScript, HTML5, CSS3, React, Node.js',
            reason: 'The job description emphasizes TypeScript and React experience. Adding these keywords will significantly improve your ATS score.',
            impact: 'high' as const,
            status: 'pending' as const,
          },
          {
            id: '2',
            type: 'content' as const,
            section: 'Experience',
            original: 'Worked on web development projects',
            suggested: 'Developed scalable web applications using React and Node.js, serving 10,000+ daily active users',
            reason: 'Quantifying your impact and using specific technologies mentioned in the JD will make your experience more compelling.',
            impact: 'high' as const,
            status: 'pending' as const,
          },
          {
            id: '3',
            type: 'keyword' as const,
            section: 'Experience',
            original: 'team collaboration',
            suggested: 'cross-functional team collaboration in Agile/Scrum environment',
            reason: 'The job posting specifically mentions Agile methodology and cross-functional teamwork.',
            impact: 'medium' as const,
            status: 'pending' as const,
          },
        ];

        addMessage({
          type: 'ai',
          content: `I've completed my analysis! I found several opportunities to optimize your resume for this position. Here are my top recommendations to improve your ATS score and better match the job requirements:`,
          suggestions: mockSuggestions,
        });
      }, 2000);
    }, 1500);
  };

  const handleSendMessage = (content: string) => {
    addMessage({ type: 'user', content });
    
    // Simulate AI response
    setTimeout(() => {
      addMessage({
        type: 'ai',
        content: `I understand you'd like me to "${content}". Let me work on that for you. I'll analyze your resume and provide specific suggestions to address your request.`,
      });
    }, 1000);
  };

  const handleExport = (options: any) => {
    console.log('Exporting with options:', options);
    // Implement export logic
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                icon={ArrowLeft}
                onClick={() => window.history.back()}
              >
                Back
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">Resume Optimization</h1>
            </div>
            
            <Button
              variant="outline"
              onClick={reset}
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              Start Over
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <ProgressBar
          currentStep={state.progress.step}
          totalSteps={4}
          steps={steps}
          progress={state.progress.progress}
        />

        {/* Main Content */}
        <div className="mt-8">
          {state.progress.step === 1 && (
            <JdInput
              onSubmit={handleJdSubmit}
              isProcessing={state.isProcessing}
            />
          )}

          {state.progress.step === 2 && (
            <ResumeSourceSelector
              onSourceSelect={handleSourceSelect}
              isProcessing={state.isProcessing}
            />
          )}

          {state.progress.step === 3 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[800px]">
              <ChatInterface
                messages={state.messages}
                suggestions={state.suggestions}
                onSendMessage={handleSendMessage}
                onApproveSuggestion={approveSuggestion}
                onRejectSuggestion={rejectSuggestion}
                isProcessing={state.isProcessing}
              />
              <PreviewPane
                content={state.optimizedContent || 'preview'}
                onExport={handleExport}
              />
            </div>
          )}

          {state.progress.step === 4 && (
            <div className="max-w-4xl mx-auto">
              <PreviewPane
                content={state.optimizedContent}
                onExport={handleExport}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};