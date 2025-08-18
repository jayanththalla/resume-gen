import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { JobDescription, ResumeSource, AIMessage, ResumeSuggestion, OptimizationProgress } from '../types/resume';

interface ResumeState {
  jobDescription: JobDescription | null;
  resumeSource: ResumeSource | null;
  messages: AIMessage[];
  suggestions: ResumeSuggestion[];
  progress: OptimizationProgress;
  optimizedContent: string;
  isProcessing: boolean;
  error: string | null;
}

type ResumeAction =
  | { type: 'SET_JOB_DESCRIPTION'; payload: JobDescription }
  | { type: 'SET_RESUME_SOURCE'; payload: ResumeSource }
  | { type: 'ADD_MESSAGE'; payload: AIMessage }
  | { type: 'ADD_SUGGESTIONS'; payload: ResumeSuggestion[] }
  | { type: 'UPDATE_SUGGESTION'; payload: { id: string; status: 'approved' | 'rejected' } }
  | { type: 'SET_PROGRESS'; payload: OptimizationProgress }
  | { type: 'SET_OPTIMIZED_CONTENT'; payload: string }
  | { type: 'SET_PROCESSING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET' };

const initialState: ResumeState = {
  jobDescription: null,
  resumeSource: null,
  messages: [],
  suggestions: [],
  progress: { step: 1, stepName: 'Job Description Input', progress: 0, isComplete: false },
  optimizedContent: '',
  isProcessing: false,
  error: null,
};

function resumeReducer(state: ResumeState, action: ResumeAction): ResumeState {
  switch (action.type) {
    case 'SET_JOB_DESCRIPTION':
      return {
        ...state,
        jobDescription: action.payload,
        progress: { step: 2, stepName: 'Resume Source', progress: 25, isComplete: false },
      };
    case 'SET_RESUME_SOURCE':
      return {
        ...state,
        resumeSource: action.payload,
        progress: { step: 3, stepName: 'AI Optimization', progress: 50, isComplete: false },
      };
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    case 'ADD_SUGGESTIONS':
      return {
        ...state,
        suggestions: [...state.suggestions, ...action.payload],
      };
    case 'UPDATE_SUGGESTION':
      return {
        ...state,
        suggestions: state.suggestions.map(s =>
          s.id === action.payload.id ? { ...s, status: action.payload.status } : s
        ),
      };
    case 'SET_PROGRESS':
      return {
        ...state,
        progress: action.payload,
      };
    case 'SET_OPTIMIZED_CONTENT':
      return {
        ...state,
        optimizedContent: action.payload,
        progress: { step: 4, stepName: 'Preview & Export', progress: 100, isComplete: true },
      };
    case 'SET_PROCESSING':
      return {
        ...state,
        isProcessing: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isProcessing: false,
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

interface ResumeContextType {
  state: ResumeState;
  dispatch: React.Dispatch<ResumeAction>;
  setJobDescription: (jd: JobDescription) => void;
  setResumeSource: (source: ResumeSource) => void;
  addMessage: (message: Omit<AIMessage, 'id' | 'timestamp'>) => void;
  approveSuggestion: (id: string) => void;
  rejectSuggestion: (id: string) => void;
  reset: () => void;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(resumeReducer, initialState);

  const setJobDescription = (jd: JobDescription) => {
    dispatch({ type: 'SET_JOB_DESCRIPTION', payload: jd });
  };

  const setResumeSource = (source: ResumeSource) => {
    dispatch({ type: 'SET_RESUME_SOURCE', payload: source });
  };

  const addMessage = (message: Omit<AIMessage, 'id' | 'timestamp'>) => {
    const fullMessage: AIMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    dispatch({ type: 'ADD_MESSAGE', payload: fullMessage });
  };

  const approveSuggestion = (id: string) => {
    dispatch({ type: 'UPDATE_SUGGESTION', payload: { id, status: 'approved' } });
  };

  const rejectSuggestion = (id: string) => {
    dispatch({ type: 'UPDATE_SUGGESTION', payload: { id, status: 'rejected' } });
  };

  const reset = () => {
    dispatch({ type: 'RESET' });
  };

  return (
    <ResumeContext.Provider
      value={{
        state,
        dispatch,
        setJobDescription,
        setResumeSource,
        addMessage,
        approveSuggestion,
        rejectSuggestion,
        reset,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
}