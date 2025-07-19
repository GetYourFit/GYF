import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  User, Settings, Camera, Edit3, Save, X, ArrowLeft, 
  Mail, Phone, MapPin, Calendar, Award, Star, Heart,
  Sparkles, TrendingUp, ShoppingBag, Palette, Ruler
} from 'lucide-react';

const Profile = () => {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: user?.firstName ? `${user.firstName} ${user.lastName}` : user?.name || 'Fashion Enthusiast',
    email: user?.email || 'user@example.com',
    phone: user?.PhoneNumber || '+1 (555) 123-4567',
    location: 'New York, NY',
    birthday: user?.DOB || '1995-06-15',
    gender: user?.Gender || 'Prefer not to say',
    bio: 'Fashion lover with a passion for sustainable style and timeless elegance.',
    bodyType: 'Hourglass',
    colorProfile: 'Warm Autumn',
    stylePersonality: 'Classic Elegant',
    favoriteColors: ['Deep burgundy', 'Golden yellow', 'Forest green'],
    measurements: {
      bust: '34"',
      waist: '26"',
      hips: '36"',
      height: '5\'6"'
    }
  });

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to backend
  };

  const stats = [
    { label: 'Outfits Created', value: '127', icon: ShoppingBag, color: 'from-purple-500 to-pink-500' },
    { label: 'Style Score', value: '94%', icon: Star, color: 'from-blue-500 to-cyan-500' },
    { label: 'Favorites', value: '23', icon: Heart, color: 'from-pink-500 to-rose-500' },
    { label: 'Achievements', value: '8', icon: Award, color: 'from-emerald-500 to-teal-500' }
  ];

  const achievements = [
    { name: 'Style Pioneer', description: 'Created your first outfit', icon: '🎨', earned: true },
    { name: 'Color Expert', description: 'Mastered color coordination', icon: '🌈', earned: true },
    { name: 'Trendsetter', description: 'Followed 10 trending styles', icon: '✨', earned: true },
    { name: 'Fashion Guru', description: 'Reached 90% style score', icon: '👑', earned: true },
    { name: 'Wardrobe Master', description: 'Added 50+ items to wardrobe', icon: '👗', earned: false },
    { name: 'Social Butterfly', description: 'Shared 20 outfits', icon: '🦋', earned: false }
  ];

  const renderProfile = () => (
    <div className="space-y-6 md:space-y-8">
      {/* Profile Header */}
      <div className="glass-effect rounded-2xl md:rounded-3xl p-4 md:p-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-6 lg:mb-0 w-full lg:w-auto">
            <div className="relative mx-auto sm:mx-0">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <User className="h-10 w-10 md:h-12 md:w-12 text-white" />
              </div>
              <button className="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 p-1.5 md:p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
                <Camera className="h-3 w-3 md:h-4 md:w-4 text-white" />
              </button>
            </div>
            <div className="text-center sm:text-left w-full sm:w-auto">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-1 md:mb-2">{profileData.name}</h1>
              <p className="text-gray-300 text-base md:text-lg mb-2">{profileData.email}</p>
              <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-4 text-gray-400 text-sm md:text-base">
                <div className="flex items-center space-x-1">
                  <MapPin className="h-3 w-3 md:h-4 md:w-4" />
                  <span>{profileData.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3 md:h-4 md:w-4" />
                  <span>Joined 2024</span>
                </div>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="w-full lg:w-auto flex items-center justify-center space-x-2 px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
          >
            {isEditing ? <Save className="h-4 w-4 md:h-5 md:w-5" /> : <Edit3 className="h-4 w-4 md:h-5 md:w-5" />}
            <span>{isEditing ? 'Save Changes' : 'Edit Profile'}</span>
          </button>
        </div>

        {/* Bio */}
        <div className="mb-6 md:mb-8">
          <h3 className="text-lg md:text-xl font-semibold text-white mb-2 md:mb-3">About</h3>
          {isEditing ? (
            <textarea
              value={profileData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              className="w-full p-3 md:p-4 bg-white/10 border border-gray-300/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none text-sm md:text-base"
              rows="3"
            />
          ) : (
            <p className="text-gray-300 leading-relaxed text-sm md:text-base">{profileData.bio}</p>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white/10 rounded-xl md:rounded-2xl p-4 md:p-6 text-center">
              <div className={`inline-flex p-2 md:p-3 rounded-lg md:rounded-xl bg-gradient-to-r ${stat.color} mb-2 md:mb-3`}>
                <stat.icon className="h-4 w-4 md:h-6 md:w-6 text-white" />
              </div>
              <div className="text-lg md:text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-gray-300 text-xs md:text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Personal Information */}
      <div className="glass-effect rounded-2xl md:rounded-3xl p-4 md:p-8">
        <h3 className="text-xl md:text-2xl font-semibold text-white mb-4 md:mb-6">Personal Information</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <div>
            <label className="block text-gray-300 font-medium mb-2 text-sm md:text-base">Full Name</label>
            {isEditing ? (
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full p-3 md:p-4 bg-white/10 border border-gray-300/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm md:text-base"
              />
            ) : (
              <p className="text-white text-base md:text-lg">{profileData.name}</p>
            )}
          </div>
          
          <div>
            <label className="block text-gray-300 font-medium mb-2 text-sm md:text-base">Email</label>
            {isEditing ? (
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full p-3 md:p-4 bg-white/10 border border-gray-300/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm md:text-base"
              />
            ) : (
              <p className="text-white text-base md:text-lg">{profileData.email}</p>
            )}
          </div>
          
          <div>
            <label className="block text-gray-300 font-medium mb-2 text-sm md:text-base">Phone</label>
            {isEditing ? (
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full p-3 md:p-4 bg-white/10 border border-gray-300/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm md:text-base"
              />
            ) : (
              <p className="text-white text-base md:text-lg">{profileData.phone}</p>
            )}
          </div>
          
          <div>
            <label className="block text-gray-300 font-medium mb-2 text-sm md:text-base">Location</label>
            {isEditing ? (
              <input
                type="text"
                value={profileData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full p-3 md:p-4 bg-white/10 border border-gray-300/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm md:text-base"
              />
            ) : (
              <p className="text-white text-base md:text-lg">{profileData.location}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-300 font-medium mb-2 text-sm md:text-base">Gender</label>
            {isEditing ? (
              <select
                value={profileData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                className="w-full p-3 md:p-4 bg-white/10 border border-gray-300/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm md:text-base"
              >
                <option value="Male" className="bg-gray-800">Male</option>
                <option value="Female" className="bg-gray-800">Female</option>
                <option value="Other" className="bg-gray-800">Other</option>
                <option value="Prefer not to say" className="bg-gray-800">Prefer not to say</option>
              </select>
            ) : (
              <p className="text-white text-base md:text-lg">{profileData.gender}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-300 font-medium mb-2 text-sm md:text-base">Date of Birth</label>
            {isEditing ? (
              <input
                type="date"
                value={profileData.birthday}
                onChange={(e) => handleInputChange('birthday', e.target.value)}
                className="w-full p-3 md:p-4 bg-white/10 border border-gray-300/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm md:text-base"
              />
            ) : (
              <p className="text-white text-base md:text-lg">{new Date(profileData.birthday).toLocaleDateString()}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStyleProfile = () => (
    <div className="space-y-6 md:space-y-8">
      {/* Style Analysis */}
      <div className="glass-effect rounded-2xl md:rounded-3xl p-4 md:p-8">
        <h3 className="text-xl md:text-2xl font-semibold text-white mb-4 md:mb-6 flex items-center">
          <Palette className="mr-2 md:mr-3 h-5 w-5 md:h-6 md:w-6 text-purple-400" />
          Style Profile
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl md:rounded-2xl p-4 md:p-6 border border-purple-500/30">
            <h4 className="text-base md:text-lg font-semibold text-white mb-2">Body Type</h4>
            <p className="text-xl md:text-2xl font-bold text-purple-300">{profileData.bodyType}</p>
            <p className="text-gray-300 text-xs md:text-sm mt-2">Balanced proportions with defined waist</p>
          </div>
          
          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl md:rounded-2xl p-4 md:p-6 border border-blue-500/30">
            <h4 className="text-base md:text-lg font-semibold text-white mb-2">Color Profile</h4>
            <p className="text-xl md:text-2xl font-bold text-blue-300">{profileData.colorProfile}</p>
            <p className="text-gray-300 text-xs md:text-sm mt-2">Warm, rich colors complement your skin tone</p>
          </div>
          
          <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl md:rounded-2xl p-4 md:p-6 border border-emerald-500/30">
            <h4 className="text-base md:text-lg font-semibold text-white mb-2">Style Personality</h4>
            <p className="text-xl md:text-2xl font-bold text-emerald-300">{profileData.stylePersonality}</p>
            <p className="text-gray-300 text-xs md:text-sm mt-2">Timeless elegance with modern touches</p>
          </div>
        </div>

        {/* Favorite Colors */}
        <div className="mb-6 md:mb-8">
          <h4 className="text-lg md:text-xl font-semibold text-white mb-3 md:mb-4">Your Perfect Colors</h4>
          <div className="flex flex-wrap gap-2 md:gap-3">
            {profileData.favoriteColors.map((color, index) => (
              <div key={index} className="flex items-center space-x-2 md:space-x-3 bg-white/10 rounded-lg md:rounded-xl px-3 md:px-4 py-2 md:py-3">
                <div className="w-4 h-4 md:w-6 md:h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
                <span className="text-white font-medium text-sm md:text-base">{color}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Measurements */}
        <div>
          <h4 className="text-lg md:text-xl font-semibold text-white mb-3 md:mb-4 flex items-center">
            <Ruler className="mr-2 h-4 w-4 md:h-5 md:w-5 text-purple-400" />
            Measurements
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {Object.entries(profileData.measurements).map(([key, value]) => (
              <div key={key} className="bg-white/10 rounded-lg md:rounded-xl p-3 md:p-4 text-center">
                <div className="text-gray-300 text-xs md:text-sm capitalize mb-1">{key}</div>
                <div className="text-white font-semibold text-base md:text-lg">{value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAchievements = () => (
    <div className="space-y-6 md:space-y-8">
      <div className="glass-effect rounded-2xl md:rounded-3xl p-4 md:p-8">
        <h3 className="text-xl md:text-2xl font-semibold text-white mb-4 md:mb-6 flex items-center">
          <Award className="mr-2 md:mr-3 h-5 w-5 md:h-6 md:w-6 text-purple-400" />
          Achievements
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className={`rounded-xl md:rounded-2xl p-4 md:p-6 border transition-all duration-300 ${
                achievement.earned
                  ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/30'
                  : 'bg-white/5 border-gray-600/30'
              }`}
            >
              <div className="text-center">
                <div className={`text-3xl md:text-4xl mb-3 md:mb-4 ${achievement.earned ? '' : 'grayscale opacity-50'}`}>
                  {achievement.icon}
                </div>
                <h4 className={`text-base md:text-lg font-semibold mb-2 ${achievement.earned ? 'text-white' : 'text-gray-400'}`}>
                  {achievement.name}
                </h4>
                <p className={`text-xs md:text-sm ${achievement.earned ? 'text-gray-300' : 'text-gray-500'}`}>
                  {achievement.description}
                </p>
                {achievement.earned && (
                  <div className="mt-3 md:mt-4">
                    <span className="inline-flex items-center px-2 md:px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-medium rounded-full">
                      ✓ Earned
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="glass-effect backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 md:space-x-4">
              <Link
                to="/dashboard"
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 md:h-6 md:w-6" />
              </Link>
              <div className="flex items-center space-x-2 md:space-x-3">
                <div className="p-1.5 md:p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg md:rounded-xl">
                  <User className="h-5 w-5 md:h-6 md:w-6 text-white" />
                </div>
                <h1 className="text-lg md:text-2xl font-bold text-white">Profile</h1>
              </div>
            </div>
            
            <button
              onClick={logout}
              className="flex items-center space-x-1 md:space-x-2 px-3 md:px-4 py-1.5 md:py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-all duration-200 text-sm md:text-base"
            >
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6">
        <div className="flex space-x-1 bg-white/10 rounded-lg md:rounded-xl p-1 backdrop-blur-xl overflow-x-auto">
          {[
            { id: 'profile', label: 'Profile', icon: User },
            { id: 'style', label: 'Style Profile', icon: Palette },
            { id: 'achievements', label: 'Achievements', icon: Award }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-1 md:space-x-2 py-2 md:py-3 px-3 md:px-6 rounded-md md:rounded-lg font-semibold transition-all duration-300 text-sm md:text-base whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <tab.icon className="h-4 w-4 md:h-5 md:w-5" />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 pb-8 md:pb-12">
        {activeTab === 'profile' && renderProfile()}
        {activeTab === 'style' && renderStyleProfile()}
        {activeTab === 'achievements' && renderAchievements()}
      </main>
    </div>
  );
};

export default Profile;