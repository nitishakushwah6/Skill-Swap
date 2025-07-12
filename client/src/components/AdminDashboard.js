import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 1250,
    totalSwaps: 3420,
    pendingSwaps: 45,
    bannedUsers: 12,
    reportedContent: 8
  });

  const [users, setUsers] = useState([
    {
      _id: '1',
      name: 'Sarah Chen',
      email: 'sarah@example.com',
      status: 'active',
      totalSwaps: 23,
      rating: 4.8,
      joinDate: '2024-01-15',
      lastActive: '2024-01-20'
    },
    {
      _id: '2',
      name: 'Rahul Sharma',
      email: 'rahul@example.com',
      status: 'banned',
      totalSwaps: 18,
      rating: 4.6,
      joinDate: '2024-01-10',
      lastActive: '2024-01-18'
    },
    {
      _id: '3',
      name: 'Priya Patel',
      email: 'priya@example.com',
      status: 'active',
      totalSwaps: 31,
      rating: 4.9,
      joinDate: '2024-01-12',
      lastActive: '2024-01-21'
    }
  ]);

  const [swaps, setSwaps] = useState([
    {
      _id: '1',
      requester: 'Sarah Chen',
      recipient: 'Rahul Sharma',
      requestedSkill: 'UI/UX Design',
      offeredSkill: 'React Development',
      status: 'pending',
      createdAt: '2024-01-20',
      reported: false
    },
    {
      _id: '2',
      requester: 'Priya Patel',
      recipient: 'Sarah Chen',
      requestedSkill: 'Content Writing',
      offeredSkill: 'Graphic Design',
      status: 'accepted',
      createdAt: '2024-01-19',
      reported: true
    }
  ]);

  const [reportedContent, setReportedContent] = useState([
    {
      _id: '1',
      type: 'skill_description',
      user: 'John Doe',
      content: 'Learn hacking and cracking...',
      reason: 'Inappropriate content',
      status: 'pending',
      reportedAt: '2024-01-21'
    },
    {
      _id: '2',
      type: 'swap_request',
      user: 'Jane Smith',
      content: 'Spam message...',
      reason: 'Spam',
      status: 'resolved',
      reportedAt: '2024-01-20'
    }
  ]);

  const [announcements, setAnnouncements] = useState([
    {
      _id: '1',
      title: 'New Feature: Video Calls',
      message: 'We\'ve added video call functionality to make skill swapping even easier!',
      type: 'feature',
      createdAt: '2024-01-21',
      active: true
    }
  ]);

  const handleBanUser = (userId) => {
    setUsers(prev => prev.map(user => 
      user._id === userId 
        ? { ...user, status: user.status === 'banned' ? 'active' : 'banned' }
        : user
    ));
  };

  const handleResolveReport = (reportId) => {
    setReportedContent(prev => prev.map(report => 
      report._id === reportId 
        ? { ...report, status: 'resolved' }
        : report
    ));
  };

  const handleDeleteSwap = (swapId) => {
    setSwaps(prev => prev.filter(swap => swap._id !== swapId));
  };

  const handleSendAnnouncement = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newAnnouncement = {
      _id: Date.now().toString(),
      title: formData.get('title'),
      message: formData.get('message'),
      type: formData.get('type'),
      createdAt: new Date().toISOString(),
      active: true
    };
    setAnnouncements(prev => [newAnnouncement, ...prev]);
    e.target.reset();
  };

  const downloadReport = () => {
    const reportData = {
      users: users,
      swaps: swaps,
      reportedContent: reportedContent,
      stats: stats,
      generatedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `skillswap-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
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
                ← Back to Site
              </button>
              <h1 className="text-xl sm:text-3xl font-bold text-white">Admin Dashboard</h1>
            </div>
            
            <div className="flex space-x-2 sm:space-x-4">
              <button 
                onClick={downloadReport}
                className="btn-secondary text-xs sm:text-sm"
              >
                📊 Download Report
              </button>
              <button 
                onClick={() => navigate('/')}
                className="btn-primary text-xs sm:text-sm"
                style={{background: 'linear-gradient(45deg, #8b5cf6, #ec4899)'}}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="stats-card animate-fade-in-up">
            <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-2">{stats.totalUsers}</div>
            <div className="text-white/80 text-sm sm:text-base">Total Users</div>
          </div>
          <div className="stats-card animate-fade-in-up" style={{animationDelay: '0.1s'}}>
            <div className="text-2xl sm:text-3xl font-bold text-pink-600 mb-2">{stats.totalSwaps}</div>
            <div className="text-white/80 text-sm sm:text-base">Total Swaps</div>
          </div>
          <div className="stats-card animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            <div className="text-2xl sm:text-3xl font-bold text-orange-600 mb-2">{stats.pendingSwaps}</div>
            <div className="text-white/80 text-sm sm:text-base">Pending Swaps</div>
          </div>
          <div className="stats-card animate-fade-in-up" style={{animationDelay: '0.3s'}}>
            <div className="text-2xl sm:text-3xl font-bold text-red-600 mb-2">{stats.bannedUsers}</div>
            <div className="text-white/80 text-sm sm:text-base">Banned Users</div>
          </div>
          <div className="stats-card animate-fade-in-up" style={{animationDelay: '0.4s'}}>
            <div className="text-2xl sm:text-3xl font-bold text-yellow-600 mb-2">{stats.reportedContent}</div>
            <div className="text-white/80 text-sm sm:text-base">Reports</div>
          </div>
        </div>

        {/* Admin Tabs */}
        <div className="mb-6 sm:mb-8 animate-fade-in-up">
          <div className="glass-card rounded-2xl p-1 sm:p-2">
            <nav className="flex flex-wrap space-x-1 sm:space-x-2">
              {[
                { id: 'overview', label: 'Overview', icon: '📊' },
                { id: 'users', label: 'Users', icon: '👥' },
                { id: 'swaps', label: 'Swaps', icon: '🔄' },
                { id: 'reports', label: 'Reports', icon: '🚨' },
                { id: 'announcements', label: 'Announcements', icon: '📢' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-2 sm:py-3 px-2 sm:px-4 rounded-xl font-medium text-xs sm:text-sm transition-all ${
                    activeTab === tab.id
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  <span className="mr-1">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="animate-fade-in-up" style={{animationDelay: '0.2s'}}>
          {activeTab === 'overview' && (
            <div className="modern-card">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Platform Overview</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Recent Activity</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm">New user registered</span>
                      <span className="text-xs text-gray-500">2 min ago</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm">Swap request completed</span>
                      <span className="text-xs text-gray-500">15 min ago</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm">Content reported</span>
                      <span className="text-xs text-gray-500">1 hour ago</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Quick Actions</h4>
                  <div className="space-y-3">
                    <button className="w-full btn-primary text-sm" style={{background: 'linear-gradient(45deg, #8b5cf6, #ec4899)'}}>
                      Send Announcement
                    </button>
                    <button className="w-full btn-secondary text-sm">
                      Review Reports
                    </button>
                    <button className="w-full btn-secondary text-sm">
                      Generate Report
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="modern-card">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">User Management</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm sm:text-base">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-2">User</th>
                      <th className="text-left py-3 px-2">Status</th>
                      <th className="text-left py-3 px-2">Swaps</th>
                      <th className="text-left py-3 px-2">Rating</th>
                      <th className="text-left py-3 px-2">Joined</th>
                      <th className="text-left py-3 px-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user._id} className="border-b border-gray-100">
                        <td className="py-3 px-2">
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-gray-500 text-xs">{user.email}</div>
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="py-3 px-2">{user.totalSwaps}</td>
                        <td className="py-3 px-2">⭐ {user.rating}</td>
                        <td className="py-3 px-2 text-xs">{new Date(user.joinDate).toLocaleDateString()}</td>
                        <td className="py-3 px-2">
                          <button
                            onClick={() => handleBanUser(user._id)}
                            className={`text-xs px-2 py-1 rounded ${
                              user.status === 'banned' 
                                ? 'bg-green-600 text-white hover:bg-green-700' 
                                : 'bg-red-600 text-white hover:bg-red-700'
                            }`}
                          >
                            {user.status === 'banned' ? 'Unban' : 'Ban'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'swaps' && (
            <div className="modern-card">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Swap Monitoring</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm sm:text-base">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-2">Requester</th>
                      <th className="text-left py-3 px-2">Recipient</th>
                      <th className="text-left py-3 px-2">Skills</th>
                      <th className="text-left py-3 px-2">Status</th>
                      <th className="text-left py-3 px-2">Date</th>
                      <th className="text-left py-3 px-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {swaps.map(swap => (
                      <tr key={swap._id} className="border-b border-gray-100">
                        <td className="py-3 px-2">{swap.requester}</td>
                        <td className="py-3 px-2">{swap.recipient}</td>
                        <td className="py-3 px-2">
                          <div className="text-xs">
                            <div>Learn: {swap.requestedSkill}</div>
                            <div>Teach: {swap.offeredSkill}</div>
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            swap.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            swap.status === 'accepted' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {swap.status}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-xs">{new Date(swap.createdAt).toLocaleDateString()}</td>
                        <td className="py-3 px-2">
                          <button
                            onClick={() => handleDeleteSwap(swap._id)}
                            className="text-xs px-2 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="modern-card">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Content Moderation</h3>
              <div className="space-y-4">
                {reportedContent.map(report => (
                  <div key={report._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium">{report.type.replace('_', ' ').toUpperCase()}</h4>
                        <p className="text-sm text-gray-600">Reported by: {report.user}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {report.status}
                      </span>
                    </div>
                    <div className="mb-3">
                      <p className="text-sm font-medium mb-1">Content:</p>
                      <p className="text-sm bg-gray-50 p-2 rounded">{report.content}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs text-gray-500">Reason: {report.reason}</p>
                        <p className="text-xs text-gray-500">Reported: {new Date(report.reportedAt).toLocaleDateString()}</p>
                      </div>
                      {report.status === 'pending' && (
                        <button
                          onClick={() => handleResolveReport(report._id)}
                          className="text-xs px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700"
                        >
                          Resolve
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'announcements' && (
            <div className="space-y-6">
              {/* Send Announcement Form */}
              <div className="modern-card">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Send Announcement</h3>
                <form onSubmit={handleSendAnnouncement} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <input
                      type="text"
                      name="title"
                      required
                      className="modern-input w-full text-sm sm:text-base"
                      placeholder="Announcement title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                    <textarea
                      name="message"
                      required
                      rows={3}
                      className="modern-input w-full text-sm sm:text-base"
                      placeholder="Announcement message"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                    <select name="type" className="modern-input w-full text-sm sm:text-base">
                      <option value="info">Information</option>
                      <option value="feature">Feature Update</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="alert">Alert</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="btn-primary text-sm sm:text-base"
                    style={{background: 'linear-gradient(45deg, #8b5cf6, #ec4899)'}}
                  >
                    Send Announcement
                  </button>
                </form>
              </div>

              {/* Existing Announcements */}
              <div className="modern-card">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Recent Announcements</h3>
                <div className="space-y-4">
                  {announcements.map(announcement => (
                    <div key={announcement._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{announcement.title}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          announcement.type === 'feature' ? 'bg-blue-100 text-blue-800' :
                          announcement.type === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                          announcement.type === 'alert' ? 'bg-red-100 text-red-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {announcement.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{announcement.message}</p>
                      <p className="text-xs text-gray-500">
                        Sent: {new Date(announcement.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation Bar */}
      <nav className="mobile-nav md:hidden">
        <div className="flex justify-around items-center">
          <a href="/" className={`mobile-nav-item ${location.pathname === '/' ? 'active' : ''}`}>
            <span className="text-lg mb-1">🏠</span>
            <span>Home</span>
          </a>
          <a href="/admin" className={`mobile-nav-item ${location.pathname === '/admin' ? 'active' : ''}`}>
            <span className="text-lg mb-1">⚙️</span>
            <span>Admin</span>
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

export default AdminDashboard; 