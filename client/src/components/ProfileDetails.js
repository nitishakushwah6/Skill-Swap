import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const ProfileDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, [id]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      // Simulate API call for demo
      setTimeout(() => {
        const mockUser = {
          _id: id,
          name: id === '1' ? 'Sarah Chen' : id === '2' ? 'Rahul Sharma' : 'Priya Patel',
          email: 'user@example.com',
          location: id === '1' ? 'Mumbai, India' : id === '2' ? 'Delhi, India' : 'Bangalore, India',
          profilePhoto: null,
          skillsOffered: id === '1' ? ['UI/UX Design', 'Figma', 'Prototyping'] : 
                        id === '2' ? ['Python', 'Machine Learning', 'Data Analysis'] : 
                        ['Content Writing', 'SEO', 'Social Media'],
          skillsWanted: id === '1' ? ['React', 'JavaScript', 'Node.js'] : 
                       id === '2' ? ['Web Development', 'JavaScript', 'React'] : 
                       ['Graphic Design', 'Photoshop', 'Illustrator'],
          availability: {
            weekends: true,
            evenings: true,
            weekdays: false,
            custom: 'Available on weekends and weekday evenings'
          },
          profileVisibility: 'public',
          rating: 4.7,
          totalSwaps: 15
        };
        setUser(mockUser);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setLoading(false);
    }
  };

  const handleRequestSwap = () => {
    navigate(`/request/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-4">User Not Found</h1>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

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
                ← Back
              </button>
              <h1 className="text-xl sm:text-3xl font-bold text-white">User Profile</h1>
            </div>
            
            {/* Desktop Actions */}
            <div className="hidden sm:flex space-x-2 sm:space-x-4">
              <button 
                onClick={handleRequestSwap}
                className="btn-primary text-sm"
                style={{background: 'linear-gradient(45deg, #8b5cf6, #ec4899)'}}
              >
                Request Swap
              </button>
            </div>
            
            {/* Mobile Actions */}
            <div className="sm:hidden">
              <button 
                onClick={handleRequestSwap}
                className="btn-primary text-xs"
                style={{background: 'linear-gradient(45deg, #8b5cf6, #ec4899)'}}
              >
                Request
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="modern-card animate-fade-in-up">
          {/* User Header */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start mb-6 sm:mb-8">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mb-4 sm:mb-0 sm:mr-6">
              {user.profilePhoto ? (
                <img
                  src={user.profilePhoto}
                  alt={user.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover"
                />
              ) : (
                <span className="text-white font-semibold text-2xl sm:text-3xl">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="text-center sm:text-left flex-1">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{user.name}</h2>
              {user.location && (
                <p className="text-gray-600 text-sm sm:text-base mb-3 sm:mb-4">{user.location}</p>
              )}
              <div className="flex items-center justify-center sm:justify-start space-x-4 sm:space-x-6 text-xs sm:text-sm text-gray-600">
                <span className="flex items-center">
                  ⭐ {user.rating.toFixed(1)} Rating
                </span>
                <span>🔄 {user.totalSwaps} Swaps</span>
              </div>
            </div>
            
            {/* Mobile Request Button */}
            <div className="sm:hidden mt-4">
              <button
                onClick={handleRequestSwap}
                className="btn-primary text-sm"
                style={{background: 'linear-gradient(45deg, #8b5cf6, #ec4899)'}}
              >
                Request Swap
              </button>
            </div>
          </div>

          {/* Skills Offered */}
          <div className="mb-6 sm:mb-8">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 sm:mr-3"></span>
              Skills Offered
            </h3>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {user.skillsOffered.map((skill, index) => (
                <span
                  key={index}
                  className="skill-tag"
                  style={{background: 'linear-gradient(45deg, #10b981, #059669)'}}
                >
                  {skill}
                </span>
              ))}
              {user.skillsOffered.length === 0 && (
                <p className="text-gray-500 text-sm sm:text-base">No skills offered yet</p>
              )}
            </div>
          </div>

          {/* Skills Wanted */}
          <div className="mb-6 sm:mb-8">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 sm:mr-3"></span>
              Skills Wanted
            </h3>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {user.skillsWanted.map((skill, index) => (
                <span
                  key={index}
                  className="skill-tag"
                  style={{background: 'linear-gradient(45deg, #3b82f6, #1d4ed8)'}}
                >
                  {skill}
                </span>
              ))}
              {user.skillsWanted.length === 0 && (
                <p className="text-gray-500 text-sm sm:text-base">No skills wanted yet</p>
              )}
            </div>
          </div>

          {/* Availability */}
          <div className="mb-6 sm:mb-8">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Availability</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="flex items-center">
                <span className={`w-4 h-4 rounded mr-3 ${user.availability.weekends ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                <span className="text-gray-700 text-sm sm:text-base">Weekends</span>
              </div>
              <div className="flex items-center">
                <span className={`w-4 h-4 rounded mr-3 ${user.availability.evenings ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                <span className="text-gray-700 text-sm sm:text-base">Evenings</span>
              </div>
              <div className="flex items-center">
                <span className={`w-4 h-4 rounded mr-3 ${user.availability.weekdays ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                <span className="text-gray-700 text-sm sm:text-base">Weekdays</span>
              </div>
            </div>
            {user.availability.custom && (
              <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                <p className="text-gray-700 text-sm sm:text-base">{user.availability.custom}</p>
              </div>
            )}
          </div>

          {/* Profile Visibility */}
          <div className="border-t border-gray-200 pt-4 sm:pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
              <span className="text-xs sm:text-sm text-gray-600">
                Profile Visibility: <span className="font-medium capitalize">{user.profileVisibility}</span>
              </span>
              
              {/* Desktop Request Button */}
              <div className="hidden sm:block">
                <button
                  onClick={handleRequestSwap}
                  className="btn-primary text-sm"
                  style={{background: 'linear-gradient(45deg, #8b5cf6, #ec4899)'}}
                >
                  Request Skill Swap
                </button>
              </div>
            </div>
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
          <a href="/profile" className={`mobile-nav-item ${location.pathname === '/profile' ? 'active' : ''}`}>
            <span className="text-lg mb-1">👤</span>
            <span>Profile</span>
          </a>
          <a href="/swaps" className={`mobile-nav-item ${location.pathname === '/swaps' ? 'active' : ''}`}>
            <span className="text-lg mb-1">🔄</span>
            <span>Swaps</span>
          </a>
          <a href="/login" className={`mobile-nav-item ${location.pathname === '/login' ? 'active' : ''}`}>
            <span className="text-lg mb-1">🔐</span>
            <span>Login</span>
          </a>
        </div>
      </nav>
    </div>
  );
};

export default ProfileDetails; 