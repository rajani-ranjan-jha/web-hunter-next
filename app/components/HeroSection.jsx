'use client'
import React, { useState } from 'react';
import { Search, Sparkles, Globe, TrendingUp, X } from 'lucide-react';
import SearchWindow from './SearchWindow';

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchWindowOpen, setIsSearchWindowOpen] = useState(false);

  const handleSearch = () => {
    console.log('Searching for:', searchQuery);
    // Add your search logic here
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen pt-16 transition-colors duration-300 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-red-900 dark:via-blue-900 dark:to-green-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl opacity-20 animate-pulse bg-purple-400 dark:bg-purple-600" style={{ animationDuration: '4s' }}></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse bg-blue-400 dark:bg-blue-600" style={{ animationDuration: '6s', animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl opacity-10 animate-pulse bg-pink-400 dark:bg-pink-600" style={{ animationDuration: '5s', animationDelay: '2s' }}></div>
      </div>

      {/* Hero Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-600/10 to-blue-600/10 border border-purple-600/20 backdrop-blur-sm mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-purple-600 dark:text-white" />
            <span className="text-sm font-medium text-purple-700 dark:text-purple-100">
              Discover 5000+ Amazing Websites
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 animate-slide-up text-gray-900 dark:text-white">
            Discover the Best
            <span className="block mt-2 bg-gradient-to-r from-purple-600 via-blue-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
              Websites on the Web
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl md:text-2xl mb-12 max-w-3xl mx-auto animate-slide-up text-gray-600 dark:text-gray-300" style={{ animationDelay: '0.1s' }}>
            Your ultimate directory to explore, discover, and bookmark the most useful tools, resources, and platforms across the internet.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="relative">
              <div className="flex items-center rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 bg-white/80 dark:bg-gray-800/50 backdrop-blur-lg border border-gray-200 dark:border-gray-700">
                <Search className="w-6 h-6 ml-6 text-gray-500 dark:text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for websites, tools, resources..."
                  onClick={() => setIsSearchWindowOpen(true)}
                  className="flex-1 px-6 py-5 text-lg bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  readOnly
                />
                {/* not needed */}
                <button
                  onClick={handleSearch}
                  className="hidden m-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-500 dark:from-white/20 dark:to-white/20 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200"
                >
                  Search
                </button>
              </div>
            </div>

            {/* Popular Searches */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Popular:
              </span>
              {['Design', 'Productivity', 'AI Tools', 'Marketing'].map((tag, index) => (
                <a
                  key={index}
                  href={`/categories/${tag.toLowerCase().replace(/\s+/g, '-')}`}
                  target='_blank'
                  className="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
                >
                  {tag}
                </a>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="p-6 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:scale-105 bg-white/40 dark:bg-gray-800/30 border border-white/50 dark:border-gray-700/50">
              <Globe className="w-8 h-8 mx-auto mb-3 text-purple-600 dark:text-purple-400" />
              <div className="text-3xl font-bold mb-1 text-gray-900 dark:text-white">
                5000+
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Curated Websites
              </div>
            </div>

            <div className="p-6 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:scale-105 bg-white/40 dark:bg-gray-800/30 border border-white/50 dark:border-gray-700/50">
              <TrendingUp className="w-8 h-8 mx-auto mb-3 text-blue-600 dark:text-blue-400" />
              <div className="text-3xl font-bold mb-1 text-gray-900 dark:text-white">
                50+
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Categories
              </div>
            </div>

            <div className="p-6 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:scale-105 bg-white/40 dark:bg-gray-800/30 border border-white/50 dark:border-gray-700/50">
              <Sparkles className="w-8 h-8 mx-auto mb-3 text-pink-600 dark:text-pink-400" />
              <div className="text-3xl font-bold mb-1 text-gray-900 dark:text-white">
                Daily
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                New Additions
              </div>
            </div>
          </div>
        </div>
        {isSearchWindowOpen && (
          <div className="fixed w-screen h-screen inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-50">
            <div className='w-full h-full mx-auto backdrop-blur-sm rounded-lg'
              onClick={(e) => e.stopPropagation()}>
              <SearchWindow onClose={() => setIsSearchWindowOpen(false)} />
            </div>
          </div>
        )}
      </div>



      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default Hero;