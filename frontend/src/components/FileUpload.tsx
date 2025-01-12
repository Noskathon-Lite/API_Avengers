import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // Import the useAuth hook

axios.defaults.baseURL = 'http://127.0.0.1:5000/';

const FileUpload = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth(); // Get user info and authentication status
  const [fileTitle, setFileTitle] = useState(''); // State to handle the title input for the file

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      // Check if the title is provided
      if (!fileTitle.trim()) {
        alert('Please provide a title for the file.');
        return;
      }
      formData.append('title', fileTitle);

      try {
        if (isAuthenticated) {
          const token = localStorage.getItem('token');
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

          const response = await axios.post('/api/presentations', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },

          });

          // Log and extract the response data
          
          const { fileUrl, fileName } = response.data;

          // Navigate to the new page with state and fallback query parameters
          navigate(`/present/`+response.data.id, {
            state: { fileUrl, fileName },
            replace: true, // Optional: Prevent users from navigating back to the upload form
          });
        } else {
          alert('You must be logged in to upload files.');
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        alert('File upload failed. Please try again.');
      }
    }
  }, [navigate, isAuthenticated, fileTitle]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileTitle(e.target.value);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'], // Added docx support
    },
    maxFiles: 1,
  });

  return (
    <div>
      {/* Title input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">File Title</label>
        <input
          type="text"
          value={fileTitle}
          onChange={handleTitleChange}
          placeholder="Enter file title"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Dropzone Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors duration-200 ease-in-out ${
          isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400 bg-white/50 backdrop-blur-sm'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-4 text-lg text-gray-700">
          {isDragActive ? 'Drop your file here...' : 'Drag & drop your file here, or click to select'}
        </p>
        <p className="mt-2 text-sm text-gray-500">Supported formats: PDF, PPTX, DOCX</p>
      </div>
    </div>
  );
};

export default FileUpload;
