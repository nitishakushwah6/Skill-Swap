import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Swap {
  _id: string;
  requester: {
    _id: string;
    name: string;
    profilePhoto?: string;
  };
  recipient: {
    _id: string;
    name: string;
    profilePhoto?: string;
  };
  requestedSkill: string;
  offeredSkill: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'completed';
  createdAt: string;
  rating?: number;
  feedback?: string;
}

const SwapRequests: React.FC = () => {
  const [swaps, setSwaps] = useState<Swap[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');

  useEffect(() => {
    fetchSwapRequests();
  }, [activeTab]);

  const fetchSwapRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/swaps/${activeTab}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSwaps(response.data);
    } catch (error) {
      console.error('Error fetching swap requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptSwap = async (swapId: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/swaps/${swapId}/accept`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchSwapRequests();
    } catch (error) {
      console.error('Error accepting swap:', error);
    }
  };

  const handleRejectSwap = async (swapId: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/swaps/${swapId}/reject`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchSwapRequests();
    } catch (error) {
      console.error('Error rejecting swap:', error);
    }
  };

  const handleCancelSwap = async (swapId: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/swaps/${swapId}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchSwapRequests();
    } catch (error) {
      console.error('Error cancelling swap:', error);
    }
  };

  const handleCompleteSwap = async (swapId: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/swaps/${swapId}/complete`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchSwapRequests();
    } catch (error) {
      console.error('Error completing swap:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Swap Requests</h1>
            <div className="flex space-x-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('received')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'received'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Received Requests
              </button>
              <button
                onClick={() => setActiveTab('sent')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'sent'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Sent Requests
              </button>
            </nav>
          </div>
        </div>

        {/* Swap Requests List */}
        <div className="space-y-6">
          {swaps.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No {activeTab} swap requests found.
              </p>
            </div>
          ) : (
            swaps.map((swap) => (
              <div key={swap._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* User Info */}
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mr-4">
                        {activeTab === 'received' ? (
                          swap.requester.profilePhoto ? (
                            <img
                              src={swap.requester.profilePhoto}
                              alt={swap.requester.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-gray-600 font-semibold">
                              {swap.requester.name.charAt(0).toUpperCase()}
                            </span>
                          )
                        ) : (
                          swap.recipient.profilePhoto ? (
                            <img
                              src={swap.recipient.profilePhoto}
                              alt={swap.recipient.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-gray-600 font-semibold">
                              {swap.recipient.name.charAt(0).toUpperCase()}
                            </span>
                          )
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">
                          {activeTab === 'received' ? swap.requester.name : swap.recipient.name}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {formatDate(swap.createdAt)}
                        </p>
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">You'll Learn:</h4>
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                          {swap.requestedSkill}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">You'll Teach:</h4>
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                          {swap.offeredSkill}
                        </span>
                      </div>
                    </div>

                    {/* Message */}
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Message:</h4>
                      <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                        {swap.message}
                      </p>
                    </div>

                    {/* Status */}
                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(swap.status)}`}>
                        {swap.status.charAt(0).toUpperCase() + swap.status.slice(1)}
                      </span>

                      {/* Actions */}
                      <div className="flex space-x-2">
                        {activeTab === 'received' && swap.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleAcceptSwap(swap._id)}
                              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleRejectSwap(swap._id)}
                              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {activeTab === 'sent' && swap.status === 'pending' && (
                          <button
                            onClick={() => handleCancelSwap(swap._id)}
                            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 text-sm"
                          >
                            Cancel
                          </button>
                        )}

                        {swap.status === 'accepted' && (
                          <button
                            onClick={() => handleCompleteSwap(swap._id)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
                          >
                            Mark Complete
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Rating and Feedback */}
                    {swap.status === 'completed' && swap.rating && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center mb-2">
                          <span className="text-sm text-gray-600 mr-2">Rating:</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className="text-yellow-400">
                                {i < swap.rating! ? '★' : '☆'}
                              </span>
                            ))}
                          </div>
                        </div>
                        {swap.feedback && (
                          <div>
                            <span className="text-sm text-gray-600">Feedback:</span>
                            <p className="text-gray-700 mt-1">{swap.feedback}</p>
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
    </div>
  );
};

export default SwapRequests; 