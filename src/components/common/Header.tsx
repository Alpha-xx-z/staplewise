import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, LogOut, Menu, X, ChevronDown, MapPin, Package } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import LoginModal from './LoginModal';
import { Role } from '../../types';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogin, setShowLogin] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleCategoryClick = (categoryId: string) => {
    if (categoryId === 'cashews') {
      navigate('/products');
    } else {
      // For other categories, you can add navigation logic here
      console.log(`Navigate to ${categoryId} category`);
    }
  };

  const categories = [
    { id: 'cashews', name: 'Cashews' },
    { id: 'cloves', name: 'Cloves' },
    { id: 'chillies', name: 'Chillies' },
    { id: 'star-anise', name: 'Star Anise' },
    { id: 'pepper', name: 'Pepper' },
    { id: 'cinnamon', name: 'Cinnamon' }
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const getDashboardRoute = () => {
    if (!user) return '/';
    switch (user.role) {
      case Role.ADMIN:
        return '/admin';
      case Role.SALES:
        return '/sales';
      case Role.SELLER:
        return '/seller';
      default:
        return '/';
    }
  };

  const isSellerPortal = location.pathname.startsWith('/seller');

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">SW</span>
                </div>
                <span className="text-xl font-bold text-primary font-playfair">StapleWise</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {!isSellerPortal && (
                <>
                  <Link to="/" className="text-gray-700 hover:text-primary transition-colors">Home</Link>
                  
                  {/* Categories Dropdown */}
                  <div className="relative group">
                    <button className="flex items-center text-gray-700 hover:text-primary transition-colors py-2 px-3 rounded-lg hover:bg-primary/5">
                      Categories
                      <ChevronDown className="w-4 h-4 ml-1 group-hover:rotate-180 transition-transform duration-200" />
                    </button>
                    
                    {/* Dropdown Menu */}
                    <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="py-2">
                        {categories.map((category) => (
                          <button
                            key={category.id}
                            onClick={() => handleCategoryClick(category.id)}
                            className="w-full text-left px-4 py-3 text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors flex items-center"
                          >
                            <Package className="w-4 h-4 mr-3 text-gray-400" />
                            {category.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <Link to="/about" className="text-gray-700 hover:text-primary transition-colors">About</Link>
                  <Link to="/contact" className="text-gray-700 hover:text-primary transition-colors">Contact</Link>
                </>
              )}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <Link 
                    to={getDashboardRoute()}
                    className="flex items-center space-x-2 text-gray-700 hover:text-primary transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span>{user.name}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowLogin(true)}
                  className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Login
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-700 hover:text-primary transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <nav className="flex flex-col space-y-4">
                {!isSellerPortal && (
                  <>
                    <Link to="/" className="text-gray-700 hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
                    
                    {/* Mobile Categories */}
                    <div className="space-y-2">
                      <span className="text-gray-700 font-medium">Categories</span>
                      <div className="pl-4 space-y-1">
                        {categories.map((category) => (
                          <button
                            key={category.id}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block text-sm text-gray-600 hover:text-primary transition-colors"
                          >
                            {category.name}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <Link to="/about" className="text-gray-700 hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
                    <Link to="/contact" className="text-gray-700 hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
                  </>
                )}
                
                {user ? (
                  <>
                    <Link 
                      to={getDashboardRoute()}
                      className="flex items-center space-x-2 text-gray-700 hover:text-primary transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      <span>{user.name}</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setShowLogin(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors text-left"
                  >
                    Login
                  </button>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  );
};

export default Header;