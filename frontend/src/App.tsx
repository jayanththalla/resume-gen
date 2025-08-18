import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ResumeProvider } from './contexts/ResumeContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/sections/HeroSection';
import { FeaturesSection } from './components/sections/FeaturesSection';
import { HowItWorksSection } from './components/sections/HowItWorksSection';
import { TestimonialsSection } from './components/sections/TestimonialsSection';
import { ResumeFlow } from './pages/ResumeFlow';

const HomePage = () => (
  <>
    <HeroSection />
    <FeaturesSection />
    <HowItWorksSection />
    <TestimonialsSection />
  </>
);

function App() {
  return (
    <ResumeProvider>
      <Router>
        <div className="min-h-screen bg-white">
          <Routes>
            <Route path="/" element={
              <>
                <Header />
                <main>
                  <HomePage />
                </main>
                <Footer />
              </>
            } />
            <Route path="/optimize" element={<ResumeFlow />} />
          </Routes>
        </div>
      </Router>
    </ResumeProvider>
  );
}

export default App;