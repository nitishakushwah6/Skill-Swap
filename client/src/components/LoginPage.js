import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simulate API call
      setTimeout(() => {
        // Demo credentials
        if (formData.email === 'demo@skillswap.com' && formData.password === 'demo123') {
          // Regular user login
          localStorage.setItem('user', JSON.stringify({
            _id: '1',
            name: 'Demo User',
            email: 'demo@skillswap.com',
            role: 'user'
          }));
          navigate('/');
        } else if (formData.email === 'admin@skillswap.com' && formData.password === 'admin123') {
          // Admin login
          localStorage.setItem('user', JSON.stringify({
            _id: 'admin1',
            name: 'Admin User',
            email: 'admin@skillswap.com',
            role: 'admin'
          }));
          navigate('/admin');
        } else {
          setError('Invalid credentials. Please try again.');
        }
        setLoading(false);
      }, 1000);
    } catch (error) {
      setError('Login failed. Please try again.');
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setFormData({
      email: 'demo@skillswap.com',
      password: 'demo123'
    });
    setIsAdmin(false);
  };

  const handleAdminDemo = () => {
    setFormData({
      email: 'admin@skillswap.com',
      password: 'admin123'
    });
    setIsAdmin(true);
  };

  return (
    <div className="min-h-screen">
      {/* Animated Background */}
      <div className="fixed inset-0 gradient-bg opacity-20"></div>
      
      {/* Floating Elements - Hidden on mobile */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none mobile-float">
        <div className="absolute top-20 left-10 w-20 h-20 bg-purple-400 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-pink-400 rounded-full opacity-20 animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-orange-400 rounded-full opacity-20 animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Header */}
      <header className="modern-header relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 sm:py-6">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={() => navigate('/')}
                className="text-white hover:text-purple-200 transition-colors text-sm sm:text-base"
              >
                ← Back to Home
              </button>
              <h1 className="text-xl sm:text-3xl font-bold text-white">Login</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="modern-card animate-fade-in-up">
          <div className="text-center mb-8">
            <div className="text-4xl sm:text-6xl mb-4">🔐</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              Sign in to your SkillSwap account
            </p>
          </div>

          {/* Demo Login Buttons */}
          <div className="mb-6 space-y-3">
            <button
              onClick={handleDemoLogin}
              className="w-full btn-primary text-sm sm:text-base"
              style={{background: 'linear-gradient(45deg, #8b5cf6, #ec4899)'}}
            >
              🚀 Try Demo User
            </button>
            <button
              onClick={handleAdminDemo}
              className="w-full btn-secondary text-sm sm:text-base"
            >
              ⚙️ Try Admin Demo
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or sign in manually</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="modern-input w-full text-sm sm:text-base"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="modern-input w-full text-sm sm:text-base"
                placeholder="Enter your password"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary text-sm sm:text-base disabled:opacity-50"
              style={{background: 'linear-gradient(45deg, #8b5cf6, #ec4899)'}}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="loading-spinner w-4 h-4 mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Demo Credentials Info */}
          <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
            <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Demo Credentials</h4>
            <div className="space-y-2 text-xs sm:text-sm">
              <div>
                <span className="font-medium">User:</span> demo@skillswap.com / demo123
              </div>
              <div>
                <span className="font-medium">Admin:</span> admin@skillswap.com / admin123
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-xs sm:text-sm">
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/')}
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                Browse as Guest
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Bar */}
      <nav className="mobile-nav md:hidden">
        <div className="flex justify-around items-center">
          <a href="/" className={`mobile-nav-item ${location.pathname === '/' ? 'active' : ''}`}>
            <span className="text-lg mb-1">🏠</span>
            <span>Home</span>
          </a>
          <a href="/login" className={`mobile-nav-item ${location.pathname === '/login' ? 'active' : ''}`}>
            <span className="text-lg mb-1">🔐</span>
            <span>Login</span>
          </a>
          <a href="/profile" className={`mobile-nav-item ${location.pathname === '/profile' ? 'active' : ''}`}>
            <span className="text-lg mb-1">👤</span>
            <span>Profile</span>
          </a>
          <a href="/swaps" className={`mobile-nav-item ${location.pathname === '/swaps' ? 'active' : ''}`}>
            <span className="text-lg mb-1">🔄</span>
            <span>Swaps</span>
          </a>
        </div>
      </nav>
    </div>
  );
};

export default LoginPage; 