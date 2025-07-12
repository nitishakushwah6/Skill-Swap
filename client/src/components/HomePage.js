import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchSkill, setSearchSkill] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [currentUser, setCurrentUser] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 1250,
    totalSwaps: 3420,
    activeUsers: 89
  });

  useEffect(() => {
    fetchUsers(currentPage, searchSkill);
    checkLoginStatus();
    // Simulate real-time stats updates
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 3) - 1
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, [currentPage, searchSkill]);

  const checkLoginStatus = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    setCurrentUser(user);
  };

  const fetchUsers = async (page = 1, skill) => {
    try {
      setLoading(true);
      // Simulate API call for demo
      setTimeout(() => {
        const mockUsers = [
          {
            _id: '1',
            name: 'Sarah Chen',
            location: 'Mumbai, India',
            profilePhoto: null,
            skillsOffered: ['UI/UX Design', 'Figma', 'Prototyping'],
            skillsWanted: ['React', 'JavaScript', 'Node.js'],
            rating: 4.8,
            totalSwaps: 23
          },
          {
            _id: '2',
            name: 'Rahul Sharma',
            location: 'Delhi, India',
            profilePhoto: null,
            skillsOffered: ['Python', 'Machine Learning', 'Data Analysis'],
            skillsWanted: ['Web Development', 'JavaScript', 'React'],
            rating: 4.6,
            totalSwaps: 18
          },
          {
            _id: '3',
            name: 'Priya Patel',
            location: 'Bangalore, India',
            profilePhoto: null,
            skillsOffered: ['Content Writing', 'SEO', 'Social Media'],
            skillsWanted: ['Graphic Design', 'Photoshop', 'Illustrator'],
            rating: 4.9,
            totalSwaps: 31
          }
        ];
        setUsers(mockUsers);
        setPagination({
          currentPage: page,
          totalPages: 5,
          totalUsers: 1250,
          hasNext: page < 5,
          hasPrev: page > 1
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchUsers(1, searchSkill);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleProfileClick = (userId) => {
    navigate(`/user/${userId}`);
  };

  const handleRequestSwap = (userId) => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    navigate(`/request/${userId}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setCurrentUser(null);
    navigate('/');
  };

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
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg sm:text-xl">SS</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white animate-slide-in-left">
                SkillSwap
              </h1>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4 lg:space-x-6 desktop-nav">
              {currentUser ? (
                <>
                  <span className="text-white text-sm">Welcome, {currentUser.name}!</span>
                  {currentUser.role === 'admin' && (
                    <button
                      onClick={() => navigate('/admin')}
                      className="btn-secondary text-sm lg:text-base"
                    >
                      ⚙️ Admin Panel
                    </button>
                  )}
                  <button 
                    onClick={() => navigate('/profile')}
                    className="btn-secondary text-sm lg:text-base"
                  >
                    My Profile
                  </button>
                  <button 
                    onClick={() => navigate('/swaps')}
                    className="btn-secondary text-sm lg:text-base"
                  >
                    My Swaps
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="btn-primary text-sm lg:text-base"
                    style={{background: 'linear-gradient(45deg, #ef4444, #dc2626)'}}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => navigate('/login')}
                  className="btn-primary text-sm lg:text-base"
                  style={{background: 'linear-gradient(45deg, #8b5cf6, #ec4899)'}}
                >
                  Login
                </button>
              )}
            </div>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              {currentUser ? (
                <button
                  onClick={() => navigate('/profile')}
                  className="btn-secondary text-sm"
                >
                  Profile
                </button>
              ) : (
                <button 
                  onClick={() => navigate('/login')}
                  className="btn-primary text-sm"
                  style={{background: 'linear-gradient(45deg, #8b5cf6, #ec4899)'}}
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 py-8 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 animate-fade-in-up mobile-hero">
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-4 sm:mb-6">
              Connect. Learn. 
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent"> Grow.</span>
            </h2>
            <p className="text-lg sm:text-xl text-white/80 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
              Join thousands of learners exchanging skills across India. Find your perfect skill swap partner and accelerate your learning journey.
            </p>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
              <div className="stats-card animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-2">{stats.totalUsers.toLocaleString()}+</div>
                <div className="text-white/80 text-sm sm:text-base">Active Users</div>
              </div>
              <div className="stats-card animate-fade-in-up" style={{animationDelay: '0.4s'}}>
                <div className="text-2xl sm:text-3xl font-bold text-pink-600 mb-2">{stats.totalSwaps.toLocaleString()}+</div>
                <div className="text-white/80 text-sm sm:text-base">Successful Swaps</div>
              </div>
              <div className="stats-card animate-fade-in-up" style={{animationDelay: '0.6s'}}>
                <div className="text-2xl sm:text-3xl font-bold text-orange-600 mb-2">{stats.activeUsers}</div>
                <div className="text-white/80 text-sm sm:text-base">Online Now</div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12 sm:mb-16 animate-fade-in-up mobile-search" style={{animationDelay: '0.8s'}}>
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by skill (e.g., Photoshop, Excel, React, Guitar)"
                  value={searchSkill}
                  onChange={(e) => setSearchSkill(e.target.value)}
                  className="modern-input w-full pr-12 text-base sm:text-lg"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 btn-primary py-2 px-3 sm:px-4 text-sm sm:text-base"
                >
                  🔍
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Users Grid */}
      <section className="relative z-10 pb-16 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center items-center py-16 sm:py-20">
              <div className="loading-spinner"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mobile-grid">
                {users.map((user, index) => (
                  <div 
                    key={user._id} 
                    className="modern-card hover-lift animate-fade-in-up"
                    style={{animationDelay: `${index * 0.1}s`}}
                  >
                    {/* User Header */}
                    <div className="flex items-center mb-4 sm:mb-6">
                      <div 
                        className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mr-3 sm:mr-4 cursor-pointer hover:scale-105 transition-transform"
                        onClick={() => handleProfileClick(user._id)}
                      >
                        {user.profilePhoto ? (
                          <img
                            src={user.profilePhoto}
                            alt={user.name}
                            className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-white font-bold text-lg sm:text-xl">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 
                          className="text-lg sm:text-xl font-bold text-gray-900 mb-1 cursor-pointer hover:text-purple-600 transition-colors"
                          onClick={() => handleProfileClick(user._id)}
                        >
                          {user.name}
                        </h3>
                        <p className="text-gray-600 text-xs sm:text-sm">{user.location}</p>
                      </div>
                    </div>

                    {/* Skills Offered */}
                    <div className="mb-4 sm:mb-6">
                      <h4 className="font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        Skills Offered
                      </h4>
                      <div className="flex flex-wrap gap-1 sm:gap-2">
                        {user.skillsOffered.slice(0, 3).map((skill, skillIndex) => (
                          <span
                            key={skillIndex}
                            className="skill-tag"
                            style={{background: 'linear-gradient(45deg, #10b981, #059669)'}}
                          >
                            {skill}
                          </span>
                        ))}
                        {user.skillsOffered.length > 3 && (
                          <span className="text-gray-500 text-xs sm:text-sm">+{user.skillsOffered.length - 3} more</span>
                        )}
                      </div>
                    </div>

                    {/* Skills Wanted */}
                    <div className="mb-4 sm:mb-6">
                      <h4 className="font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        Skills Wanted
                      </h4>
                      <div className="flex flex-wrap gap-1 sm:gap-2">
                        {user.skillsWanted.slice(0, 3).map((skill, skillIndex) => (
                          <span
                            key={skillIndex}
                            className="skill-tag"
                            style={{background: 'linear-gradient(45deg, #3b82f6, #1d4ed8)'}}
                          >
                            {skill}
                          </span>
                        ))}
                        {user.skillsWanted.length > 3 && (
                          <span className="text-gray-500 text-xs sm:text-sm">+{user.skillsWanted.length - 3} more</span>
                        )}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex justify-between items-center mb-4 sm:mb-6 text-xs sm:text-sm text-gray-600">
                      <span className="flex items-center">
                        ⭐ {user.rating.toFixed(1)}
                      </span>
                      <span>🔄 {user.totalSwaps} swaps</span>
                    </div>

                    {/* Request Button - Only show if logged in */}
                    {currentUser ? (
                      <button
                        onClick={() => handleRequestSwap(user._id)}
                        className="btn-primary w-full text-sm sm:text-base"
                        style={{background: 'linear-gradient(45deg, #8b5cf6, #ec4899)'}}
                      >
                        Request Swap
                      </button>
                    ) : (
                      <button
                        onClick={() => navigate('/login')}
                        className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-full font-semibold text-sm sm:text-base hover:from-purple-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105"
                      >
                        Login to Request
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination && (
                <div className="flex justify-center items-center space-x-2 sm:space-x-4 mt-8 sm:mt-12 mobile-pagination">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrev}
                    className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    ← Previous
                  </button>
                  
                  <div className="flex space-x-1 sm:space-x-2">
                    {[...Array(pagination.totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => handlePageChange(i + 1)}
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full text-sm sm:text-base ${
                          pagination.currentPage === i + 1
                            ? 'bg-purple-600 text-white'
                            : 'bg-white/20 text-white hover:bg-white/30'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={!pagination.hasNext}
                    className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Mobile Navigation Bar */}
      <nav className="mobile-nav md:hidden">
        <div className="flex justify-around items-center">
          <a href="/" className={`mobile-nav-item ${location.pathname === '/' ? 'active' : ''}`}>
            <span className="text-lg mb-1">🏠</span>
            <span>Home</span>
          </a>
          {currentUser && currentUser.role === 'admin' && (
            <a href="/admin" className={`mobile-nav-item ${location.pathname === '/admin' ? 'active' : ''}`}>
              <span className="text-lg mb-1">⚙️</span>
              <span>Admin</span>
            </a>
          )}
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

      {/* Footer */}
      <footer className="relative z-10 py-6 sm:py-8 text-center text-white/60 text-sm sm:text-base">
        <p>© 2024 SkillSwap - Connecting learners across India</p>
      </footer>
    </div>
  );
};

export default HomePage; 