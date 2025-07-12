import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const RequestSwap = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    requestedSkill: '',
    offeredSkill: '',
    message: ''
  });

  useEffect(() => {
    fetchUserProfile();
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      // Simulate API call for demo
      setTimeout(() => {
        const mockUser = {
          _id: userId,
          name: userId === '1' ? 'Sarah Chen' : userId === '2' ? 'Rahul Sharma' : 'Priya Patel',
          email: 'user@example.com',
          location: userId === '1' ? 'Mumbai, India' : userId === '2' ? 'Delhi, India' : 'Bangalore, India',
          profilePhoto: null,
          skillsOffered: userId === '1' ? ['UI/UX Design', 'Figma', 'Prototyping'] : 
                        userId === '2' ? ['Python', 'Machine Learning', 'Data Analysis'] : 
                        ['Content Writing', 'SEO', 'Social Media'],
          skillsWanted: userId === '1' ? ['React', 'JavaScript', 'Node.js'] : 
                       userId === '2' ? ['Web Development', 'JavaScript', 'React'] : 
                       ['Graphic Design', 'Photoshop', 'Illustrator'],
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Get current user from localStorage
      const currentUser = JSON.parse(localStorage.getItem('user'));
      if (!currentUser) {
        alert('Please login to send swap requests');
        navigate('/login');
        return;
      }

      // Create swap request data
      const swapRequestData = {
        requesterId: currentUser._id || currentUser.id,
        recipientId: userId,
        requestedSkill: formData.requestedSkill,
        offeredSkill: formData.offeredSkill,
        message: formData.message,
        status: 'pending'
      };

      // For demo purposes, simulate successful swap request
      // In a real app, this would be an API call
      setTimeout(() => {
        alert('Swap request sent successfully! The user will be notified and can accept or reject your request.');
        navigate('/swaps');
      }, 1000);

      // TODO: Uncomment this when backend authentication is properly set up
      // const response = await axios.post('http://localhost:5000/api/swapRequests', swapRequestData, {
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
      //     'Content-Type': 'application/json'
      //   }
      // });

      // if (response.data.success) {
      //   alert('Swap request sent successfully! The user will be notified and can accept or reject your request.');
      //   navigate('/swaps');
      // } else {
      //   alert('Failed to send swap request: ' + response.data.message);
      // }
    } catch (error) {
      console.error('Error sending swap request:', error);
      alert('Failed to send swap request. Please try again.');
    } finally {
      setSubmitting(false);
    }
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
                onClick={() => navigate(`/user/${userId}`)}
                className="text-white hover:text-purple-200 transition-colors text-sm sm:text-base"
              >
                ← Back to Profile
              </button>
              <h1 className="text-xl sm:text-3xl font-bold text-white">Request Skill Swap</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* User Info */}
        <div className="modern-card mb-6 sm:mb-8 animate-fade-in-up">
          <div className="flex items-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mr-3 sm:mr-4">
              {user.profilePhoto ? (
                <img
                  src={user.profilePhoto}
                  alt={user.name}
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover"
                />
              ) : (
                <span className="text-white font-semibold text-lg sm:text-xl">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">{user.name}</h2>
              {user.location && (
                <p className="text-gray-600 text-sm sm:text-base">{user.location}</p>
              )}
            </div>
          </div>
        </div>

        {/* Swap Request Form */}
        <div className="modern-card animate-fade-in-up" style={{animationDelay: '0.2s'}}>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Send Swap Request</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Requested Skill */}
            <div>
              <label htmlFor="requestedSkill" className="block text-sm font-medium text-gray-700 mb-2">
                Skill you want to learn from {user.name}
              </label>
              <select
                id="requestedSkill"
                name="requestedSkill"
                value={formData.requestedSkill}
                onChange={handleChange}
                required
                className="modern-input w-full text-sm sm:text-base"
              >
                <option value="">Select a skill</option>
                {user.skillsOffered.map((skill, index) => (
                  <option key={index} value={skill}>{skill}</option>
                ))}
              </select>
            </div>

            {/* Offered Skill */}
            <div>
              <label htmlFor="offeredSkill" className="block text-sm font-medium text-gray-700 mb-2">
                Skill you can offer in return
              </label>
              <input
                type="text"
                id="offeredSkill"
                name="offeredSkill"
                value={formData.offeredSkill}
                onChange={handleChange}
                required
                placeholder="e.g., Photoshop, Excel, Guitar, Spanish"
                className="modern-input w-full text-sm sm:text-base"
              />
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Message to {user.name}
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Introduce yourself and explain why you'd like to swap skills..."
                className="modern-input w-full text-sm sm:text-base"
              />
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate(`/user/${userId}`)}
                className="btn-secondary text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary text-sm sm:text-base disabled:opacity-50"
                style={{background: 'linear-gradient(45deg, #8b5cf6, #ec4899)'}}
              >
                {submitting ? (
                  <div className="flex items-center justify-center">
                    <div className="loading-spinner w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3"></div>
                    Sending...
                  </div>
                ) : (
                  'Send Request'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Tips */}
        <div className="mt-6 sm:mt-8 modern-card animate-fade-in-up" style={{animationDelay: '0.4s'}}>
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200 p-4 sm:p-6">
            <h4 className="text-base sm:text-lg font-semibold text-purple-900 mb-3">💡 Tips for a successful swap request:</h4>
            <ul className="space-y-2 text-purple-800 text-sm sm:text-base">
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">•</span>
                Be specific about what you want to learn
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">•</span>
                Offer a skill that matches their interests
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">•</span>
                Be friendly and professional in your message
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">•</span>
                Mention your availability and preferred meeting format
              </li>
            </ul>
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

export default RequestSwap; 