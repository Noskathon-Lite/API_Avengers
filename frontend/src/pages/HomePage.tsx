import React from 'react';
import { Upload,  Brain, Sparkles } from 'lucide-react';
const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-6xl mb-4">
            Transform Your Presentations with AI
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload your documents and let AI enhance your presentation with smart diagrams,
            animated videos, and an intelligent chatbot assistant.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <FeatureCard
            icon={<Brain className="h-8 w-8 text-indigo-600" />}
            title="Smart Diagrams"
            description="Convert your content into clear, insightful diagrams automatically"
          />
          <FeatureCard
            icon={<Sparkles className="h-8 w-8 text-purple-600" />}
            title="Animated Videos"
            description="Transform your presentations into engaging animated videos with voiceover"
          />
          <FeatureCard
            icon={<Upload className="h-8 w-8 text-pink-600" />}
            title="AI Assistant"
            description="Get real-time answers to questions during your presentation"
          />
        </div>
      </main>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-indigo-50 mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default HomePage;