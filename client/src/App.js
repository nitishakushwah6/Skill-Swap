import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import UserProfile from './components/UserProfile';
import SwapRequests from './components/SwapRequests';
import ProfileDetails from './components/ProfileDetails';
import RequestSwap from './components/RequestSwap';
import AdminDashboard from './components/AdminDashboard';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/swaps" element={<SwapRequests />} />
          <Route path="/profile/:userId" element={<ProfileDetails />} />
          <Route path="/request/:userId" element={<RequestSwap />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 