import React from 'react';
import { Users, Target, Eye, Handshake, Star, Award, TrendingUp } from 'lucide-react';

const About: React.FC = () => {
  const teamMembers = [
    {
      name: 'Rajesh Kumar',
      role: 'Founder & CEO',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300',
      description: '15+ years in agri-commodity trading'
    },
    {
      name: 'Priya Sharma',
      role: 'Co-Founder & CTO',
      image: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=300',
      description: 'Technology expert with fintech background'
    },
    {
      name: 'Arjun Nair',
      role: 'Head of Operations',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=300',
      description: 'Supply chain and logistics specialist'
    },
    {
      name: 'Kavitha Reddy',
      role: 'Head of Quality',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300',
      description: 'Food quality and safety expert'
    }
  ];

  const values = [
    {
      icon: Target,
      title: 'Mission',
      description: 'Simplifying bulk cashew procurement through compliance and technology-driven solutions that ensure transparency, quality, and competitive pricing for B2B buyers across India.'
    },
    {
      icon: Eye,
      title: 'Vision',
      description: 'To become India\'s leading B2B marketplace for cashews and expand to other agri-staple commodities, creating a transparent and efficient ecosystem for agricultural trade.'
    },
    {
      icon: Users,
      title: 'Values',
      description: 'Transparency in every transaction, commitment to quality, regulatory compliance, customer-centric approach, and sustainable business practices that benefit all stakeholders.'
    }
  ];

  return (
    <div className="min-h-screen py-8 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-accent/10 rounded-full blur-2xl animate-bounce"></div>
        <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-secondary/30 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-1/3 right-1/3 w-16 h-16 border border-primary/20 rounded-full animate-spin-slow"></div>
        <div className="absolute bottom-20 right-10 w-20 h-20 bg-accent/5 transform rotate-45 animate-pulse"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16 relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold font-playfair text-primary mb-6 animate-fade-in-up">
            About StapleWise
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-primary to-accent rounded-full animate-expand-width"></div>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-300">
            Revolutionizing B2B cashew procurement through technology, transparency, 
            and unwavering commitment to quality across India's cashew supply chain.
          </p>
        </div>

        {/* Mission, Vision, Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 animate-slide-up">
          {values.map((value, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-soft text-center hover:shadow-soft-lg transition-all duration-300 transform hover:-translate-y-2 group relative overflow-hidden">
              {/* Card Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              
              <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 relative z-10">
                <value.icon className="w-10 h-10 text-primary group-hover:text-accent transition-colors duration-300" />
              </div>
              <h3 className="text-2xl font-bold font-playfair text-primary mb-4 group-hover:text-accent transition-colors duration-300 relative z-10">
                {value.title}
              </h3>
              <p className="text-gray-600 leading-relaxed relative z-10">
                {value.description}
              </p>
            </div>
          ))}
        </div>

        {/* Our Story */}
        <div className="bg-secondary/30 rounded-2xl p-8 md:p-12 mb-20 relative overflow-hidden">
          {/* Background Decorative Elements */}
          <div className="absolute top-10 right-10 w-24 h-24 border border-primary/20 rounded-full animate-spin-slow"></div>
          <div className="absolute bottom-10 left-10 w-16 h-16 bg-accent/10 rounded-full animate-pulse"></div>
          <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-secondary/40 transform rotate-45 animate-float"></div>
          
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold font-playfair text-primary mb-6 text-center relative">
              Our Story
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-accent/20 rounded-full animate-ping"></div>
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700 relative z-10">
              <p className="mb-6">
                StapleWise was born from a simple observation: the B2B cashew procurement 
                process in India was fragmented, opaque, and inefficient. Traditional 
                trading methods lacked transparency in pricing, quality standards were 
                inconsistent, and compliance requirements were complex to navigate.
              </p>
              <p className="mb-6">
                Founded in 2023 by industry veterans with deep expertise in agricultural 
                commodities and technology, StapleWise set out to create a modern, 
                technology-driven platform that would address these challenges head-on.
              </p>
              <p>
                Today, we're proud to serve hundreds of buyers and sellers across India, 
                facilitating transparent, compliant, and efficient cashew trade. Our platform 
                has processed thousands of tonnes of cashews, helping businesses of all sizes 
                access premium quality products at competitive prices.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16 relative">
          <h2 className="text-3xl md:text-4xl font-bold font-playfair text-primary mb-12 text-center relative">
            Meet Our Team
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-primary to-accent rounded-full"></div>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-soft text-center hover:shadow-soft-lg transition-all duration-300 transform hover:-translate-y-2 group relative overflow-hidden">
                {/* Card Effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                
                <div className="w-24 h-24 mx-auto mb-4 overflow-hidden rounded-full relative z-10 group-hover:scale-110 transition-transform duration-300">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold font-playfair text-primary mb-2 group-hover:text-accent transition-colors duration-300 relative z-10">
                  {member.name}
                </h3>
                <p className="text-accent font-semibold mb-3 group-hover:text-primary transition-colors duration-300 relative z-10">
                  {member.role}
                </p>
                <p className="text-gray-600 text-sm relative z-10">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-primary rounded-2xl p-8 md:p-12 text-center text-white relative overflow-hidden">
          {/* CTA Background Effects */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary via-accent to-secondary"></div>
          <div className="absolute -top-4 -right-4 w-16 h-16 bg-secondary/20 rounded-full animate-pulse"></div>
          <div className="absolute -bottom-2 -left-2 w-12 h-12 bg-accent/20 rounded-full animate-bounce"></div>
          
          <h2 className="text-3xl md:text-4xl font-bold font-playfair mb-6 relative z-10">
            Partner With Us
          </h2>
          <p className="text-xl mb-8 text-gray-100 max-w-2xl mx-auto relative z-10">
            Join our growing network of cashew suppliers and buyers. 
            Let's build the future of agricultural commodity trading together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <a
              href="/contact"
              className="bg-secondary text-primary px-8 py-4 rounded-xl font-semibold text-lg hover:bg-secondary/90 transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <Handshake className="w-5 h-5 mr-2" />
              Get In Touch
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;