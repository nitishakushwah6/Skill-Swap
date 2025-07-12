import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const UserProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    skillsOffered: [],
    skillsWanted: [],
    availability: {
      weekends: false,
      evenings: false,
      weekdays: false,
      custom: ''
    },
    profileVisibility: 'public'
  });
  const [newSkill, setNewSkill] = useState({ offered: '', wanted: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      // Simulate API call for demo
      setTimeout(() => {
        const mockUser = {
          _id: '1',
          name: 'Demo User',
          email: 'demo@skillswap.com',
          location: 'Mumbai, India',
          profilePhoto: null,
          skillsOffered: ['React', 'JavaScript', 'Node.js'],
          skillsWanted: ['UI/UX Design', 'Python', 'Machine Learning'],
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
        setFormData({
          name: mockUser.name,
          location: mockUser.location || '',
          skillsOffered: mockUser.skillsOffered,
          skillsWanted: mockUser.skillsWanted,
          availability: mockUser.availability,
          profileVisibility: mockUser.profileVisibility
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Simulate API call
      setTimeout(() => {
        setSuccess('Profile updated successfully!');
        setEditing(false);
        fetchUserProfile();
        setLoading(false);
      }, 1000);
    } catch (error) {
      setError('Failed to update profile');
      setLoading(false);
    }
  };

  const addSkillOffered = () => {
    if (newSkill.offered.trim()) {
      setFormData({
        ...formData,
        skillsOffered: [...formData.skillsOffered, newSkill.offered.trim()]
      });
      setNewSkill({ ...newSkill, offered: '' });
    }
  };

  const addSkillWanted = () => {
    if (newSkill.wanted.trim()) {
      setFormData({
        ...formData,
        skillsWanted: [...formData.skillsWanted, newSkill.wanted.trim()]
      });
      setNewSkill({ ...newSkill, wanted: '' });
    }
  };

  const removeSkillOffered = (index) => {
    setFormData({
      ...formData,
      skillsOffered: formData.skillsOffered.filter((_, i) => i !== index)
    });
  };

  const removeSkillWanted = (index) => {
    setFormData({
      ...formData,
      skillsWanted: formData.skillsWanted.filter((_, i) => i !== index)
    });
  };

  if (loading && !user) {
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
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-4">User not found</h1>
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
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-400 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-purple-400 rounded-full opacity-20 animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-pink-400 rounded-full opacity-20 animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Header */}
      <header className="modern-header relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 sm:py-6">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={() => navigate('/')}
                className="text-white hover:text-blue-200 transition-colors text-sm sm:text-base"
              >
                ← Back
              </button>
              <h1 className="text-xl sm:text-3xl font-bold text-white">My Profile</h1>
            </div>
            
            {/* Desktop Actions */}
            <div className="hidden sm:flex space-x-2 sm:space-x-4">
              <button 
                onClick={() => setEditing(!editing)}
                className="btn-secondary text-sm"
              >
                {editing ? 'Cancel' : 'Edit Profile'}
              </button>
              <button 
                onClick={() => navigate('/swaps')}
                className="btn-primary text-sm"
              >
                My Swaps
              </button>
            </div>
            
            {/* Mobile Actions */}
            <div className="sm:hidden flex space-x-2">
              <button 
                onClick={() => setEditing(!editing)}
                className="btn-secondary text-xs"
              >
                {editing ? 'Cancel' : 'Edit'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-3 rounded-xl mb-4 sm:mb-6 animate-fade-in-up text-sm sm:text-base">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-3 sm:px-4 py-3 rounded-xl mb-4 sm:mb-6 animate-fade-in-up text-sm sm:text-base">
            {success}
          </div>
        )}

        <div className="modern-card animate-fade-in-up">
          <form onSubmit={handleSubmit}>
            {/* Profile Photo */}
            <div className="mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row items-center sm:items-start">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4 sm:mb-0 sm:mr-6">
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
                <div className="text-center sm:text-left">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">{user.name}</h2>
                  <p className="text-gray-700 text-sm sm:text-base">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={!editing}
                  className="modern-input w-full disabled:bg-gray-100 text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  disabled={!editing}
                  className="modern-input w-full disabled:bg-gray-100 text-sm sm:text-base"
                  placeholder="Enter your location"
                />
              </div>
            </div>

            {/* Skills Offered */}
            <div className="mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 sm:mr-3"></span>
                Skills Offered
              </h3>
              <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
                {formData.skillsOffered.map((skill, index) => (
                  <span
                    key={index}
                    className="skill-tag flex items-center"
                  >
                    {skill}
                    {editing && (
                      <button
                        type="button"
                        onClick={() => removeSkillOffered(index)}
                        className="ml-1 sm:ml-2 text-white hover:text-red-200"
                      >
                        ×
                      </button>
                    )}
                  </span>
                ))}
              </div>
              {editing && (
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={newSkill.offered}
                    onChange={(e) => setNewSkill({ ...newSkill, offered: e.target.value })}
                    placeholder="Add a skill you can offer"
                    className="modern-input flex-1 text-sm sm:text-base"
                  />
                  <button
                    type="button"
                    onClick={addSkillOffered}
                    className="btn-primary text-sm sm:text-base"
                  >
                    Add
                  </button>
                </div>
              )}
            </div>

            {/* Skills Wanted */}
            <div className="mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 sm:mr-3"></span>
                Skills Wanted
              </h3>
              <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
                {formData.skillsWanted.map((skill, index) => (
                  <span
                    key={index}
                    className="skill-tag flex items-center"
                    style={{background: 'linear-gradient(45deg, #3b82f6, #1d4ed8)'}}
                  >
                    {skill}
                    {editing && (
                      <button
                        type="button"
                        onClick={() => removeSkillWanted(index)}
                        className="ml-1 sm:ml-2 text-white hover:text-red-200"
                      >
                        ×
                      </button>
                    )}
                  </span>
                ))}
              </div>
              {editing && (
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={newSkill.wanted}
                    onChange={(e) => setNewSkill({ ...newSkill, wanted: e.target.value })}
                    placeholder="Add a skill you want to learn"
                    className="modern-input flex-1 text-sm sm:text-base"
                  />
                  <button
                    type="button"
                    onClick={addSkillWanted}
                    className="btn-primary text-sm sm:text-base"
                  >
                    Add
                  </button>
                </div>
              )}
            </div>

            {/* Availability */}
            <div className="mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Availability</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.availability.weekends}
                    onChange={(e) => setFormData({
                      ...formData,
                      availability: { ...formData.availability, weekends: e.target.checked }
                    })}
                    disabled={!editing}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-800">Weekends</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.availability.evenings}
                    onChange={(e) => setFormData({
                      ...formData,
                      availability: { ...formData.availability, evenings: e.target.checked }
                    })}
                    disabled={!editing}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-800">Evenings</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.availability.weekdays}
                    onChange={(e) => setFormData({
                      ...formData,
                      availability: { ...formData.availability, weekdays: e.target.checked }
                    })}
                    disabled={!editing}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-800">Weekdays</span>
                </label>
              </div>

              {editing && (
                <div className="mt-3 sm:mt-4">
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Custom Availability
                  </label>
                  <textarea
                    value={formData.availability.custom || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      availability: { ...formData.availability, custom: e.target.value }
                    })}
                    placeholder="Describe your specific availability"
                    className="modern-input w-full text-sm sm:text-base"
                    rows={3}
                  />
                </div>
              )}
            </div>

            {/* Profile Visibility */}
            <div className="mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Profile Visibility</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="public"
                    checked={formData.profileVisibility === 'public'}
                    onChange={(e) => setFormData({ ...formData, profileVisibility: e.target.value })}
                    disabled={!editing}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-800">Public - Anyone can see my profile</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="radio"
                    value="private"
                    checked={formData.profileVisibility === 'private'}
                    onChange={(e) => setFormData({ ...formData, profileVisibility: e.target.value })}
                    disabled={!editing}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-800">Private - Only I can see my profile</span>
                </label>
              </div>
            </div>

            {/* Stats */}
            <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-xs sm:text-sm text-gray-700">Rating</p>
                  <p className="text-2xl sm:text-3xl font-bold text-blue-600">{user.rating.toFixed(1)} ⭐</p>
                </div>
                <div className="text-center">
                  <p className="text-xs sm:text-sm text-gray-700">Total Swaps</p>
                  <p className="text-2xl sm:text-3xl font-bold text-purple-600">{user.totalSwaps}</p>
                </div>
              </div>
            </div>

            {/* Save Button */}
            {editing && (
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary px-6 sm:px-8 py-3 text-base sm:text-lg"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </form>
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

export default UserProfile; 