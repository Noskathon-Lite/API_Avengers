import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Presentation, Layout, Upload, User, Crown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { NavLinkProps } from '../types';

const Navigation = () => {
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const isPresenting = location.pathname.startsWith('/present');

  if (isPresenting) return null;

  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Presentation className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Neo-Presenta</span>
            </Link>
          </div>
          <div className="flex space-x-8">
            <NavLink to="/createpresentation" icon={<Presentation />} label="Create AI PPTX"/>
            <NavLink to="/upload" icon={<Upload />} label="Upload" />
            <NavLink to="/dashboard" icon={<Layout />} label="Dashboard" />
            <NavLink to="/pricing" icon={<Crown />} label="Upgrade to Pro" />
            <NavLink 
              to="/profile" 
              icon={<User />} 
              label={isAuthenticated ? user?.email?.split('@')[0] : "Sign In"} 
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavLink: React.FC<NavLinkProps> = ({ to, icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium
        ${isActive 
          ? 'text-indigo-600 bg-indigo-50' 
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
        }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

export default Navigation;