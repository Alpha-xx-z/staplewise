import React, { useState } from 'react';
import { Mail, Phone, MapPin, MessageCircle, Send, Clock, Globe, Users } from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Contact form submitted:', formData);
    alert('Thank you for your message! We\'ll get back to you soon.');
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen py-8 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-40 h-40 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-60 left-10 w-32 h-32 bg-accent/10 rounded-full blur-2xl animate-bounce"></div>
        <div className="absolute bottom-40 right-1/4 w-24 h-24 bg-secondary/40 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 border border-primary/20 rounded-full animate-spin-slow"></div>
        <div className="absolute bottom-20 left-20 w-20 h-20 bg-accent/5 transform rotate-45 animate-pulse"></div>
        
        {/* Floating Geometric Shapes */}
        <div className="absolute top-32 left-1/4 w-12 h-12 border-2 border-accent/30 rotate-45 animate-float"></div>
        <div className="absolute bottom-60 right-1/3 w-8 h-8 bg-primary/20 rounded-full animate-bounce delay-500"></div>
        <div className="absolute top-2/3 right-20 w-6 h-6 bg-secondary/60 transform rotate-12 animate-ping"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold font-playfair text-primary mb-6 animate-fade-in-up relative">
            Contact Us
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-primary to-accent rounded-full animate-expand-width"></div>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in-up delay-300">
            Have questions about our products or services? We're here to help. 
            Reach out to us and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="animate-slide-up">
            <h2 className="text-3xl font-bold font-playfair text-primary mb-8 relative">
              Get In Touch
              <div className="absolute -bottom-2 left-0 w-16 h-1 bg-gradient-to-r from-primary to-accent rounded-full"></div>
            </h2>
            
            <div className="space-y-6 mb-8">
              <div className="flex items-start space-x-4 group hover:transform hover:scale-105 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-soft group-hover:shadow-soft-lg">
                  <Mail className="w-6 h-6 text-primary group-hover:text-accent transition-colors duration-300" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-1 group-hover:text-accent transition-colors duration-300">Email</h3>
                  <p className="text-gray-600">info@staplewise.com</p>
                  <p className="text-gray-600">support@staplewise.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 group hover:transform hover:scale-105 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-soft group-hover:shadow-soft-lg">
                  <Phone className="w-6 h-6 text-primary group-hover:text-accent transition-colors duration-300" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-1 group-hover:text-accent transition-colors duration-300">Phone</h3>
                  <p className="text-gray-600">+91 98765 43210</p>
                  <p className="text-gray-600">+91 98765 43211</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 group hover:transform hover:scale-105 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-soft group-hover:shadow-soft-lg">
                  <MessageCircle className="w-6 h-6 text-primary group-hover:text-accent transition-colors duration-300" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-1 group-hover:text-accent transition-colors duration-300">WhatsApp</h3>
                  <p className="text-gray-600">+91 98765 43210</p>
                  <p className="text-sm text-gray-500">Available 9 AM - 6 PM IST</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 group hover:transform hover:scale-105 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-soft group-hover:shadow-soft-lg">
                  <MapPin className="w-6 h-6 text-primary group-hover:text-accent transition-colors duration-300" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-1 group-hover:text-accent transition-colors duration-300">Office</h3>
                  <p className="text-gray-600">
                    123 Business District<br />
                    Koramangala, Bangalore - 560034<br />
                    Karnataka, India
                  </p>
                </div>
              </div>
            </div>

            {/* Google Map Placeholder */}
            <div className="bg-gray-200 rounded-2xl h-64 flex items-center justify-center hover:bg-gray-100 transition-colors duration-300 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="text-center text-gray-500">
                <MapPin className="w-12 h-12 mx-auto mb-2 group-hover:text-primary transition-colors duration-300" />
                <p>Interactive Map</p>
                <p className="text-sm">Koramangala, Bangalore</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="animate-slide-up delay-300">
            <div className="bg-white rounded-2xl shadow-soft p-8 hover:shadow-soft-lg transition-all duration-300 relative overflow-hidden group">
              {/* Form Background Effects */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent"></div>
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-secondary/20 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-2 -left-2 w-12 h-12 bg-primary/10 rounded-full animate-bounce"></div>
              
              <h2 className="text-3xl font-bold font-playfair text-primary mb-6 relative z-10">
                Send us a Message
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 hover:border-primary/50"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 hover:border-primary/50"
                    placeholder="Enter your email address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 hover:border-primary/50"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 hover:border-primary/50 resize-none"
                    placeholder="Tell us about your inquiry..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary text-white px-6 py-3 rounded-lg font-semibold text-lg hover:bg-accent transition-all duration-300 transform hover:scale-105 flex items-center justify-center relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  <Send className="w-5 h-5 mr-2" />
                  Send Message
                </button>
              </form>
            </div>

            {/* Business Hours */}
            <div className="mt-8 bg-secondary/30 rounded-2xl p-6 hover:bg-secondary/40 transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 to-accent/50 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              
              <h3 className="text-xl font-bold font-playfair text-primary mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 group-hover:text-accent transition-colors duration-300" />
                Business Hours
              </h3>
              <div className="space-y-2 text-gray-700">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span>9:00 AM - 6:00 PM IST</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span>9:00 AM - 2:00 PM IST</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span>Closed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;