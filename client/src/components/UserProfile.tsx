import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  _id: string;
  name: string;
  email: string;
  location?: string;
  profilePhoto?: string;
  skillsOffered: string[];
  skillsWanted: string[];
  availability: {
    weekends: boolean;
    evenings: boolean;
    weekdays: boolean;
    custom?: string;
  };
  profileVisibility: 'public' | 'private';
  rating: number;
  totalSwaps: number;
}

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    skillsOffered: [] as string[],
    skillsWanted: [] as string[],
    availability: {
      weekends: false,
      evenings: false,
      weekdays: false,
      custom: ''
    },
    profileVisibility: 'public' as 'public' | 'private'
  });
  const [newSkill, setNewSkill] = useState({ offered: '', wanted: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
      setFormData({
        name: response.data.name,
        location: response.data.location || '',
        skillsOffered: response.data.skillsOffered,
        skillsWanted: response.data.skillsWanted,
        availability: response.data.availability,
        profileVisibility: response.data.profileVisibility
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      await axios.put('/api/users/me', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Profile updated successfully!');
      setEditing(false);
      fetchUserProfile();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to update profile');
    } finally {
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

  const removeSkillOffered = (index: number) => {
    setFormData({
      ...formData,
      skillsOffered: formData.skillsOffered.filter((_, i) => i !== index)
    });
  };

  const removeSkillWanted = (index: number) => {
    setFormData({
      ...formData,
      skillsWanted: formData.skillsWanted.filter((_, i) => i !== index)
    });
  };

  if (loading && !user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <div className="flex space-x-4">
              <button 
                onClick={() => setEditing(!editing)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                {editing ? 'Cancel' : 'Edit Profile'}
              </button>
              <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-8">
          <form onSubmit={handleSubmit}>
            {/* Profile Photo */}
            <div className="mb-8">
              <div className="flex items-center">
                <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center mr-6">
                  {user.profilePhoto ? (
                    <img
                      src={user.profilePhoto}
                      alt={user.name}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-600 font-semibold text-2xl">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                  <p className="text-gray-600">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={!editing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  disabled={!editing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  placeholder="Enter your location"
                />
              </div>
            </div>

            {/* Skills Offered */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Skills Offered</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {formData.skillsOffered.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center"
                  >
                    {skill}
                    {editing && (
                      <button
                        type="button"
                        onClick={() => removeSkillOffered(index)}
                        className="ml-2 text-green-600 hover:text-green-800"
                      >
                        ×
                      </button>
                    )}
                  </span>
                ))}
              </div>
              {editing && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkill.offered}
                    onChange={(e) => setNewSkill({ ...newSkill, offered: e.target.value })}
                    placeholder="Add a skill you can offer"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={addSkillOffered}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                  >
                    Add
                  </button>
                </div>
              )}
            </div>

            {/* Skills Wanted */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Skills Wanted</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {formData.skillsWanted.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
                  >
                    {skill}
                    {editing && (
                      <button
                        type="button"
                        onClick={() => removeSkillWanted(index)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    )}
                  </span>
                ))}
              </div>
              {editing && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkill.wanted}
                    onChange={(e) => setNewSkill({ ...newSkill, wanted: e.target.value })}
                    placeholder="Add a skill you want to learn"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={addSkillWanted}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
              )}
            </div>

            {/* Availability */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Availability</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <span className="ml-2 text-sm text-gray-700">Weekends</span>
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
                  <span className="ml-2 text-sm text-gray-700">Evenings</span>
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
                  <span className="ml-2 text-sm text-gray-700">Weekdays</span>
                </label>
              </div>

              {editing && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Availability
                  </label>
                  <textarea
                    value={formData.availability.custom || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      availability: { ...formData.availability, custom: e.target.value }
                    })}
                    placeholder="Describe your specific availability"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                  />
                </div>
              )}
            </div>

            {/* Profile Visibility */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Visibility</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="public"
                    checked={formData.profileVisibility === 'public'}
                    onChange={(e) => setFormData({ ...formData, profileVisibility: e.target.value as 'public' | 'private' })}
                    disabled={!editing}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Public - Anyone can see my profile</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="radio"
                    value="private"
                    checked={formData.profileVisibility === 'private'}
                    onChange={(e) => setFormData({ ...formData, profileVisibility: e.target.value as 'public' | 'private' })}
                    disabled={!editing}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Private - Only I can see my profile</span>
                </label>
              </div>
            </div>

            {/* Stats */}
            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Rating</p>
                  <p className="text-2xl font-bold text-gray-900">{user.rating.toFixed(1)} ⭐</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Swaps</p>
                  <p className="text-2xl font-bold text-gray-900">{user.totalSwaps}</p>
                </div>
              </div>
            </div>

            {/* Save Button */}
            {editing && (
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 