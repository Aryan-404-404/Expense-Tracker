import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate()

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto pt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-sm flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-sm opacity-90"></div>
              </div>
              <span className="text-xl text-gray-800 font-semibold">ExpenseTracker</span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed max-w-md">
              Take control of your finances with our intuitive expense tracking platform.
              Monitor spending, track income, and achieve your financial goals with ease.
            </p>
          </div>

          {/* Features Links */}
          <div>
            <h3 className="text-gray-800 font-medium mb-4">Features</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">Dashboard</Link></li>
              <li><Link to="/transactions" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">Transactions</Link></li>
              <li><Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">Categories</Link></li>
              <li><Link to="#" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">Reports</Link></li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-gray-800 font-medium mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">Help Center</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">Contact Us</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="text-sm text-gray-500">
              © 2024 ExpenseTracker. All rights reserved.
            </div>
            <div className="text-sm text-gray-500">
              Made with ❤️ for better financial management
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;