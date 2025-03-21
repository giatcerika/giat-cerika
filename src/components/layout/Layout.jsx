import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Video, FileQuestion, Menu, X } from 'lucide-react';

const Layout = ({ children }) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    {
      path: '/',
      name: 'Dashboard',
      icon: LayoutDashboard
    },
    {
      path: '/materi',
      name: 'Materi',
      icon: BookOpen
    },
    {
      path: '/video',
      name: 'Video',
      icon: Video
    },
    {
      path: '/quiz',
      name: 'Quiz',
      icon: FileQuestion
    },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-[#FFF8DC]">
      {/* Mobile Header */}
      <div className={`
        fixed top-0 left-0 right-0 h-16 bg-white z-10 lg:hidden 
        flex items-center px-4 transition-shadow ${scrolled ? 'shadow-md' : ''}
      `}>
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md hover:bg-gray-100 transition-colors"
          aria-label="Toggle Menu"
        >
          {isSidebarOpen ?
            <X size={24} className="text-[#497D74]" /> :
            <Menu size={24} className="text-[#497D74]" />
          }
        </button>
        <h1 className="text-xl font-bold text-[#497D74] ml-4">Giat Cerika</h1>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-40 z-10 backdrop-blur-sm"
          onClick={toggleSidebar}
        />
      )}

      {/* Enhanced Sidebar */}
      <div className={`
        fixed lg:static w-64 bg-[#497D74] text-white h-full z-20
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header with stylish background */}
        <div className="relative h-36 overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 bg-[#3a6b63]">
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-[#5c8f86] opacity-40"></div>
            <div className="absolute top-10 -left-8 w-24 h-24 rounded-full bg-[#5c8f86] opacity-20"></div>
            <div className="absolute bottom-0 right-12 w-16 h-16 rounded-full bg-[#5c8f86] opacity-30"></div>
          </div>

          {/* Logo and title with good positioning */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 pt-8">
            <div className="bg-white rounded-xl p-2.5 shadow-md mb-3">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" rx="6" fill="#497D74" />
                <path d="M8 9L12 12L16 9M8 15L12 18L16 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white">Admin <span className="text-[#FFD95F]">Cerika</span></h1>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="px-4 py-6">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`
                    flex items-center px-4 py-3 rounded-lg text-base font-medium
                    transition-all duration-200 relative
                    ${active
                      ? 'bg-[#FFD95F] text-[#497D74] shadow-md'
                      : 'text-white hover:bg-[#5c8f86]'
                    }
                  `}
                >
                  <div className={`
                    flex items-center justify-center w-8 h-8 rounded-lg mr-3
                    ${active ? 'bg-[#497D74] text-[#FFD95F]' : 'text-white'}
                  `}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span>{item.name}</span>
                  {active && (
                    <span className="ml-auto w-2 h-2 rounded-full bg-[#497D74]"></span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-24 overflow-hidden">
          <div className="absolute inset-0 bg-[#3a6b63] opacity-30">
            <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-[#5c8f86] opacity-40"></div>
            <div className="absolute -bottom-5 right-8 w-20 h-20 rounded-full bg-[#5c8f86] opacity-20"></div>
          </div>
        </div>
      </div>

      {/* Main Content - Untouched */}
      <div className="flex-1 overflow-auto">
        <main className="p-6 mt-16 lg:mt-0">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;