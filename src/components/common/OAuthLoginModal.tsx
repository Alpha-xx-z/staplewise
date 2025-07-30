import React, { useState } from 'react';
import { X, Mail, Chrome, Github, Facebook } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Role } from '../../types';

interface OAuthLoginModalProps {
  onClose: () => void;
  onSuccess?: () => void;
  title?: string;
  subtitle?: string;
}

const OAuthLoginModal: React.FC<OAuthLoginModalProps> = ({ 
  onClose, 
  onSuccess, 
  title = "Sign in to Continue",
  subtitle = "Choose your preferred sign-in method"
}) => {
  const { login, register } = useAuth();
  const [loading, setLoading] = useState<string>('');
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    companyName: ''
  });
  const [error, setError] = useState('');

  // Mock OAuth handlers (in production, these would integrate with actual OAuth providers)
  const handleGoogleLogin = async () => {
    setLoading('google');
    try {
      // Simulate OAuth flow
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock successful Google login
      const success = await login('buyer@example.com', 'password123');
      if (success) {
        onSuccess?.();
        onClose();
      } else {
        setError('Google login failed. Please try again.');
      }
    } catch (err) {
      setError('Google login failed. Please try again.');
    } finally {
      setLoading('');
    }
  };

  const handleFacebookLogin = async () => {
    setLoading('facebook');
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const success = await login('buyer@example.com', 'password123');
      if (success) {
        onSuccess?.();
        onClose();
      } else {
        setError('Facebook login failed. Please try again.');
      }
    } catch (err) {
      setError('Facebook login failed. Please try again.');
    } finally {
      setLoading('');
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading('email');
    setError('');

    try {
      let success = false;
      if (isLogin) {
        success = await login(formData.email, formData.password);
      } else {
        success = await register({ ...formData, role: Role.BUYER });
      }

      if (success) {
        onSuccess?.();
        onClose();
      } else {
        setError(isLogin ? 'Invalid credentials' : 'Registration failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading('');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl transform animate-fade-in-up">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-primary font-playfair">{title}</h2>
              <p className="text-gray-600 text-sm mt-1">{subtitle}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {!showEmailForm ? (
            <>
              {/* OAuth Buttons */}
              <div className="space-y-3 mb-6">
                <button
                  onClick={handleGoogleLogin}
                  disabled={loading === 'google'}
                  className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed relative"
                >
                  {loading === 'google' ? (
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-primary rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Chrome className="w-5 h-5 text-red-500 mr-3" />
                      <span className="font-medium text-gray-700">Continue with Google</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleFacebookLogin}
                  disabled={loading === 'facebook'}
                  className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading === 'facebook' ? (
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-primary rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Facebook className="w-5 h-5 text-blue-600 mr-3" />
                      <span className="font-medium text-gray-700">Continue with Facebook</span>
                    </>
                  )}
                </button>

              </div>

              {/* Divider */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or</span>
                </div>
              </div>

              {/* Email Option */}
              <button
                onClick={() => setShowEmailForm(true)}
                className="w-full flex items-center justify-center px-4 py-3 bg-primary text-white rounded-lg hover:bg-accent transition-colors font-medium"
              >
                <Mail className="w-5 h-5 mr-3" />
                Continue with Email
              </button>
            </>
          ) : (
            <>
              {/* Email Form */}
              <div className="mb-4">
                <div className="flex rounded-lg bg-gray-100 p-1">
                  <button
                    type="button"
                    onClick={() => setIsLogin(true)}
                    className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      isLogin
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-gray-600 hover:text-primary'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsLogin(false)}
                    className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      !isLogin
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-gray-600 hover:text-primary'
                    }`}
                  >
                    Sign Up
                  </button>
                </div>
              </div>

              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                    placeholder="Enter your password"
                  />
                </div>

                {!isLogin && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                        placeholder="+91 98765 43210"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company Name
                      </label>
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                        placeholder="Enter your company name"
                      />
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  disabled={loading === 'email'}
                  className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  {loading === 'email' ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Please wait...
                    </div>
                  ) : (
                    isLogin ? 'Sign In' : 'Create Account'
                  )}
                </button>
              </form>

              <button
                onClick={() => setShowEmailForm(false)}
                className="w-full mt-4 text-primary hover:text-accent transition-colors text-sm font-medium"
              >
                ← Back to login options
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OAuthLoginModal;