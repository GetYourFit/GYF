import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, User, Mail, Lock, Eye, EyeOff, ArrowLeft, CheckCircle, Phone, Calendar, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    PhoneNumber: '',
    Gender: '',
    DOB: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
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

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.PhoneNumber.trim()) {
      newErrors.PhoneNumber = 'Phone number is required';
    }

    if (!formData.Gender) {
      newErrors.Gender = 'Gender is required';
    }

    if (!formData.DOB) {
      newErrors.DOB = 'Date of birth is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      const { confirmPassword, ...registrationData } = formData;
      await register(registrationData);
      
      // Redirect to dashboard after successful registration
      navigate('/dashboard');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      setErrors({ submit: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 md:w-96 md:h-96 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        <div className="glass-effect-dark rounded-3xl p-6 md:p-8 shadow-2xl animate-fade-in-up border border-purple-200">
          {/* Header */}
          <div className="text-center mb-6 md:mb-8">
            <div className="flex justify-center mb-4 md:mb-6">
              <div className="p-3 md:p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-lg">
                <Sparkles className="h-8 w-8 md:h-12 md:w-12 text-white" />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 md:mb-3">Join GYF</h2>
            <p className="text-gray-600 text-base md:text-lg">Create your account to get started</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2 md:mb-3">
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="form-input pl-10 md:pl-12 text-sm md:text-base"
                    placeholder="First name"
                  />
                </div>
                {errors.firstName && <p className="mt-1 md:mt-2 text-red-500 text-xs md:text-sm">{errors.firstName}</p>}
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2 md:mb-3">
                  Last Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="form-input pl-10 md:pl-12 text-sm md:text-base"
                    placeholder="Last name"
                  />
                </div>
                {errors.lastName && <p className="mt-1 md:mt-2 text-red-500 text-xs md:text-sm">{errors.lastName}</p>}
              </div>
            </div>

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

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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
                    placeholder="Create password"
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

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2 md:mb-3">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="form-input pl-10 md:pl-12 pr-10 md:pr-12 text-sm md:text-base"
                    placeholder="Confirm password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4 md:h-5 md:w-5" /> : <Eye className="h-4 w-4 md:h-5 md:w-5" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="mt-1 md:mt-2 text-red-500 text-xs md:text-sm">{errors.confirmPassword}</p>}
              </div>
            </div>

            {/* Phone and Gender */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2 md:mb-3">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                  <input
                    type="tel"
                    name="PhoneNumber"
                    value={formData.PhoneNumber}
                    onChange={handleChange}
                    className="form-input pl-10 md:pl-12 text-sm md:text-base"
                    placeholder="Phone number"
                  />
                </div>
                {errors.PhoneNumber && <p className="mt-1 md:mt-2 text-red-500 text-xs md:text-sm">{errors.PhoneNumber}</p>}
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2 md:mb-3">
                  Gender
                </label>
                <div className="relative">
                  <Users className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                  <select
                    name="Gender"
                    value={formData.Gender}
                    onChange={handleChange}
                    className="form-input pl-10 md:pl-12 text-sm md:text-base appearance-none"
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
                {errors.Gender && <p className="mt-1 md:mt-2 text-red-500 text-xs md:text-sm">{errors.Gender}</p>}
              </div>
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2 md:mb-3">
                Date of Birth
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                <input
                  type="date"
                  name="DOB"
                  value={formData.DOB}
                  onChange={handleChange}
                  className="form-input pl-10 md:pl-12 text-sm md:text-base"
                />
              </div>
              {errors.DOB && <p className="mt-1 md:mt-2 text-red-500 text-xs md:text-sm">{errors.DOB}</p>}
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                required
              />
              <label htmlFor="terms" className="text-xs md:text-sm text-gray-600">
                I agree to the{' '}
                <Link to="#" className="text-purple-600 hover:text-purple-700 font-medium">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="#" className="text-purple-600 hover:text-purple-700 font-medium">
                  Privacy Policy
                </Link>
              </label>
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
                  <span>Creating Account...</span>
                </div>
              ) : (
                'Create Account'
              )}
            </button>

            {errors.submit && <p className="text-red-500 text-xs md:text-sm text-center">{errors.submit}</p>}
          </form>

          {/* Benefits */}
          <div className="mt-4 md:mt-6 p-3 md:p-4 glass-effect rounded-2xl border border-purple-100">
            <h4 className="text-xs md:text-sm font-semibold text-gray-800 mb-2 md:mb-3">What you'll get:</h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                'AI-powered style analysis',
                'Personalized recommendations',
                'Gamified fashion experience',
                'Access to exclusive content'
              ].map((benefit, index) => (
                <div key={index} className="flex items-center space-x-2 text-xs md:text-sm text-gray-600">
                  <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-green-500 flex-shrink-0" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Login Link */}
          <div className="mt-6 md:mt-8 text-center">
            <p className="text-gray-600 text-sm md:text-base">
              Already have an account?{' '}
              <Link to="/login" className="text-purple-600 hover:text-purple-700 font-semibold transition-colors duration-200">
                Sign in
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

export default Register;