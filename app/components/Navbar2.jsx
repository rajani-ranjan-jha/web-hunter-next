'use client';
import React, { useState, useEffect } from 'react';
import { Moon, Sun, Menu, X, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { setAdminStatus } from '../redux/authSlice';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';

const Navbar2 = ({theme, toggleTheme}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);

  // const [theme, setTheme] = useState();

  const isAdmin = useSelector(state => state.admin.status);
  const dispatch = useDispatch();
  const { data: session } = useSession();

  const categories = [
    'AI Code',
    'Design',
    'Free',
    'Productivity',
    'Social Media',
    'Typing',
    'Video Editing',
    'Image Tool',
  ];

  // useEffect(() => {
  //   const currentTheme = localStorage.getItem('theme');
  //   if (currentTheme) {
  //     setTheme(currentTheme);
  //   }
    
  // }, []);

  useEffect(() => {
    if (session && session?.user) {
      verifyAdmin();
    }
  }, [session]);

  const verifyAdmin = async () => {
    try {
      const response = await fetch('/api/user/authorize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: session?.user?.email }),
      });
      const result = await response.json();
      dispatch(setAdminStatus(result.success));
    } catch (error) {
      console.error("Error verifying admin:", error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isCategoriesOpen) setIsCategoriesOpen(false);
    if (isDropDownOpen) setIsDropDownOpen(false);
  };

  // const toggleTheme = () => {
  //   setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  //   document.body.className = theme;
  //   localStorage.setItem('theme', theme);
  // };

  const toggleDropDown = () => {
    setIsDropDownOpen(!isDropDownOpen);
  };

  return (
    <nav className={`fixed z-40 w-full top-0 transition-all duration-300 ${theme === 'dark'
        ? 'bg-gray-900/95 backdrop-blur-md border-b border-gray-800'
        : 'bg-white/95 backdrop-blur-md border-b border-gray-200'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/" className="flex items-center">
              <span className={`text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent`}>
                Web-Hunter
              </span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <a
              href="/"
              className={`transition-colors duration-200 ${theme === 'dark'
                  ? 'text-gray-300 hover:text-white'
                  : 'text-gray-700 hover:text-gray-900'
                }`}
            >
              Home
            </a>

            {/* Categories Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                className={`flex items-center space-x-1 transition-colors duration-200 ${theme === 'dark'
                    ? 'text-gray-300 hover:text-white'
                    : 'text-gray-700 hover:text-gray-900'
                  }`}
              >
                <span>Categories</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isCategoriesOpen ? 'rotate-180' : ''}`} />
              </button>

              {isCategoriesOpen && (
                <div className={`absolute top-full left-0 mt-2 w-56 rounded-lg shadow-xl transition-all duration-200 z-[1000] ${theme === 'dark'
                    ? 'bg-gray-800 border border-gray-700'
                    : 'bg-white border border-gray-200'
                  }`}
                  >
                  <div className="py-2">
                    {categories.map((category, index) => (
                      <a
                        key={index}
                        href={`/categories/${category.toLowerCase().replace(/\s+/g, '-')}`}
                        className={`block px-4 py-2 transition-colors duration-150 ${theme === 'dark'
                            ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                          }`}
                        onClick={() => setIsCategoriesOpen(false)}
                      >
                        {category}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/about"
              className={`transition-colors duration-200 ${theme === 'dark'
                  ? 'text-gray-300 hover:text-white'
                  : 'text-gray-700 hover:text-gray-900'
                }`}
            >
              About
            </Link>

            <Link
              href="/contact"
              className={`transition-colors duration-200 ${theme === 'dark'
                  ? 'text-gray-300 hover:text-white'
                  : 'text-gray-700 hover:text-gray-900'
                }`}
            >
              Contact
            </Link>
          </div>

          {/* Right Side - Theme Toggle & Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all duration-200 ${theme === 'dark'
                  ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {session ? (
              <div className="relative">
                <button
                  onClick={toggleDropDown}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 ${theme === 'dark'
                      ? 'text-gray-300 hover:bg-gray-800'
                      : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  <span className="capitalize">{'Hello, '+session.user.name.split(' ')[0]}</span>
                  <Image src={session?.user?.image} alt="user" width={30} height={30} className="rounded-full" />
                  {isDropDownOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {isDropDownOpen && (
                  <ul className={`absolute top-full right-0 mt-2 w-48 rounded-lg shadow-xl transition-all duration-200 ${theme === 'dark'
                      ? 'bg-gray-800 border border-gray-700'
                      : 'bg-white border border-gray-200'
                    } py-2`}>
                    {isAdmin && (
                      <li>
                        <Link
                          onClick={toggleDropDown}
                          href="/admin-panel"
                          className={`block px-4 py-2 transition-colors duration-150 ${theme === 'dark'
                              ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                        >
                          Add Data
                        </Link>
                      </li>
                    )}
                    <li>
                      <Link
                        onClick={toggleDropDown}
                        href="/bookmarks"
                        className={`block px-4 py-2 transition-colors duration-150 ${theme === 'dark'
                            ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                          }`}
                      >
                        Bookmarks
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={() => { signOut(); toggleDropDown(); }}
                        className={`w-full text-left px-4 py-2 transition-colors duration-150 ${theme === 'dark'
                            ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                          }`}
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            ) : (
              <>
                <Link
                  href='/login'
                  className={`px-4 py-2 rounded-lg transition-all duration-200 ${theme === 'dark'
                      ? 'text-gray-300 hover:bg-gray-800'
                      : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  Login
                </Link>
                <Link
                  href='/register'
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all duration-200 ${theme === 'dark'
                  ? 'bg-gray-800 text-yellow-400'
                  : 'bg-gray-100 text-gray-700'
                }`}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button
              onClick={toggleMenu}
              className={`p-2 rounded-lg transition-colors duration-200 ${theme === 'dark'
                  ? 'text-gray-300 hover:bg-gray-800'
                  : 'text-gray-700 hover:bg-gray-100'
                }`}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className={`lg:hidden transition-all duration-300 ${theme === 'dark' ? 'bg-gray-900 border-t border-gray-800' : 'bg-white border-t border-gray-200'
          }`}>
          <div className="px-4 pt-2 pb-4 space-y-2">
            <a
              href="/"
              className={`block px-3 py-2 rounded-lg transition-colors duration-200 ${theme === 'dark'
                  ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
            >
              Home
            </a>

            <div>
              <button
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors duration-200 ${theme === 'dark'
                    ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
              >
                <span>Categories</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isCategoriesOpen ? 'rotate-180' : ''}`} />
              </button>
              {isCategoriesOpen && (
                <div className="ml-4 mt-2 space-y-1">
                  {categories.map((category, index) => (
                    <a
                      key={index}
                      href={`/categories/${category.toLowerCase().replace(/\s+/g, '-')}`}
                      className={`block px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${theme === 'dark'
                          ? 'text-gray-400 hover:bg-gray-800 hover:text-white'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                    >
                      {category}
                    </a>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/about"
              className={`block px-3 py-2 rounded-lg transition-colors duration-200 ${theme === 'dark'
                  ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
            >
              About
            </Link>

            <Link
              href="/contact"
              className={`block px-3 py-2 rounded-lg transition-colors duration-200 ${theme === 'dark'
                  ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
            >
              Contact
            </Link>

            <div className="pt-4 space-y-2">
              {session ? (
                <div className="space-y-2">
                  {isAdmin && (
                    <Link
                      onClick={toggleMenu}
                      href="/admin-panel"
                      className={`block w-full px-4 py-2 rounded-lg transition-colors duration-200 ${theme === 'dark'
                          ? 'text-gray-300 hover:bg-gray-800'
                          : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                      Add Data
                    </Link>
                  )}
                  <Link
                    onClick={toggleMenu}
                    href="/bookmarks"
                    className={`block w-full px-4 py-2 rounded-lg transition-colors duration-200 ${theme === 'dark'
                        ? 'text-gray-300 hover:bg-gray-800'
                        : 'text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    Bookmarks
                  </Link>
                  <button
                    onClick={() => { signOut(); toggleMenu(); }}
                    className={`w-full px-4 py-2 rounded-lg transition-colors duration-200 ${theme === 'dark'
                        ? 'text-gray-300 hover:bg-gray-800'
                        : 'text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    href='/login'
                    className={`block w-full px-4 py-2 rounded-lg transition-colors duration-200 ${theme === 'dark'
                        ? 'text-gray-300 hover:bg-gray-800'
                        : 'text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    Login
                  </Link>
                  <Link
                    href='/register'
                    className="block w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg hover:shadow-lg transition-all duration-200"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar2;