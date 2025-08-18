import React from 'react';
import { Sparkles, TrendingUp, Clock, Shield } from 'lucide-react';
import { Button } from '../common/Button';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-teal-50 py-20 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                AI-Powered
                <span className="block text-blue-600">ATS Resume</span>
                <span className="block">Optimization</span>
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                Upload, optimize, and send your job-ready resume in minutes. Beat ATS filters and land more interviews with AI-powered optimization.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" icon={Sparkles} className="transform hover:scale-105" onClick={() => window.location.href = '/optimize'}>
                Start Optimizing Now
              </Button>
              <Button variant="outline" size="lg" className="transform hover:scale-105">
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">95%</div>
                <div className="text-sm text-gray-600">ATS Pass Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-teal-600">2 Min</div>
                <div className="text-sm text-gray-600">Average Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">10K+</div>
                <div className="text-sm text-gray-600">Resumes Optimized</div>
              </div>
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <div className="text-sm text-gray-500">resume_optimized.pdf</div>
                </div>
                
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-blue-200 rounded w-3/4 animate-pulse delay-100"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse delay-200"></div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-700 font-medium">ATS Score: 94%</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded animate-pulse delay-300"></div>
                    <div className="h-3 bg-gray-200 rounded w-4/5 animate-pulse delay-400"></div>
                    <div className="h-3 bg-teal-200 rounded w-2/3 animate-pulse delay-500"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 bg-blue-600 text-white p-3 rounded-xl shadow-lg animate-bounce">
              <Clock className="h-6 w-6" />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-teal-600 text-white p-3 rounded-xl shadow-lg animate-bounce delay-500">
              <Shield className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};