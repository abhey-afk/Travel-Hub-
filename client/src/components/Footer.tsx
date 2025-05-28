import React from 'react';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, CreditCard } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Company */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">About Travel Hub</h3>
            <p className="mb-4 text-gray-400">
              Travel Hub is India's leading online travel booking brand providing range of choice for hotels, flights, trains, bus and cars for travelers.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Careers</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Customer Support</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Partner With Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Blog</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Investor Relations</a></li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Travel Products</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Domestic Flights</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">International Flights</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Hotels & Homestays</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Holiday Packages</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Train Tickets</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Bus Tickets</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Cab Bookings</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <MapPin className="w-5 h-5 mr-3 text-gray-400" />
                <p className="text-gray-400">
                  Travel Hub Office, Sector 5, Gurugram, Haryana 122002, India
                </p>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 mr-3 text-gray-400" />
                <p className="text-gray-400">+91 9876543210</p>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 mr-3 text-gray-400" />
                <p className="text-gray-400">support@travelhub.com</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Divider */}
        <div className="border-t border-gray-800 my-8"></div>
        
        {/* Payment Options */}
        <div className="mb-8">
          <h3 className="text-white text-lg font-bold mb-4">Payment Options</h3>
          <div className="flex flex-wrap gap-3">
            <div className="bg-white p-2 rounded">
              <CreditCard className="w-6 h-6 text-gray-800" />
            </div>
            {/* You would add more payment icons here */}
          </div>
        </div>
        
        {/* Bottom Footer */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-center text-gray-400">© 2025 Travel Hub. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-white transition duration-300 text-sm">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition duration-300 text-sm">
              Terms of Service
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition duration-300 text-sm">
              Legal Information
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;