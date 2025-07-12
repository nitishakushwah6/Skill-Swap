import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import RatingModal from './RatingModal';

const SwapRequests = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [swaps, setSwaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('received');
  const [ratingModal, setRatingModal] = useState({ isOpen: false, swapData: null });

  useEffect(() => {
    fetchSwapRequests();
  }, [activeTab]);

  const fetchSwapRequests = async () => {
    try {
      setLoading(true);
      
      // Get current user from localStorage
      const currentUser = JSON.parse(localStorage.getItem('user'));
      if (!currentUser) {
        console.error('No user logged in');
        setLoading(false);
        return;
      }

      // Fetch real data from API
      const response = await axios.get(`http://localhost:5000/api/swaps?userId=${currentUser._id || currentUser.id}`);
      
      if (response.data.success) {
        setSwaps(response.data.data);
      } else {
        console.error('Failed to fetch swaps:', response.data.message);
        setSwaps([]);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching swap requests:', error);
      setLoading(false);
      // Fallback to mock data if API fails
      const mockSwaps = [
        {
          _id: '1',
          requester: {
            _id: '2',
            name: 'Sarah Chen',
            profilePhoto: null,
          },
          recipient: {
            _id: '1',
            name: 'Demo User',
            profilePhoto: null,
          },
          requestedSkill: 'UI/UX Design',
          offeredSkill: 'React Development',
          message: 'Hi! I would love to learn UI/UX design from you. I can teach you React in return. Let me know if you\'re interested!',
          status: 'pending',
          createdAt: '2024-01-15T10:30:00Z',
          rating: null,
          feedback: null
        }
      ];
      setSwaps(mockSwaps);
    }
  };

  const handleAcceptSwap = async (swapId) => {
    try {
      const response = await axios.patch(`http://localhost:5000/api/swaps/${swapId}/accept`, {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data.success) {
        setSwaps(prev => prev.map(swap => 
          swap._id === swapId ? { ...swap, status: 'accepted' } : swap
        ));
      }
    } catch (error) {
      console.error('Error accepting swap:', error);
      alert('Failed to accept swap. Please try again.');
    }
  };

  const handleRejectSwap = async (swapId) => {
    try {
      // Simulate API call
      setTimeout(() => {
        setSwaps(prev => prev.map(swap => 
          swap._id === swapId ? { ...swap, status: 'rejected' } : swap
        ));
      }, 500);
    } catch (error) {
      console.error('Error rejecting swap:', error);
    }
  };

  const handleCancelSwap = async (swapId) => {
    try {
      // Simulate API call
      setTimeout(() => {
        setSwaps(prev => prev.map(swap => 
          swap._id === swapId ? { ...swap, status: 'cancelled' } : swap
        ));
      }, 500);
    } catch (error) {
      console.error('Error cancelling swap:', error);
    }
  };

  const handleCompleteSwap = async (swapId) => {
    try {
      const response = await axios.patch(`http://localhost:5000/api/swaps/${swapId}/complete`, {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data.success) {
        setSwaps(prev => prev.map(swap => 
          swap._id === swapId ? { ...swap, status: 'completed' } : swap
        ));
      }
    } catch (error) {
      console.error('Error completing swap:', error);
      alert('Failed to complete swap. Please try again.');
    }
  };

  const handleDeleteSwap = async (swapId) => {
    if (window.confirm('Are you sure you want to delete this swap request? This action cannot be undone.')) {
      try {
        const response = await axios.delete(`http://localhost:5000/api/swaps/${swapId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.data.success) {
          setSwaps(prev => prev.filter(swap => swap._id !== swapId));
        }
      } catch (error) {
        console.error('Error deleting swap:', error);
        alert('Failed to delete swap. Please try again.');
      }
    }
  };

  const handleRateSwap = (swapData) => {
    setRatingModal({ isOpen: true, swapData });
  };

  const handleSubmitRating = async (ratingData) => {
    try {
      // Simulate API call
      setTimeout(() => {
        setSwaps(prev => prev.map(swap => 
          swap._id === ratingModal.swapData._id 
            ? { ...swap, rating: ratingData.rating, feedback: ratingData.feedback }
            : swap
        ));
        setRatingModal({ isOpen: false, swapData: null });
      }, 1000);
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="loading-spinner"></div>
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
              <h1 className="text-xl sm:text-3xl font-bold text-white">Swap Requests</h1>
            </div>
            
            {/* Desktop Actions */}
            <div className="hidden sm:flex space-x-2 sm:space-x-4">
              <button 
                onClick={() => navigate('/profile')}
                className="btn-secondary text-sm"
              >
                My Profile
              </button>
            </div>
            
            {/* Mobile Actions */}
            <div className="sm:hidden">
              <button 
                onClick={() => navigate('/profile')}
                className="btn-secondary text-xs"
              >
                Profile
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Tabs */}
        <div className="mb-6 sm:mb-8 animate-fade-in-up">
          <div className="glass-card rounded-2xl p-1 sm:p-2">
            <nav className="flex space-x-1 sm:space-x-2">
              <button
                onClick={() => setActiveTab('received')}
                className={`flex-1 py-2 sm:py-3 px-3 sm:px-6 rounded-xl font-medium text-xs sm:text-sm transition-all ${
                  activeTab === 'received'
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                Received
              </button>
              <button
                onClick={() => setActiveTab('sent')}
                className={`flex-1 py-2 sm:py-3 px-3 sm:px-6 rounded-xl font-medium text-xs sm:text-sm transition-all ${
                  activeTab === 'sent'
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                Sent
              </button>
            </nav>
          </div>
        </div>

        {/* Swap Requests List */}
        <div className="space-y-4 sm:space-y-6">
          {swaps.length === 0 ? (
            <div className="text-center py-12 sm:py-16 animate-fade-in-up">
              <div className="glass-card rounded-2xl p-6 sm:p-8">
                <div className="text-4xl sm:text-6xl mb-4">📬</div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  No {activeTab} swap requests found
                </h3>
                <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                  {activeTab === 'received' 
                    ? 'When someone sends you a swap request, it will appear here.'
                    : 'Your sent swap requests will appear here.'
                  }
                </p>
                <button
                  onClick={() => navigate('/')}
                  className="btn-primary text-sm sm:text-base"
                >
                  Browse Users
                </button>
              </div>
            </div>
          ) : (
            swaps.map((swap, index) => (
              <div 
                key={swap._id} 
                className="modern-card hover-lift animate-fade-in-up"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* User Info */}
                    <div className="flex items-center mb-4 sm:mb-6">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mr-3 sm:mr-4">
                        {activeTab === 'received' ? (
                          swap.requester.profilePhoto ? (
                            <img
                              src={swap.requester.profilePhoto}
                              alt={swap.requester.name}
                              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-white font-semibold text-lg sm:text-xl">
                              {swap.requester.name.charAt(0).toUpperCase()}
                            </span>
                          )
                        ) : (
                          swap.recipient.profilePhoto ? (
                            <img
                              src={swap.recipient.profilePhoto}
                              alt={swap.recipient.name}
                              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-white font-semibold text-lg sm:text-xl">
                              {swap.recipient.name.charAt(0).toUpperCase()}
                            </span>
                          )
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                          {activeTab === 'received' ? swap.requester.name : swap.recipient.name}
                        </h3>
                        <p className="text-gray-600 text-xs sm:text-sm">
                          {formatDate(swap.createdAt)}
                        </p>
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                          You'll Learn
                        </h4>
                        <span className="skill-tag">
                          {swap.requestedSkill}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                          You'll Teach
                        </h4>
                        <span className="skill-tag" style={{background: 'linear-gradient(45deg, #10b981, #059669)'}}>
                          {swap.offeredSkill}
                        </span>
                      </div>
                    </div>

                    {/* Message */}
                    <div className="mb-4 sm:mb-6">
                      <h4 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Message</h4>
                      <div className="bg-gray-50 p-3 sm:p-4 rounded-xl border-l-4 border-purple-500">
                        <p className="text-gray-700 text-sm sm:text-base">{swap.message}</p>
                      </div>
                    </div>

                    {/* Status and Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                      <span className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(swap.status)} w-fit`}>
                        {swap.status.charAt(0).toUpperCase() + swap.status.slice(1)}
                      </span>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2 sm:space-x-3">
                        {activeTab === 'received' && swap.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleAcceptSwap(swap._id)}
                              className="btn-primary text-xs sm:text-sm px-3 sm:px-4 py-2"
                              style={{background: 'linear-gradient(45deg, #10b981, #059669)'}}
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleRejectSwap(swap._id)}
                              className="bg-red-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-red-700 text-xs sm:text-sm"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {activeTab === 'sent' && swap.status === 'pending' && (
                          <button
                            onClick={() => handleCancelSwap(swap._id)}
                            className="bg-gray-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-700 text-xs sm:text-sm"
                          >
                            Cancel
                          </button>
                        )}

                        {swap.status === 'accepted' && (
                          <button
                            onClick={() => handleCompleteSwap(swap._id)}
                            className="btn-primary text-xs sm:text-sm px-3 sm:px-4 py-2"
                            style={{background: 'linear-gradient(45deg, #3b82f6, #1d4ed8)'}}
                          >
                            Mark Complete
                          </button>
                        )}

                        {/* Delete Button for completed/rejected/cancelled swaps */}
                        {['completed', 'rejected', 'cancelled'].includes(swap.status) && (
                          <button
                            onClick={() => handleDeleteSwap(swap._id)}
                            className="bg-red-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-red-700 text-xs sm:text-sm"
                          >
                            Delete
                          </button>
                        )}

                        {/* Rate Button for completed swaps without rating */}
                        {swap.status === 'completed' && !swap.rating && (
                          <button
                            onClick={() => handleRateSwap({
                              _id: swap._id,
                              partnerName: activeTab === 'received' ? swap.requester.name : swap.recipient.name
                            })}
                            className="btn-primary text-xs sm:text-sm px-3 sm:px-4 py-2"
                            style={{background: 'linear-gradient(45deg, #f59e0b, #d97706)'}}
                          >
                            Rate Swap
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Rating and Feedback */}
                    {swap.status === 'completed' && swap.rating && (
                      <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                        <div className="flex items-center mb-2">
                          <span className="text-xs sm:text-sm text-gray-600 mr-2">Rating:</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className="text-yellow-400 text-lg sm:text-xl">
                                {i < swap.rating ? '★' : '☆'}
                              </span>
                            ))}
                          </div>
                        </div>
                        {swap.feedback && (
                          <div>
                            <span className="text-xs sm:text-sm text-gray-600">Feedback:</span>
                            <p className="text-gray-700 mt-1 text-sm sm:text-base">{swap.feedback}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Rating Modal */}
      <RatingModal
        isOpen={ratingModal.isOpen}
        onClose={() => setRatingModal({ isOpen: false, swapData: null })}
        onSubmit={handleSubmitRating}
        swapData={ratingModal.swapData}
      />

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

export default SwapRequests; 