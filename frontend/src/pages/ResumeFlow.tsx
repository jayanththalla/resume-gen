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

  const handleJdSubmit = async (jd: any) => {
    setJobDescription(jd);
    addMessage({ type: 'user', content: `Job description for ${jd.position} at ${jd.company} submitted.` });
    
    try {
      const response = await fetch('http://localhost:3000/api/job/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription: jd.description }),
      });

      if (!response.ok) throw new Error('Failed to analyze job description.');

      const data = await response.json();

      addMessage({
        type: 'ai',
        content: `Great! I've analyzed the ${jd.position} position at ${jd.company}. I found ${data.keywords.length} key skills. Now, let's get your resume.`,
      });

    } catch (error) {
      addMessage({
        type: 'ai',
        content: `Sorry, I encountered an error analyzing the job description. Please try again.`,
      });
    }
  };

  const handleSourceSelect = async (source: any) => {
    setResumeSource(source);
    addMessage({ type: 'user', content: `Resume source selected: ${source.type}` });

    try {
      let resumeText = '';
      if (source.type === 'upload') {
        const formData = new FormData();
        formData.append('resume', source.file);

        const parseResponse = await fetch('http://localhost:3000/api/resume/parse', {
          method: 'POST',
          body: formData,
        });
        if (!parseResponse.ok) throw new Error('Failed to parse resume.');
        const parsedData = await parseResponse.json();
        resumeText = parsedData.text;
      } else if (source.type === 'paste') {
        resumeText = source.content;
      }

      addMessage({ type: 'ai', content: `Great, I have your resume. Now, I'm optimizing it for the ${state.jobDescription?.position} role...` });

      const optimizeResponse = await fetch('http://localhost:3000/api/resume/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeContent: resumeText,
          jobDescription: state.jobDescription?.description,
        }),
      });
      if (!optimizeResponse.ok) throw new Error('Failed to optimize resume.');
      const optimizedData = await optimizeResponse.json();

      addMessage({
        type: 'ai',
        content: `I've finished optimizing your resume. Here are my suggestions:`,
        suggestions: optimizedData.suggestions,
      });

    } catch (error) {
      addMessage({ type: 'ai', content: 'Sorry, I encountered an error processing your resume. Please try again.' });
    }
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

  const handleExport = async (options: { format: 'pdf' | 'docx' }) => {
    try {
      const response = await fetch('http://localhost:3000/api/resume/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeContent: state.optimizedContent,
          format: options.format,
          companyName: state.jobDescription?.company,
        }),
      });
      if (!response.ok) throw new Error('Failed to export resume.');

      const data = await response.json();

      // Trigger download
      const link = document.createElement('a');
      link.href = `http://localhost:3000${data.downloadUrl}`;
      link.setAttribute('download', data.fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      addMessage({ type: 'ai', content: 'Sorry, I encountered an error exporting your resume. Please try again.' });
    }
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