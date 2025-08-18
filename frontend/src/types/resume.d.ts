export interface JobDescription {
  id: string;
  content: string;
  company: string;
  position: string;
  keywords: string[];
  requirements: string[];
  createdAt: Date;
}

export interface ResumeSource {
  type: 'overleaf' | 'upload' | 'paste' | 'template';
  content: string;
  fileName?: string;
  overleafUrl?: string;
  templateId?: string;
}

export interface AIMessage {
  id: string;
  type: 'ai' | 'user';
  content: string;
  timestamp: Date;
  suggestions?: ResumeSuggestion[];
  status?: 'pending' | 'approved' | 'rejected';
}

export interface ResumeSuggestion {
  id: string;
  type: 'keyword' | 'content' | 'format' | 'section';
  section: string;
  original: string;
  suggested: string;
  reason: string;
  impact: 'high' | 'medium' | 'low';
  status: 'pending' | 'approved' | 'rejected';
}

export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  category: 'tech' | 'business' | 'creative' | 'academic';
  preview: string;
  latexCode: string;
  atsScore: number;
}

export interface OptimizationProgress {
  step: 1 | 2 | 3 | 4;
  stepName: string;
  progress: number;
  isComplete: boolean;
}

export interface ExportOptions {
  format: 'pdf' | 'docx' | 'both';
  fileName: string;
  autoUpload: boolean;
  driveFolder: string;
}