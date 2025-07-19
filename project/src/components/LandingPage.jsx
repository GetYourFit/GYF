import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, Zap, Camera, Search, Heart, Star, ArrowRight, Play, 
  CheckCircle, Users, Award, TrendingUp, Target, Trophy, Flame,
  BarChart3, Palette, Wand2, Rocket, Crown, Gift, Menu, X
} from 'lucide-react';

const LandingPage = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [stats, setStats] = useState({ users: 0, matches: 0, accuracy: 0 });
  const [isVisible, setIsVisible] = useState({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Animate stats counter
    const animateStats = () => {
      const duration = 2000;
      const steps = 60;
      const stepDuration = duration / steps;
      
      const targets = { users: 50000, matches: 1000000, accuracy: 98 };
      let current = { users: 0, matches: 0, accuracy: 0 };
      
      const timer = setInterval(() => {
        current.users = Math.min(current.users + targets.users / steps, targets.users);
        current.matches = Math.min(current.matches + targets.matches / steps, targets.matches);
        current.accuracy = Math.min(current.accuracy + targets.accuracy / steps, targets.accuracy);
        
        setStats({
          users: Math.floor(current.users),
          matches: Math.floor(current.matches),
          accuracy: Math.floor(current.accuracy)
        });
        
        if (current.users >= targets.users) {
          clearInterval(timer);
        }
      }, stepDuration);
    };

    const timer = setTimeout(animateStats, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[data-animate]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: Camera,
      title: "AI Style Analysis",
      description: "Upload your photo and our advanced AI analyzes your body type, skin tone, and style preferences with 98% accuracy",
      color: "from-purple-500 to-pink-500",
      stats: "2M+ analyses completed"
    },
    {
      icon: Search,
      title: "Smart Catalog",
      description: "Browse thousands of curated fashion items matched to your unique style profile from top brands worldwide",
      color: "from-blue-500 to-cyan-500",
      stats: "500K+ items available"
    },
    {
      icon: Heart,
      title: "Perfect Occasions",
      description: "Get personalized outfit recommendations for work, dates, parties, and special events with seasonal updates",
      color: "from-pink-500 to-rose-500",
      stats: "50+ occasion types"
    },
    {
      icon: TrendingUp,
      title: "Style Evolution",
      description: "Track your style journey, discover new trends, and level up your fashion game with our gamified system",
      color: "from-emerald-500 to-teal-500",
      stats: "Daily trend updates"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Fashion Enthusiast",
      level: "Style Expert",
      image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      quote: "GYF completely transformed how I shop for clothes. The recommendations are incredibly accurate!",
      rating: 5,
      achievements: 12
    },
    {
      name: "Michael Chen",
      role: "Business Professional",
      level: "Trendsetter",
      image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      quote: "Finally found my perfect business wardrobe. GYF's AI knows exactly what works for my body type.",
      rating: 5,
      achievements: 8
    },
    {
      name: "Emma Rodriguez",
      role: "Style Blogger",
      level: "Fashion Guru",
      image: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      quote: "As a style blogger, I'm impressed by GYF's ability to predict fashion trends and personal preferences.",
      rating: 5,
      achievements: 25
    }
  ];

  const gamificationFeatures = [
    {
      icon: Trophy,
      title: "Style Achievements",
      description: "Unlock badges and trophies as you explore new styles and complete fashion challenges"
    },
    {
      icon: Target,
      title: "Daily Challenges",
      description: "Complete daily style missions to earn XP and discover new fashion combinations"
    },
    {
      icon: Crown,
      title: "Level System",
      description: "Progress from Fashion Newbie to Style Guru with our comprehensive leveling system"
    },
    {
      icon: Gift,
      title: "Rewards Program",
      description: "Earn points for every interaction and redeem them for exclusive fashion content"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-48 h-48 md:w-96 md:h-96 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-48 h-48 md:w-96 md:h-96 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-48 h-48 md:w-96 md:h-96 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 glass-effect border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-lg">
                <Sparkles className="h-6 w-6 md:h-8 md:w-8 text-white" />
              </div>
              <div>
                <span className="text-2xl md:text-3xl font-bold gradient-text">GYF</span>
                <p className="text-xs md:text-sm text-gray-600 hidden md:block">Get Your Fashion</p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <a href="#features" className="nav-link">Features</a>
              <a href="#how-it-works" className="nav-link">How it Works</a>
              <a href="#testimonials" className="nav-link">Reviews</a>
              <a href="#pricing" className="nav-link">Pricing</a>
            </div>
            
            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-gray-600 hover:text-purple-600 transition-colors"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
            
            {/* Desktop Auth Buttons */}
            <div className="hidden lg:flex items-center space-x-4">
              <Link to="/login" className="btn-ghost text-sm md:text-base">
                Login
              </Link>
              <Link to="/register" className="btn-primary flex items-center space-x-2 text-sm md:text-base">
                <span>Get Started</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          
          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 border-t border-white/20">
              <div className="flex flex-col space-y-4 mt-4">
                <a href="#features" className="nav-link text-center" onClick={() => setMobileMenuOpen(false)}>Features</a>
                <a href="#how-it-works" className="nav-link text-center" onClick={() => setMobileMenuOpen(false)}>How it Works</a>
                <a href="#testimonials" className="nav-link text-center" onClick={() => setMobileMenuOpen(false)}>Reviews</a>
                <a href="#pricing" className="nav-link text-center" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
                <div className="flex flex-col space-y-2 pt-4">
                  <Link to="/login" className="btn-ghost text-center" onClick={() => setMobileMenuOpen(false)}>
                    Login
                  </Link>
                  <Link to="/register" className="btn-primary flex items-center justify-center space-x-2" onClick={() => setMobileMenuOpen(false)}>
                    <span>Get Started</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[85vh] text-center px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-fade-in-up mb-6 md:mb-8">
            <div className="inline-flex items-center px-4 md:px-6 py-2 md:py-3 glass-effect border border-purple-200 rounded-full text-purple-700 text-xs md:text-sm font-medium mb-6 md:mb-8 hover-scale">
              <Zap className="h-3 w-3 md:h-4 md:w-4 mr-2 text-purple-600" />
              AI-Powered Fashion Intelligence
              <Sparkles className="h-3 w-3 md:h-4 md:w-4 ml-2 text-pink-500" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold text-gray-800 mb-6 md:mb-8 leading-tight animate-slide-in-left">
            Get Your
            <span className="gradient-text block animate-slide-in-right" style={{ animationDelay: '0.2s' }}>
              Fashion
            </span>
            <span className="text-2xl md:text-4xl lg:text-5xl text-gray-600 block mt-2 md:mt-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              Perfect Every Time
            </span>
          </h1>
          
          <p className="text-base md:text-xl lg:text-2xl text-gray-600 mb-8 md:mb-12 max-w-4xl mx-auto leading-relaxed animate-fade-in-up px-4" style={{ animationDelay: '0.6s' }}>
            Upload your photo, discover your unique style profile, and get AI-powered fashion recommendations 
            tailored specifically for your body type, skin tone, and lifestyle. Level up your fashion game!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center mb-12 md:mb-16 animate-fade-in-up px-4" style={{ animationDelay: '0.8s' }}>
            <Link to="/register" className="btn-primary flex items-center justify-center space-x-2 md:space-x-3 text-base md:text-lg px-6 md:px-10 py-3 md:py-5">
              <Camera className="h-5 w-5 md:h-6 md:w-6" />
              <span>Start Style Analysis</span>
              <Rocket className="h-4 w-4 md:h-5 md:w-5" />
            </Link>
            <button className="btn-secondary flex items-center justify-center space-x-2 md:space-x-3 text-base md:text-lg px-6 md:px-10 py-3 md:py-5">
              <Play className="h-5 w-5 md:h-6 md:w-6" />
              <span>Watch Demo</span>
            </button>
          </div>

          {/* Animated Stats */}
          <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-3xl mx-auto mb-12 md:mb-16 animate-fade-in-up px-4" style={{ animationDelay: '1s' }}>
            <div className="text-center">
              <div className="text-2xl md:text-4xl font-bold gradient-text mb-1 md:mb-2 animate-count-up">
                {stats.users.toLocaleString()}+
              </div>
              <div className="text-gray-600 font-medium text-xs md:text-base">Happy Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-4xl font-bold gradient-text mb-1 md:mb-2 animate-count-up">
                {stats.accuracy}%
              </div>
              <div className="text-gray-600 font-medium text-xs md:text-base">Accuracy Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-4xl font-bold gradient-text mb-1 md:mb-2 animate-count-up">
                {(stats.matches / 1000000).toFixed(1)}M+
              </div>
              <div className="text-gray-600 font-medium text-xs md:text-base">Style Matches</div>
            </div>
          </div>

          {/* Floating Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto animate-fade-in-up px-4" style={{ animationDelay: '1.2s' }}>
            <div className="card-premium text-center hover-glow">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4">
                <Wand2 className="h-6 w-6 md:h-8 md:w-8 text-white" />
              </div>
              <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-1 md:mb-2">Instant Analysis</h3>
              <p className="text-gray-600 text-xs md:text-sm">Get results in under 30 seconds</p>
            </div>
            <div className="card-premium text-center hover-glow" style={{ animationDelay: '0.1s' }}>
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4">
                <BarChart3 className="h-6 w-6 md:h-8 md:w-8 text-white" />
              </div>
              <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-1 md:mb-2">Track Progress</h3>
              <p className="text-gray-600 text-xs md:text-sm">Monitor your style evolution</p>
            </div>
            <div className="card-premium text-center hover-glow" style={{ animationDelay: '0.2s' }}>
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4">
                <Palette className="h-6 w-6 md:h-8 md:w-8 text-white" />
              </div>
              <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-1 md:mb-2">Personalized</h3>
              <p className="text-gray-600 text-xs md:text-sm">Tailored just for you</p>
            </div>
          </div>
        </div>
      </div>

      {/* Gamification Section */}
      <div id="gamification" data-animate className="relative z-10 py-12 md:py-20 px-4 md:px-6 bg-gradient-to-r from-purple-100 to-pink-100">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-12 md:mb-16 ${isVisible.gamification ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <div className="inline-flex items-center px-4 md:px-6 py-2 md:py-3 glass-effect border border-purple-200 rounded-full text-purple-700 text-xs md:text-sm font-medium mb-4 md:mb-6">
              <Trophy className="h-3 w-3 md:h-4 md:w-4 mr-2" />
              Level Up Your Style Game
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 md:mb-6">
              Fashion is <span className="gradient-text">Fun</span> Again
            </h2>
            <p className="text-base md:text-xl text-gray-600 max-w-3xl mx-auto">
              Earn XP, unlock achievements, and compete with friends as you discover your perfect style
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {gamificationFeatures.map((feature, index) => (
              <div 
                key={index} 
                className={`card-premium text-center hover-lift ${isVisible.gamification ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r ${features[index]?.color || 'from-purple-500 to-pink-500'} rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6`}>
                  <feature.icon className="h-6 w-6 md:h-8 md:w-8 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2 md:mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-sm md:text-base">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Sample Achievement Showcase */}
          <div className={`mt-12 md:mt-16 text-center ${isVisible.gamification ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.5s' }}>
            <div className="inline-flex items-center space-x-3 md:space-x-4 glass-effect-dark rounded-2xl p-4 md:p-6 border border-purple-200">
              <div className="achievement-badge w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center">
                <Crown className="h-6 w-6 md:h-8 md:w-8 text-white" />
              </div>
              <div className="text-left">
                <h4 className="text-base md:text-lg font-semibold text-gray-800">Style Guru Achievement</h4>
                <p className="text-gray-600 text-sm md:text-base">Complete 50 style challenges to unlock this badge</p>
                <div className="flex items-center mt-2">
                  <div className="w-24 md:w-32 h-2 bg-gray-200 rounded-full mr-3">
                    <div className="progress-bar w-3/4 h-full rounded-full"></div>
                  </div>
                  <span className="text-xs md:text-sm text-gray-600">37/50</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" data-animate className="relative z-10 py-12 md:py-20 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-12 md:mb-16 ${isVisible.features ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 md:mb-6">
              Why Choose <span className="gradient-text">GYF</span>?
            </h2>
            <p className="text-base md:text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI-powered platform combines cutting-edge technology with fashion expertise 
              to deliver personalized style recommendations that actually work.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Feature Navigation */}
            <div className={`space-y-4 md:space-y-6 ${isVisible.features ? 'animate-slide-in-left' : 'opacity-0'}`}>
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`card-premium cursor-pointer transition-all duration-300 ${
                    activeFeature === index
                      ? 'border-purple-300 shadow-lg'
                      : 'hover:border-purple-200'
                  }`}
                  onClick={() => setActiveFeature(index)}
                >
                  <div className="flex items-start space-x-3 md:space-x-4">
                    <div className={`p-3 md:p-4 rounded-2xl bg-gradient-to-r ${feature.color} shadow-lg`}>
                      <feature.icon className="h-6 w-6 md:h-8 md:w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-1 md:mb-2">{feature.title}</h3>
                      <p className="text-gray-600 mb-2 md:mb-3 text-sm md:text-base">{feature.description}</p>
                      <div className="inline-flex items-center px-2 md:px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs md:text-sm font-medium">
                        {feature.stats}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Feature Showcase */}
            <div className={`card-premium h-64 md:h-96 flex items-center justify-center ${isVisible.features ? 'animate-slide-in-right' : 'opacity-0'}`}>
              <div className="text-center">
                <div className={`inline-flex p-6 md:p-8 rounded-3xl bg-gradient-to-r ${features[activeFeature].color} mb-4 md:mb-6 shadow-2xl hover-scale`}>
                  {React.createElement(features[activeFeature].icon, { className: "h-12 w-12 md:h-16 md:w-16 text-white" })}
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 md:mb-4">{features[activeFeature].title}</h3>
                <p className="text-gray-600 text-base md:text-lg leading-relaxed">{features[activeFeature].description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div id="how-it-works" data-animate className="relative z-10 py-12 md:py-20 px-4 md:px-6 bg-gradient-to-r from-blue-50 to-cyan-50">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-12 md:mb-16 ${isVisible['how-it-works'] ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 md:mb-6">How GYF Works</h2>
            <p className="text-base md:text-xl text-gray-600 max-w-3xl mx-auto">
              Get personalized fashion recommendations in just three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                icon: Camera,
                title: "Upload Photo",
                description: "Upload a full-body photo and let our AI analyze your body type and proportions",
                color: "from-purple-500 to-pink-500"
              },
              {
                icon: Zap,
                title: "AI Analysis",
                description: "Our advanced AI determines your style profile, color palette, and fit preferences",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: Heart,
                title: "Get Recommendations",
                description: "Receive personalized outfit suggestions for any occasion or style preference",
                color: "from-emerald-500 to-teal-500"
              }
            ].map((step, index) => (
              <div 
                key={index} 
                className={`text-center ${isVisible['how-it-works'] ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="relative mb-6 md:mb-8">
                  <div className={`w-16 h-16 md:w-24 md:h-24 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center mx-auto shadow-2xl hover-scale`}>
                    <step.icon className="h-8 w-8 md:h-12 md:w-12 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 w-6 h-6 md:w-8 md:h-8 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-purple-200">
                    <span className="text-xs md:text-sm font-bold text-purple-600">{index + 1}</span>
                  </div>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 md:mb-4">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm md:text-base">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div id="testimonials" data-animate className="relative z-10 py-12 md:py-20 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-12 md:mb-16 ${isVisible.testimonials ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 md:mb-6">What Our Users Say</h2>
            <div className="flex justify-center items-center space-x-2 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-6 w-6 md:h-8 md:w-8 text-yellow-400 fill-current" />
              ))}
              <span className="text-gray-800 text-lg md:text-xl ml-3 font-semibold">4.9/5 from 50,000+ users</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className={`card-premium hover-lift ${isVisible.testimonials ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center mb-4 md:mb-6">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 md:w-16 md:h-16 rounded-full mr-3 md:mr-4 border-4 border-purple-200"
                  />
                  <div className="flex-1">
                    <h4 className="text-gray-800 font-semibold text-base md:text-lg">{testimonial.name}</h4>
                    <p className="text-gray-600 text-xs md:text-sm">{testimonial.role}</p>
                    <div className="flex items-center mt-1">
                      <div className="level-indicator px-2 py-1 rounded-full text-xs text-white font-medium">
                        {testimonial.level}
                      </div>
                      <div className="flex items-center ml-2">
                        <Trophy className="h-3 w-3 text-yellow-500 mr-1" />
                        <span className="text-xs text-gray-600">{testimonial.achievements}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 italic mb-3 md:mb-4 leading-relaxed text-sm md:text-base">"{testimonial.quote}"</p>
                <div className="flex justify-between items-center">
                  <div className="flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 md:h-4 md:w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <div className="text-xs md:text-sm text-gray-500">Verified User</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 py-12 md:py-20 px-4 md:px-6 bg-gradient-to-r from-purple-100 to-pink-100">
        <div className="max-w-4xl mx-auto text-center">
          <div className="card-premium">
            <div className="mb-6 md:mb-8">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-2xl animate-bounce-slow">
                <Sparkles className="h-8 w-8 md:h-10 md:w-10 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 md:mb-6">
                Ready to Transform Your Style?
              </h2>
              <p className="text-base md:text-xl text-gray-600 mb-6 md:mb-8 leading-relaxed">
                Join thousands of fashion-forward individuals who've discovered their perfect style with GYF.
                Start your journey today and unlock your style potential!
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4 md:mb-6">
              <Link to="/register" className="btn-primary text-base md:text-lg px-8 md:px-10 py-3 md:py-5 flex items-center justify-center space-x-2 md:space-x-3">
                <span>Start Free Analysis</span>
                <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
              </Link>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-xs md:text-sm text-gray-600">
              <div className="flex items-center">
                <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-green-500 mr-2" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-green-500 mr-2" />
                <span>Free forever</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-green-500 mr-2" />
                <span>Instant results</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 bg-gray-800 text-white py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl">
                  <Sparkles className="h-5 w-5 md:h-6 md:w-6 text-white" />
                </div>
                <span className="text-xl md:text-2xl font-bold">GYF</span>
              </div>
              <p className="text-gray-400 text-sm md:text-base">Get Your Fashion - AI-powered style recommendations for everyone.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm md:text-base">Product</h4>
              <ul className="space-y-2 text-gray-400 text-sm md:text-base">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">How it Works</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm md:text-base">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm md:text-base">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm md:text-base">Support</h4>
              <ul className="space-y-2 text-gray-400 text-sm md:text-base">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-6 md:mt-8 pt-6 md:pt-8 text-center text-gray-400 text-sm md:text-base">
            <p>&copy; 2024 GYF. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;