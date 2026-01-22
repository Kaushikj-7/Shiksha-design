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
    <nav className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Header Row */}
        <div className="flex items-center justify-between mb-4">
          {/* Logo */}
          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition"
          >
            <span className="text-2xl font-bold text-blue-600">🧠</span>
            <span className="text-xl font-bold text-gray-900 hidden sm:inline">ShikshaDesign</span>
          </div>

          {/* Program Name */}
          <div className="text-center flex-1 mx-4">
            <p className="text-sm text-gray-600">Current Program:</p>
            <p className="text-lg font-semibold text-gray-900 truncate">{programName}</p>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 rounded hover:bg-gray-100"
          >
            <span className="text-2xl">☰</span>
          </button>

          {/* Quick Actions */}
          <div className="hidden sm:flex gap-2">
            <button
              onClick={() => navigate('/framework')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-semibold"
            >
              View Framework
            </button>
          </div>
        </div>

        {/* Navigation Tabs - Desktop */}
        <div className="hidden md:flex gap-1 overflow-x-auto pb-2">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium transition ${
                isActive(item.path)
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="text-sm">{item.step}.</span> {item.label}
            </button>
          ))}
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden flex flex-col gap-2 py-4 border-t border-gray-200">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setShowMobileMenu(false);
                }}
                className={`px-4 py-3 rounded-lg text-left font-medium transition ${
                  isActive(item.path)
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
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
