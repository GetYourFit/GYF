import React, { useState, useRef, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom'; // Removed this import
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, RotateCcw, Upload, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext'; // This was causing an error
import { useNavigate } from 'react-router-dom';

// Mocking useAuth hook since the context is not available in this environment.


const CameraCapture = ({ isOpen, onClose, onAnalysisComplete }) => {
  // const navigate = useNavigate(); // Removed this line
  const [imagePreview, setImagePreview] = useState(null); // For the <img src>
  const [imageFile, setImageFile] = useState(null); // For the FormData
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [budget, setBudget] = useState('');
  const [prompt, setPrompt] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // New state for submission loading
  const {token,setRecommendations} = useAuth();
  // const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileUpload = useCallback((event) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file); // Store the actual file object for submission
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === 'string') {
          setImagePreview(e.target.result); // Set the preview URL
          setShowQuestionnaire(true); // Go directly to questionnaire
        }
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!budget || !prompt.trim() || !imageFile) {
      return;
    }
    
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('pic', imageFile); // Append the file object directly
      formData.append('budget', budget);
      formData.append('prompt', prompt);

      const response = await fetch('http://localhost:3000/api/recommend/fashion', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}` // Include the token in the Authorization header
        },
        // Note: 'Content-Type' is automatically set by the browser for FormData
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const recommendationData = await response.json();
      setRecommendations(prev=> [recommendationData.data, ...(prev || [])]);


      console.log("API Response:", recommendationData);

      
      const preferences = {
        budget: budget,
        prompt: prompt,
      };

      // Pass the API response to the parent component
      onAnalysisComplete(recommendationData, preferences, prompt);
      handleClose();

    } catch (error) {
      console.error('Error submitting for recommendation:', error);
      console.error('Sorry, there was an issue generating your recommendations. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = useCallback(() => {
    setImagePreview(null);
    setImageFile(null);
    setShowQuestionnaire(false);
    setBudget('');
    setPrompt('');
    setIsSubmitting(false);
    navigate('/catalog'); // Navigate back to home on close
    onClose();
  }, [onClose]);
  
  const budgetOptions = [
      { value: '4000', label: 'Under ₹4,000', desc: 'Budget-friendly' },
      { value: '8000', label: '₹4k - ₹8k', desc: 'Moderate' },
      { value: '16000', label: '₹8k - ₹16k', desc: 'Premium' },
      { value: '30000', label: '₹16,000+', desc: 'Luxury' }
  ];
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Enhanced Backdrop */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-black/60 via-purple-900/20 to-indigo-900/40 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Enhanced Modal */}
          <motion.div
            className="relative w-full h-full sm:h-auto sm:max-h-[95vh] max-w-4xl bg-white/95 backdrop-blur-xl rounded-none sm:rounded-3xl shadow-2xl border border-white/20 overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="flex flex-col h-full">
              {/* Enhanced Header */}
              <div className="flex items-center justify-between p-4 sm:p-6 md:p-8 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shrink-0">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      AI Style Analysis
                    </h2>
                    <p className="text-gray-600 text-xs sm:text-sm">Powered by advanced computer vision</p>
                  </div>
                </div>
                <motion.button
                  onClick={handleClose}
                  className="p-3 hover:bg-gray-100 rounded-xl transition-colors group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="h-6 w-6 text-gray-500 group-hover:text-gray-700" />
                </motion.button>
              </div>

              {/* Enhanced Content with Scrolling */}
              <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 overflow-y-auto">
                {!imagePreview && (
                  <motion.div 
                    className="text-center space-y-6 max-w-lg w-full"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="relative">
                      <motion.div 
                        className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto relative overflow-hidden"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Camera className="h-12 w-12 sm:h-16 sm:w-16 text-indigo-600" />
                      </motion.div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">
                        Discover Your Perfect Style
                      </h3>
                      <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                        Our AI analyzes your photo to generate personalized recommendations.
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      <motion.label 
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 sm:py-4 rounded-2xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 cursor-pointer flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Upload className="h-6 w-6" />
                        <span>Upload Your Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </motion.label>
                    </div>

                    <div className="text-xs text-gray-500 bg-gray-50 p-4 rounded-xl">
                      <p className="font-medium mb-1">Privacy Notice:</p>
                      <p>Your photos are used for a one-time analysis and are not stored on our servers.</p>
                    </div>
                  </motion.div>
                )}

                {imagePreview && showQuestionnaire && (
                  <motion.div 
                    className="w-full max-w-2xl space-y-8"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                     <div className="text-center">
                        <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                          Almost there!
                        </h3>
                        <p className="text-gray-600 text-base sm:text-lg">
                          Just a few more details to personalize your recommendations.
                        </p>
                      </div>

                    <div className="relative w-full max-w-sm mx-auto">
                        <img
                            src={imagePreview}
                            alt="Captured"
                            className="w-full rounded-2xl shadow-xl"
                        />
                        <motion.button
                            onClick={() => { setImagePreview(null); setImageFile(null); setShowQuestionnaire(false); }}
                            className="absolute top-3 right-3 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                        >
                            <RotateCcw className="h-5 w-5" />
                        </motion.button>
                    </div>

                    <motion.form 
                      onSubmit={handleSubmit}
                      className="space-y-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="space-y-4">
                        <div>
                          <label className="block text-base sm:text-lg font-semibold text-gray-900 mb-3">
                            💰 What's your budget in Rupees (₹)?
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                            {budgetOptions.map((option) => (
                              <motion.label
                                key={option.value}
                                className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${ budget === option.value ? 'border-indigo-500 bg-indigo-50 shadow-md' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50' }`}
                                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                              >
                                <input type="radio" name="budget" value={option.value} checked={budget === option.value} onChange={(e) => setBudget(e.target.value)} className="sr-only" />
                                <div className="text-center">
                                  <div className="font-semibold text-gray-900 text-sm sm:text-base">{option.label}</div>
                                  <div className="text-xs sm:text-sm text-gray-500">{option.desc}</div>
                                </div>
                              </motion.label>
                            ))}
                          </div>
                          
                           <div className="relative my-4">
                              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                <div className="w-full border-t border-gray-300" />
                              </div>
                              <div className="relative flex justify-center">
                                <span className="bg-white/95 px-2 text-sm text-gray-500">Or</span>
                              </div>
                            </div>

                            <div>
                              <label htmlFor="custom-budget" className="sr-only">Custom budget</label>
                              <input
                                type="number"
                                name="custom-budget"
                                id="custom-budget"
                                className="w-full px-4 py-3 sm:px-6 sm:py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 resize-none text-gray-900 placeholder-gray-400"
                                placeholder="Enter a specific amount in ₹"
                                value={!budgetOptions.map(o => o.value).includes(budget) ? budget : ''}
                                onChange={(e) => setBudget(e.target.value)}
                              />
                            </div>
                        </div>

                        <div>
                          <label className="block text-base sm:text-lg font-semibold text-gray-900 mb-3">
                            ✨ Describe your style goals
                          </label>
                          <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="e.g., 'I need professional outfits for client meetings' or 'I love bohemian style for weekend brunches'..."
                            className="w-full px-4 py-3 sm:px-6 sm:py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 resize-none text-gray-900 placeholder-gray-400"
                            rows={4}
                            required
                          />
                        </div>
                      </div>

                      <motion.button
                        type="submit"
                        disabled={!budget || !prompt.trim() || isSubmitting}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-2xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl disabled:shadow-none"
                        whileHover={{ scale: !budget || !prompt.trim() || isSubmitting ? 1 : 1.02 }}
                        whileTap={{ scale: !budget || !prompt.trim() || isSubmitting ? 1 : 0.98 }}
                      >
                        {isSubmitting ? (
                          <>
                            
                            <span>Generating...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-6 w-6" />
                            <span>Generate My Perfect Outfits</span>
                          </>
                        )}
                      </motion.button>
                    </motion.form>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CameraCapture;

