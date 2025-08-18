import React, { useState } from 'react';
import { Download, Eye, FileText, Share, Cloud, Settings } from 'lucide-react';
import { Button } from '../common/Button';
import { ExportOptions } from '../../types/resume';

interface PreviewPaneProps {
  content: string;
  onExport: (options: ExportOptions) => void;
  isExporting?: boolean;
}

export const PreviewPane: React.FC<PreviewPaneProps> = ({
  content,
  onExport,
  isExporting = false,
}) => {
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'pdf',
    fileName: 'resume_optimized',
    autoUpload: true,
    driveFolder: 'Resume',
  });

  const handleExport = () => {
    onExport(exportOptions);
    setShowExportOptions(false);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <Eye className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Live Preview</h3>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowExportOptions(!showExportOptions)}
            icon={Settings}
          >
            Export Options
          </Button>
          <Button
            size="sm"
            onClick={handleExport}
            disabled={isExporting}
            icon={Download}
          >
            {isExporting ? 'Exporting...' : 'Export'}
          </Button>
        </div>
      </div>

      {/* Export Options Panel */}
      {showExportOptions && (
        <div className="border-b border-gray-200 p-4 bg-gray-50">
          <h4 className="font-medium text-gray-900 mb-3">Export Settings</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Format Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
              <select
                value={exportOptions.format}
                onChange={(e) => setExportOptions(prev => ({ ...prev, format: e.target.value as 'pdf' | 'docx' | 'both' }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="pdf">PDF Only</option>
                <option value="docx">DOCX Only</option>
                <option value="both">Both PDF & DOCX</option>
              </select>
            </div>

            {/* File Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">File Name</label>
              <input
                type="text"
                value={exportOptions.fileName}
                onChange={(e) => setExportOptions(prev => ({ ...prev, fileName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="resume_optimized"
              />
            </div>

            {/* Google Drive Upload */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-2">
                <input
                  type="checkbox"
                  id="autoUpload"
                  checked={exportOptions.autoUpload}
                  onChange={(e) => setExportOptions(prev => ({ ...prev, autoUpload: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="autoUpload" className="text-sm font-medium text-gray-700">
                  <Cloud className="w-4 h-4 inline mr-1" />
                  Auto-upload to Google Drive
                </label>
              </div>
              
              {exportOptions.autoUpload && (
                <input
                  type="text"
                  value={exportOptions.driveFolder}
                  onChange={(e) => setExportOptions(prev => ({ ...prev, driveFolder: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Folder name in Google Drive"
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Preview Content */}
      <div className="flex-1 p-4 overflow-auto">
        {content ? (
          <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm min-h-full">
            {/* PDF Preview Simulation */}
            <div className="max-w-2xl mx-auto">
              <div className="space-y-6">
                {/* Header */}
                <div className="text-center border-b border-gray-200 pb-4">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">John Doe</h1>
                  <p className="text-gray-600">Software Engineer</p>
                  <p className="text-sm text-gray-500">john.doe@email.com • (555) 123-4567 • LinkedIn • GitHub</p>
                </div>

                {/* Professional Summary */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2 border-b border-gray-300">Professional Summary</h2>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Experienced Software Engineer with 5+ years developing scalable web applications using React, Node.js, and cloud technologies. 
                    Proven track record of delivering high-quality solutions that improve user experience and business metrics.
                  </p>
                </div>

                {/* Experience */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2 border-b border-gray-300">Experience</h2>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-medium text-gray-900">Senior Software Engineer</h3>
                        <span className="text-sm text-gray-500">2021 - Present</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Tech Company Inc.</p>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Developed and maintained React-based web applications serving 100K+ users</li>
                        <li>• Implemented CI/CD pipelines reducing deployment time by 60%</li>
                        <li>• Led cross-functional team of 5 developers in agile environment</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2 border-b border-gray-300">Technical Skills</h2>
                  <div className="text-sm text-gray-700">
                    <p><strong>Languages:</strong> JavaScript, TypeScript, Python, Java</p>
                    <p><strong>Frameworks:</strong> React, Node.js, Express, Django</p>
                    <p><strong>Tools:</strong> Git, Docker, AWS, Jenkins, MongoDB</p>
                  </div>
                </div>

                {/* Education */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2 border-b border-gray-300">Education</h2>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">Bachelor of Science in Computer Science</h3>
                      <p className="text-sm text-gray-600">University of Technology</p>
                    </div>
                    <span className="text-sm text-gray-500">2015 - 2019</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-lg font-medium">No content to preview</p>
              <p className="text-sm">Your optimized resume will appear here</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="border-t border-gray-200 p-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-green-600">94%</div>
            <div className="text-xs text-gray-500">ATS Score</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-blue-600">12</div>
            <div className="text-xs text-gray-500">Keywords Added</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-orange-600">8</div>
            <div className="text-xs text-gray-500">Improvements</div>
          </div>
        </div>
      </div>
    </div>
  );
};