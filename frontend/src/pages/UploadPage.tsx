import React from 'react';
import { useNavigate } from 'react-router-dom';
import FileUpload from '../components/FileUpload';
import { FileText, Presentation, FileCheck } from 'lucide-react';

const UploadPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">Upload Your File</h1>
          <p className="mt-4 text-xl text-gray-600">
            Transform your documents into interactive presentations
          </p>
        </div>

        <div className="mt-12">
          <FileUpload />
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<FileText className="h-8 w-8 text-indigo-600" />}
            title="Multiple Formats"
            description="Support for PDF, PPTX, and DOCX files"
          />
          <FeatureCard
            icon={<Presentation className="h-8 w-8 text-purple-600" />}
            title="Smart Conversion"
            description="AI-powered transformation into presentations"
          />
          <FeatureCard
            icon={<FileCheck className="h-8 w-8 text-emerald-600" />}
            title="Instant Preview"
            description="See your presentation immediately after upload"
          />
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm">
    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gray-50 mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default UploadPage;