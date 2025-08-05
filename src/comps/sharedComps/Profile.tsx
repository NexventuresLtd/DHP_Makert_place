import { useState, useEffect } from 'react';

import { Edit2, User as UserIcon, Mail, Key, Save, X } from 'lucide-react';
import type { User, UserUpdate } from '../../types/UserTypes';
import { useToast } from './useToast';
import mainAxios from '../Instance/mainAxios';


const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserUpdate>({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await mainAxios.get<User>('/users/me/');
        setUser(response.data);
        setFormData({
          first_name: response.data.first_name,
          last_name: response.data.last_name || '',
          username: response.data.username,
          email: response.data.email,
          password: ''
        });
        setIsLoading(false);
      } catch (error) {
        showToast('Failed to fetch user profile', 'error');
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [showToast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await mainAxios.patch<User>('/users/me/', formData);
      setUser(response.data);
      setIsEditing(false);
      showToast('Profile updated successfully', 'success');
    } catch (error) {
      showToast('Failed to update profile', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600">Failed to load user profile</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-primary to-secondary px-6 py-8 text-white">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 p-3 rounded-full">
                  <UserIcon size={32} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">
                    {user.first_name} {user.last_name}
                  </h1>
                  <p className="text-white/80">@{user.username}</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center space-x-2 bg-black hover:bg-black/80 px-4 py-2 rounded-lg transition-colors"
              >
                {isEditing ? (
                  <>
                    <X size={18} />
                    <span>Cancel</span>
                  </>
                ) : (
                  <>
                    <Edit2 size={18} />
                    <span>Edit Profile</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Profile Content */}
          <div className="px-6 py-8">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="first_name"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="last_name"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password (leave blank to keep current)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Key size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center space-x-2 bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    <Save size={18} />
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">First Name</h3>
                    <p className="mt-1 text-lg font-medium">{user.first_name}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Last Name</h3>
                    <p className="mt-1 text-lg font-medium">{user.last_name || 'Not provided'}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Username</h3>
                  <p className="mt-1 text-lg font-medium">@{user.username}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email Address</h3>
                  <div className="mt-1 flex items-center space-x-2">
                    <Mail size={18} className="text-gray-400" />
                    <p className="text-lg font-medium">{user.email}</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Account Security</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    To change your password, click the "Edit Profile" button above.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;