import { useNavigate, useLocation } from 'react-router-dom';
import { getStoredData } from '../utils/storage';
import { useState, useEffect } from 'react';

export default function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [programName, setProgramName] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    const stored = getStoredData();
    setProgramName(stored.program?.name || 'New Program');
  }, [location.pathname]);

  // Hide navigation on landing page
  if (location.pathname === '/') {
    return null;
  }

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/basics', label: 'Basics', step: 1 },
    { path: '/problem-outcome', label: 'Problem & Outcome', step: 2 },
    { path: '/stakeholders', label: 'Stakeholders', step: 3 },
    { path: '/activities', label: 'Activities', step: 4 },
    { path: '/framework', label: 'Framework', step: 5 }
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-3">
        {/* Header Row */}
        <div className="flex items-center justify-between mb-2">
          {/* Logo */}
          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-md group-hover:shadow-lg transition-all">
                🧠
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 hidden sm:inline">ShikshaDesign</span>
          </div>

          {/* Program Name */}
          <div className="text-center flex-1 mx-4 hidden md:block">
            <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Current Program</span>
            <p className="text-sm font-bold text-gray-900 truncate max-w-[200px] mx-auto">{programName}</p>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
          >
            <span className="text-2xl">☰</span>
          </button>

          {/* Quick Actions */}
          <div className="hidden sm:flex gap-2">
            <button
              onClick={() => navigate('/framework')}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition text-xs font-semibold shadow-sm"
            >
              View Framework
            </button>
          </div>
        </div>

        {/* Navigation Tabs - Desktop */}
        <div className="hidden md:flex items-center justify-center gap-2 overflow-x-auto pb-1">
          {navItems.map((item) => {
             const active = isActive(item.path);
             return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all duration-200 ${
                active
                  ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-200'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span className={`inline-flex items-center justify-center w-5 h-5 mr-2 rounded-full text-[10px] ${active ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                  {item.step}
              </span>
               {item.label}
            </button>
          )})}
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden flex flex-col gap-2 py-4 border-t border-gray-200 mt-2 animate-in slide-in-from-top-2">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setShowMobileMenu(false);
                }}
                className={`px-4 py-3 rounded-lg text-left font-medium transition ${
                  isActive(item.path)
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Step {item.step}: {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
