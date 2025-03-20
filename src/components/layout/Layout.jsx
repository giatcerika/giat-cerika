import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Video, FileQuestion, Menu, X } from 'lucide-react';

const Layout = ({ children }) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-20 p-2 rounded-md bg-[#497D74] text-white"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static w-64 bg-[#497D74] text-white h-full z-20
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-4">
          <h1 className="text-2xl font-bold text-[#FFD95F]">Admin Giat Cerika</h1>
        </div>
        <nav className="mt-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center px-6 py-3 text-lg transition-colors duration-200 
                  ${isActive(item.path)
                    ? 'bg-[#FFD95F] text-[#497D74]'
                    : 'text-white hover:bg-[#5c8f86]'}`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto lg:ml-0">
        <main className="p-6 mt-16 lg:mt-0">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;