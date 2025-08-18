import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, ThumbsUp, ThumbsDown, Edit3, Sparkles } from 'lucide-react';
import { Button } from '../common/Button';
import { AIMessage, ResumeSuggestion } from '../../types/resume';

interface ChatInterfaceProps {
  messages: AIMessage[];
  suggestions: ResumeSuggestion[];
  onSendMessage: (content: string) => void;
  onApproveSuggestion: (id: string) => void;
  onRejectSuggestion: (id: string) => void;
  isProcessing?: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  suggestions,
  onSendMessage,
  onApproveSuggestion,
  onRejectSuggestion,
  isProcessing = false,
}) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isProcessing) return;
    
    onSendMessage(inputValue.trim());
    setInputValue('');
  };

  const getSuggestionColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'border-red-200 bg-red-50';
      case 'medium':
        return 'border-yellow-200 bg-yellow-50';
      case 'low':
        return 'border-green-200 bg-green-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getImpactBadge = (impact: string) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800',
    };
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colors[impact as keyof typeof colors]}`}>
        {impact.toUpperCase()} IMPACT
      </span>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-gray-200">
      {/* Header */}
      <div className="flex items-center space-x-3 p-4 border-b border-gray-200">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <Bot className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">AI Resume Optimizer</h3>
          <p className="text-sm text-gray-500">Analyzing and optimizing your resume</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">I'm ready to help optimize your resume! I'll analyze it against the job description and suggest improvements.</p>
          </div>
        )}

        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-3xl ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              {/* Avatar */}
              <div className={`flex-shrink-0 ${message.type === 'user' ? 'ml-3' : 'mr-3'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.type === 'user' ? 'bg-blue-600' : 'bg-gray-100'
                }`}>
                  {message.type === 'user' ? (
                    <User className="w-5 h-5 text-white" />
                  ) : (
                    <Bot className="w-5 h-5 text-gray-600" />
                  )}
                </div>
              </div>

              {/* Message Content */}
              <div className={`rounded-lg px-4 py-3 ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}>
                <p className="text-sm leading-relaxed">{message.content}</p>
                
                {/* Suggestions */}
                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="mt-4 space-y-3">
                    {message.suggestions.map((suggestion) => (
                      <div
                        key={suggestion.id}
                        className={`border rounded-lg p-3 ${getSuggestionColor(suggestion.impact)}`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-medium text-gray-600 uppercase">
                              {suggestion.section}
                            </span>
                            {getImpactBadge(suggestion.impact)}
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-700 mb-2">{suggestion.reason}</p>
                        
                        <div className="space-y-2">
                          <div>
                            <span className="text-xs font-medium text-red-600">REMOVE:</span>
                            <p className="text-sm text-gray-800 bg-red-100 p-2 rounded mt-1">
                              {suggestion.original}
                            </p>
                          </div>
                          <div>
                            <span className="text-xs font-medium text-green-600">ADD:</span>
                            <p className="text-sm text-gray-800 bg-green-100 p-2 rounded mt-1">
                              {suggestion.suggested}
                            </p>
                          </div>
                        </div>
                        
                        {suggestion.status === 'pending' && (
                          <div className="flex items-center space-x-2 mt-3">
                            <Button
                              size="sm"
                              onClick={() => onApproveSuggestion(suggestion.id)}
                              className="text-xs"
                            >
                              <ThumbsUp className="w-3 h-3 mr-1" />
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onRejectSuggestion(suggestion.id)}
                              className="text-xs"
                            >
                              <ThumbsDown className="w-3 h-3 mr-1" />
                              Reject
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs"
                            >
                              <Edit3 className="w-3 h-3 mr-1" />
                              Edit
                            </Button>
                          </div>
                        )}
                        
                        {suggestion.status === 'approved' && (
                          <div className="mt-3">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              ✓ Approved
                            </span>
                          </div>
                        )}
                        
                        {suggestion.status === 'rejected' && (
                          <div className="mt-3">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              ✗ Rejected
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {isProcessing && (
          <div className="flex justify-start">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-gray-600" />
              </div>
              <div className="bg-gray-100 rounded-lg px-4 py-3">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                  <span className="text-sm text-gray-600">Analyzing your resume...</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-4">
        <form onSubmit={handleSubmit} className="flex items-center space-x-3">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask me to make changes or add specific keywords..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isProcessing}
          />
          <Button
            type="submit"
            disabled={!inputValue.trim() || isProcessing}
            icon={Send}
          >
            Send
          </Button>
        </form>
        
        <div className="flex flex-wrap gap-2 mt-3">
          {['Add more technical keywords', 'Improve action verbs', 'Quantify achievements', 'Optimize for ATS'].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setInputValue(suggestion)}
              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors"
              disabled={isProcessing}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};