import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Presentation, Layout, Upload, User, Crown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { NavLinkProps } from '../types';


const Navigation = () => {
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const isPresenting = location.pathname.startsWith('/present');
  const [isOpen, setIsOpen] = useState(false);

  if (isPresenting) return null;

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Presentation className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Neo-Presenta</span>
            </Link>
          </div>
<<<<<<< HEAD

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:space-x-8">
            <NavLink to="/upload" icon={<Upload className="h-5 w-5" />} label="Upload" />
            <NavLink to="/dashboard" icon={<Layout className="h-5 w-5" />} label="Dashboard" />
            <NavLink to="/pricing" icon={<Crown className="h-5 w-5" />} label="Upgrade to Pro" />
=======
          <div className="flex space-x-8">
            <NavLink to="/createpresentation" icon={<Presentation />} label="Create AI PPTX"/>
            <NavLink to="/upload" icon={<Upload />} label="Upload" />
            <NavLink to="/dashboard" icon={<Layout />} label="Dashboard" />
            <NavLink to="/pricing" icon={<Crown />} label="Upgrade to Pro" />
>>>>>>> e5e0251df375f5b1322113094718f5b9c74d9c56
            <NavLink 
              to="/profile" 
              icon={<User className="h-5 w-5" />} 
              label={isAuthenticated ? user?.email?.split('@')[0] : "Sign In"} 
            />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-b border-gray-200">
          <MobileNavLink to="/upload" icon={<Upload className="h-5 w-5" />} label="Upload" />
          <MobileNavLink to="/dashboard" icon={<Layout className="h-5 w-5" />} label="Dashboard" />
          <MobileNavLink to="/pricing" icon={<Crown className="h-5 w-5" />} label="Upgrade to Pro" />
          <MobileNavLink 
            to="/profile" 
            icon={<User className="h-5 w-5" />} 
            label={isAuthenticated ? user?.email?.split('@')[0] : "Sign In"} 
          />
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
      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150
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

const MobileNavLink: React.FC<NavLinkProps> = ({ to, icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium w-full transition-colors duration-150
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