import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-primary font-bold text-sm">SW</span>
              </div>
              <span className="text-xl font-bold font-playfair">StapleWise</span>
            </div>
            <p className="text-gray-200 mb-4 max-w-md">
              Empowering B2B cashew procurement across India through transparency, 
              compliance, and technology-driven solutions.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span className="text-gray-200">info@staplewise.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span className="text-gray-200">+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span className="text-gray-200">Bangalore, Karnataka, India</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 font-playfair">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-200 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/products" className="text-gray-200 hover:text-white transition-colors">Products</Link></li>
              <li><Link to="/about" className="text-gray-200 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-200 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4 font-playfair">Services</h3>
            <ul className="space-y-2">
              <li><span className="text-gray-200">B2B Procurement</span></li>
              <li><span className="text-gray-200">Quality Assurance</span></li>
              <li><span className="text-gray-200">Logistics Support</span></li>
              <li><span className="text-gray-200">Compliance Management</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary/20 mt-8 pt-8 text-center">
          <p className="text-gray-200">
            © 2024 StapleWise. All rights reserved. | Empowering cashew procurement across India.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;