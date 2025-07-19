import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      await login(formData);
      
      // Redirect to dashboard after successful login
      navigate('/dashboard');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Invalid email or password. Please try again.';
      setErrors({ submit: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 flex items-center justify-center p-4 md:p-6 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 md:w-96 md:h-96 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="glass-effect-dark rounded-3xl p-6 md:p-8 shadow-2xl animate-fade-in-up border border-purple-200">
          {/* Header */}
          <div className="text-center mb-6 md:mb-8">
            <div className="flex justify-center mb-4 md:mb-6">
              <div className="p-3 md:p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-lg">
                <Sparkles className="h-8 w-8 md:h-12 md:w-12 text-white" />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 md:mb-3">Welcome Back</h2>
            <p className="text-gray-600 text-base md:text-lg">Sign in to your GYF account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2 md:mb-3">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input pl-10 md:pl-12 text-sm md:text-base"
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && <p className="mt-1 md:mt-2 text-red-500 text-xs md:text-sm">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2 md:mb-3">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input pl-10 md:pl-12 pr-10 md:pr-12 text-sm md:text-base"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  {showPassword ? <EyeOff className="h-4 w-4 md:h-5 md:w-5" /> : <Eye className="h-4 w-4 md:h-5 md:w-5" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 md:mt-2 text-red-500 text-xs md:text-sm">{errors.password}</p>}
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <Link to="#" className="text-purple-600 hover:text-purple-700 text-xs md:text-sm font-medium transition-colors duration-200">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary text-base md:text-lg py-3 md:py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="loading-spinner"></div>
                  <span>Signing In...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </button>

            {errors.submit && <p className="text-red-500 text-xs md:text-sm text-center">{errors.submit}</p>}
          </form>

          {/* Register Link */}
          <div className="mt-6 md:mt-8 text-center">
            <p className="text-gray-600 text-sm md:text-base">
              Don't have an account?{' '}
              <Link to="/register" className="text-purple-600 hover:text-purple-700 font-semibold transition-colors duration-200">
                Sign up for free
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-4 md:mt-6">
          <Link to="/" className="text-gray-600 hover:text-gray-800 transition-colors duration-200 flex items-center justify-center space-x-2 text-sm md:text-base">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;