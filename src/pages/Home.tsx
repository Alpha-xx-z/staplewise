import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Shield, Truck, CheckCircle, MapPin, Users, Package, TrendingUp, Search, ShoppingCart, CreditCard, Zap } from 'lucide-react';
import FloatingPopup from '../components/common/FloatingPopup';
import LoginModal from '../components/common/OAuthLoginModal';
import { useAuth } from '../contexts/AuthContext';

const Home: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showBuyForm, setShowBuyForm] = useState(false);
  const [showSellForm, setShowSellForm] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleCategoryClick = (categoryId: string) => {
    if (categoryId === 'cashews') {
      navigate('/products');
    } else {
      const categoryName = categoryId.replace('-', ' ').split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
      setSelectedCategory(categoryName);
      setShowComingSoon(true);
    }
  };

  const categories = [
    {
      id: 'cashews',
      name: 'Cashews',
      icon: Package,
      image: 'https://images.pexels.com/photos/4198019/pexels-photo-4198019.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Premium quality cashew kernels in various grades',
      varieties: ['W180', 'W210', 'W240', 'W320', 'W400', 'LWP', 'SWP', 'BB']
    },
    {
      id: 'cloves',
      name: 'Cloves',
      icon: Zap,
      image: 'https://images.pexels.com/photos/4198020/pexels-photo-4198020.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Aromatic whole cloves for culinary and medicinal use',
      varieties: ['Whole Cloves', 'Ground Cloves', 'Clove Oil']
    },
    {
      id: 'chillies',
      name: 'Chillies',
      icon: Zap,
      image: 'https://images.pexels.com/photos/4198021/pexels-photo-4198021.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Fresh and dried chillies with varying heat levels',
      varieties: ['Red Chilli', 'Green Chilli', 'Kashmiri Chilli', 'Guntur Chilli']
    },
    {
      id: 'star-anise',
      name: 'Star Anise',
      icon: Package,
      image: 'https://images.pexels.com/photos/4198022/pexels-photo-4198022.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Star-shaped spice with sweet licorice flavor',
      varieties: ['Whole Star Anise', 'Broken Star Anise', 'Ground Star Anise']
    },
    {
      id: 'pepper',
      name: 'Pepper',
      icon: Package,
      image: 'https://images.pexels.com/photos/4110256/pexels-photo-4110256.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Black and white peppercorns for seasoning',
      varieties: ['Black Pepper', 'White Pepper', 'Green Pepper', 'Pink Pepper']
    },
    {
      id: 'cinnamon',
      name: 'Cinnamon',
      icon: Package,
      image: 'https://images.pexels.com/photos/4110257/pexels-photo-4110257.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Sweet and aromatic cinnamon bark and powder',
      varieties: ['Ceylon Cinnamon', 'Cassia Cinnamon', 'Cinnamon Powder', 'Cinnamon Sticks']
    }
  ];
  const features = [
    {
      icon: Shield,
      title: 'Transparency',
      description: 'Complete transparency in pricing, quality, and supply chain processes'
    },
    {
      icon: Truck,
      title: 'Distribution',
      description: 'Efficient distribution network across major cashew production hubs'
    },
    {
      icon: CheckCircle,
      title: 'Compliance',
      description: 'Full regulatory compliance with GST, quality standards, and documentation'
    }
  ];

  const steps = [
    {
      icon: Search,
      title: 'Browse',
      description: 'Explore our extensive catalog of premium cashews from verified suppliers.'
    },
    {
      icon: CheckCircle,
      title: 'Grade & Price',
      description: 'Compare quality grades and competitive pricing across multiple suppliers.'
    },
    {
      icon: ShoppingCart,
      title: 'Place Order',
      description: 'Select your products and quantities, then submit your purchase order.'
    },
    {
      icon: Truck,
      title: 'Track & Delivery',
      description: 'Monitor your order status in real-time until it arrives at your doorstep.'
    },
    {
      icon: CreditCard,
      title: 'Payment',
      description: 'Complete your transaction securely through our integrated payment system.'
    }
  ];

  const stats = [
    { label: 'Active Suppliers', value: '500+', icon: Users },
    { label: 'Product Varieties', value: '25+', icon: Package },
    { label: 'Cities Covered', value: '50+', icon: MapPin },
    { label: 'Monthly Growth', value: '15%', icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary to-accent text-white pt-20 overflow-hidden">
        {/* Animated Background Shapes */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Concentric Circle Patterns */}
          <div className="absolute -top-20 -right-20 w-96 h-96">
            <div className="absolute inset-0 rounded-full border-4 border-secondary/20 animate-spin-slow"></div>
            <div className="absolute inset-8 rounded-full border-2 border-accent/30 animate-spin-reverse"></div>
            <div className="absolute inset-16 rounded-full border border-white/20 animate-pulse"></div>
            <div className="absolute inset-24 rounded-full bg-secondary/10 animate-float"></div>
          </div>
          
          {/* Dotted Circle Pattern */}
          <div className="absolute top-32 -left-32 w-64 h-64">
            <div className="absolute inset-0 rounded-full border-8 border-dotted border-accent/25 animate-spin-slow"></div>
            <div className="absolute inset-6 rounded-full border-4 border-dashed border-secondary/30 animate-spin-reverse"></div>
            <div className="absolute inset-12 rounded-full bg-white/5 animate-pulse"></div>
          </div>
          
          {/* Orbital Circle System */}
          <div className="absolute bottom-20 right-10 w-80 h-80">
            <div className="absolute inset-0 rounded-full border border-secondary/20"></div>
            <div className="absolute top-4 left-4 right-4 bottom-4 rounded-full border border-accent/25"></div>
            <div className="absolute top-8 left-8 right-8 bottom-8 rounded-full border border-white/15"></div>
            {/* Orbiting dots */}
            <div className="absolute top-0 left-1/2 w-3 h-3 bg-secondary/40 rounded-full animate-orbit-1 transform -translate-x-1/2"></div>
            <div className="absolute top-1/2 right-0 w-2 h-2 bg-accent/50 rounded-full animate-orbit-2 transform -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-1/2 w-2.5 h-2.5 bg-white/30 rounded-full animate-orbit-3 transform -translate-x-1/2"></div>
          </div>
          
          {/* Ripple Effect Circles */}
          <div className="absolute top-1/3 left-1/5 w-48 h-48">
            <div className="absolute inset-0 rounded-full bg-secondary/10 animate-ripple-1"></div>
            <div className="absolute inset-0 rounded-full bg-accent/10 animate-ripple-2"></div>
            <div className="absolute inset-0 rounded-full bg-white/10 animate-ripple-3"></div>
          </div>
          
          {/* Breathing Circle Pattern */}
          <div className="absolute bottom-1/3 left-1/3 w-32 h-32">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-secondary/20 to-accent/20 animate-breathe"></div>
            <div className="absolute inset-2 rounded-full bg-gradient-to-r from-accent/15 to-white/15 animate-breathe-reverse"></div>
            <div className="absolute inset-4 rounded-full bg-secondary/10 animate-pulse"></div>
          </div>
          
          {/* Floating Geometric Shapes */}
          <div className="absolute top-32 right-1/4 w-16 h-16 border-2 border-secondary/40 rotate-45 animate-spin-slow"></div>
          <div className="absolute bottom-40 left-1/3 w-12 h-12 bg-accent/20 transform rotate-12 animate-float"></div>
          <div className="absolute top-2/3 right-1/3 w-8 h-8 bg-secondary/30 rounded-full animate-bounce delay-500"></div>
        </div>
        
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=1920)',
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/85 to-accent/90">
          {/* Overlay Pattern */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, white 2px, transparent 2px),
                             radial-gradient(circle at 75% 75%, white 2px, transparent 2px)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 md:py-20 lg:py-24">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold font-playfair mb-3 sm:mb-4 md:mb-6 leading-tight px-2 animate-fade-in-up">
              Empowering B2B Cashew
              <br />
              <span className="text-secondary relative">
                Procurement Across India
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-secondary/50 rounded-full animate-expand-width"></div>
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-4 sm:mb-6 md:mb-8 text-gray-100 max-w-3xl mx-auto px-4 leading-relaxed animate-fade-in-up delay-300">
              Simplify your bulk cashew procurement through our technology-driven platform 
              ensuring transparency, compliance, and competitive pricing
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 max-w-md sm:max-w-none mx-auto animate-fade-in-up delay-500">
              <button
                onClick={() => {
                  const categoriesSection = document.getElementById('categories-section');
                  if (categoriesSection) {
                    categoriesSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="bg-secondary text-primary px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base md:text-lg hover:bg-secondary/90 transition-all duration-300 transform hover:scale-105 shadow-soft-lg relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                Explore Products
              </button>
              <button
                onClick={() => {
                  if (!user) {
                    window.location.href = '/register';
                  } else {
                    setShowSellForm(true);
                  }
                }}
                className="border-2 border-secondary text-secondary px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base md:text-lg hover:bg-secondary hover:text-primary transition-all duration-300 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-secondary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                <span className="relative z-10">Join as Seller</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Stats - Responsive positioning */}
      <div className="relative mt-8 sm:mt-8 lg:-mt-16 px-4 sm:px-6 lg:px-8 z-10 mb-8 sm:mb-12 lg:mb-20 animate-slide-up">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-xl lg:rounded-2xl shadow-soft p-4 sm:p-6 lg:p-10 hover:shadow-soft-lg transition-all duration-300">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-8 relative z-10">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-2 sm:mb-3 lg:mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-primary/10 rounded-full flex items-center justify-center">
                      <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-8 lg:h-8 text-primary" />
                    </div>
                  </div>
                  <div className="text-base sm:text-xl lg:text-3xl font-bold text-primary font-playfair mb-1 sm:mb-2">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm lg:text-base text-gray-600">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Platform Description */}
      <section className="py-8 sm:py-12 bg-gradient-to-b from-secondary/20 to-secondary/40 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-10 left-10 w-32 h-32 border border-primary/20 rounded-full animate-spin-slow"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-accent/10 rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-secondary/40 transform rotate-45 animate-float"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-playfair text-primary mb-4 sm:mb-6 px-2 relative">
              Why Choose StapleWise?
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-accent/20 rounded-full animate-ping"></div>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-3xl mx-auto px-4 leading-relaxed">
              Our mission is to revolutionize B2B cashew procurement by connecting 
              buyers and sellers through a transparent, efficient, and compliant platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white/95 backdrop-blur-sm rounded-lg md:rounded-xl p-4 md:p-6 shadow-soft hover:shadow-soft-lg hover:bg-white transition-all duration-300 transform hover:-translate-y-2 border border-white/20 group relative overflow-hidden">
                {/* Card Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                
                <div className="flex items-center md:flex-col md:items-start">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-primary/10 to-primary/20 rounded-lg flex items-center justify-center flex-shrink-0 mr-3 md:mr-0 md:mb-3 group-hover:scale-110 transition-transform duration-300 relative z-10">
                    <feature.icon className="w-5 h-5 md:w-6 md:h-6 text-primary group-hover:text-accent transition-colors duration-300" />
                  </div>
                  <div className="flex-1 md:w-full relative z-10">
                    <h3 className="text-lg md:text-xl font-bold font-playfair text-primary mb-1 md:mb-2 group-hover:text-accent transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section id="categories-section" className="py-12 sm:py-16 md:py-20 lg:py-24 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(45deg, transparent 40%, rgba(28, 74, 41, 0.1) 50%, transparent 60%),
                             linear-gradient(-45deg, transparent 40%, rgba(45, 95, 63, 0.1) 50%, transparent 60%)`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold font-playfair text-primary mb-3 sm:mb-4 md:mb-6 px-4 relative">
              Product Categories
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-primary to-accent rounded-full"></div>
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 max-w-3xl mx-auto px-4 leading-relaxed">
              Explore our comprehensive range of premium spices and agricultural products
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {categories.map((category) => (
              <div
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className="group relative overflow-hidden rounded-xl shadow-soft hover:shadow-soft-lg transition-all duration-300 transform hover:-translate-y-2 cursor-pointer h-64 md:h-80"
              >
                {/* Background Image */}
                <img
                  src={category.image}
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                
                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6">
                  <h3 className="text-xl md:text-2xl font-bold font-playfair text-white mb-2 group-hover:-translate-y-1 transition-transform duration-300">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-200 mb-3 opacity-90 line-clamp-2">
                    {category.description}
                  </p>
                  <div className="flex items-center text-white/90 text-sm font-medium">
                    <Package className="w-4 h-4 mr-2" />
                    <span>{category.varieties.length} varieties</span>
                  </div>
                </div>
                
                {/* Hover Effect Border */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-secondary/60 rounded-xl transition-colors duration-300"></div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8 md:mt-12">
            <button
              className="inline-flex items-center bg-primary text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-semibold text-base md:text-lg hover:bg-accent transition-all duration-300 transform hover:scale-105 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              View All Categories
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-32 bg-secondary/30 relative overflow-hidden">
        {/* Floating Elements */}
        <div className="absolute top-20 right-20 w-20 h-20 border-2 border-primary/20 rounded-full animate-spin-slow"></div>
        <div className="absolute bottom-20 left-20 w-16 h-16 bg-accent/10 rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 right-1/3 w-12 h-12 bg-secondary/50 transform rotate-45 animate-float"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold font-playfair text-primary mb-3 sm:mb-4 md:mb-6 px-4">
              How StapleWise Works
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 leading-relaxed px-4">
              Our streamlined process makes B2B cashew procurement simple, transparent, and efficient.
            </p>
          </div>
          
          <div className="relative">
            {/* Connection line for desktop */}
            <div className="hidden lg:block absolute top-12 md:top-16 lg:top-20 left-0 w-full h-0.5 bg-gradient-to-r from-primary/20 via-accent/40 to-primary/20 z-0"></div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-8 relative z-10">
              {steps.map((step, index) => (
                <div 
                  key={index}
                  className={`flex flex-col items-center text-center group hover:transform hover:scale-105 transition-all duration-300 ${index >= 3 && 'sm:col-span-2 md:col-span-1'}`}
                >
                  <div className="mb-3 sm:mb-4 md:mb-6 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 flex items-center justify-center bg-white rounded-full shadow-soft border-2 border-primary/20 group-hover:border-primary/40 group-hover:shadow-soft-lg transition-all duration-300 transform group-hover:-translate-y-1 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 scale-0 group-hover:scale-100 transition-transform duration-300 rounded-full"></div>
                    <step.icon className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-primary group-hover:text-accent transition-colors duration-300 relative z-10" />
                  </div>
                  <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold font-playfair text-primary mb-1 sm:mb-2 md:mb-3 group-hover:text-accent transition-colors duration-300">{step.title}</h3>
                  <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed max-w-xs px-2">{step.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-8 sm:mt-12 md:mt-16">
            <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl p-4 sm:p-6 md:p-8 shadow-soft-lg max-w-2xl mx-auto relative overflow-hidden group">
              {/* CTA Background Effects */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-secondary"></div>
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-secondary/20 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-2 -left-2 w-12 h-12 bg-primary/10 rounded-full animate-bounce"></div>
              
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold font-playfair text-primary mb-2 sm:mb-3 md:mb-4">
                Ready to Transform Your Procurement?
              </h3>
              <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-3 sm:mb-4 md:mb-6 leading-relaxed px-4">
                Join hundreds of businesses already streamlining their cashew procurement with StapleWise
              </p>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 justify-center px-4 max-w-md sm:max-w-none mx-auto">
                <button
                  onClick={() => {
                    if (!user) {
                     setShowLoginModal(true);
                    } else {
                      setShowBuyForm(true);
                    }
                  }}
                  className="bg-primary text-white px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 lg:py-4 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm md:text-base lg:text-lg hover:bg-accent transition-all duration-300 transform hover:-translate-y-0.5 shadow-soft hover:shadow-soft-lg text-center relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  Start Your Procurement
                </button>
                <Link
                  to="/products"
                  className="border-2 border-primary text-primary px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 lg:py-4 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm md:text-base lg:text-lg hover:bg-primary hover:text-white transition-all duration-300 text-center relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  <span className="relative z-10">Browse Products</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Popups */}
      {showBuyForm && (
        <FloatingPopup
          type="buy"
          onClose={() => setShowBuyForm(false)}
          category="CASHEWS"
        />
      )}
      {showSellForm && (
        <FloatingPopup
          type="sell"
          onClose={() => setShowSellForm(false)}
          category="CASHEWS"
        />
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onSuccess={() => {
            setShowLoginModal(false);
            setShowBuyForm(true);
          }}
          title="Sign in to Continue"
          subtitle="Please sign in to start your procurement journey"
        />
      )}

      {/* Coming Soon Modal */}
      {showComingSoon && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl transform animate-fade-in-up">
            <div className="p-8 text-center">
              {/* Icon */}
              <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-8 h-8 text-primary" />
              </div>
              
              {/* Title */}
              <h3 className="text-2xl font-bold font-playfair text-primary mb-4">
                Coming Soon!
              </h3>
              
              {/* Message */}
              <p className="text-gray-600 mb-2 text-lg">
                <span className="font-semibold text-primary">{selectedCategory}</span> listing page
              </p>
              <p className="text-gray-500 mb-8 text-sm leading-relaxed">
                We're working hard to add more product categories to our platform. 
                Stay tuned for updates!
              </p>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => setShowComingSoon(false)}
                  className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-accent transition-colors"
                >
                  Got it!
                </button>
                <Link
                  to="/products"
                  onClick={() => setShowComingSoon(false)}
                  className="border-2 border-primary text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors text-center"
                >
                  Browse Cashews
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;