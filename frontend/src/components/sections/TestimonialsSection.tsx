import React from 'react';
import { Star, Quote } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Software Engineer',
      company: 'Google',
      image: 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      rating: 5,
      text: 'ResumeAI helped me land my dream job at Google! The ATS optimization was spot-on, and I got 3x more interview calls.',
      category: 'Tech Professional',
    },
    {
      name: 'Michael Rodriguez',
      role: 'Recent Graduate',
      company: 'Marketing Startup',
      image: 'https://images.pexels.com/photos/3778876/pexels-photo-3778876.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      rating: 5,
      text: 'As a fresh graduate with limited experience, ResumeAI helped me highlight my potential. Got my first job within 2 weeks!',
      category: 'Student',
    },
    {
      name: 'Jennifer Park',
      role: 'Marketing Director',
      company: 'Fortune 500',
      image: 'https://images.pexels.com/photos/3756681/pexels-photo-3756681.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      rating: 5,
      text: 'The cold email feature is genius! Generated professional outreach emails that actually got responses from recruiters.',
      category: 'Job Switcher',
    },
    {
      name: 'David Kim',
      role: 'Freelance Designer',
      company: 'Self-Employed',
      image: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      rating: 5,
      text: 'Perfect for freelancers like me who need to constantly tailor resumes for different clients. Saves hours of work!',
      category: 'Freelancer',
    },
    {
      name: 'Amanda Foster',
      role: 'Product Manager',
      company: 'Meta',
      image: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      rating: 5,
      text: 'The LaTeX integration is seamless. I can keep my professional formatting while ensuring ATS compatibility.',
      category: 'Tech Professional',
    },
    {
      name: 'Carlos Mendez',
      role: 'Business Analyst',
      company: 'McKinsey & Company',
      image: 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      rating: 5,
      text: 'Increased my interview rate by 400%. The keyword optimization really works - highly recommend for career transitions!',
      category: 'Job Switcher',
    },
  ];

  const categories = ['All', 'Students', 'Tech Professional', 'Job Switcher', 'Freelancer'];
  const [activeCategory, setActiveCategory] = React.useState('All');

  const filteredTestimonials = activeCategory === 'All' 
    ? testimonials 
    : testimonials.filter(t => t.category === activeCategory);

  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Success Stories
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Join thousands of professionals who have transformed their job search with ResumeAI
          </p>
          
          {/* Category Filter */}
          <div className="flex justify-center space-x-2 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeCategory === category
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTestimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-xl hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Quote Icon */}
              <div className="text-blue-600 mb-4">
                <Quote className="h-8 w-8" />
              </div>
              
              {/* Rating */}
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              
              {/* Testimonial Text */}
              <p className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>
              
              {/* Author Info */}
              <div className="flex items-center space-x-3">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                  <div className="text-xs text-blue-600 font-medium">{testimonial.company}</div>
                </div>
              </div>
              
              {/* Category Badge */}
              <div className="mt-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {testimonial.category}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl p-8 text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">10,000+</div>
              <div className="text-blue-100">Resumes Optimized</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">95%</div>
              <div className="text-blue-100">ATS Pass Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">4.9/5</div>
              <div className="text-blue-100">User Rating</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">2x</div>
              <div className="text-blue-100">More Interviews</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};