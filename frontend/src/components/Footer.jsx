import React from 'react';
import LOGO from '../assets/LOGO.png';
import { FaInstagram } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4 lg:px-20">
        <div className="flex flex-col md:flex-row md:justify-between items-center">
          {/* Logo and Company Info */}
          <div className="flex flex-col items-center md:items-start mb-6 md:mb-0 text-start md:text-left">
            <img src={LOGO} alt="Logo" className="w-40 h-auto mb-4" />
            <p>&copy; 2024 Your Company. All rights reserved.</p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col md:flex-row md:justify-around md:space-x-20 w-full text-start md:text-left">
            <div className="mb-6 md:mb-0">
              <h4 className="font-semibold mb-2">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-gray-400">About Us</a></li>
                <li><a href="#" className="hover:text-gray-400">Careers</a></li>
                <li><a href="#" className="hover:text-gray-400">Privacy Policy</a></li>
              </ul>
            </div>

            <div className="mb-6 md:mb-0">
              <h4 className="font-semibold mb-2">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-gray-400">Help Center</a></li>
                <li><a href="#" className="hover:text-gray-400">Contact Us</a></li>
                <li><a href="#" className="hover:text-gray-400">Returns</a></li>
              </ul>
            </div>

            <div className="mb-6 md:mb-0">
              <h4 className="font-semibold mb-2">Follow Us</h4>
              <div className="flex justify-start md:justify-start space-x-4">
                <a href="#" className="hover:text-gray-400"><FaXTwitter size={20} /></a>
                <a href="#" className="hover:text-gray-400"><FaFacebook size={20} /></a>
                <a href="#" className="hover:text-gray-400"><FaInstagram size={20} /></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
