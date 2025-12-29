import React from 'react';
import { Instagram, Twitter, Facebook, Github, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    navigation: [
      { name: 'Home', href: '/' },
      { name: 'Categories', href: '/categories' },
      { name: 'About', href: '/about' },
      { name: 'Contact', href: '/contact' }
    ],
    social: [
      { name: 'Instagram', icon: Instagram, href: 'https://instagram.com' },
      { name: 'Twitter', icon: Twitter, href: 'https://x.com' },
      { name: 'Facebook', icon: Facebook, href: 'https://facebook.com' },
      { name: 'GitHub', icon: Github, href: 'https://github.com' }
    ]
  };

  return (
    <footer className="transition-colors duration-300 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <a href="/" className="inline-block mb-4">
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                Web-Hunter
              </span>
            </a>
            <p className="text-sm mb-4 max-w-md text-gray-600 dark:text-gray-400">
              Your ultimate directory to explore, discover, and bookmark the most useful tools, resources, and platforms across the internet.
            </p>
            <div className="flex space-x-4">
              {footerLinks.social.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg transition-all duration-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider text-gray-900 dark:text-gray-300">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {footerLinks.navigation.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm transition-colors duration-200 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider text-gray-900 dark:text-gray-300">
              Resources
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#blog"
                  className="text-sm transition-colors duration-200 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#submit"
                  className="text-sm transition-colors duration-200 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  Submit Website
                </a>
              </li>
              <li>
                <a
                  href="#privacy"
                  className="text-sm transition-colors duration-200 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#terms"
                  className="text-sm transition-colors duration-200 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="w-full sm:w-auto text-sm text-wrap sm:flex items-center text-gray-600 dark:text-gray-400">

              © {currentYear} Web-Hunter.
              Made with
              <Heart className="w-4 h-4 text-red-500 sm:mx-1 fill-current" />
              
              by
              <a href='mailto:rajanijha50@gmail.com'
                className='mx-1 underline text-wrap'>
                Rajani Ranjan Jha
              </a>
              for developers.

            </p>
            <div className="flex space-x-6">
              <a
                href="#cookies"
                className="text-sm transition-colors duration-200 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                Cookie Policy
              </a>
              <a
                href="#sitemap"
                className="text-sm transition-colors duration-200 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;