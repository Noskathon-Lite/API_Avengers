import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ProfilePage from './ProfilePage';
import { FileText, Clock, Star } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const { isAuthenticated, user } = useAuth(); // Get authentication state and user info
  const [presentations, setPresentations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPresentations = async () => {
      if (isAuthenticated) {
        try {
          const token = localStorage.getItem('token');
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

          // Fetch presentations for the authenticated user
          const response = await axios.get('/api/presentations');
          
          setPresentations(response.data.data);
        } catch (error) {
          console.error('Error fetching presentations:', error);
        }
      }
    };

    fetchPresentations();
  }, [isAuthenticated]);

  if (!isAuthenticated || !user) {
    // If the user is not authenticated, render the ProfilePage component
    return <ProfilePage />;
  }

  // Render the dashboard when authenticated


  const handleViewPresentation = (id) => {
    navigate(`/present/`+id, { state: { id } });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Recent Files Section */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Clock className="h-5 w-5 text-indigo-600 mr-2" />
              Recent Files
            </h2>
            <div className="space-y-4">
              {presentations.map(presentation => (
                <div
                  key={presentation.id}
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => handleViewPresentation(presentation.id)}
                >
          
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-gray-700">{presentation.title}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(presentation.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Presentations Section */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FileText className="h-5 w-5 text-indigo-600 mr-2" />
              My Presentations
            </h2>
            <div className="space-y-4">
              {presentations.map(presentation => (
                <div
                  key={presentation.id}
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => handleViewPresentation(presentation.id)}
                >
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-gray-700">{presentation.title}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(presentation.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats Section */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-indigo-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-indigo-600">0</div>
                <div className="text-sm text-gray-600">Files Uploaded</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-600">0</div>
                <div className="text-sm text-gray-600">Presentations</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
