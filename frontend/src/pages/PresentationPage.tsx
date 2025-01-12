import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronLeft, MessageCircle, LayoutDashboard, Video } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { pdfjs } from 'react-pdf';
import { useParams } from 'react-router-dom';




const PresentationPage = () => {
  const [toolbarVisible, setToolbarVisible] = useState(false);
  const [chatVisible, setChatVisible] = useState(false);
  const [fileUrl, setFileUrl] = useState('');
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { id: fileId } = useParams();

  // Load the file URL when the file ID changes
  useEffect(() => {
    if (fileId) {
      const fetchFileById = async () => {
        setLoading(true);
        setError('');

        try {
          const response = await axios.get(`/api/presentations/${fileId}`);
          setFileUrl(response.data.file_url); // Assuming the backend returns the file URL
        } catch (err) {
          console.error('Error fetching file:', err);
          setError('Failed to load the file. Please try again later.');
        } finally {
          setLoading(false);
        }
      };

      fetchFileById();
    }
  }, [fileId]);

  // Configure the PDF worker
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

  // Handle chat message sending
  const sendMessage = async () => {
    if (userMessage.trim()) {
      setMessages((prev) => [...prev, { sender: 'user', text: userMessage }]);
      setUserMessage('');

      try {
        const response = await axios.post('/api/chat', { message: userMessage });
        setMessages((prev) => [...prev, { sender: 'ai', text: response.data.response }]);
      } catch (err) {
        console.error('Error sending message:', err);
        setMessages((prev) => [...prev, { sender: 'ai', text: 'Sorry, an error occurred.' }]);
      }
    }
  };

  // Render file preview based on its type
  const renderFilePreview = () => {
    if (loading) return <p>Loading file...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (!fileUrl) return <p>No file available for preview.</p>;

    const fileExtension = fileUrl.split('.').pop().toLowerCase();

    switch (fileExtension) {
      case 'pdf':
        return (
          <Worker workerUrl={`https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`}>
            <Viewer fileUrl={fileUrl} />
          </Worker>
        );
      case 'docx':
      case 'pptx':
        return (
          <iframe
            src={`https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true`}
            width="100%"
            height="100%"
            frameBorder="0"
            title="Document Viewer"
          ></iframe>
        );
      default:
        return <p className="text-red-500">Unsupported file type.</p>;
    }
  };

  return (
    <div className="h-screen bg-gray-100 flex">
      {/* Main Content */}
      <div className="flex-1 relative">
        {/* Toolbar Toggle Button */}
        <div className="absolute top-4 left-4">
          <button
            onClick={() => setToolbarVisible(!toolbarVisible)}
            className="p-2 bg-white rounded-full shadow hover:shadow-lg transition-shadow"
            aria-label="Toggle Toolbar"
          >
            <ChevronLeft className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        {/* File Presentation Area */}
        <div className="h-full flex items-center justify-center">
          <div className="bg-white rounded-lg shadow w-[800px] h-[600px] flex items-center justify-center">
            {renderFilePreview()}
          </div>
        </div>

        
        {/* Toolbar */}
        <AnimatePresence>
          {toolbarVisible && (
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="absolute top-20 left-4 bg-white rounded-lg shadow p-4 space-y-4"
            >
              <ToolbarButton
                icon={<LayoutDashboard />}
                label="Generate Diagrams"
                onClick={() => alert('Generate Diagrams action')}
              />
              <ToolbarButton
                icon={<Video />}
                label="Create Video"
                onClick={() => alert('Create Video action')}
              />
              <ToolbarButton
                icon={<MessageCircle />}
                label="Open Chat"
                onClick={() => setChatVisible(true)}
              />
              <ToolbarButton
                icon={<ChevronLeft />}
                label="Back to Home"
                onClick={() => window.location.href = '/'}
              />
              <button
                onClick={() => setToolbarVisible(false)}
                className="w-full flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg"
              >
                <ChevronLeft className="h-6 w-6" />
                <span className="text-sm text-gray-700">Back</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Chat Sidebar */}
      <AnimatePresence>
        {chatVisible && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="w-96 bg-white border-l border-gray-200"
          >
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-semibold">AI Assistant</h3>
              <button
                onClick={() => setChatVisible(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 space-y-4 h-[400px] overflow-y-auto">
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.sender === 'ai' ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-8 h-8 rounded-full ${msg.sender === 'ai' ? 'bg-blue-500' : 'bg-green-500'}`} />
                  <p className={`ml-2 p-2 rounded ${msg.sender === 'ai' ? 'bg-blue-100' : 'bg-green-100'}`}>{msg.text}</p>
                </div>
              ))}
            </div>
            <div className="p-4">
              <input
                type="text"
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Type your message..."
              />
              <button onClick={sendMessage} className="w-full p-2 mt-2 bg-indigo-600 text-white rounded">
                Send
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ToolbarButton = ({ icon, label, onClick }) => (
  <button onClick={onClick} className="w-full flex items-center p-2 hover:bg-gray-100 rounded">
    <span>{icon}</span>
    <span className="ml-2 text-sm">{label}</span>
  </button>
);

export default PresentationPage;
