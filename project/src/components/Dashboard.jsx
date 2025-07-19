import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { 
  Search, Upload, User, LogOut, Camera, Filter, Star, Heart, ShoppingBag, 
  Sparkles, TrendingUp, Calendar, Award, Settings, Bell, Menu, X, ArrowRight,
  Trophy, Target, Flame, Crown, Gift, Zap, BarChart3, Plus, Eye, Share2,
  Bookmark, Clock, MapPin, ThumbsUp, MessageCircle, Users, Palette
} from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOccasion, setSelectedOccasion] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [bodyAnalysis, setBodyAnalysis] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userLevel, setUserLevel] = useState(12);
  const [userXP, setUserXP] = useState(2450);
  const [dailyStreak, setDailyStreak] = useState(7);
  const [notifications, setNotifications] = useState([]);

  const occasions = ['Casual', 'Business', 'Date Night', 'Party', 'Wedding', 'Vacation', 'Formal', 'Sport'];
  
  const sampleClothes = [
    {
      id: 1,
      name: 'Elegant Midi Dress',
      brand: 'StyleCo',
      price: '$89',
      originalPrice: '$120',
      image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
      occasion: 'Date Night',
      rating: 4.8,
      fit: 'Perfect for Apple body type',
      discount: '25% OFF',
      likes: 234,
      views: 1200,
      trending: true
    },
    {
      id: 2,
      name: 'Professional Blazer',
      brand: 'WorkWear',
      price: '$129',
      originalPrice: '$180',
      image: 'https://images.pexels.com/photos/1346187/pexels-photo-1346187.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
      occasion: 'Business',
      rating: 4.9,
      fit: 'Great for Pear body type',
      discount: '28% OFF',
      likes: 189,
      views: 890,
      trending: false
    },
    {
      id: 3,
      name: 'Casual Summer Top',
      brand: 'CasualTrend',
      price: '$45',
      originalPrice: '$65',
      image: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
      occasion: 'Casual',
      rating: 4.6,
      fit: 'Flattering for all body types',
      discount: '31% OFF',
      likes: 156,
      views: 670,
      trending: true
    },
    {
      id: 4,
      name: 'Party Sequin Dress',
      brand: 'GlamourNight',
      price: '$159',
      originalPrice: '$220',
      image: 'https://images.pexels.com/photos/1346187/pexels-photo-1346187.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
      occasion: 'Party',
      rating: 4.7,
      fit: 'Ideal for Hourglass body type',
      discount: '28% OFF',
      likes: 312,
      views: 1450,
      trending: true
    },
    {
      id: 5,
      name: 'Athletic Wear Set',
      brand: 'FitStyle',
      price: '$75',
      originalPrice: '$95',
      image: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
      occasion: 'Sport',
      rating: 4.5,
      fit: 'Perfect for active lifestyle',
      discount: '21% OFF',
      likes: 98,
      views: 445,
      trending: false
    },
    {
      id: 6,
      name: 'Formal Evening Gown',
      brand: 'ElegantWear',
      price: '$299',
      originalPrice: '$450',
      image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
      occasion: 'Formal',
      rating: 4.9,
      fit: 'Stunning for special occasions',
      discount: '34% OFF',
      likes: 445,
      views: 2100,
      trending: true
    }
  ];

  const achievements = [
    { id: 1, name: 'Style Pioneer', icon: '🎨', earned: true, xp: 100 },
    { id: 2, name: 'Trendsetter', icon: '✨', earned: true, xp: 150 },
    { id: 3, name: 'Fashion Guru', icon: '👑', earned: false, xp: 200 },
    { id: 4, name: 'Color Expert', icon: '🌈', earned: true, xp: 120 }
  ];

  const dailyChallenges = [
    { id: 1, title: 'Try a new color palette', progress: 0, total: 1, xp: 50, completed: false },
    { id: 2, title: 'Create 3 outfit combinations', progress: 1, total: 3, xp: 75, completed: false },
    { id: 3, title: 'Rate 5 fashion items', progress: 5, total: 5, xp: 25, completed: true }
  ];

  useEffect(() => {
    // Simulate real-time notifications
    const notificationTimer = setInterval(() => {
      const newNotifications = [
        'New trending item matches your style!',
        'Daily challenge completed! +25 XP',
        'Your friend Sarah liked your outfit',
        'Weekly style report is ready'
      ];
      
      if (Math.random() > 0.7) {
        setNotifications(prev => [
          ...prev.slice(-2),
          newNotifications[Math.floor(Math.random() * newNotifications.length)]
        ]);
      }
    }, 10000);

    return () => clearInterval(notificationTimer);
  }, []);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarOpen && !event.target.closest('.sidebar') && !event.target.closest('.sidebar-toggle')) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [sidebarOpen]);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [sidebarOpen]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
        // Simulate AI analysis with loading states
        setTimeout(() => {
          setBodyAnalysis({
            bodyType: 'Hourglass',
            colorProfile: 'Warm Autumn',
            stylePersonality: 'Classic Elegant',
            recommendedColors: ['Deep burgundy', 'Golden yellow', 'Forest green', 'Chocolate brown'],
            recommendations: 'Your hourglass figure is perfectly balanced. Emphasize your waist with fitted clothing and try warm, rich colors that complement your skin tone.',
            confidence: 94
          });
          // Award XP for analysis
          setUserXP(prev => prev + 50);
        }, 3000);
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredClothes = sampleClothes.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesOccasion = selectedOccasion === '' || item.occasion === selectedOccasion;
    return matchesSearch && matchesOccasion;
  });

  const sidebarItems = [
    { id: 'home', label: 'Home', icon: Sparkles },
    { id: 'catalog', label: 'Catalog', icon: Search },
    { id: 'trending', label: 'Trending', icon: TrendingUp },
    { id: 'challenges', label: 'Challenges', icon: Target },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
  ];

  const completeChallenge = (challengeId) => {
    setDailyChallenges(prev => 
      prev.map(challenge => 
        challenge.id === challengeId 
          ? { ...challenge, completed: true, progress: challenge.total }
          : challenge
      )
    );
    setUserXP(prev => prev + 25);
  };

  const likeItem = (itemId) => {
    // Simulate liking an item
    setUserXP(prev => prev + 5);
  };

  const renderHome = () => (
    <div className="space-y-6 md:space-y-8">
      {/* Welcome Section with Gamification */}
      <div className="glass-effect-dark rounded-2xl md:rounded-3xl p-4 md:p-8 border border-purple-200">
        <div className="flex flex-col lg:flex-row items-start justify-between mb-6 md:mb-8">
          <div className="flex-1 w-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-4 md:mb-4">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 md:h-8 md:w-8 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl md:text-3xl font-bold text-gray-800 mb-1">
                  Welcome back, {user?.firstName || user?.name || 'Fashionista'}! ✨
                </h2>
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
                  <div className="flex items-center space-x-2">
                    <Crown className="h-4 w-4 md:h-5 md:w-5 text-purple-600" />
                    <span className="text-purple-600 font-semibold text-sm md:text-base">Level {userLevel}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Flame className="h-4 w-4 md:h-5 md:w-5 text-orange-500" />
                    <span className="text-orange-600 font-semibold text-sm md:text-base">{dailyStreak} day streak</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* XP Progress Bar */}
            <div className="mb-4 md:mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs md:text-sm text-gray-600">Progress to Level {userLevel + 1}</span>
                <span className="text-xs md:text-sm text-gray-600">{userXP}/3000 XP</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 md:h-3">
                <div 
                  className="xp-bar h-2 md:h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(userXP / 3000) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <p className="text-gray-600 text-sm md:text-lg">
              Ready to discover your perfect style? Complete challenges to earn XP and unlock new features!
            </p>
          </div>
          
          <div className="hidden lg:block mt-4 lg:mt-0">
            <div className="p-4 md:p-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-lg">
              <Award className="h-12 w-12 md:h-16 md:w-16 text-white mx-auto" />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          <div className="glass-effect rounded-xl md:rounded-2xl p-3 md:p-6 text-center border border-purple-100 hover-lift">
            <div className="text-xl md:text-3xl font-bold text-purple-600 mb-1 md:mb-2">127</div>
            <div className="text-gray-600 text-xs md:text-base">Outfits Created</div>
            <div className="text-xs text-green-600 mt-1">+12 this week</div>
          </div>
          <div className="glass-effect rounded-xl md:rounded-2xl p-3 md:p-6 text-center border border-blue-100 hover-lift">
            <div className="text-xl md:text-3xl font-bold text-blue-600 mb-1 md:mb-2">94%</div>
            <div className="text-gray-600 text-xs md:text-base">Style Match</div>
            <div className="text-xs text-green-600 mt-1">+2% improved</div>
          </div>
          <div className="glass-effect rounded-xl md:rounded-2xl p-3 md:p-6 text-center border border-pink-100 hover-lift">
            <div className="text-xl md:text-3xl font-bold text-pink-600 mb-1 md:mb-2">23</div>
            <div className="text-gray-600 text-xs md:text-base">Saved Favorites</div>
            <div className="text-xs text-green-600 mt-1">+5 today</div>
          </div>
          <div className="glass-effect rounded-xl md:rounded-2xl p-3 md:p-6 text-center border border-emerald-100 hover-lift">
            <div className="text-xl md:text-3xl font-bold text-emerald-600 mb-1 md:mb-2">{userXP}</div>
            <div className="text-gray-600 text-xs md:text-base">Total XP</div>
            <div className="text-xs text-green-600 mt-1">+75 today</div>
          </div>
        </div>
      </div>

      {/* Daily Challenges */}
      <div className="glass-effect-dark rounded-2xl md:rounded-3xl p-4 md:p-8 border border-purple-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 md:mb-6">
          <h3 className="text-lg md:text-2xl font-semibold text-gray-800 flex items-center mb-2 sm:mb-0">
            <Target className="mr-2 md:mr-3 h-5 w-5 md:h-6 md:w-6 text-purple-600" />
            Daily Challenges
          </h3>
          <div className="flex items-center space-x-2 text-xs md:text-sm text-gray-600">
            <Clock className="h-3 w-3 md:h-4 md:w-4" />
            <span>Resets in 8h 32m</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {dailyChallenges.map((challenge) => (
            <div key={challenge.id} className={`glass-effect rounded-xl md:rounded-2xl p-4 md:p-6 border transition-all duration-300 hover-lift ${
              challenge.completed ? 'border-green-200 bg-green-50' : 'border-gray-200'
            }`}>
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <h4 className="font-semibold text-gray-800 text-sm md:text-base">{challenge.title}</h4>
                <div className="flex items-center space-x-1 text-purple-600">
                  <Zap className="h-3 w-3 md:h-4 md:w-4" />
                  <span className="text-xs md:text-sm font-medium">+{challenge.xp} XP</span>
                </div>
              </div>
              
              <div className="mb-3 md:mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs md:text-sm text-gray-600">Progress</span>
                  <span className="text-xs md:text-sm text-gray-600">{challenge.progress}/{challenge.total}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 md:h-2">
                  <div 
                    className={`h-1.5 md:h-2 rounded-full transition-all duration-500 ${
                      challenge.completed ? 'bg-green-500' : 'bg-purple-500'
                    }`}
                    style={{ width: `${(challenge.progress / challenge.total) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              {challenge.completed ? (
                <div className="flex items-center justify-center text-green-600 font-medium text-sm">
                  <Trophy className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                  Completed!
                </div>
              ) : (
                <button 
                  onClick={() => completeChallenge(challenge.id)}
                  className="w-full btn-primary text-xs md:text-sm py-2"
                >
                  Complete Challenge
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* AI Style Analysis */}
      <div className="glass-effect-dark rounded-2xl md:rounded-3xl p-4 md:p-8 border border-purple-200">
        <h3 className="text-lg md:text-2xl font-semibold text-gray-800 mb-6 md:mb-8 flex items-center">
          <Camera className="mr-2 md:mr-3 h-5 w-5 md:h-6 md:w-6 text-purple-600" />
          AI Style Analysis
          <div className="ml-2 md:ml-3 px-2 md:px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs md:text-sm font-medium">
            +50 XP per analysis
          </div>
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Upload Area */}
          <div>
            <div className="border-2 border-dashed border-purple-300 rounded-xl md:rounded-2xl p-6 md:p-12 text-center hover:border-purple-400 transition-all duration-300 bg-gradient-to-br from-purple-50 to-pink-50">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <Upload className="mx-auto h-12 w-12 md:h-16 md:w-16 text-purple-500 mb-4 md:mb-6" />
                <p className="text-gray-800 text-lg md:text-xl font-semibold mb-2 md:mb-3">Upload Your Photo</p>
                <p className="text-gray-600 text-sm md:text-lg">Upload a full-body photo for accurate analysis</p>
                <div className="mt-4 md:mt-6">
                  <span className="btn-primary inline-flex items-center space-x-2 text-sm md:text-base">
                    <span>Choose Photo</span>
                    <Camera className="h-3 w-3 md:h-4 md:w-4" />
                  </span>
                </div>
              </label>
            </div>

            {uploadedImage && (
              <div className="mt-6 md:mt-8">
                <img 
                  src={uploadedImage} 
                  alt="Uploaded" 
                  className="w-full max-w-sm mx-auto rounded-xl md:rounded-2xl shadow-2xl border-4 border-white"
                />
              </div>
            )}
          </div>

          {/* Analysis Results */}
          <div>
            {bodyAnalysis ? (
              <div className="glass-effect rounded-xl md:rounded-2xl p-6 md:p-8 border border-purple-200">
                <div className="flex items-center justify-between mb-4 md:mb-6">
                  <h4 className="text-lg md:text-xl font-semibold text-gray-800">Analysis Results</h4>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 md:w-3 md:h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-600 font-medium text-sm md:text-base">{bodyAnalysis.confidence}% Match</span>
                  </div>
                </div>
                
                <div className="space-y-4 md:space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    <div className="glass-effect rounded-lg md:rounded-xl p-3 md:p-4 border border-purple-100">
                      <p className="text-purple-600 font-medium mb-1 text-sm md:text-base">Body Type</p>
                      <p className="text-gray-800 text-base md:text-lg font-semibold">{bodyAnalysis.bodyType}</p>
                    </div>
                    <div className="glass-effect rounded-lg md:rounded-xl p-3 md:p-4 border border-blue-100">
                      <p className="text-blue-600 font-medium mb-1 text-sm md:text-base">Color Profile</p>
                      <p className="text-gray-800 text-base md:text-lg font-semibold">{bodyAnalysis.colorProfile}</p>
                    </div>
                  </div>
                  
                  <div className="glass-effect rounded-lg md:rounded-xl p-3 md:p-4 border border-emerald-100">
                    <p className="text-emerald-600 font-medium mb-2 text-sm md:text-base">Style Personality</p>
                    <p className="text-gray-800 text-base md:text-lg font-semibold">{bodyAnalysis.stylePersonality}</p>
                  </div>
                  
                  <div>
                    <p className="text-purple-600 font-medium mb-2 md:mb-3 text-sm md:text-base">Recommended Colors</p>
                    <div className="flex flex-wrap gap-2">
                      {bodyAnalysis.recommendedColors.map((color, index) => (
                        <span key={index} className="bg-gradient-to-r from-purple-500 to-pink-500 px-3 md:px-4 py-1 md:py-2 rounded-full text-white text-xs md:text-sm font-medium">
                          {color}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="glass-effect rounded-lg md:rounded-xl p-3 md:p-4 border border-gray-200">
                    <p className="text-purple-600 font-medium mb-2 text-sm md:text-base">Personal Recommendations</p>
                    <p className="text-gray-700 leading-relaxed text-sm md:text-base">{bodyAnalysis.recommendations}</p>
                  </div>
                  
                  <div className="flex items-center justify-center text-green-600 font-medium text-sm md:text-base">
                    <Zap className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                    +50 XP Earned!
                  </div>
                </div>
              </div>
            ) : uploadedImage ? (
              <div className="glass-effect rounded-xl md:rounded-2xl p-6 md:p-8 text-center border border-purple-200">
                <div className="loading-spinner mx-auto mb-4 md:mb-6"></div>
                <p className="text-gray-800 text-lg md:text-xl font-semibold mb-2">Analyzing your photo...</p>
                <p className="text-gray-600 text-sm md:text-base">Our AI is processing your style profile</p>
              </div>
            ) : (
              <div className="glass-effect rounded-xl md:rounded-2xl p-6 md:p-8 text-center border border-gray-200">
                <Camera className="mx-auto h-12 w-12 md:h-16 md:w-16 text-gray-400 mb-4 md:mb-6" />
                <p className="text-gray-600 text-lg md:text-xl mb-2">Upload a photo to get started</p>
                <p className="text-gray-500 text-sm md:text-base">See your personalized style analysis and recommendations</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Trending Recommendations */}
      <div className="glass-effect-dark rounded-2xl md:rounded-3xl p-4 md:p-8 border border-purple-200">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <h3 className="text-lg md:text-2xl font-semibold text-gray-800">Trending for You</h3>
          <Link to="#" className="text-purple-600 hover:text-purple-700 font-medium flex items-center text-sm md:text-base">
            View All <ArrowRight className="ml-2 h-3 w-3 md:h-4 md:w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          {sampleClothes.slice(0, 4).map((item) => (
            <div key={item.id} className="glass-effect rounded-xl md:rounded-2xl p-3 md:p-4 hover-lift group border border-gray-200">
              <div className="relative mb-3 md:mb-4">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-32 md:h-48 object-cover rounded-lg md:rounded-xl"
                />
                <div className="absolute top-2 md:top-3 right-2 md:right-3 flex space-x-1 md:space-x-2">
                  <button 
                    onClick={() => likeItem(item.id)}
                    className="p-1.5 md:p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-200 shadow-lg"
                  >
                    <Heart className="h-3 w-3 md:h-4 md:w-4 text-red-500" />
                  </button>
                  <button className="p-1.5 md:p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-200 shadow-lg">
                    <Bookmark className="h-3 w-3 md:h-4 md:w-4 text-purple-600" />
                  </button>
                </div>
                {item.trending && (
                  <div className="absolute top-2 md:top-3 left-2 md:left-3 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-1.5 md:px-2 py-0.5 md:py-1 rounded-full flex items-center">
                    <TrendingUp className="h-2 w-2 md:h-3 md:w-3 mr-0.5 md:mr-1" />
                    Trending
                  </div>
                )}
                {item.discount && (
                  <div className="absolute bottom-2 md:bottom-3 left-2 md:left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-1.5 md:px-2 py-0.5 md:py-1 rounded-full">
                    {item.discount}
                  </div>
                )}
              </div>
              
              <div className="space-y-1 md:space-y-2">
                <h4 className="text-gray-800 font-semibold text-xs md:text-sm truncate">{item.name}</h4>
                <p className="text-purple-600 text-xs md:text-sm">{item.brand}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 md:space-x-2">
                    <span className="text-gray-800 font-bold text-xs md:text-sm">{item.price}</span>
                    {item.originalPrice && (
                      <span className="text-gray-400 text-xs line-through">{item.originalPrice}</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-2 w-2 md:h-3 md:w-3 text-yellow-400 fill-current" />
                    <span className="text-gray-700 text-xs">{item.rating}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <ThumbsUp className="h-2 w-2 md:h-3 md:w-3" />
                    <span>{item.likes}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="h-2 w-2 md:h-3 md:w-3" />
                    <span>{item.views}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCatalog = () => (
    <div className="space-y-6 md:space-y-8">
      {/* Search and Filters */}
      <div className="glass-effect-dark rounded-xl md:rounded-2xl p-4 md:p-6 border border-purple-200">
        <div className="flex flex-col lg:flex-row gap-3 md:gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for clothes, brands, or styles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input pl-10 md:pl-12 text-sm md:text-base"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
            <select
              value={selectedOccasion}
              onChange={(e) => setSelectedOccasion(e.target.value)}
              className="form-input pl-8 md:pl-10 pr-6 md:pr-8 appearance-none min-w-[120px] md:min-w-[150px] text-sm md:text-base"
            >
              <option value="">All Occasions</option>
              {occasions.map((occasion) => (
                <option key={occasion} value={occasion}>
                  {occasion}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">
          {filteredClothes.length} items found
          {selectedOccasion && <span className="text-purple-600"> for {selectedOccasion}</span>}
        </h2>
        <div className="flex items-center space-x-3 md:space-x-4">
          <span className="text-gray-600 text-sm md:text-base">Sort by:</span>
          <select className="form-input py-2 px-3 min-w-[120px] md:min-w-[150px] text-sm md:text-base">
            <option value="relevance">Relevance</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="trending">Trending</option>
          </select>
        </div>
      </div>

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
        {filteredClothes.map((item) => (
          <div key={item.id} className="glass-effect-dark rounded-xl md:rounded-2xl p-4 md:p-6 hover-lift group border border-purple-200">
            <div className="relative mb-4 md:mb-6">
              <img 
                src={item.image} 
                alt={item.name}
                className="w-full h-48 md:h-80 object-cover rounded-lg md:rounded-xl"
              />
              <div className="absolute top-3 md:top-4 right-3 md:right-4 flex space-x-2">
                <button 
                  onClick={() => likeItem(item.id)}
                  className="p-2 md:p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-200 shadow-lg opacity-0 group-hover:opacity-100"
                >
                  <Heart className="h-4 w-4 md:h-5 md:w-5 text-red-500" />
                </button>
                <button className="p-2 md:p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-200 shadow-lg opacity-0 group-hover:opacity-100">
                  <Share2 className="h-4 w-4 md:h-5 md:w-5 text-purple-600" />
                </button>
              </div>
              {item.trending && (
                <div className="absolute top-3 md:top-4 left-3 md:left-4 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs md:text-sm font-bold px-2 md:px-3 py-1 rounded-full flex items-center">
                  <TrendingUp className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                  Trending
                </div>
              )}
              {item.discount && (
                <div className="absolute bottom-3 md:bottom-4 left-3 md:left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs md:text-sm font-bold px-2 md:px-3 py-1 rounded-full">
                  {item.discount}
                </div>
              )}
            </div>
            
            <div className="space-y-3 md:space-y-4">
              <div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-1">{item.name}</h3>
                <p className="text-purple-600 font-medium text-sm md:text-base">{item.brand}</p>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 md:space-x-3">
                  <span className="text-xl md:text-2xl font-bold text-gray-800">{item.price}</span>
                  {item.originalPrice && (
                    <span className="text-gray-400 line-through text-sm md:text-base">{item.originalPrice}</span>
                  )}
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-3 w-3 md:h-4 md:w-4 text-yellow-400 fill-current" />
                  <span className="text-gray-700 font-medium text-sm md:text-base">{item.rating}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <span className="bg-purple-100 text-purple-700 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium">
                  {item.occasion}
                </span>
              </div>
              
              <p className="text-gray-600 text-xs md:text-sm leading-relaxed">{item.fit}</p>
              
              <div className="flex items-center justify-between text-xs md:text-sm text-gray-500">
                <div className="flex items-center space-x-3 md:space-x-4">
                  <div className="flex items-center space-x-1">
                    <ThumbsUp className="h-3 w-3 md:h-4 md:w-4" />
                    <span>{item.likes}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="h-3 w-3 md:h-4 md:w-4" />
                    <span>{item.views}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="h-3 w-3 md:h-4 md:w-4" />
                    <span>12</span>
                  </div>
                </div>
              </div>
              
              <button className="w-full btn-primary flex items-center justify-center space-x-2 hover-lift text-sm md:text-base">
                <ShoppingBag className="h-4 w-4 md:h-5 md:w-5" />
                <span>Try This Style</span>
                <span className="text-xs md:text-sm">+10 XP</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderChallenges = () => (
    <div className="space-y-6 md:space-y-8">
      <div className="glass-effect-dark rounded-2xl md:rounded-3xl p-4 md:p-8 border border-purple-200">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-6 flex items-center">
          <Target className="mr-2 md:mr-3 h-6 w-6 md:h-8 md:w-8 text-purple-600" />
          Style Challenges
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {[
            { title: 'Color Harmony Master', description: 'Create 5 outfits using complementary colors', xp: 200, difficulty: 'Medium', timeLeft: '2 days' },
            { title: 'Seasonal Stylist', description: 'Build a complete spring wardrobe', xp: 500, difficulty: 'Hard', timeLeft: '1 week' },
            { title: 'Mix & Match Pro', description: 'Create 10 different looks with 5 pieces', xp: 150, difficulty: 'Easy', timeLeft: '3 days' },
            { title: 'Trend Spotter', description: 'Identify and try 3 current fashion trends', xp: 300, difficulty: 'Medium', timeLeft: '5 days' },
            { title: 'Budget Fashionista', description: 'Create stylish looks under $100', xp: 250, difficulty: 'Medium', timeLeft: '4 days' },
            { title: 'Occasion Expert', description: 'Style outfits for 7 different occasions', xp: 400, difficulty: 'Hard', timeLeft: '1 week' }
          ].map((challenge, index) => (
            <div key={index} className="glass-effect rounded-xl md:rounded-2xl p-4 md:p-6 border border-purple-200 hover-lift">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <div className={`px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium ${
                  challenge.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                  challenge.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {challenge.difficulty}
                </div>
                <div className="flex items-center space-x-1 text-purple-600">
                  <Zap className="h-3 w-3 md:h-4 md:w-4" />
                  <span className="font-semibold text-xs md:text-sm">+{challenge.xp} XP</span>
                </div>
              </div>
              
              <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-2">{challenge.title}</h3>
              <p className="text-gray-600 mb-3 md:mb-4 text-sm md:text-base">{challenge.description}</p>
              
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <div className="flex items-center space-x-1 text-xs md:text-sm text-gray-500">
                  <Clock className="h-3 w-3 md:h-4 md:w-4" />
                  <span>{challenge.timeLeft} left</span>
                </div>
              </div>
              
              <button className="w-full btn-primary text-sm md:text-base">
                Start Challenge
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAchievements = () => (
    <div className="space-y-6 md:space-y-8">
      <div className="glass-effect-dark rounded-2xl md:rounded-3xl p-4 md:p-8 border border-purple-200">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-6 flex items-center">
          <Trophy className="mr-2 md:mr-3 h-6 w-6 md:h-8 md:w-8 text-purple-600" />
          Your Achievements
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {[
            { name: 'Style Pioneer', description: 'Created your first outfit', icon: '🎨', earned: true, rarity: 'Common' },
            { name: 'Color Expert', description: 'Mastered color coordination', icon: '🌈', earned: true, rarity: 'Rare' },
            { name: 'Trendsetter', description: 'Followed 10 trending styles', icon: '✨', earned: true, rarity: 'Epic' },
            { name: 'Fashion Guru', description: 'Reached 90% style score', icon: '👑', earned: true, rarity: 'Legendary' },
            { name: 'Wardrobe Master', description: 'Added 50+ items to wardrobe', icon: '👗', earned: false, rarity: 'Rare' },
            { name: 'Social Butterfly', description: 'Shared 20 outfits', icon: '🦋', earned: false, rarity: 'Common' },
            { name: 'Challenge Champion', description: 'Completed 25 challenges', icon: '🏆', earned: false, rarity: 'Epic' },
            { name: 'Style Influencer', description: 'Got 1000+ likes on outfits', icon: '⭐', earned: false, rarity: 'Legendary' }
          ].map((achievement, index) => (
            <div
              key={index}
              className={`rounded-xl md:rounded-2xl p-4 md:p-6 border transition-all duration-300 hover-lift ${
                achievement.earned
                  ? achievement.rarity === 'Legendary' ? 'bg-gradient-to-br from-yellow-100 to-orange-100 border-yellow-300 achievement-glow' :
                    achievement.rarity === 'Epic' ? 'bg-gradient-to-br from-purple-100 to-pink-100 border-purple-300' :
                    achievement.rarity === 'Rare' ? 'bg-gradient-to-br from-blue-100 to-cyan-100 border-blue-300' :
                    'bg-gradient-to-br from-green-100 to-emerald-100 border-green-300'
                  : 'glass-effect border-gray-200'
              }`}
            >
              <div className="text-center">
                <div className={`text-4xl md:text-6xl mb-3 md:mb-4 ${achievement.earned ? '' : 'grayscale opacity-50'}`}>
                  {achievement.icon}
                </div>
                <div className={`inline-block px-2 md:px-3 py-1 rounded-full text-xs font-medium mb-2 md:mb-3 ${
                  achievement.rarity === 'Legendary' ? 'bg-yellow-200 text-yellow-800' :
                  achievement.rarity === 'Epic' ? 'bg-purple-200 text-purple-800' :
                  achievement.rarity === 'Rare' ? 'bg-blue-200 text-blue-800' :
                  'bg-green-200 text-green-800'
                }`}>
                  {achievement.rarity}
                </div>
                <h4 className={`text-base md:text-lg font-semibold mb-2 ${achievement.earned ? 'text-gray-800' : 'text-gray-400'}`}>
                  {achievement.name}
                </h4>
                <p className={`text-xs md:text-sm ${achievement.earned ? 'text-gray-600' : 'text-gray-500'}`}>
                  {achievement.description}
                </p>
                {achievement.earned && (
                  <div className="mt-3 md:mt-4">
                    <span className="inline-flex items-center px-2 md:px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-medium rounded-full">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="glass-effect sticky top-0 z-50 backdrop-blur-xl border-b border-purple-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 md:space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 text-gray-600 hover:bg-purple-50 rounded-lg sidebar-toggle"
              >
                {sidebarOpen ? <X className="h-5 w-5 md:h-6 md:w-6" /> : <Menu className="h-5 w-5 md:h-6 md:w-6" />}
              </button>
              
              <div className="flex items-center space-x-2 md:space-x-3">
                <div className="p-1.5 md:p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg md:rounded-xl shadow-lg">
                  <Sparkles className="h-5 w-5 md:h-8 md:w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-lg md:text-2xl font-bold text-gray-800">GYF Dashboard</h1>
                  <p className="text-gray-600 text-xs md:text-sm hidden sm:block">Get Your Fashion</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 md:space-x-4">
              <div className="relative">
                <button className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors relative">
                  <Bell className="h-4 w-4 md:h-5 md:w-5" />
                  {notifications.length > 0 && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 md:w-3 md:h-3 bg-red-500 rounded-full"></div>
                  )}
                </button>
              </div>
              
              <div className="flex items-center space-x-2 md:space-x-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 md:h-5 md:w-5 text-white" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-gray-800 font-medium text-sm md:text-base">{user?.firstName || user?.name || user?.email || 'User'}</p>
                  <div className="flex items-center space-x-2">
                    <Crown className="h-2 w-2 md:h-3 md:w-3 text-purple-600" />
                    <p className="text-gray-600 text-xs md:text-sm">Level {userLevel}</p>
                  </div>
                </div>
              </div>
              
              <Link
                to="/profile"
                className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
              >
                <Settings className="h-4 w-4 md:h-5 md:w-5" />
              </Link>
              
              <button
                onClick={logout}
                className="flex items-center space-x-1 md:space-x-2 px-2 md:px-4 py-1.5 md:py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all duration-200"
              >
                <LogOut className="h-3 w-3 md:h-4 md:w-4" />
                <span className="hidden sm:inline text-xs md:text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-40 w-56 md:w-64 glass-effect backdrop-blur-xl border-r border-purple-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 sidebar ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex flex-col h-full pt-16 lg:pt-4 md:pt-6">
            <nav className="flex-1 px-3 md:px-4 space-y-1 md:space-y-2">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center space-x-2 md:space-x-3 px-3 md:px-4 py-2 md:py-3 rounded-lg md:rounded-xl font-medium transition-all duration-200 text-sm md:text-base ${
                    activeTab === item.id
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                  }`}
                >
                  <item.icon className="h-4 w-4 md:h-5 md:w-5" />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
            
            <div className="p-3 md:p-4 border-t border-purple-200">
              <Link
                to="/wardrobe"
                className="w-full flex items-center space-x-2 md:space-x-3 px-3 md:px-4 py-2 md:py-3 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg md:rounded-xl font-medium transition-all duration-200 text-sm md:text-base"
              >
                <User className="h-4 w-4 md:h-5 md:w-5" />
                <span>My Wardrobe</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/20 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 lg:ml-0">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-8">
            {activeTab === 'home' && renderHome()}
            {activeTab === 'catalog' && renderCatalog()}
            {activeTab === 'challenges' && renderChallenges()}
            {activeTab === 'achievements' && renderAchievements()}
            {activeTab === 'trending' && (
              <div className="text-center py-12 md:py-20">
                <TrendingUp className="h-12 w-12 md:h-16 md:w-16 text-purple-500 mx-auto mb-4" />
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">Trending Styles</h2>
                <p className="text-gray-600 text-sm md:text-base">Discover the latest fashion trends personalized for you.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;