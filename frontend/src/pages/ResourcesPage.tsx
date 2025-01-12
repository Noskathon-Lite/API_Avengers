import React from 'react';
import { Book, Video, Users, Download } from 'lucide-react';

const ResourcesPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Learning Resources</h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ResourceCard
            icon={<Book className="h-6 w-6 text-emerald-600" />}
            title="Study Materials"
            description="Access a wide range of educational materials and guides"
            items={[
              "Academic Papers",
              "Research Guides",
              "Study Notes",
              "Practice Tests"
            ]}
          />

          <ResourceCard
            icon={<Video className="h-6 w-6 text-blue-600" />}
            title="Video Tutorials"
            description="Watch educational videos and tutorials"
            items={[
              "Course Videos",
              "Topic Explanations",
              "Problem Solving",
              "Lab Demonstrations"
            ]}
          />

          <ResourceCard
            icon={<Users className="h-6 w-6 text-purple-600" />}
            title="Community"
            description="Connect with other students and educators"
            items={[
              "Discussion Forums",
              "Study Groups",
              "Q&A Sessions",
              "Peer Reviews"
            ]}
          />
        </div>
      </div>
    </div>
  );
};

const ResourceCard = ({ icon, title, description, items }) => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <div className="flex items-center mb-4">
      {icon}
      <h2 className="text-xl font-semibold ml-2">{title}</h2>
    </div>
    <p className="text-gray-600 mb-4">{description}</p>
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={index} className="flex items-center text-gray-700">
          <Download className="h-4 w-4 text-gray-400 mr-2" />
          {item}
        </li>
      ))}
    </ul>
  </div>
);

export default ResourcesPage;