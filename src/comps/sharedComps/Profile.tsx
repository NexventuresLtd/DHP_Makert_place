import { useState, useEffect } from 'react';
import { Edit2, Mail, Key, Save, X, Info, Loader2, Shield, Settings, Calendar, CheckCircle, User2 } from 'lucide-react';
import type { User, UserUpdate } from '../../types/UserTypes';
import { useToast } from './useToast';
import mainAxios from '../Instance/mainAxios';
import DigitalHeritagePlatform from './Navbar';
import { getUserInfo } from '../../app/Localstorage';
interface ProfilePageProps {
    ShowNav?: boolean;
}
const ProfilePage = ({ ShowNav }: ProfilePageProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<UserUpdate>({
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        password: '',
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { showToast } = useToast();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await mainAxios.get<User>('/users/me/');
                setUser(response.data);
                // Initialize formData with user data
                setFormData({
                    first_name: response.data.first_name,
                    last_name: response.data.last_name || '',
                    username: response.data.username,
                    email: response.data.email,
                    password: ''
                });
            } catch (error) {
                showToast('Failed to fetch user profile', 'error');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    // Reset form data when editing mode changes
    useEffect(() => {
        if (user && isEditing) {
            setFormData({
                first_name: user.first_name,
                last_name: user.last_name || '',
                username: user.username,
                email: user.email,
                password: ''
            });
        }
    }, [isEditing, user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const payload: Partial<UserUpdate> = {};
            if (formData.first_name !== user?.first_name) payload.first_name = formData.first_name;
            if (formData.last_name !== user?.last_name) payload.last_name = formData.last_name;
            if (formData.username !== user?.username) payload.username = formData.username;
            if (formData.email !== user?.email) payload.email = formData.email;
            if (formData.password) payload.password = formData.password;

            const response = await mainAxios.patch<User>('/users/me/', payload);
            setUser(response.data);
            setIsEditing(false);
            showToast('Profile updated successfully', 'success');
        } catch (error) {
            showToast('Failed to update profile', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                {ShowNav ? <DigitalHeritagePlatform /> : ""}
                <div className="flex justify-center items-center h-screen">
                    <div className="flex flex-col items-center gap-6 bg-white p-8 rounded-xl border border-gray-100">
                        <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                        <div className="text-center">
                            <h3 className="text-lg font-medium text-gray-700 mb-1">Loading Your Profile</h3>
                            <p className="text-gray-500">Fetching your information...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50">
                {ShowNav ? <DigitalHeritagePlatform /> : ""}
                <div className="flex justify-center items-center h-screen">
                    <div className="flex items-center gap-4 text-red-500 bg-white p-6 rounded-xl border border-gray-100">
                        <Info className="h-6 w-6" />
                        <div>
                            <h3 className="font-medium text-gray-700">Unable to Load Profile</h3>
                            <p className="text-gray-500">Please try refreshing the page</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className=" bg-gray-50">
            {ShowNav ? <DigitalHeritagePlatform /> : ""}

            <div className="mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Profile Card */}
                    <div className="lg:col-span-1 ">
                        <div className=" rounded-xl border border-gray-100  sticky top-6 bg-[url('/images/research.png')] bg-center bg-repeat bg-blend-overlay bg-white/90 backdrop-blur-3xl">
                            <div className="text-center mb-6">
                                <div className="relative inline-block mb-4">
                                    <div className="bg-blue-50 p-6 rounded-xl inline-block">
                                        <User2 className="h-16 w-16 text-blue-500" />
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 bg-green-500 p-1 rounded-full">
                                        <CheckCircle className="h-4 w-4 text-white" />
                                    </div>
                                </div>

                                <div className="space-y-1 mb-6">
                                    <h3 className="text-xl font-medium text-gray-800">
                                        {user.first_name} {user.last_name}
                                    </h3>
                                    <p className="text-blue-500 font-medium">@{user.username}</p>
                                    <p className="text-gray-500 text-xs">{user.email}</p>
                                    <p className="text-xs font-bold capitalize text-gray-400">Membership Type: {" "}
                                        <span className={`${getUserInfo?.type === 'creator' ? 'bg-blue-100 text-blue-500' : getUserInfo?.type === 'admin' ? 'bg-green-100 text-green-500' : 'bg-gray-100 text-gray-500'   } px-2 py-1 rounded`}>
                                            {getUserInfo?.type}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3 bg-white p-4 w-full">
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Shield className="h-5 w-5 text-blue-500" />
                                        <div>
                                            <p className="font-medium text-gray-700">Verified Account</p>
                                            <p className="text-sm text-gray-500">Active Member</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-purple-50 p-4 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Calendar className="h-5 w-5 text-purple-500" />
                                        <div>
                                            <p className="font-medium text-gray-700">Heritage Explorer</p>
                                            <p className="text-sm text-gray-500">Digital Curator</p>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                            {/* Header */}
                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-b border-gray-100">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div>
                                        <h2 className="text-xl font-medium text-gray-800 mb-1">Profile Information</h2>
                                        <p className="text-gray-500">Update your personal details and preferences</p>
                                    </div>
                                    <button
                                        onClick={() => setIsEditing(!isEditing)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${isEditing
                                            ? 'bg-red-50 text-red-500 hover:bg-red-100'
                                            : 'bg-blue-50 text-blue-500 hover:bg-blue-100'
                                            }`}
                                    >
                                        {isEditing ? (
                                            <>
                                                <X className="h-4 w-4" />
                                                <span>Cancel</span>
                                            </>
                                        ) : (
                                            <>
                                                <Edit2 className="h-4 w-4" />
                                                <span>Edit Profile</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                {isEditing ? (
                                    <form onSubmit={handleSubmit} className="space-y-8">
                                        {/* Personal Information */}
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="bg-blue-100 p-2 rounded-lg">
                                                    <User2 className="h-5 w-5 text-blue-500" />
                                                </div>
                                                <h3 className="text-lg font-medium text-gray-800">Personal Information</h3>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        First Name
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            name="first_name"
                                                            value={formData.first_name}
                                                            onChange={(e) => handleInputChange(e)}
                                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-lg text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-blue-200 focus:bg-white transition-all outline-none border border-gray-200"
                                                            placeholder="First name"
                                                            required
                                                        />
                                                        <User2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Last Name
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            name="last_name"
                                                            value={formData.last_name}
                                                            onChange={(e) => handleInputChange(e)}
                                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-lg text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-blue-200 focus:bg-white transition-all outline-none border border-gray-200"
                                                            placeholder="Last name"
                                                        />
                                                        <User2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Account Details */}
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="bg-purple-100 p-2 rounded-lg">
                                                    <Settings className="h-5 w-5 text-purple-500" />
                                                </div>
                                                <h3 className="text-lg font-medium text-gray-800">Account Details</h3>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Username
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            name="username"
                                                            value={formData.username}
                                                            onChange={(e) => handleInputChange(e)}
                                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-lg text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-purple-200 focus:bg-white transition-all outline-none border border-gray-200"
                                                            placeholder="Username"
                                                            required
                                                        />
                                                        <User2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Email Address
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type="email"
                                                            name="email"
                                                            value={formData.email}
                                                            onChange={(e) => handleInputChange(e)}
                                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-lg text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-purple-200 focus:bg-white transition-all outline-none border border-gray-200"
                                                            placeholder="Email"
                                                            required
                                                        />
                                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Security */}
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="bg-red-100 p-2 rounded-lg">
                                                    <Key className="h-5 w-5 text-red-500" />
                                                </div>
                                                <h3 className="text-lg font-medium text-gray-800">Security Settings</h3>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700">
                                                    New Password
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="password"
                                                        name="password"
                                                        value={formData.password}
                                                        onChange={(e) => handleInputChange(e)}
                                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-lg text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-red-200 focus:bg-white transition-all outline-none border border-gray-200"
                                                        placeholder="Leave blank to keep current"
                                                    />
                                                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Only fill this field if you want to change your password
                                                </p>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex justify-end gap-3 pt-6">
                                            <button
                                                type="button"
                                                onClick={() => setIsEditing(false)}
                                                className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="flex items-center gap-2 px-5 py-2.5 bg-primary from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-colors font-medium disabled:opacity-70"
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                        <span>Saving...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Save className="h-4 w-4" />
                                                        <span>Save Changes</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="space-y-8">
                                        {/* Personal Information Display */}
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="bg-blue-100 p-2 rounded-lg">
                                                    <User2 className="h-5 w-5 text-blue-500" />
                                                </div>
                                                <h3 className="text-lg font-medium text-gray-800">Personal Information</h3>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <User2 className="h-4 w-4 text-blue-500" />
                                                        <h4 className="text-sm font-medium text-gray-500">First Name</h4>
                                                    </div>
                                                    <p className="text-gray-700 font-medium">{user.first_name}</p>
                                                </div>

                                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <User2 className="h-4 w-4 text-blue-500" />
                                                        <h4 className="text-sm font-medium text-gray-500">Last Name</h4>
                                                    </div>
                                                    <p className="text-gray-700 font-medium">
                                                        {user.last_name || <span className="text-gray-400 italic">Not provided</span>}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Account Details Display */}
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="bg-purple-100 p-2 rounded-lg">
                                                    <Settings className="h-5 w-5 text-purple-500" />
                                                </div>
                                                <h3 className="text-lg font-medium text-gray-800">Account Details</h3>
                                            </div>

                                            <div className="space-y-3">
                                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <User2 className="h-4 w-4 text-purple-500" />
                                                        <h4 className="text-sm font-medium text-gray-500">Username</h4>
                                                    </div>
                                                    <p className="text-blue-500 font-medium">@{user.username}</p>
                                                </div>

                                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <Mail className="h-4 w-4 text-purple-500" />
                                                        <h4 className="text-sm font-medium text-gray-500">Email Address</h4>
                                                    </div>
                                                    <p className="text-gray-700 font-medium">{user.email}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Information Card */}
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-gray-100">
                            <div className="flex items-start gap-4">
                                <div className="bg-blue-100 p-3 rounded-lg">
                                    <Info className="h-5 w-5 text-blue-500" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium text-gray-800 mb-3">About Digital Heritage Platform</h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        The Digital Heritage Platform (DHP) preserves and promotes cultural heritage through
                                        digital innovation. Your profile helps us personalize your experience with cultural
                                        artifacts, historical data, and community features. We're committed to protecting
                                        your privacy and ensuring your data remains secure in our digital ecosystem.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;