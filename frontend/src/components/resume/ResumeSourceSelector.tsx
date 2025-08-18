import React, { useState } from 'react';
import { ExternalLink, Upload, FileText, Palette, Link } from 'lucide-react';
import { Button } from '../common/Button';
import { FileUpload } from '../common/FileUpload';
import { ResumeSource, ResumeTemplate } from '../../types/resume';

interface ResumeSourceSelectorProps {
  onSourceSelect: (source: ResumeSource) => void;
  isProcessing?: boolean;
}

const mockTemplates: ResumeTemplate[] = [
  {
    id: 'modern-tech',
    name: 'Modern Tech',
    description: 'Clean, ATS-friendly template perfect for software engineers and tech professionals',
    category: 'tech',
    preview: 'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=300&h=400',
    latexCode: '% Modern Tech Resume Template\n\\documentclass[11pt,a4paper]{article}...',
    atsScore: 95,
  },
  {
    id: 'business-pro',
    name: 'Business Professional',
    description: 'Traditional format ideal for business, finance, and consulting roles',
    category: 'business',
    preview: 'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=300&h=400',
    latexCode: '% Business Professional Resume Template\n\\documentclass[11pt,a4paper]{article}...',
    atsScore: 92,
  },
  {
    id: 'creative-design',
    name: 'Creative Design',
    description: 'Stylish template for designers, marketers, and creative professionals',
    category: 'creative',
    preview: 'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=300&h=400',
    latexCode: '% Creative Design Resume Template\n\\documentclass[11pt,a4paper]{article}...',
    atsScore: 88,
  },
  {
    id: 'academic-research',
    name: 'Academic Research',
    description: 'Comprehensive format for researchers, professors, and PhD candidates',
    category: 'academic',
    preview: 'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=300&h=400',
    latexCode: '% Academic Research Resume Template\n\\documentclass[11pt,a4paper]{article}...',
    atsScore: 90,
  },
];

export const ResumeSourceSelector: React.FC<ResumeSourceSelectorProps> = ({
  onSourceSelect,
  isProcessing = false,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'overleaf' | 'paste' | 'template'>('upload');
  const [overleafUrl, setOverleafUrl] = useState('');
  const [pastedContent, setPastedContent] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  const handleFileUpload = (file: File, content: string) => {
    const source: ResumeSource = {
      type: 'upload',
      content,
      fileName: file.name,
    };
    onSourceSelect(source);
  };

  const handleOverleafSubmit = () => {
    if (!overleafUrl.trim()) return;
    
    const source: ResumeSource = {
      type: 'overleaf',
      content: '', // Would be fetched from Overleaf API
      overleafUrl: overleafUrl.trim(),
    };
    onSourceSelect(source);
  };

  const handlePasteSubmit = () => {
    if (!pastedContent.trim()) return;
    
    const source: ResumeSource = {
      type: 'paste',
      content: pastedContent.trim(),
    };
    onSourceSelect(source);
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = mockTemplates.find(t => t.id === templateId);
    if (!template) return;
    
    const source: ResumeSource = {
      type: 'template',
      content: template.latexCode,
      templateId,
    };
    onSourceSelect(source);
  };

  const tabs = [
    { id: 'upload', label: 'Upload File', icon: Upload },
    { id: 'overleaf', label: 'Overleaf', icon: ExternalLink },
    { id: 'paste', label: 'Paste LaTeX', icon: FileText },
    { id: 'template', label: 'Templates', icon: Palette },
  ] as const;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Choose Your Resume Source
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Upload your existing LaTeX resume, import from Overleaf, paste your code, or start with a template.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 p-1 rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              disabled={isProcessing}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        {activeTab === 'upload' && (
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Upload LaTeX File</h3>
            <FileUpload
              accept=".tex,.txt"
              maxSize={5}
              onFileSelect={handleFileUpload}
              placeholder="Drop your .tex file here or click to browse"
            />
          </div>
        )}

        {activeTab === 'overleaf' && (
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Import from Overleaf</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="overleafUrl" className="block text-sm font-medium text-gray-700 mb-2">
                  <Link className="w-4 h-4 inline mr-2" />
                  Overleaf Project URL
                </label>
                <input
                  type="url"
                  id="overleafUrl"
                  value={overleafUrl}
                  onChange={(e) => setOverleafUrl(e.target.value)}
                  placeholder="https://www.overleaf.com/project/your-project-id"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isProcessing}
                />
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> Make sure your Overleaf project is set to public or shared with link access.
                </p>
              </div>
              <Button
                onClick={handleOverleafSubmit}
                disabled={!overleafUrl.trim() || isProcessing}
                icon={ExternalLink}
              >
                Import from Overleaf
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'paste' && (
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Paste LaTeX Code</h3>
            <div className="space-y-4">
              <textarea
                value={pastedContent}
                onChange={(e) => setPastedContent(e.target.value)}
                placeholder="Paste your LaTeX resume code here..."
                rows={12}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                disabled={isProcessing}
              />
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  {pastedContent.length} characters
                </p>
                <Button
                  onClick={handlePasteSubmit}
                  disabled={!pastedContent.trim() || isProcessing}
                  icon={FileText}
                >
                  Use This Code
                </Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'template' && (
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Choose a Template</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {mockTemplates.map((template) => (
                <div
                  key={template.id}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                    selectedTemplate === template.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <div className="aspect-[3/4] bg-gray-100 rounded-lg mb-4 overflow-hidden">
                    <img
                      src={template.preview}
                      alt={template.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <h4 className="font-semibold text-gray-900 mb-2">{template.name}</h4>
                  <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                      {template.category}
                    </span>
                    <span className="text-xs font-medium text-green-600">
                      ATS: {template.atsScore}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            {selectedTemplate && (
              <div className="mt-6 text-center">
                <Button
                  onClick={() => handleTemplateSelect(selectedTemplate)}
                  disabled={isProcessing}
                  icon={Palette}
                  size="lg"
                >
                  Use Selected Template
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};